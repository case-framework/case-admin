import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { subscribeWithSelector } from 'zustand/middleware';
import { SurveyEditor, SurveyEditorJson } from "survey-engine/editor";
import { Survey } from "survey-engine";

export interface SessionData {
    id: string;
    name: string;
    timestamps: {
        created: number;
        lastUpdate: number;
        lastSavedToDisk: number;
    };
    surveyEditor: SurveyEditor | null;
}

interface SerializedSessionData {
    id: string;
    name: string;
    timestamps: {
        created: number;
        lastUpdate: number;
        lastSavedToDisk: number;
    };
    surveyEditorState: SurveyEditorJson | null; // Serialized state of SurveyEditor
}

interface SessionStore {
    // Persisted state (shared across tabs)
    sessions: Record<string, SerializedSessionData>;

    // Local state (non-shared, non-persisted)
    currentSessionId: string | null;
    currentSession: SessionData | null;

    // Actions
    createSession: (name: string) => string;
    deleteSession: (sessionId: string) => void;
    selectSession: (sessionId: string) => void;
    deselectSession: () => void;
    updateCurrentSession: (updater: (session: SessionData) => SessionData) => void;
    getSessionsList: () => Array<{ id: string; name: string; timestamps: SessionData['timestamps'] }>;

    // Internal methods
    _serializeSession: (session: SessionData) => SerializedSessionData;
    _deserializeSession: (serialized: SerializedSessionData) => SessionData;
    _syncFromStorage: () => void;
}

// Debounce utility
function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(func: T, wait: number): T {
    let timeout: NodeJS.Timeout;
    return ((...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    }) as T;
}

// Cross-tab communication key
const CROSS_TAB_EVENT_KEY = 'survey-editor-session-update';

export const useSessionStore = create<SessionStore>()(
    subscribeWithSelector(
        persist(
            (set, get) => ({
                // Persisted state
                sessions: {},

                // Local state
                currentSessionId: null,
                currentSession: null,

                // Actions
                createSession: (name: string) => {
                    const id = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
                    const now = Date.now();

                    const newSession: SessionData = {
                        id,
                        name,
                        timestamps: {
                            created: now,
                            lastUpdate: now,
                            lastSavedToDisk: 0,
                        },
                        surveyEditor: new SurveyEditor(new Survey()),
                    };

                    const serialized = get()._serializeSession(newSession);

                    set((state) => ({
                        sessions: {
                            ...state.sessions,
                            [id]: serialized,
                        },
                    }));

                    // Notify other tabs
                    window.dispatchEvent(new CustomEvent(CROSS_TAB_EVENT_KEY, {
                        detail: { type: 'session-created', sessionId: id }
                    }));

                    return id;
                },

                deleteSession: (sessionId: string) => {
                    set((state) => {
                        const newSessions = { ...state.sessions };
                        delete newSessions[sessionId];

                        return {
                            sessions: newSessions,
                            // If deleting current session, deselect it
                            currentSessionId: state.currentSessionId === sessionId ? null : state.currentSessionId,
                            currentSession: state.currentSessionId === sessionId ? null : state.currentSession,
                        };
                    });

                    // Notify other tabs
                    window.dispatchEvent(new CustomEvent(CROSS_TAB_EVENT_KEY, {
                        detail: { type: 'session-deleted', sessionId }
                    }));
                },

                selectSession: (sessionId: string) => {
                    const state = get();
                    const serializedSession = state.sessions[sessionId];

                    if (!serializedSession) {
                        console.warn(`Session with id ${sessionId} not found`);
                        return;
                    }

                    const session = state._deserializeSession(serializedSession);

                    set({
                        currentSessionId: sessionId,
                        currentSession: session,
                    });
                },

                deselectSession: () => {
                    set({
                        currentSessionId: null,
                        currentSession: null,
                    });
                },

                updateCurrentSession: (updater: (session: SessionData) => SessionData) => {
                    const state = get();
                    if (!state.currentSession || !state.currentSessionId) {
                        console.warn('No current session to update');
                        return;
                    }

                    const updatedSession = updater(state.currentSession);
                    updatedSession.timestamps.lastUpdate = Date.now();

                    const serialized = state._serializeSession(updatedSession);

                    set((state) => ({
                        currentSession: updatedSession,
                        sessions: {
                            ...state.sessions,
                            [state.currentSessionId!]: serialized,
                        },
                    }));

                    // Debounced notification to other tabs
                    debouncedNotifyOtherTabs(state.currentSessionId!);
                },

                getSessionsList: () => {
                    const state = get();
                    return Object.values(state.sessions).map(session => ({
                        id: session.id,
                        name: session.name,
                        timestamps: session.timestamps,
                    }));
                },

                // Internal methods
                _serializeSession: (session: SessionData) => {
                    // For now, we'll store the Survey object directly
                    // This assumes SurveyEditor has a getSurvey() method or similar

                    return {
                        id: session.id,
                        name: session.name,
                        timestamps: session.timestamps,
                        surveyEditorState: session.surveyEditor?.toJson() || null,
                    };
                },

                _deserializeSession: (serialized: SerializedSessionData) => {
                    let surveyEditor: SurveyEditor | null = null;

                    if (serialized.surveyEditorState) {
                        surveyEditor = SurveyEditor.fromJson(serialized.surveyEditorState);
                    }

                    return {
                        id: serialized.id,
                        name: serialized.name,
                        timestamps: serialized.timestamps,
                        surveyEditor,
                    };
                },

                _syncFromStorage: () => {
                    // This method can be called to manually sync from storage
                    // The persist middleware handles this automatically, but we can use it for manual sync
                    const state = get();
                    if (state.currentSessionId && state.sessions[state.currentSessionId]) {
                        const serializedSession = state.sessions[state.currentSessionId];
                        const session = state._deserializeSession(serializedSession);
                        set({
                            currentSession: session,
                        });
                    }
                },
            }),
            {
                name: 'survey-editor-sessions',
                storage: createJSONStorage(() => localStorage),
                // Only persist the sessions, not the local state
                partialize: (state) => ({
                    sessions: state.sessions,
                }),
            }
        )
    )
);

