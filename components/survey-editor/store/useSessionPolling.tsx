import { useEffect, useRef } from 'react'
import { useSessionStore } from './session-store'

interface UseSessionPollingOptions {
    interval?: number // Polling interval in milliseconds (default: 1000)
    enabled?: boolean // Whether polling is enabled (default: true)
    pauseOnHidden?: boolean // Pause polling when tab is hidden (default: true)
}

export const useSessionPolling = (options: UseSessionPollingOptions = {}) => {
    const {
        interval = 1000,
        enabled = true,
        pauseOnHidden = true
    } = options

    const { refreshFromStorage } = useSessionStore()
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const isPollingRef = useRef(enabled)

    // Start/stop polling based on enabled state
    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
            return
        }

        const startPolling = () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }

            intervalRef.current = setInterval(() => {
                if (isPollingRef.current) {
                    refreshFromStorage()
                }
            }, interval)
        }

        startPolling()

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
                intervalRef.current = null
            }
        }
    }, [enabled, interval, refreshFromStorage])

    // Handle visibility changes
    useEffect(() => {
        if (!pauseOnHidden) return

        const handleVisibilityChange = () => {
            const isHidden = document.hidden
            isPollingRef.current = !isHidden

            if (!isHidden) {
                // Immediately refresh when tab becomes visible
                refreshFromStorage()
            }
        }

        document.addEventListener('visibilitychange', handleVisibilityChange)
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
    }, [pauseOnHidden, refreshFromStorage])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return {
        isPolling: isPollingRef.current && enabled,
        refreshNow: refreshFromStorage
    }
}
