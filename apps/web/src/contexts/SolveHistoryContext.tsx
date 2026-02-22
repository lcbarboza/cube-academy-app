import { migrateSessionData, persistMigration, saveSolves } from '@/lib/session-migration'
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
import { useSession } from './SessionContext'

interface SolveHistoryState {
  /** Array of solves for the active session (filtered) */
  solves: Solve[]
  /** Array of all solves across all sessions */
  allSolves: Solve[]
  /** Computed statistics for the current session */
  stats: SessionStats
}

interface SolveHistoryActions {
  /** Add a new solve to the history (automatically uses active session) */
  addSolve: (timeMs: number, scramble: string) => void
  /** Delete a solve by ID */
  deleteSolve: (id: string) => void
  /** Update the penalty for a solve */
  updatePenalty: (id: string, penalty: SolvePenalty) => void
  /** Clear all solves in the current session */
  clearSession: () => void
  /** Delete all solves for a specific session */
  deleteSessionSolves: (sessionId: string) => void
}

type SolveHistoryContextValue = SolveHistoryState & SolveHistoryActions

const SolveHistoryContext = createContext<SolveHistoryContextValue | null>(null)

interface SolveHistoryProviderProps {
  children: React.ReactNode
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
  const { activeSessionId } = useSession()

  // Lazy initialization with migration
  const [allSolves, setAllSolves] = useState<Solve[]>(() => {
    const result = migrateSessionData()
    persistMigration(result)
    return result.solves
  })

  // Filter solves by active session
  const solves = useMemo(
    () => allSolves.filter((solve) => solve.sessionId === activeSessionId),
    [allSolves, activeSessionId],
  )

  // Calculate stats for the active session
  const stats = useMemo(() => calculateStats(solves), [solves])

  // Persist to localStorage whenever all solves change
  useEffect(() => {
    saveSolves(allSolves)
  }, [allSolves])

  // Add a new solve with ao5/ao12 snapshots
  const addSolve = useCallback(
    (timeMs: number, scramble: string) => {
      setAllSolves((prev) => {
        // Get session solves for stats calculation
        const sessionSolves = prev.filter((s) => s.sessionId === activeSessionId)

        // Create a temporary solve to compute stats including the new solve
        const tempSolve = createSolve(timeMs, scramble, activeSessionId)
        const sessionSolvesWithNew = [...sessionSolves, tempSolve]

        // Compute ao5 and ao12 snapshots including the new solve
        const ao5Snapshot = calculateAo5(sessionSolvesWithNew)
        const ao12Snapshot = calculateAo12(sessionSolvesWithNew)

        // Create the actual solve with snapshots
        const newSolve = createSolve(timeMs, scramble, activeSessionId, {
          ao5Snapshot,
          ao12Snapshot,
        })

        return [...prev, newSolve]
      })
    },
    [activeSessionId],
  )

  // Delete a solve by ID
  const deleteSolve = useCallback((id: string) => {
    setAllSolves((prev) => prev.filter((solve) => solve.id !== id))
  }, [])

  // Update penalty for a solve
  const updatePenalty = useCallback((id: string, penalty: SolvePenalty) => {
    setAllSolves((prev) => prev.map((solve) => (solve.id === id ? { ...solve, penalty } : solve)))
  }, [])

  // Clear all solves in the current session
  const clearSession = useCallback(() => {
    setAllSolves((prev) => prev.filter((solve) => solve.sessionId !== activeSessionId))
  }, [activeSessionId])

  // Delete all solves for a specific session
  const deleteSessionSolves = useCallback((sessionId: string) => {
    setAllSolves((prev) => prev.filter((solve) => solve.sessionId !== sessionId))
  }, [])

  const value: SolveHistoryContextValue = {
    solves,
    allSolves,
    stats,
    addSolve,
    deleteSolve,
    updatePenalty,
    clearSession,
    deleteSessionSolves,
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
