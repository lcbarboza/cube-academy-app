import type { SpeedOption } from '@/hooks/useScramblePlayer'
import type { CubeState, PieceState } from '@/lib/cube-state'
import { Suspense, lazy, useEffect, useRef } from 'react'

// Lazy load the heavy CubeViewer component (Three.js bundle)
const CubeViewerLazy = lazy(() =>
  import('./CubeViewer').then((module) => ({ default: module.CubeViewer })),
)

interface LazyCubeViewerProps {
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
  /** Called when the cube has finished loading */
  onLoad?: () => void
}

/**
 * Loading placeholder for the cube viewer
 * Shows a minimalist cube skeleton with pulsing animation
 */
function CubeLoadingFallback({ height }: { height: string | number }) {
  return (
    <div
      style={{ width: '100%', height, position: 'relative' }}
      className="flex items-center justify-center"
    >
      <div className="cube-loading-skeleton">
        {/* Minimalist 3D cube outline */}
        <svg
          viewBox="0 0 100 100"
          className="w-24 h-24 animate-pulse"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          role="img"
          aria-label="Loading cube"
        >
          {/* Front face */}
          <polygon
            points="25,35 75,35 75,85 25,85"
            className="fill-[var(--surface-elevated)] stroke-[var(--text-muted)]"
            opacity="0.5"
          />
          {/* Top face */}
          <polygon
            points="25,35 50,15 100,15 75,35"
            className="fill-[var(--surface-elevated)] stroke-[var(--text-muted)]"
            opacity="0.3"
          />
          {/* Right face */}
          <polygon
            points="75,35 100,15 100,65 75,85"
            className="fill-[var(--surface-elevated)] stroke-[var(--text-muted)]"
            opacity="0.4"
          />
        </svg>
        <span className="absolute bottom-4 text-xs font-mono text-[var(--text-muted)] animate-pulse">
          Loading 3D...
        </span>
      </div>
    </div>
  )
}

/**
 * Wrapper that notifies when the lazy component has mounted
 */
function CubeViewerWithLoadCallback({
  onLoad,
  ...props
}: Omit<LazyCubeViewerProps, 'onLoad'> & { onLoad?: () => void }) {
  const hasCalledOnLoad = useRef(false)

  useEffect(() => {
    if (!hasCalledOnLoad.current) {
      hasCalledOnLoad.current = true
      // Small delay to ensure Three.js canvas is ready
      const timer = setTimeout(() => {
        onLoad?.()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [onLoad])

  return (
    <CubeViewerLazy
      cubeState={props.cubeState}
      pieceState={props.pieceState}
      currentMove={props.currentMove ?? null}
      isAnimating={props.isAnimating ?? false}
      speed={props.speed ?? 1}
      onAnimationComplete={props.onAnimationComplete}
      height={props.height ?? 300}
      showDebugInfo={props.showDebugInfo ?? false}
    />
  )
}

/**
 * Lazy-loaded 3D Cube viewer with Suspense fallback
 * Reduces initial page load time by deferring Three.js bundle
 */
export function LazyCubeViewer({
  cubeState,
  pieceState,
  currentMove = null,
  isAnimating = false,
  speed = 1,
  onAnimationComplete,
  height = 300,
  showDebugInfo = false,
  onLoad,
}: LazyCubeViewerProps) {
  return (
    <Suspense fallback={<CubeLoadingFallback height={height} />}>
      <CubeViewerWithLoadCallback
        cubeState={cubeState}
        pieceState={pieceState}
        currentMove={currentMove}
        isAnimating={isAnimating}
        speed={speed}
        onAnimationComplete={onAnimationComplete}
        height={height}
        showDebugInfo={showDebugInfo}
        onLoad={onLoad}
      />
    </Suspense>
  )
}
