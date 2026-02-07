import { Link } from 'react-router-dom'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  to?: string
  className?: string
}

const sizeMap = {
  sm: { cube: 28, text: 'text-lg' },
  md: { cube: 36, text: 'text-xl' },
  lg: { cube: 48, text: 'text-2xl' },
}

/**
 * Cubing World Logo
 * Isometric Rubik's cube with cosmic arcade styling
 */
export function Logo({ size = 'md', showText = true, to = '/', className = '' }: LogoProps) {
  const { cube: cubeSize, text: textClass } = sizeMap[size]

  const logoContent = (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Isometric Cube Icon */}
      <div
        className="logo-cube-container relative flex items-center justify-center"
        style={{ width: cubeSize, height: cubeSize }}
      >
        <svg
          viewBox="0 0 48 48"
          width={cubeSize}
          height={cubeSize}
          className="logo-cube-svg"
        >
          <defs>
            {/* Gradient for top face */}
            <linearGradient id="logoTopFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e8e8e8" />
            </linearGradient>
            
            {/* Gradient for left face (orange) */}
            <linearGradient id="logoLeftFace" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--neon-orange, #ff6b00)" />
              <stop offset="100%" stopColor="#cc5500" />
            </linearGradient>
            
            {/* Gradient for right face (blue) */}
            <linearGradient id="logoRightFace" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--cube-blue, #0088ff)" />
              <stop offset="100%" stopColor="#0066cc" />
            </linearGradient>
            
            {/* Glow filter */}
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1" result="blur" />
              <feFlood floodColor="var(--neon-cyan, #00fff2)" floodOpacity="0.4" />
              <feComposite in2="blur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Isometric Rubik's Cube */}
          <g transform="translate(24, 24)" filter="url(#logoGlow)">
            {/* Top face (white) */}
            <polygon
              points="0,-14 12,-8 0,-2 -12,-8"
              fill="url(#logoTopFace)"
              stroke="var(--text-muted, #555)"
              strokeWidth="0.3"
            />
            {/* Top grid lines */}
            <line x1="-4" y1="-10" x2="4" y2="-5" stroke="#bbb" strokeWidth="0.4" />
            <line x1="4" y1="-10" x2="-4" y2="-5" stroke="#bbb" strokeWidth="0.4" />
            
            {/* Left face (orange) */}
            <polygon
              points="-12,-8 0,-2 0,10 -12,4"
              fill="url(#logoLeftFace)"
              stroke="var(--text-muted, #444)"
              strokeWidth="0.3"
            />
            {/* Left grid lines */}
            <line x1="-8" y1="-3" x2="-4" y2="1" stroke="#aa4400" strokeWidth="0.4" />
            <line x1="-8" y1="1" x2="-4" y2="5" stroke="#aa4400" strokeWidth="0.4" />
            
            {/* Right face (blue) */}
            <polygon
              points="12,-8 12,4 0,10 0,-2"
              fill="url(#logoRightFace)"
              stroke="var(--text-muted, #444)"
              strokeWidth="0.3"
            />
            {/* Right grid lines */}
            <line x1="4" y1="-3" x2="8" y2="1" stroke="#004499" strokeWidth="0.4" />
            <line x1="4" y1="1" x2="8" y2="5" stroke="#004499" strokeWidth="0.4" />
            
            {/* Edge highlights */}
            <line x1="0" y1="-14" x2="12" y2="-8" stroke="var(--neon-cyan, #00fff2)" strokeWidth="0.8" opacity="0.7" />
            <line x1="0" y1="-14" x2="-12" y2="-8" stroke="var(--neon-magenta, #ff00ff)" strokeWidth="0.8" opacity="0.5" />
          </g>
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <span className={`font-display font-bold tracking-wider text-glow-cyan ${textClass}`}>
          CUBING WORLD
        </span>
      )}
    </div>
  )

  if (to) {
    return (
      <Link
        to={to}
        className="hover:opacity-90 transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neon-cyan)] rounded-lg"
      >
        {logoContent}
      </Link>
    )
  }

  return logoContent
}
