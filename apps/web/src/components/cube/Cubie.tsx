import type { FaceColor } from '@/lib/cube-state'
import { COLOR_HEX } from '@/lib/cube-state'
import { useMemo } from 'react'
import * as THREE from 'three'

interface CubieProps {
  position: [number, number, number]
  colors: {
    right?: FaceColor
    left?: FaceColor
    top?: FaceColor
    bottom?: FaceColor
    front?: FaceColor
    back?: FaceColor
  }
}

/** Internal dark color for non-visible faces (cube body) */
const BLACK = '#0d0d0d'

/** Size of each cubie */
const CUBIE_SIZE = 0.93

/**
 * A single cubie (small cube) with colored faces
 * Each cubie can have 0-3 colored faces depending on its position
 */
export function Cubie({ position, colors }: CubieProps) {
  const materials = useMemo(() => {
    // Three.js box faces order: +X, -X, +Y, -Y, +Z, -Z
    // Which maps to: right, left, top, bottom, front, back
    return [
      new THREE.MeshStandardMaterial({
        color: colors.right ? COLOR_HEX[colors.right] : BLACK,
        roughness: 0.2,
        metalness: 0.0,
      }),
      new THREE.MeshStandardMaterial({
        color: colors.left ? COLOR_HEX[colors.left] : BLACK,
        roughness: 0.2,
        metalness: 0.0,
      }),
      new THREE.MeshStandardMaterial({
        color: colors.top ? COLOR_HEX[colors.top] : BLACK,
        roughness: 0.2,
        metalness: 0.0,
      }),
      new THREE.MeshStandardMaterial({
        color: colors.bottom ? COLOR_HEX[colors.bottom] : BLACK,
        roughness: 0.2,
        metalness: 0.0,
      }),
      new THREE.MeshStandardMaterial({
        color: colors.front ? COLOR_HEX[colors.front] : BLACK,
        roughness: 0.2,
        metalness: 0.0,
      }),
      new THREE.MeshStandardMaterial({
        color: colors.back ? COLOR_HEX[colors.back] : BLACK,
        roughness: 0.2,
        metalness: 0.0,
      }),
    ]
  }, [colors])

  return (
    <mesh position={position} material={materials}>
      <boxGeometry args={[CUBIE_SIZE, CUBIE_SIZE, CUBIE_SIZE]} />
    </mesh>
  )
}
