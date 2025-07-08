import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { SurveyEditor, SurveyEditorJson } from 'survey-engine/editor';

interface SerializedSessionData {
    id: string;
    name: string;
    createdAt: number;
    updatedAt: number;
    lastSeenAt: number;
    lockedBy: string | null
    surveyEditorState: SurveyEditorJson | null; // Serialized state of SurveyEditor
}

interface SessionIndexEntry {
    id: string;
    fileName: string;
}

interface SessionStore {
    // Persisted state (shared across tabs) - now just contains session index
    sessions: Record<string, SessionIndexEntry>;

    // Local state (non-shared, non-persisted)
    currentSession: SerializedSessionData | null;
    currentTabId: string | null;
    sessionsLoaded: boolean;

    // Actions
    createSession: (editor: SurveyEditor) => boolean
    openSession: (sessionId: string) => boolean


    updateCurrentSession: (editor: SurveyEditor) => void
    updateCurrentSessionLastSeen: () => void
    closeCurrentSession: () => void

    deleteSession: (sessionId: string) => void
    isSessionLocked: (sessionId: string) => boolean
    refreshFromStorage: () => void
    getSessionsData: () => SerializedSessionData[]
    rebuildSessionIndex: () => void

    // Internal methods
    _cleanupOldSessions: () => void
    _generateTabId: () => string
    _saveSessionData: (sessionId: string, data: SerializedSessionData) => void
    _loadSessionData: (sessionId: string) => SerializedSessionData | null
    _deleteSessionData: (sessionId: string) => void
    _updateSessionIndex: (sessionId: string, indexEntry: SessionIndexEntry) => void
    _removeFromSessionIndex: (sessionId: string) => void
}

const SESSION_LOCK_TIMEOUT = 1 * 60 * 1000
const MAX_SESSIONS = 15

