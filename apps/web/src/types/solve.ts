/**
 * Penalty types for cube solves following WCA standards
 * - 'none': No penalty applied
 * - '+2': 2-second penalty (e.g., cube not fully aligned at stop)
 * - 'dnf': Did Not Finish (e.g., cube not solved)
 */
export type SolvePenalty = 'none' | '+2' | 'dnf'

/**
 * Represents a single cube solve attempt with all associated data
 */
export interface Solve {
  /** Unique identifier for the solve */
  id: string
  /** Raw solve time in milliseconds (without penalty applied) */
  timeMs: number
  /** The scramble string used for this solve */
  scramble: string
  /** ISO timestamp when the solve was completed */
  timestamp: string
  /** Penalty status for this solve */
  penalty: SolvePenalty
}

/**
 * Statistical result that can be either a time in ms or DNF
 */
export type StatResult = number | 'dnf' | null

/**
 * Session statistics computed from solve history
 */
export interface SessionStats {
  /** Total number of solves in the session */
  totalSolves: number
  /** Mean of last 3 solves */
  mo3: StatResult
  /** Average of last 5 solves (trim best/worst) */
  ao5: StatResult
  /** Average of last 12 solves (trim best/worst) */
  ao12: StatResult
  /** Best ao5 achieved in the session */
  bestAo5: StatResult
  /** Best ao12 achieved in the session */
  bestAo12: StatResult
  /** Best single solve time in the session */
  bestSingle: StatResult
}

/**
 * Creates a new solve with default values
 */
export function createSolve(timeMs: number, scramble: string): Solve {
  return {
    id: crypto.randomUUID(),
    timeMs,
    scramble,
    timestamp: new Date().toISOString(),
    penalty: 'none',
  }
}

/**
 * Gets the effective time for a solve (with penalty applied)
 * Returns Infinity for DNF to simplify sorting
 */
export function getEffectiveTime(solve: Solve): number {
  if (solve.penalty === 'dnf') {
    return Number.POSITIVE_INFINITY
  }
  if (solve.penalty === '+2') {
    return solve.timeMs + 2000
  }
  return solve.timeMs
}

/**
 * Checks if a solve is a DNF
 */
export function isDnf(solve: Solve): boolean {
  return solve.penalty === 'dnf'
}
