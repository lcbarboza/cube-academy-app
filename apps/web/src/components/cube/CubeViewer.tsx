import type { SpeedOption } from '@/hooks/useScramblePlayer'
import type { CubeState, PieceState } from '@/lib/cube-state'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { AnimatedRubiksCube } from './AnimatedRubiksCube'

interface CubeViewerProps {
  /** Current cube state to display */
  cubeState: CubeState
  /** Current piece state for debug tracking */
  pieceState?: PieceState
  /** Move currently being animated (null if not animating) */
  currentMove?: string | null
  /** Whether animation is in progress */
  isAnimating?: boolean
  /** Animation speed multiplier */
  speed?: SpeedOption
  /** Called when animation completes */
  onAnimationComplete?: () => void
  /** Height of the viewer in pixels or CSS value */
  height?: string | number
  /** Show debug info (piece numbers and position labels) */
  showDebugInfo?: boolean
}

/**
 * 3D Cube viewer with orbit controls and animation support
 * Displays a Rubik's Cube with optional move animation
 */
export function CubeViewer({
  cubeState,
  pieceState,
  currentMove = null,
  isAnimating = false,
  speed = 1,
  onAnimationComplete,
  height = 300,
  showDebugInfo = false,
}: CubeViewerProps) {
  // Force re-render on resize/orientation change to fix Canvas sizing issues
  const [canvasKey, setCanvasKey] = useState(0)

  useEffect(() => {
    let resizeTimeout: ReturnType<typeof setTimeout>
    
    const handleResize = () => {
      // Debounce resize events to avoid excessive re-renders
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        // Force Canvas to recalculate by changing key
        setCanvasKey((k) => k + 1)
      }, 100)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      clearTimeout(resizeTimeout)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
  }, [])

  return (
    <div style={{ width: '100%', height, position: 'relative' }}>
      <Canvas
        key={canvasKey}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        camera={{
          position: [5, 4, 5],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
      >
        {/* Bright ambient light for overall illumination */}
        <ambientLight intensity={1.2} />

        {/* Main directional lights for bright, even lighting */}
        <directionalLight position={[10, 10, 10]} intensity={1.5} />
        <directionalLight position={[-10, 10, -10]} intensity={0.8} />
        <directionalLight position={[0, -10, 0]} intensity={0.4} />

        {/* The animated cube */}
        <AnimatedRubiksCube
          cubeState={cubeState}
          pieceState={pieceState}
          currentMove={currentMove}
          isAnimating={isAnimating}
          speed={speed}
          onAnimationComplete={onAnimationComplete ?? (() => {})}
          showDebugInfo={showDebugInfo}
        />

        {/* Orbit controls for rotation */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.8}
        />
      </Canvas>
    </div>
  )
}
