import type { FaceColor } from '@/lib/cube-state'
import { COLOR_HEX } from '@/lib/cube-state'
import { Text } from '@react-three/drei'
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
  /** Piece numbers for each visible face (moves with the piece) */
  pieceNumbers?: {
    right?: number
    left?: number
    top?: number
    bottom?: number
    front?: number
    back?: number
  }
  /** Position labels for each visible face (fixed positions) */
  positionLabels?: {
    right?: string
    left?: string
    top?: string
    bottom?: string
    front?: string
    back?: string
  }
  /** Show debug info (piece numbers and position labels) */
  showDebugInfo?: boolean
}

/** Size of the black cube base */
const CUBE_SIZE = 0.97

/** Size of the colored sticker (smaller than cube face to show border) */
const STICKER_SIZE = 0.82

/** Offset to place sticker slightly above cube surface */
const STICKER_OFFSET = 0.49

/** Text offset from sticker surface */
const TEXT_OFFSET = 0.02

/**
 * A single cubie (small cube) with colored stickers and black borders
 * Uses a black cube base with colored plane stickers on top
 */
export function Cubie({
  position,
  colors,
  pieceNumbers,
  positionLabels,
  showDebugInfo = false,
}: CubieProps) {
  const stickerMaterials = useMemo(() => {
    return {
      right: colors.right
        ? new THREE.MeshStandardMaterial({
            color: COLOR_HEX[colors.right],
            roughness: 0.3,
            metalness: 0.0,
          })
        : null,
      left: colors.left
        ? new THREE.MeshStandardMaterial({
            color: COLOR_HEX[colors.left],
            roughness: 0.3,
            metalness: 0.0,
          })
        : null,
      top: colors.top
        ? new THREE.MeshStandardMaterial({
            color: COLOR_HEX[colors.top],
            roughness: 0.3,
            metalness: 0.0,
          })
        : null,
      bottom: colors.bottom
        ? new THREE.MeshStandardMaterial({
            color: COLOR_HEX[colors.bottom],
            roughness: 0.3,
            metalness: 0.0,
          })
        : null,
      front: colors.front
        ? new THREE.MeshStandardMaterial({
            color: COLOR_HEX[colors.front],
            roughness: 0.3,
            metalness: 0.0,
          })
        : null,
      back: colors.back
        ? new THREE.MeshStandardMaterial({
            color: COLOR_HEX[colors.back],
            roughness: 0.3,
            metalness: 0.0,
          })
        : null,
    }
  }, [colors])

  // Render debug text (piece number in center, position label in corner)
  const renderDebugText = (
    face: 'right' | 'left' | 'top' | 'bottom' | 'front' | 'back',
    facePosition: [number, number, number],
    rotation: [number, number, number],
  ) => {
    if (!showDebugInfo) return null

    const pieceNum = pieceNumbers?.[face]
    const posLabel = positionLabels?.[face]

    if (!pieceNum && !posLabel) return null

    return (
      <group>
        {/* Piece number - large, centered */}
        {pieceNum !== undefined && (
          <Text
            position={facePosition}
            rotation={rotation}
            fontSize={0.35}
            color="#000000"
            anchorX="center"
            anchorY="middle"
            fontWeight="bold"
            raycast={() => null}
          >
            {pieceNum}
          </Text>
        )}
        {/* Position label - small, in corner */}
        {posLabel && (
          <Text
            position={[
              facePosition[0] + (face === 'right' ? 0 : face === 'left' ? 0 : -0.28),
              facePosition[1] + (face === 'top' ? 0 : face === 'bottom' ? 0 : 0.28),
              facePosition[2] + (face === 'front' ? 0 : face === 'back' ? 0 : 0),
            ]}
            rotation={rotation}
            fontSize={0.12}
            color="#333333"
            anchorX="left"
            anchorY="top"
            raycast={() => null}
          >
            {posLabel}
          </Text>
        )}
      </group>
    )
  }

  return (
    <group position={position}>
      {/* Black cube base */}
      <mesh>
        <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
        <meshStandardMaterial color="#111111" roughness={0.5} />
      </mesh>

      {/* Right sticker (+X) */}
      {stickerMaterials.right && (
        <>
          <mesh
            position={[STICKER_OFFSET, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            material={stickerMaterials.right}
          >
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          </mesh>
          {renderDebugText('right', [STICKER_OFFSET + TEXT_OFFSET, 0, 0], [0, Math.PI / 2, 0])}
        </>
      )}

      {/* Left sticker (-X) */}
      {stickerMaterials.left && (
        <>
          <mesh
            position={[-STICKER_OFFSET, 0, 0]}
            rotation={[0, -Math.PI / 2, 0]}
            material={stickerMaterials.left}
          >
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          </mesh>
          {renderDebugText('left', [-STICKER_OFFSET - TEXT_OFFSET, 0, 0], [0, -Math.PI / 2, 0])}
        </>
      )}

      {/* Top sticker (+Y) */}
      {stickerMaterials.top && (
        <>
          <mesh
            position={[0, STICKER_OFFSET, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            material={stickerMaterials.top}
          >
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          </mesh>
          {renderDebugText('top', [0, STICKER_OFFSET + TEXT_OFFSET, 0], [-Math.PI / 2, 0, 0])}
        </>
      )}

      {/* Bottom sticker (-Y) */}
      {stickerMaterials.bottom && (
        <>
          <mesh
            position={[0, -STICKER_OFFSET, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            material={stickerMaterials.bottom}
          >
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          </mesh>
          {renderDebugText('bottom', [0, -STICKER_OFFSET - TEXT_OFFSET, 0], [Math.PI / 2, 0, 0])}
        </>
      )}

      {/* Front sticker (+Z) */}
      {stickerMaterials.front && (
        <>
          <mesh position={[0, 0, STICKER_OFFSET]} material={stickerMaterials.front}>
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          </mesh>
          {renderDebugText('front', [0, 0, STICKER_OFFSET + TEXT_OFFSET], [0, 0, 0])}
        </>
      )}

      {/* Back sticker (-Z) */}
      {stickerMaterials.back && (
        <>
          <mesh
            position={[0, 0, -STICKER_OFFSET]}
            rotation={[0, Math.PI, 0]}
            material={stickerMaterials.back}
          >
            <planeGeometry args={[STICKER_SIZE, STICKER_SIZE]} />
          </mesh>
          {renderDebugText('back', [0, 0, -STICKER_OFFSET - TEXT_OFFSET], [0, Math.PI, 0])}
        </>
      )}
    </group>
  )
}
