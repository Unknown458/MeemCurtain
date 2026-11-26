import { useEffect, useRef, useState } from 'react'

// ─── Custom video player ───────────────────────────────────────────────────
// Plays API video media (mediaType 2) inside the product dialog with a
// professional play/pause, seek and mute control bar.

type Props = {
  src: string
  alt?: string
}

const formatTime = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0')
  return `${mins}:${secs}`
}

export default function VideoPlayer({ src, alt = 'Video' }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  const togglePlay = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play().catch(() => {})
    } else {
      v.pause()
    }
  }

  const toggleMute = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current
    if (!v || !duration) return
    const pct = Number(e.target.value)
    v.currentTime = (pct / 100) * duration
    setCurrent(v.currentTime)
  }

  // Autoplay muted (browser-safe) whenever a new source is selected.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = true
    setMuted(true)
    setCurrent(0)
    const p = v.play()
    if (p && typeof p.catch === 'function') p.catch(() => {})
  }, [src])

  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div className="video-player">
      <video
        ref={videoRef}
        className="video-player-el"
        src={src}
        playsInline
        preload="metadata"
        aria-label={alt}
        onClick={togglePlay}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={() => setPlaying(false)}
      />

      {/* Center play overlay */}
      {!playing && (
        <button
          type="button"
          className="video-player-center"
          onClick={togglePlay}
          aria-label="Play video"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.5-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
          </svg>
        </button>
      )}

      {/* Control bar */}
      <div className="video-player-bar">
        <button
          type="button"
          className="video-player-btn"
          onClick={togglePlay}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.5-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
            </svg>
          )}
        </button>

        <span className="video-player-time">
          {formatTime(current)} / {formatTime(duration)}
        </span>

        <input
          type="range"
          className="video-player-seek"
          min={0}
          max={100}
          step={0.1}
          value={progress}
          onChange={handleSeek}
          aria-label="Seek"
          style={{ backgroundSize: `${progress}% 100%` }}
        />

        <button
          type="button"
          className="video-player-btn"
          onClick={toggleMute}
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5zM22 9l-6 6M16 9l6 6" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 5 6 9H2v6h4l5 4V5zM15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
