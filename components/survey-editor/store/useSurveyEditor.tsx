import { useCallback, useEffect, useRef, useState } from "react"
import { SurveyEditor } from "survey-engine/editor"
import { useSessionStore } from "./session-store"

// Global editor instance and state
let globalEditorInstance: SurveyEditor | null = null // Replace 'any' with your SurveyEditor class type
let currentLoadedSessionId: string | null = null

const UPDATE_INTERVAL = 10000 // 10 seconds

export const useSurveyEditor = () => {
    const initializingRef = useRef(false)
    const lastUpdateRef = useRef<number>(0)
    const [isEditorReady, setIsEditorReady] = useState(false)

    const {
        currentSessionId,
        sessions,
        updateSession,
        updateLastSeen,
        closeCurrentSession,
    } = useSessionStore();

    const currentSession = currentSessionId ? sessions[currentSessionId] : null

    // Update session data when editor changes
    const updateSessionData = useCallback(() => {
        if (!globalEditorInstance || !currentSession || !currentSessionId) {
            return
        }

        try {
            updateSession(currentSessionId, globalEditorInstance)
            lastUpdateRef.current = Date.now()
        } catch (error) {
            console.error('Failed to update session:', error)
        }
    }, [currentSessionId, currentSession, updateSession])


    // Initialize or switch editor when currentSessionId changes
    const initializeEditor = useCallback(async () => {
        if (initializingRef.current) return

        // If no current session, cleanup and return
        if (!currentSessionId || !currentSession) {
            if (globalEditorInstance) {
                try {
                    // Clean up current editor
                    // globalEditorInstance.destroy?.()
                    globalEditorInstance = null
                    currentLoadedSessionId = null
                    setIsEditorReady(false)
                } catch (error) {
                    console.error('Failed to cleanup editor:', error)
                }
            }
            return
        }

        // If editor is already loaded for this session, nothing to do
        if (currentLoadedSessionId === currentSessionId && globalEditorInstance) {
            setIsEditorReady(true)
            return
        }

        initializingRef.current = true
        setIsEditorReady(false)

        try {
            // Clean up previous editor if it exists
            if (globalEditorInstance) {
                // Save current state before switching
                if (currentLoadedSessionId && sessions[currentLoadedSessionId]) {
                    updateSessionData()
                }

                // globalEditorInstance.destroy?.()
                globalEditorInstance = null
            }

            if (!currentSession.surveyEditorState) {
                throw new Error('No survey editor state found for session')
            }

            // Initialize new editor with session data
            globalEditorInstance = SurveyEditor.fromJson(currentSession.surveyEditorState)

            // Set up event listeners for editor changes
            globalEditorInstance.on?.('survey-changed', () => {
                updateSessionData()
            })


            currentLoadedSessionId = currentSessionId
            setIsEditorReady(true)

            console.log(`Editor initialized for session: ${currentSessionId}`)
        } catch (error) {
            console.error('Failed to initialize editor:', error)
            globalEditorInstance = null
            currentLoadedSessionId = null
            setIsEditorReady(false)
        } finally {
            initializingRef.current = false
        }
    }, [currentSessionId, currentSession, updateSessionData, sessions])

    // Auto-initialize when currentSessionId changes
    useEffect(() => {
        initializeEditor()
    }, [initializeEditor])

    // Update lastSeen every UPDATE_INTERVAL for active sessions
    useEffect(() => {
        if (!currentSessionId || !currentSession) {
            return
        }

        const interval = setInterval(() => {
            console.log('updateLastSeen', currentSessionId)
            updateLastSeen(currentSessionId)
        }, UPDATE_INTERVAL)

        return () => clearInterval(interval)
    }, [currentSessionId, currentSession, updateLastSeen])


    // Handle page unload - save current state
    useEffect(() => {
        const handleBeforeUnload = () => {
            if (globalEditorInstance && currentLoadedSessionId) {
                updateSessionData()
                globalEditorInstance.clearAllListeners()
                closeCurrentSession()
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [updateSessionData, closeCurrentSession])

    // Handle visibility change (tab switching)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && globalEditorInstance) {
                // Tab is hidden, update session one more time
                updateSessionData()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [updateSessionData])


    return {
        editor: globalEditorInstance,
        isEditorReady,
        isInitializing: initializingRef.current,
    }
}
