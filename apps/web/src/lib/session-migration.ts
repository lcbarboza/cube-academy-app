import type { Session } from '@/types/session'
import { createSession } from '@/types/session'
import type { Solve } from '@/types/solve'

/** Storage keys for session management */
export const STORAGE_KEYS = {
  SESSIONS: 'cube-academy-sessions',
  SOLVES: 'cube-academy-solves',
  ACTIVE_SESSION: 'cube-academy-active-session',
} as const

/** Default session name for migrated legacy solves */
const DEFAULT_SESSION_NAME = 'Default Session'

/**
 * Legacy solve type (without sessionId)
 */
interface LegacySolve {
  id: string
  timeMs: number
  scramble: string
  timestamp: string
  penalty: 'none' | '+2' | 'dnf'
  ao5Snapshot?: number | 'dnf' | null
  ao12Snapshot?: number | 'dnf' | null
}

/**
 * Type guard to check if a solve has a sessionId
 */
function hasSessionId(solve: LegacySolve | Solve): solve is Solve {
  return 'sessionId' in solve && typeof solve.sessionId === 'string'
}

/**
 * Load sessions from localStorage
 */
export function loadSessions(): Session[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSIONS)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load sessions from localStorage:', error)
  }
  return []
}

/**
 * Save sessions to localStorage
 */
export function saveSessions(sessions: Session[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions))
  } catch (error) {
    console.error('Failed to save sessions to localStorage:', error)
  }
}

/**
 * Load active session ID from localStorage
 */
export function loadActiveSessionId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION)
  } catch (error) {
    console.error('Failed to load active session ID:', error)
    return null
  }
}

/**
 * Save active session ID to localStorage
 */
export function saveActiveSessionId(sessionId: string): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, sessionId)
  } catch (error) {
    console.error('Failed to save active session ID:', error)
  }
}

/**
 * Load solves from localStorage (handles both legacy and new format)
 * Returns an array that may contain legacy solves without sessionId
 */
export function loadSolves(): (LegacySolve | Solve)[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SOLVES)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed)) {
        return parsed
      }
    }
  } catch (error) {
    console.error('Failed to load solves from localStorage:', error)
  }
  return []
}

/**
 * Save solves to localStorage
 */
export function saveSolves(solves: Solve[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SOLVES, JSON.stringify(solves))
  } catch (error) {
    console.error('Failed to save solves to localStorage:', error)
  }
}

/**
 * Migration result containing the migrated data
 */
export interface MigrationResult {
  sessions: Session[]
  solves: Solve[]
  activeSessionId: string
  wasLegacy: boolean
}

/**
 * Migrate legacy data to the new session-based structure
 *
 * This function:
 * 1. Checks if sessions exist (new format)
 * 2. If not, creates a default session
 * 3. Assigns all legacy solves (without sessionId) to the default session
 * 4. Returns the migrated data
 */
export function migrateSessionData(): MigrationResult {
  const existingSessions = loadSessions()
  const existingSolves = loadSolves()
  const existingActiveSessionId = loadActiveSessionId()

  // Check if we already have sessions (new format)
  if (existingSessions.length > 0) {
    // Already migrated, but ensure all solves have sessionId
    const validActiveSessionId =
      existingActiveSessionId && existingSessions.some((s) => s.id === existingActiveSessionId)
        ? existingActiveSessionId
        : (existingSessions[0]?.id ?? '')

    // Assign any orphan solves to the first session
    const migratedSolves: Solve[] = existingSolves.map((solve) => {
      if (!hasSessionId(solve)) {
        const legacySolve = solve as LegacySolve
        return {
          id: legacySolve.id,
          timeMs: legacySolve.timeMs,
          scramble: legacySolve.scramble,
          timestamp: legacySolve.timestamp,
          penalty: legacySolve.penalty,
          ao5Snapshot: legacySolve.ao5Snapshot,
          ao12Snapshot: legacySolve.ao12Snapshot,
          sessionId: validActiveSessionId,
        }
      }
      return solve
    })

    return {
      sessions: existingSessions,
      solves: migratedSolves,
      activeSessionId: validActiveSessionId,
      wasLegacy: false,
    }
  }

  // No sessions exist - this is legacy data or first run
  const defaultSession = createSession(DEFAULT_SESSION_NAME)

  // Migrate all existing solves to the default session
  const migratedSolves: Solve[] = existingSolves.map((solve) => {
    const legacySolve = solve as LegacySolve
    return {
      id: legacySolve.id,
      timeMs: legacySolve.timeMs,
      scramble: legacySolve.scramble,
      timestamp: legacySolve.timestamp,
      penalty: legacySolve.penalty,
      ao5Snapshot: legacySolve.ao5Snapshot,
      ao12Snapshot: legacySolve.ao12Snapshot,
      sessionId: defaultSession.id,
    }
  })

  return {
    sessions: [defaultSession],
    solves: migratedSolves,
    activeSessionId: defaultSession.id,
    wasLegacy: existingSolves.length > 0,
  }
}

/**
 * Persist migration result to localStorage
 */
export function persistMigration(result: MigrationResult): void {
  saveSessions(result.sessions)
  saveSolves(result.solves)
  saveActiveSessionId(result.activeSessionId)
}