// Debounced notification to other tabs
const debouncedNotifyOtherTabs = debounce((sessionId: string) => {
    window.dispatchEvent(new CustomEvent(CROSS_TAB_EVENT_KEY, {
        detail: { type: 'session-updated', sessionId }
    }));
}, 500); // 500ms debounce

// Cross-tab communication setup
if (typeof window !== 'undefined') {
    // Listen for storage changes (when other tabs update the persisted state)
    window.addEventListener('storage', (e) => {
        if (e.key === 'survey-editor-sessions') {
            const store = useSessionStore.getState();
            store._syncFromStorage();
        }
    });

    // Listen for custom events from other tabs
    window.addEventListener(CROSS_TAB_EVENT_KEY, (e: Event) => {
        const customEvent = e as CustomEvent<{ type: string; sessionId: string }>;
        const { type, sessionId } = customEvent.detail;
        const store = useSessionStore.getState();

        switch (type) {
            case 'session-deleted':
                // If the deleted session was our current session, deselect it
                if (store.currentSessionId === sessionId) {
                    store.deselectSession();
                }
                break;
            case 'session-updated':
                // If the updated session is our current session, refresh it
                if (store.currentSessionId === sessionId) {
                    store._syncFromStorage();
                }
                break;
            case 'session-created':
                // Nothing special needed, the storage event will handle the sync
                break;
        }
    });
}

// Helper hooks for common use cases
export const useCurrentSession = () => {
    return useSessionStore(useShallow((state) => state.currentSession));
};

export const useCurrentSessionId = () => {
    return useSessionStore(useShallow((state) => state.currentSessionId));
};

export const useSessionsList = () => {
    const sessions = useSessionStore(useShallow((state) => state.sessions));
    return useMemo(() =>
        Object.values(sessions).map(session => ({
            id: session.id,
            name: session.name,
            timestamps: session.timestamps,
        })),
        [sessions]
    );
};

export const useSessionActions = () => {
    return useSessionStore(useShallow((state) => ({
        createSession: state.createSession,
        deleteSession: state.deleteSession,
        selectSession: state.selectSession,
        deselectSession: state.deselectSession,
        updateCurrentSession: state.updateCurrentSession,
    })));
};
