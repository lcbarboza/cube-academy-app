import { CubeViewer } from '@/components/cube'
import { Container } from '@/components/layout/Container'
import { Header } from '@/components/layout/Header'
import { Button } from '@/components/ui/Button'
import { generateScrambleString } from '@/lib/scramble'
import { RefreshCw } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'

export function ScramblePage() {
  const { t } = useTranslation()
  const [scramble, setScramble] = useState(() => generateScrambleString())

  const handleNewScramble = useCallback(() => {
    setScramble(generateScrambleString())
  }, [])

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />
      <Container>
        <main className="py-12">
          <div className="max-w-3xl mx-auto">
            {/* Title */}
            <h1 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
              {t('scramble.title')}
            </h1>

            {/* 3D Cube Visualization */}
            <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
              <CubeViewer scramble={scramble} height={320} />
            </div>

            {/* Scramble Display */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <p
                className="font-mono text-xl md:text-2xl text-neutral-800 text-center leading-relaxed tracking-wide select-all"
                aria-label={t('scramble.sequence')}
              >
                {scramble}
              </p>
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
