/**
 * Represents a practice session containing multiple solves
 */
export interface Session {
  /** Unique identifier for the session */
  id: string
  /** User-defined name for the session */
  name: string
  /** ISO timestamp when the session was created */
  createdAt: string
  /** ISO timestamp when the session was last modified */
  updatedAt: string
}

/**
 * Default session name prefix used when creating new sessions
 */
export const DEFAULT_SESSION_NAME_PREFIX = 'Session'

/**
 * Creates a new session with default values
 */
export function createSession(name?: string): Session {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    name: name ?? `${DEFAULT_SESSION_NAME_PREFIX} 1`,
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Creates a session with a numbered name based on existing sessions count
 */
export function createNumberedSession(existingCount: number): Session {
  return createSession(`${DEFAULT_SESSION_NAME_PREFIX} ${existingCount + 1}`)
}
