import { CubeViewer } from '@/components/cube'
import { Container } from '@/components/layout/Container'
import { SEO } from '@/components/seo'
import { useScramblePlayer } from '@/hooks/useScramblePlayer'
import { createSolvedCube } from '@/lib/cube-state'
import { Check, RotateCcw, X } from 'lucide-react'
import { useCallback, useState } from 'react'

type MoveStatus = 'pending' | 'ok' | 'direction_wrong' | 'colors_wrong'

interface MoveResult {
  move: string
  status: MoveStatus
}

const ALL_MOVES = [
  'R',
  "R'",
  'R2',
  'L',
  "L'",
  'L2',
  'U',
  "U'",
  'U2',
  'D',
  "D'",
  'D2',
  'F',
  "F'",
  'F2',
  'B',
  "B'",
  'B2',
]

export function TestMovesPage() {
  const [results, setResults] = useState<MoveResult[]>(
    ALL_MOVES.map((move) => ({ move, status: 'pending' })),
  )
  const [currentMove, setCurrentMove] = useState<string | null>(null)
  const [cubeKey, setCubeKey] = useState(0)

  const player = useScramblePlayer('')

  const handleTestMove = useCallback(
    (move: string) => {
      setCurrentMove(move)
      // Reset to solved state and apply single move
      player.setScramble(move)
      setCubeKey((k) => k + 1)
    },
    [player],
  )

  const handleMarkResult = useCallback((move: string, status: MoveStatus) => {
    setResults((prev) => prev.map((r) => (r.move === move ? { ...r, status } : r)))
    setCurrentMove(null)
  }, [])

  const handleReset = useCallback(() => {
    setResults(ALL_MOVES.map((move) => ({ move, status: 'pending' })))
    setCurrentMove(null)
    player.reset()
    setCubeKey((k) => k + 1)
  }, [player])

  const getStatusColor = (status: MoveStatus) => {
    switch (status) {
      case 'ok':
        return 'bg-green-500 text-white'
      case 'direction_wrong':
        return 'bg-yellow-500 text-white'
      case 'colors_wrong':
        return 'bg-red-500 text-white'
      default:
        return 'bg-neutral-200 text-neutral-700'
    }
  }

  const getStatusIcon = (status: MoveStatus) => {
    switch (status) {
      case 'ok':
        return '✓'
      case 'direction_wrong':
        return '↺'
      case 'colors_wrong':
        return '✗'
      default:
        return '?'
    }
  }

  const summary = {
    ok: results.filter((r) => r.status === 'ok').length,
    direction: results.filter((r) => r.status === 'direction_wrong').length,
    colors: results.filter((r) => r.status === 'colors_wrong').length,
    pending: results.filter((r) => r.status === 'pending').length,
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      {/* SEO - noindex for test pages */}
      <SEO title="Test Moves" noIndex />
      
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-neutral-900">Teste de Movimentos</h1>
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-lg text-sm font-medium"
            >
              <RotateCcw className="w-4 h-4" />
              Resetar Tudo
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-green-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">{summary.ok}</div>
              <div className="text-sm text-green-600">OK</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-700">{summary.direction}</div>
              <div className="text-sm text-yellow-600">Direção Errada</div>
            </div>
            <div className="bg-red-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">{summary.colors}</div>
              <div className="text-sm text-red-600">Cores Erradas</div>
            </div>
            <div className="bg-neutral-100 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-neutral-700">{summary.pending}</div>
              <div className="text-sm text-neutral-600">Pendente</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Cube Viewer */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b bg-neutral-50">
                <h2 className="font-semibold text-neutral-900">
                  {currentMove ? `Testando: ${currentMove}` : 'Clique em um movimento para testar'}
                </h2>
              </div>
              <CubeViewer
                key={cubeKey}
                cubeState={currentMove ? player.displayState : createSolvedCube()}
                currentMove={player.currentMove}
                isAnimating={player.isAnimating}
                speed={player.speed}
                onAnimationComplete={player.onAnimationComplete}
                height={300}
              />

              {/* Verdict buttons */}
              {currentMove && !player.isAnimating && (
                <div className="p-4 border-t bg-neutral-50">
                  <p className="text-sm text-neutral-600 mb-3">
                    Como foi o movimento <strong>{currentMove}</strong>?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleMarkResult(currentMove, 'ok')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
                    >
                      <Check className="w-5 h-5" />
                      OK
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkResult(currentMove, 'direction_wrong')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium"
                    >
                      <RotateCcw className="w-5 h-5" />
                      Direção
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMarkResult(currentMove, 'colors_wrong')}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium"
                    >
                      <X className="w-5 h-5" />
                      Cores
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Move Grid */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-4 border-b bg-neutral-50">
                <h2 className="font-semibold text-neutral-900">Movimentos</h2>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-3 gap-2">
                  {['R', 'L', 'U', 'D', 'F', 'B'].map((face) => (
                    <div key={face} className="space-y-2">
                      <div className="text-center text-sm font-semibold text-neutral-500 mb-2">
                        {face}
                      </div>
                      {[face, `${face}'`, `${face}2`].map((move) => {
                        const result = results.find((r) => r.move === move)
                        const status = result?.status ?? 'pending'
                        const isActive = currentMove === move

                        return (
                          <button
                            type="button"
                            key={move}
                            onClick={() => handleTestMove(move)}
                            disabled={player.isAnimating}
                            className={`
                              w-full px-3 py-2 rounded-lg font-mono text-sm font-medium
                              transition-all duration-150
                              ${isActive ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                              ${getStatusColor(status)}
                              ${player.isAnimating ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-80'}
                            `}
                          >
                            <span className="flex items-center justify-between">
                              <span>{move}</span>
                              <span>{getStatusIcon(status)}</span>
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
            <h3 className="font-semibold text-neutral-900 mb-2">Legenda</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-green-500 text-white flex items-center justify-center">
                  ✓
                </span>
                <span>OK - Movimento correto</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-yellow-500 text-white flex items-center justify-center">
                  ↺
                </span>
                <span>Direção invertida (gira pro lado errado)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-500 text-white flex items-center justify-center">
                  ✗
                </span>
                <span>Cores erradas (flickr/bagunça após movimento)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-neutral-200 text-neutral-700 flex items-center justify-center">
                  ?
                </span>
                <span>Pendente</span>
              </div>
            </div>
          </div>

          {/* Results JSON for easy copy */}
          {summary.pending === 0 && (
            <div className="mt-6 p-4 bg-white rounded-xl shadow-md">
              <h3 className="font-semibold text-neutral-900 mb-2">Resultado Final</h3>
              <pre className="text-xs bg-neutral-100 p-3 rounded overflow-x-auto">
                {JSON.stringify(
                  {
                    ok: results.filter((r) => r.status === 'ok').map((r) => r.move),
                    direction_wrong: results
                      .filter((r) => r.status === 'direction_wrong')
                      .map((r) => r.move),
                    colors_wrong: results
                      .filter((r) => r.status === 'colors_wrong')
                      .map((r) => r.move),
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
