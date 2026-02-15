import {
  calculateAo5,
  calculateAo12,
  calculateBestAo5,
  calculateBestAo12,
  calculateBestSingle,
  calculateMo3,
} from '@/lib/statistics'
import type { SessionStats, Solve, SolvePenalty } from '@/types/solve'
import { createSolve } from '@/types/solve'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'cube-academy-solves'

interface SolveHistoryState {
  /** Array of all solves in the session */
  solves: Solve[]
  /** Computed statistics for the current session */
  stats: SessionStats
}

interface SolveHistoryActions {
  /** Add a new solve to the history */
  addSolve: (timeMs: number, scramble: string) => void
  /** Delete a solve by ID */
  deleteSolve: (id: string) => void
  /** Update the penalty for a solve */
  updatePenalty: (id: string, penalty: SolvePenalty) => void
  /** Clear all solves in the session */
  clearSession: () => void
}

type SolveHistoryContextValue = SolveHistoryState & SolveHistoryActions

const SolveHistoryContext = createContext<SolveHistoryContextValue | null>(null)

interface SolveHistoryProviderProps {
  children: React.ReactNode
}

/**
 * Load solves from localStorage
 */
function loadSolves(): Solve[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
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
function saveSolves(solves: Solve[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(solves))
  } catch (error) {
    console.error('Failed to save solves to localStorage:', error)
  }
}

/**
 * Calculate all session statistics from solves
 */
function calculateStats(solves: Solve[]): SessionStats {
  return {
    totalSolves: solves.length,
    mo3: calculateMo3(solves),
    ao5: calculateAo5(solves),
    ao12: calculateAo12(solves),
    bestAo5: calculateBestAo5(solves),
    bestAo12: calculateBestAo12(solves),
    bestSingle: calculateBestSingle(solves),
  }
}

export function SolveHistoryProvider({ children }: SolveHistoryProviderProps) {
  // Lazy initialization from localStorage
  const [solves, setSolves] = useState<Solve[]>(() => loadSolves())

  // Calculate stats whenever solves change
  const stats = useMemo(() => calculateStats(solves), [solves])

  // Persist to localStorage whenever solves change
  useEffect(() => {
    saveSolves(solves)
  }, [solves])

  // Add a new solve with ao5/ao12 snapshots
  const addSolve = useCallback((timeMs: number, scramble: string) => {
    setSolves((prev) => {
      // Create a temporary solve to compute stats including the new solve
      const tempSolve = createSolve(timeMs, scramble)
      const allSolvesWithNew = [...prev, tempSolve]

      // Compute ao5 and ao12 snapshots including the new solve
      const ao5Snapshot = calculateAo5(allSolvesWithNew)
      const ao12Snapshot = calculateAo12(allSolvesWithNew)

      // Create the actual solve with snapshots
      const newSolve = createSolve(timeMs, scramble, { ao5Snapshot, ao12Snapshot })

      return [...prev, newSolve]
    })
  }, [])

  // Delete a solve by ID
  const deleteSolve = useCallback((id: string) => {
    setSolves((prev) => prev.filter((solve) => solve.id !== id))
  }, [])

  // Update penalty for a solve
  const updatePenalty = useCallback((id: string, penalty: SolvePenalty) => {
    setSolves((prev) => prev.map((solve) => (solve.id === id ? { ...solve, penalty } : solve)))
  }, [])

  // Clear all solves
  const clearSession = useCallback(() => {
    setSolves([])
  }, [])

  const value: SolveHistoryContextValue = {
    solves,
    stats,
    addSolve,
    deleteSolve,
    updatePenalty,
    clearSession,
  }

  return <SolveHistoryContext.Provider value={value}>{children}</SolveHistoryContext.Provider>
}

export function useSolveHistory(): SolveHistoryContextValue {
  const context = useContext(SolveHistoryContext)
  if (!context) {
    throw new Error('useSolveHistory must be used within a SolveHistoryProvider')
  }
  return context
}
