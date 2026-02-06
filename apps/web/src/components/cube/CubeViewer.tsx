import { applyScramble, createSolvedCube } from '@/lib/cube-state'
import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useMemo } from 'react'
import { RubiksCube } from './RubiksCube'

interface CubeViewerProps {
  /** Scramble string to apply (e.g., "R U R' U'") */
  scramble: string
  /** Height of the viewer in pixels or CSS value */
  height?: string | number
}

/**
 * 3D Cube viewer with orbit controls
 * Displays a Rubik's Cube with the given scramble applied
 */
export function CubeViewer({ scramble, height = 300 }: CubeViewerProps) {
  // Compute cube state from scramble
  const cubeState = useMemo(() => {
    const solved = createSolvedCube()
    if (!scramble.trim()) return solved
    return applyScramble(solved, scramble)
  }, [scramble])

  return (
    <div style={{ width: '100%', height }}>
      <Canvas
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

        {/* The cube */}
        <RubiksCube cubeState={cubeState} />

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
