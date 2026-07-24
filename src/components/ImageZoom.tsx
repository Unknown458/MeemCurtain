import { useRef, useState } from 'react'

// ─── Flipkart-style image zoom ──────────────────────────────────────────────
// In-place magnification that works everywhere:
//   • Desktop: hover to zoom, cursor follows the magnified region.
//   • Mobile / touch: tap the image to zoom in, drag to pan, tap again to reset.
//   • +/- buttons adjust the zoom strength on any device.

type Props = {
  src: string
  alt: string
}

const LEVELS = [2, 2.5, 3, 4]

const clamp = (n: number) => Math.max(0, Math.min(100, n))

export default function ImageZoom({ src, alt }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [tapped, setTapped] = useState(false) // touch zoom toggle
  const [origin, setOrigin] = useState({ x: 50, y: 50 })
  const [idx, setIdx] = useState(0)

  const level = LEVELS[idx]
  const zoomed = hovering || tapped

  const pointToOrigin = (clientX: number, clientY: number) => {
    const el = containerRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((clientX - r.left) / r.width) * 100
    const y = ((clientY - r.top) / r.height) * 100
    setOrigin({ x: clamp(x), y: clamp(y) })
  }

  return (
    <div className="image-zoom-wrapper">
      <div
        ref={containerRef}
        className={`image-zoom-container${zoomed ? ' is-zoomed' : ''}`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onMouseMove={(e) => pointToOrigin(e.clientX, e.clientY)}
        onTouchStart={(e) => {
          if (e.touches[0]) pointToOrigin(e.touches[0].clientX, e.touches[0].clientY)
        }}
        onTouchMove={(e) => {
          if (e.touches[0]) pointToOrigin(e.touches[0].clientX, e.touches[0].clientY)
        }}
        onClick={() => {
          // Touch devices never fire mouseenter, so a tap toggles zoom instead.
          if (!hovering) setTapped((t) => !t)
        }}
      >
        <img
          src={src}
          alt={alt}
          className="image-zoom-img"
          style={{
            transform: `scale(${zoomed ? level : 1})`,
            transformOrigin: `${origin.x}% ${origin.y}%`,
          }}
          draggable={false}
        />

        {/* Hint shown only when not zoomed */}
        {!zoomed && (
          <span className="image-zoom-hint">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3M11 8v6M8 11h6" />
            </svg>
            Hover / tap to zoom
          </span>
        )}
      </div>

      {/* Zoom strength controls */}
      <div className="image-zoom-controls">
        <button
          type="button"
          className="image-zoom-btn"
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
          disabled={idx === 0}
          aria-label="Zoom out"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 12h14" />
          </svg>
        </button>
        <span className="image-zoom-level">{level.toFixed(1)}×</span>
        <button
          type="button"
          className="image-zoom-btn"
          onClick={() => setIdx((i) => Math.min(LEVELS.length - 1, i + 1))}
          disabled={idx === LEVELS.length - 1}
          aria-label="Zoom in"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  )
}
