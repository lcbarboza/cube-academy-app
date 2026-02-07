import type { Solve, StatResult } from '@/types/solve'
import { getEffectiveTime, isDnf } from '@/types/solve'

/**
 * Calculate the Mean of 3 (mo3) for the given solves
 * mo3 is the simple arithmetic mean of the last 3 solves
 * If any solve is DNF, mo3 is DNF
 */
export function calculateMo3(solves: Solve[]): StatResult {
  if (solves.length < 3) {
    return null
  }

  const lastThree = solves.slice(-3)
  
  // If any solve is DNF, mo3 is DNF
  if (lastThree.some(isDnf)) {
    return 'dnf'
  }

  const sum = lastThree.reduce((acc, solve) => acc + getEffectiveTime(solve), 0)
  return sum / 3
}

/**
 * Calculate the Average of N solves with trimmed mean
 * Trims the best and worst times, then averages the rest
 * With 1 DNF: DNF counts as worst (trimmed)
 * With 2+ DNFs: result is DNF
 */
function calculateTrimmedAverage(solves: Solve[], count: number): StatResult {
  if (solves.length < count) {
    return null
  }

  const lastN = solves.slice(-count)
  const dnfCount = lastN.filter(isDnf).length

  // More than 1 DNF means the average is DNF
  if (dnfCount > 1) {
    return 'dnf'
  }

  // Get effective times (DNF = Infinity)
  const times = lastN.map(getEffectiveTime)
  
  // Sort times
  const sorted = [...times].sort((a, b) => a - b)
  
  // Remove best and worst (first and last after sorting)
  const trimmed = sorted.slice(1, -1)
  
  // Calculate average of remaining times
  const sum = trimmed.reduce((acc, time) => acc + time, 0)
  return sum / trimmed.length
}

/**
 * Calculate the Average of 5 (ao5) for the given solves
 * ao5 removes the best and worst times, then averages the remaining 3
 */
export function calculateAo5(solves: Solve[]): StatResult {
  return calculateTrimmedAverage(solves, 5)
}

/**
 * Calculate the Average of 12 (ao12) for the given solves
 * ao12 removes the best and worst times, then averages the remaining 10
 */
export function calculateAo12(solves: Solve[]): StatResult {
  return calculateTrimmedAverage(solves, 12)
}

/**
 * Find the best (lowest) single time in the session
 * Excludes DNF solves
 */
export function calculateBestSingle(solves: Solve[]): StatResult {
  if (solves.length === 0) {
    return null
  }

  const validSolves = solves.filter((s) => !isDnf(s))
  if (validSolves.length === 0) {
    return 'dnf'
  }

  const times = validSolves.map(getEffectiveTime)
  return Math.min(...times)
}

/**
 * Find the best ao5 in the session by checking all possible ao5 windows
 */
export function calculateBestAo5(solves: Solve[]): StatResult {
  if (solves.length < 5) {
    return null
  }

  let best: number | null = null

  for (let i = 0; i <= solves.length - 5; i++) {
    const window = solves.slice(i, i + 5)
    const ao5 = calculateTrimmedAverage(window, 5)
    
    if (typeof ao5 === 'number') {
      if (best === null || ao5 < best) {
        best = ao5
      }
    }
  }

  return best
}

/**
 * Find the best ao12 in the session by checking all possible ao12 windows
 */
export function calculateBestAo12(solves: Solve[]): StatResult {
  if (solves.length < 12) {
    return null
  }

  let best: number | null = null

  for (let i = 0; i <= solves.length - 12; i++) {
    const window = solves.slice(i, i + 12)
    const ao12 = calculateTrimmedAverage(window, 12)
    
    if (typeof ao12 === 'number') {
      if (best === null || ao12 < best) {
        best = ao12
      }
    }
  }

  return best
}

/**
 * Compare two stat results, returns true if a is better (lower) than b
 * null values are considered worse than any number
 * dnf values are considered worse than any number
 */
export function isBetter(a: StatResult, b: StatResult): boolean {
  if (a === null) return false
  if (b === null) return true
  if (a === 'dnf') return false
  if (b === 'dnf') return true
  return a < b
}
