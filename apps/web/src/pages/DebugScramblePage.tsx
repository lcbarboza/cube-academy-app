import { CubeViewer } from '@/components/cube'
import { Container } from '@/components/layout/Container'
import { SEO } from '@/components/seo'
import { useScramblePlayer } from '@/hooks/useScramblePlayer'
import {
  type CubeState,
  applyMove,
  applyPieceMove,
  createSolvedCube,
  createSolvedPieceState,
} from '@/lib/cube-state'
import { useMemo, useState } from 'react'

const PRESET_SEQUENCES = ["B F' D B U'", "R U R' U'", "F R U R' U' F'", "U R U' L' U R' U' L"]

function FaceDisplay({ face, label }: { face: CubeState[keyof CubeState]; label: string }) {
  const colorMap: Record<string, string> = {
    white: 'bg-white border-gray-300',
    yellow: 'bg-yellow-400',
    green: 'bg-green-500',
    blue: 'bg-blue-600',
    red: 'bg-red-600',
    orange: 'bg-orange-500',
  }

  return (
    <div className="inline-block m-2">
      <div className="text-xs font-bold text-center mb-1">{label}</div>
      <div className="grid grid-cols-3 gap-0.5 p-1 bg-gray-800 rounded">
        {face.flatMap((row, rowIdx) =>
          row.map((color, colIdx) => (
            <div
              key={`${label}-r${rowIdx}c${colIdx}`}
              className={`w-5 h-5 ${colorMap[color]} border border-gray-600 rounded-sm`}
              title={`[${rowIdx}][${colIdx}] = ${color}`}
            />
          )),
        )}
      </div>
    </div>
  )
}

function CubeStateDisplay({ state, label }: { state: CubeState; label: string }) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg">
      <div className="font-bold text-sm mb-2">{label}</div>
      <div className="flex flex-wrap justify-center">
        <FaceDisplay face={state.U} label="U (white)" />
        <FaceDisplay face={state.F} label="F (green)" />
        <FaceDisplay face={state.R} label="R (red)" />
        <FaceDisplay face={state.B} label="B (blue)" />
        <FaceDisplay face={state.L} label="L (orange)" />
        <FaceDisplay face={state.D} label="D (yellow)" />
      </div>
    </div>
  )
}

export function DebugScramblePage() {
  const [scramble, setScramble] = useState("B F' D B U'")
  const [inputValue, setInputValue] = useState(scramble)
  const [showDebugInfo, setShowDebugInfo] = useState(false)

  const player = useScramblePlayer(scramble)

  // Compute expected state step by step
  const stepStates: { move: string; state: CubeState }[] = []
  let current = createSolvedCube()
  for (const move of player.moves) {
    current = applyMove(current, move)
    stepStates.push({ move, state: current })
  }

  // Compute piece state that matches the current display state
  const pieceState = useMemo(() => {
    let pieces = createSolvedPieceState()
    // Apply moves up to currentIndex
    for (let i = 0; i <= player.currentIndex && i < player.moves.length; i++) {
      const move = player.moves[i]
      if (move) {
        pieces = applyPieceMove(pieces, move)
      }
    }
    return pieces
  }, [player.currentIndex, player.moves])

  const handleApply = () => {
    setScramble(inputValue)
    player.setScramble(inputValue)
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      {/* SEO - noindex for debug pages */}
      <SEO title="Debug Scramble" noIndex />
      
      <Container>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-6">Debug Scramble</h1>

          {/* Input */}
          <div className="bg-white rounded-lg shadow p-4 mb-6">
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded"
                placeholder="Enter scramble..."
              />
              <button
                type="button"
                onClick={handleApply}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Apply
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {PRESET_SEQUENCES.map((seq) => (
                <button
                  key={seq}
                  type="button"
                  onClick={() => {
                    setInputValue(seq)
                    setScramble(seq)
                    player.setScramble(seq)
                  }}
                  className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                >
                  {seq}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 3D Viewer */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-3 bg-gray-100 border-b flex justify-between items-start">
                <div>
                  <div className="font-bold">3D View</div>
                  <div className="text-sm text-gray-600">
                    Move: {player.currentIndex + 1} / {player.moves.length}
                    {player.isAnimating && ` (animating ${player.currentMove})`}
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDebugInfo}
                    onChange={(e) => setShowDebugInfo(e.target.checked)}
                    className="w-4 h-4"
                  />
                  Show Numbers
                </label>
              </div>
              <CubeViewer
                cubeState={player.displayState}
                pieceState={pieceState}
                currentMove={player.currentMove}
                isAnimating={player.isAnimating}
                speed={player.speed}
                onAnimationComplete={player.onAnimationComplete}
                height={300}
                showDebugInfo={showDebugInfo}
              />
              <div className="p-3 bg-gray-100 border-t flex gap-2">
                <button
                  type="button"
                  onClick={player.reset}
                  className="px-3 py-1 bg-gray-300 rounded text-sm"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={player.stepBack}
                  disabled={player.isAnimating || player.currentIndex < 0}
                  className="px-3 py-1 bg-gray-300 rounded text-sm disabled:opacity-50"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={player.stepForward}
                  disabled={player.isAnimating || player.currentIndex >= player.moves.length - 1}
                  className="px-3 py-1 bg-gray-300 rounded text-sm disabled:opacity-50"
                >
                  Forward →
                </button>
                <button
                  type="button"
                  onClick={player.isPlaying ? player.pause : player.play}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  {player.isPlaying ? 'Pause' : 'Play'}
                </button>
              </div>
            </div>

            {/* State displays */}
            <div className="space-y-4">
              <CubeStateDisplay
                state={player.displayState}
                label={`Current displayState (index ${player.currentIndex})`}
              />

              {(() => {
                const step = player.currentIndex >= 0 ? stepStates[player.currentIndex] : null
                return step ? (
                  <CubeStateDisplay state={step.state} label={`Expected after "${step.move}"`} />
                ) : null
              })()}
            </div>
          </div>

          {/* Legend */}
          {showDebugInfo && (
            <div className="mt-6 bg-white rounded-lg shadow p-4">
              <h2 className="font-bold mb-2">Debug Legend</h2>
              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Numbers (1-54):</strong> Piece identity - moves with the piece
                </p>
                <p>
                  <strong>Labels (UA, FB, etc.):</strong> Position label - fixed location
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Piece numbering: U=1-9, F=10-18, R=19-27, B=28-36, L=37-45, D=46-54
                </p>
              </div>
            </div>
          )}

          {/* Step by step states */}
          <div className="mt-6 bg-white rounded-lg shadow p-4">
            <h2 className="font-bold mb-4">Step-by-step Expected States</h2>
            <div className="space-y-4">
              <CubeStateDisplay state={createSolvedCube()} label="0: Solved" />
              {stepStates.map((step) => (
                <div
                  key={`step-${step.move}-${stepStates.indexOf(step)}`}
                  className={
                    player.currentIndex === stepStates.indexOf(step)
                      ? 'ring-2 ring-blue-500 rounded-lg'
                      : ''
                  }
                >
                  <CubeStateDisplay
                    state={step.state}
                    label={`${stepStates.indexOf(step) + 1}: After ${step.move}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