// Generate a unique tab ID
const generateTabId = (): string => {
    return `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

// Helper functions for individual session storage
const getSessionStorageKey = (sessionId: string) => `survey-editor-session-${sessionId}`

const saveSessionToStorage = (sessionId: string, data: SerializedSessionData) => {
    try {
        localStorage.setItem(getSessionStorageKey(sessionId), JSON.stringify(data))
    } catch (error) {
        console.error('Failed to save session data:', error)
    }
}

const loadSessionFromStorage = (sessionId: string): SerializedSessionData | null => {
    try {
        const data = localStorage.getItem(getSessionStorageKey(sessionId))
        return data ? JSON.parse(data) : null
    } catch (error) {
        console.error('Failed to load session data:', error)
        return null
    }
}

const deleteSessionFromStorage = (sessionId: string) => {
    try {
        localStorage.removeItem(getSessionStorageKey(sessionId))
    } catch (error) {
        console.error('Failed to delete session data:', error)
    }
}

export const useSessionStore = create<SessionStore>()(
    persist(
        (set, get) => {
            return {
                sessions: {},

                currentSession: null,
                currentTabId: generateTabId(),
                sessionsLoaded: false,

                // Actions
                createSession: (editor: SurveyEditor) => {
                    const state = get()
                    state.refreshFromStorage()
                    state._cleanupOldSessions()

                    const id = `session-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
                    const now = Date.now();

                    const newSession: SerializedSessionData = {
                        id,
                        name: editor.survey.surveyKey,
                        createdAt: now,
                        updatedAt: now,
                        lastSeenAt: now,
                        lockedBy: state.currentTabId,
                        surveyEditorState: editor.toJson(),
                    };

                    const indexEntry: SessionIndexEntry = {
                        id,
                        fileName: getSessionStorageKey(id),
                    };

                    // Save session data and update index immediately and synchronously
                    state._saveSessionData(id, newSession);
                    state._updateSessionIndex(id, indexEntry);

                    // Force immediate persistence by triggering a state update
                    set((currentState) => ({
                        currentSession: newSession,
                        sessions: {
                            ...currentState.sessions,
                            [id]: indexEntry,
                        },
                    }));

                    return true;
                },

                openSession: (sessionId: string) => {
                    const state = get()
                    state.refreshFromStorage()
                    const indexEntry = state.sessions[sessionId]

                    if (!indexEntry) {
                        return false
                    }

                    const session = state._loadSessionData(sessionId);
                    if (!session) {
                        return false
                    }

                    // Check if session is already locked by another tab
                    if (session.lockedBy && session.lockedBy !== state.currentTabId) {
                        // Check if the lock is stale (more than 5 minutes old)
                        const lockAge = Date.now() - session.lastSeenAt
                        if (lockAge < SESSION_LOCK_TIMEOUT) {
                            return false
                        }
                    }

                    const updatedSessionData: SerializedSessionData = {
                        ...session,
                        lockedBy: state.currentTabId,
                        lastSeenAt: Date.now(),
                    };

                    // Update the session data
                    const sessionData = state._loadSessionData(sessionId);
                    if (sessionData) {
                        const updatedSessionData: SerializedSessionData = {
                            ...sessionData,
                            lockedBy: state.currentTabId,
                            lastSeenAt: Date.now(),
                        };
                        state._saveSessionData(sessionId, updatedSessionData);
                    }

                    set(() => ({
                        currentSession: updatedSessionData,
                    }))

                    return true
                },

                closeCurrentSession: () => {
                    const state = get()
                    const session = state.currentSession

                    if (!session) {
                        return
                    }

                    if (session.lockedBy && session.lockedBy !== state.currentTabId) {
                        return
                    }

                    const updatedSessionData: SerializedSessionData = {
                        ...session,
                        lockedBy: null,
                        lastSeenAt: Date.now(),
                    };

                    // Update the session data
                    state._saveSessionData(session.id, updatedSessionData);

                    set(() => ({
                        currentSession: null,
                    }))
                },

                updateCurrentSession: (editor: SurveyEditor) => {
                    const state = get()
                    const session = state.currentSession

                    if (!session) {
                        return
                    }
                    const now = Date.now();
                    const updatedSessionData: SerializedSessionData = {
                        ...session,
                        surveyEditorState: editor.toJson(),
                        updatedAt: now,
                        lastSeenAt: now,
                        name: editor.survey.surveyKey,
                    };

                    state._saveSessionData(session.id, updatedSessionData);
                    set(() => ({
                        currentSession: updatedSessionData,
                    }))
                },

                deleteSession: (sessionId: string) => {
                    const state = get()
                    const indexEntry = state.sessions[sessionId]
                    if (!indexEntry) {
                        return
                    }

                    const session = state._loadSessionData(sessionId);
                    if (!session) {
                        return
                    }

                    // Only allow deletion if session is not locked by another tab
                    if (session && session.lockedBy && session.lockedBy !== state.currentTabId) {
                        return
                    }

                    state.refreshFromStorage()
                    state._deleteSessionData(sessionId);
                    state._removeFromSessionIndex(sessionId);

                    set(() => ({
                        currentSession: null,
                    }))
                },

                isSessionLocked: (sessionId: string) => {
                    const state = get()
                    const session = state._loadSessionData(sessionId);

                    if (!session || !session.lockedBy) {
                        return false
                    }

                    // Check if lock is stale
                    const lockAge = Date.now() - session.lastSeenAt
                    if (lockAge > SESSION_LOCK_TIMEOUT) {
                        return false
                    }

                    return session.lockedBy !== state.currentTabId
                },

                updateCurrentSessionLastSeen: () => {
                    const state = get()
                    const session = state.currentSession

                    if (!session) {
                        return
                    }

                    const updatedSessionData: SerializedSessionData = {
                        ...session,
                        lastSeenAt: Date.now(),
                    };

                    // Update the session data
                    state._saveSessionData(session.id, updatedSessionData);
                    set(() => ({
                        currentSession: updatedSessionData,
                    }))
                },

                // Method to refresh sessions from storage (for polling)
                refreshFromStorage: () => {
                    // First try to load from the persisted index
                    const storageData = localStorage.getItem('survey-editor-sessions')
                    if (storageData) {
                        try {
                            const parsed = JSON.parse(storageData)
                            if (parsed.state && parsed.state.sessions) {
                                set((currentState) => ({
                                    ...currentState,
                                    sessions: parsed.state.sessions,
                                    sessionsLoaded: true,
                                }))
                            }
                        } catch (error) {
                            console.error('Failed to refresh from storage:', error)
                        }
                    }

                    // Always rebuild the index to ensure it's correct and includes any orphaned sessions
                    const state = get()
                    state.rebuildSessionIndex()
                },

                getSessionsData: () => {
                    const state = get()
                    return Object.values(state.sessions).map((entry) => state._loadSessionData(entry.id))
                        .filter((session) => session !== null)
                },

                rebuildSessionIndex: () => {
                    const allSessionIds = Object.keys(localStorage)
                        .filter(key => key.startsWith('survey-editor-session-'))
                        .map(key => key.replace('survey-editor-session-', ''))

                    const newSessionIndex: Record<string, SessionIndexEntry> = {}

                    // Build index from existing session data
                    allSessionIds.forEach(sessionId => {
                        const sessionData = loadSessionFromStorage(sessionId)
                        if (sessionData) {
                            newSessionIndex[sessionId] = {
                                id: sessionId,
                                fileName: getSessionStorageKey(sessionId),
                            }
                        } else {
                            // Clean up orphaned localStorage entries
                            deleteSessionFromStorage(sessionId)
                        }
                    })

                    set(() => ({
                        sessions: newSessionIndex,
                        sessionsLoaded: true,
                    }))
                },

                _cleanupOldSessions: () => {
                    const state = get()
                    const sessionIndex = Object.values(state.sessions)
                    console.log('sessionIndex', sessionIndex)

                    if (sessionIndex.length <= MAX_SESSIONS - 1) {
                        return
                    }

                    const sessions = sessionIndex.map((entry) => state._loadSessionData(entry.id))
                        .filter((session) => session !== null)


                    // Sort by last seen (oldest first)
                    const sortedSessions = sessions.sort((a, b) => a.lastSeenAt - b.lastSeenAt)

                    // Keep only the 20 most recent sessions
                    const sessionsToKeep = sortedSessions.slice(-MAX_SESSIONS + 1)
                    const newSessionIndex: Record<string, SessionIndexEntry> = {}

                    // Delete old session data from storage
                    const sessionsToDelete = sortedSessions.slice(0, -MAX_SESSIONS + 1)
                    sessionsToDelete.forEach((session) => {
                        state._deleteSessionData(session.id)
                    })

                    sessionsToKeep.forEach((session) => {
                        newSessionIndex[session.id] = {
                            id: session.id,
                            fileName: getSessionStorageKey(session.id),
                        }
                    })

                    set({ sessions: newSessionIndex })
                },

                _generateTabId: generateTabId,

                _saveSessionData: (sessionId: string, data: SerializedSessionData) => {
                    saveSessionToStorage(sessionId, data)
                },

                _loadSessionData: (sessionId: string) => {
                    return loadSessionFromStorage(sessionId)
                },

                _deleteSessionData: (sessionId: string) => {
                    deleteSessionFromStorage(sessionId)
                },

                _updateSessionIndex: (sessionId: string, indexEntry: SessionIndexEntry) => {
                    set((state) => {
                        const updatedSessions = {
                            ...state.sessions,
                            [sessionId]: indexEntry,
                        };

                        // Force immediate persistence by returning a new state
                        return {
                            sessions: updatedSessions,
                        };
                    });
                },

                _removeFromSessionIndex: (sessionId: string) => {
                    set((state) => {
                        const newIndex = { ...state.sessions }
                        delete newIndex[sessionId]
                        return {
                            sessions: newIndex,
                        }
                    })
                },
            }
        },
        {
            name: 'survey-editor-sessions',
            storage: createJSONStorage(() => localStorage),
            // Only persist the session index, not the individual session data
            partialize: (state) => ({
                sessions: state.sessions,
            }),
        }
    )
);

