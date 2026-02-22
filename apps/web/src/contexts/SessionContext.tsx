import {
  migrateSessionData,
  persistMigration,
  saveActiveSessionId,
  saveSessions,
} from '@/lib/session-migration'
import type { Session } from '@/types/session'
import { createNumberedSession } from '@/types/session'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface SessionState {
  /** All available sessions */
  sessions: Session[]
  /** Currently active session ID */
  activeSessionId: string
  /** Currently active session object */
  activeSession: Session | null
}

interface SessionActions {
  /** Create a new session and switch to it */
  createSession: (name?: string) => Session
  /** Switch to a different session */
  switchSession: (sessionId: string) => void
  /** Rename a session */
  renameSession: (sessionId: string, newName: string) => void
  /** Delete a session (cannot delete last session) */
  deleteSession: (sessionId: string) => boolean
}

type SessionContextValue = SessionState & SessionActions

const SessionContext = createContext<SessionContextValue | null>(null)

interface SessionProviderProps {
  children: React.ReactNode
}

export function SessionProvider({ children }: SessionProviderProps) {
  // Lazy initialization with migration
  const [sessions, setSessions] = useState<Session[]>(() => {
    const result = migrateSessionData()
    persistMigration(result)
    return result.sessions
  })

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    const result = migrateSessionData()
    return result.activeSessionId
  })

  // Derive active session from sessions and activeSessionId
  const activeSession = useMemo(
    () => sessions.find((s) => s.id === activeSessionId) ?? null,
    [sessions, activeSessionId],
  )

  // Persist sessions to localStorage whenever they change
  useEffect(() => {
    saveSessions(sessions)
  }, [sessions])

  // Persist active session ID to localStorage whenever it changes
  useEffect(() => {
    saveActiveSessionId(activeSessionId)
  }, [activeSessionId])

  // Create a new session
  const createSession = useCallback(
    (name?: string): Session => {
      const newSession = name
        ? { ...createNumberedSession(sessions.length), name }
        : createNumberedSession(sessions.length)

      setSessions((prev) => [...prev, newSession])
      setActiveSessionId(newSession.id)

      return newSession
    },
    [sessions.length],
  )

  // Switch to a different session
  const switchSession = useCallback(
    (sessionId: string) => {
      const exists = sessions.some((s) => s.id === sessionId)
      if (exists) {
        setActiveSessionId(sessionId)
      }
    },
    [sessions],
  )

  // Rename a session
  const renameSession = useCallback((sessionId: string, newName: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? { ...session, name: newName, updatedAt: new Date().toISOString() }
          : session,
      ),
    )
  }, [])

  // Delete a session (cannot delete last session)
  const deleteSession = useCallback(
    (sessionId: string): boolean => {
      // Cannot delete if only one session exists
      if (sessions.length <= 1) {
        return false
      }

      const sessionIndex = sessions.findIndex((s) => s.id === sessionId)
      if (sessionIndex === -1) {
        return false
      }

      // If deleting the active session, switch to another one
      if (sessionId === activeSessionId) {
        // Prefer the previous session, or the next one if deleting the first
        const newActiveIndex = sessionIndex > 0 ? sessionIndex - 1 : 1
        const newActiveSession = sessions[newActiveIndex]
        if (newActiveSession) {
          setActiveSessionId(newActiveSession.id)
        }
      }

      setSessions((prev) => prev.filter((s) => s.id !== sessionId))
      return true
    },
    [sessions, activeSessionId],
  )

  const value: SessionContextValue = {
    sessions,
    activeSessionId,
    activeSession,
    createSession,
    switchSession,
    renameSession,
    deleteSession,
  }

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionContextValue {
  const context = useContext(SessionContext)
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider')
  }
  return context
}
