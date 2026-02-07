import { CubeViewer } from '@/components/cube'
import { Container } from '@/components/layout/Container'
import { Header } from '@/components/layout/Header'
import { PlayerControls, ScrambleDisplay } from '@/components/scramble'
import { SEO, pageSEO } from '@/components/seo'
import { Button } from '@/components/ui/Button'
import { useScramblePlayer } from '@/hooks/useScramblePlayer'
import { generateScrambleString } from '@/lib/scramble'
import { RefreshCw } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ScramblePage() {
  const { t, i18n } = useTranslation()
  const [scramble, setScramble] = useState(() => generateScrambleString())

  // Get SEO content for current language
  const seoContent =
    pageSEO.scramble[i18n.language as keyof typeof pageSEO.scramble] || pageSEO.scramble.en

  const player = useScramblePlayer(scramble)

  // Use ref to avoid dependency on player.setScramble
  const setScrambleRef = useRef(player.setScramble)
  setScrambleRef.current = player.setScramble

  // Update player when scramble changes
  useEffect(() => {
    setScrambleRef.current(scramble)
  }, [scramble])

  const handleNewScramble = useCallback(() => {
    setScramble(generateScrambleString())
  }, [])

  const handlePlayPause = useCallback(() => {
    if (player.isPlaying) {
      player.pause()
    } else {
      player.play()
    }
  }, [player])

  const handleMoveClick = useCallback(
    (index: number) => {
      // Click on move N should show the cube state AFTER that move is applied
      // So goToMove(index) makes currentIndex = index, which means moves[0..index] are applied
      player.goToMove(index)
    },
    [player],
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* SEO Meta Tags */}
      <SEO
        title={seoContent.title}
        description={seoContent.description}
        keywords={seoContent.keywords}
        canonical="/scramble"
      />
      <Header />
      <Container>
        <main className="py-12">
          <div className="max-w-3xl mx-auto">
            {/* Title */}
            <h1 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
              {t('scramble.title')}
            </h1>

            {/* 3D Cube Visualization with Animation */}
            <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
              <CubeViewer
                cubeState={player.displayState}
                currentMove={player.currentMove}
                isAnimating={player.isAnimating}
                speed={player.speed}
                onAnimationComplete={player.onAnimationComplete}
                height={320}
              />
            </div>

            {/* Player Controls */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <PlayerControls
                isPlaying={player.isPlaying}
                isAnimating={player.isAnimating}
                speed={player.speed}
                currentIndex={player.currentIndex}
                totalMoves={player.moves.length}
                onPlayPause={handlePlayPause}
                onStepForward={player.stepForward}
                onStepBack={player.stepBack}
                onReset={player.reset}
                onSpeedChange={player.setSpeed}
              />
            </div>

            {/* Scramble Display - Clickable Moves */}
            <div className="bg-white rounded-xl shadow-md mb-6">
              <ScrambleDisplay
                moves={player.moves}
                currentIndex={player.currentIndex}
                isAnimating={player.isAnimating}
                onMoveClick={handleMoveClick}
              />
            </div>

            {/* Generate Button */}
            <div className="flex justify-center">
              <Button variant="primary" size="lg" onClick={handleNewScramble}>
                <RefreshCw className="w-5 h-5 mr-2" />
                {t('scramble.generate')}
              </Button>
            </div>

            {/* Instructions */}
            <p className="text-neutral-500 text-center mt-8 text-sm">
              {t('scramble.instructions')}
            </p>
          </div>
        </main>
      </Container>
    </div>
  )
}
