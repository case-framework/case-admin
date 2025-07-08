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

interface SessionStore {
    // Persisted state (shared across tabs)
    sessions: Record<string, SerializedSessionData>;

    // Local state (non-shared, non-persisted)
    currentSessionId: string | null;
    currentTabId: string | null;

    // Actions
    createSession: (editor: SurveyEditor) => boolean
    openSession: (sessionId: string) => boolean
    closeSession: (sessionId: string) => void
    updateSession: (sessionId: string, editor: SurveyEditor) => void
    updateLastSeen: (sessionId: string) => void
    deleteSession: (sessionId: string) => void
    isSessionLocked: (sessionId: string) => boolean
    closeCurrentSession: () => void
    refreshFromStorage: () => void

    // Internal methods
    _cleanupOldSessions: () => void
    _generateTabId: () => string
}

const SESSION_LOCK_TIMEOUT = 1 * 60 * 1000

// Generate a unique tab ID
const generateTabId = (): string => {
    return `tab_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
}

export const useSessionStore = create<SessionStore>()(

    persist(
        (set, get) => {
            return {
                sessions: {},

                currentSessionId: null,
                currentTabId: generateTabId(),

                // Actions
                createSession: (editor: SurveyEditor) => {
                    const state = get()
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

                    set((state) => ({
                        sessions: {
                            ...state.sessions,
                            [id]: newSession,
                        },
                        currentSessionId: id,
                    }));

                    return true;
                },

                openSession: (sessionId: string) => {
                    const state = get()
                    const session = state.sessions[sessionId]

                    if (!session) {
                        return false
                    }

                    // Check if session is already locked by another tab
                    if (session.lockedBy && session.lockedBy !== state.currentTabId) {
                        // Check if the lock is stale (more than 5 minutes old)
                        const lockAge = Date.now() - session.lastSeenAt
                        if (lockAge < SESSION_LOCK_TIMEOUT) { // 5 minutes
                            return false
                        }
                    }

                    set((state) => ({
                        sessions: {
                            ...state.sessions,
                            [sessionId]: {
                                ...session,
                                lockedBy: state.currentTabId,
                                lastSeenAt: Date.now(),
                            },
                        },
                        currentSessionId: sessionId,
                    }))

                    return true
                },

                closeSession: (sessionId: string) => {
                    const state = get()
                    const session = state.sessions[sessionId]

                    if (!session || session.lockedBy !== state.currentTabId) {
                        return
                    }

                    set((state) => ({
                        sessions: {
                            ...state.sessions,
                            [sessionId]: {
                                ...session,
                                lockedBy: null,
                                lastSeenAt: Date.now(),
                            },
                        },
                        currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
                    }))
                },

                updateSession: (sessionId: string, editor: SurveyEditor) => {
                    const state = get()
                    const session = state.sessions[sessionId]

                    if (!session || session.lockedBy !== state.currentTabId) {
                        return
                    }

                    set((state) => ({
                        sessions: {
                            ...state.sessions,
                            [sessionId]: {
                                ...session,
                                surveyEditorState: editor.toJson(),
                                updatedAt: Date.now(),
                                lastSeen: Date.now(),
                                name: editor.survey.surveyKey,
                            },
                        },
                    }))
                },

                deleteSession: (sessionId: string) => {
                    const state = get()
                    const session = state.sessions[sessionId]

                    // Only allow deletion if session is not locked by another tab
                    if (session && session.lockedBy && session.lockedBy !== state.currentTabId) {
                        return
                    }

                    set((state) => {
                        const newSessions = { ...state.sessions }
                        delete newSessions[sessionId]

                        return {
                            sessions: newSessions,
                            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
                        }
                    })
                },

                isSessionLocked: (sessionId: string) => {
                    const state = get()
                    const session = state.sessions[sessionId]

                    if (!session || !session.lockedBy) {
                        return false
                    }

                    // Check if lock is stale
                    const lockAge = Date.now() - session.lastSeenAt
                    if (lockAge > SESSION_LOCK_TIMEOUT) { // 5 minutes
                        return false
                    }

                    return session.lockedBy !== state.currentTabId
                },

                updateLastSeen: (sessionId: string) => {
                    const state = get()
                    const session = state.sessions[sessionId]

                    if (!session || session.lockedBy !== state.currentTabId) {
                        return
                    }

                    set((state) => ({
                        sessions: {
                            ...state.sessions,
                            [sessionId]: {
                                ...session,
                                lastSeenAt: Date.now(),
                            },
                        },
                    }))
                },

                closeCurrentSession: () => {
                    const state = get()
                    if (state.currentSessionId) {
                        state.closeSession(state.currentSessionId)
                    }
                },

                // Method to refresh sessions from storage (for polling)
                refreshFromStorage: () => {
                    // Force re-read from localStorage to get latest state
                    const storageData = localStorage.getItem('survey-editor-sessions')
                    if (storageData) {
                        try {
                            const parsed = JSON.parse(storageData)
                            if (parsed.state && parsed.state.sessions) {
                                set((currentState) => ({
                                    ...currentState,
                                    sessions: parsed.state.sessions,
                                }))
                            }
                        } catch (error) {
                            console.error('Failed to refresh from storage:', error)
                        }
                    }
                },

                _cleanupOldSessions: () => {
                    const state = get()
                    const sessions = Object.values(state.sessions)

                    if (sessions.length <= 20) {
                        return
                    }

                    // Sort by last seen (oldest first)
                    const sortedSessions = sessions.sort((a, b) => a.lastSeenAt - b.lastSeenAt)

                    // Keep only the 20 most recent sessions
                    const sessionsToKeep = sortedSessions.slice(-20)
                    const newSessions: Record<string, SerializedSessionData> = {}

                    sessionsToKeep.forEach((session) => {
                        newSessions[session.id] = session
                    })

                    set({ sessions: newSessions })
                },

                _generateTabId: generateTabId,
            }
        },
        {
            name: 'survey-editor-sessions',
            storage: createJSONStorage(() => localStorage),
            // Only persist the sessions, not the local state
            partialize: (state) => ({
                sessions: state.sessions,
            }),
        }
    )
);

