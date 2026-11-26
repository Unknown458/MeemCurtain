import { useEffect, useState } from 'react'
import { getPrimaryMedia, isVideoMedia } from './galleryData'
import type { GalleryItem } from './galleryData'

// Renders the correct media preview for a gallery card — a looping muted
// video when the primary media is a video, otherwise the item's image.

type Props = {
  item: GalleryItem
}

export default function MediaThumb({ item }: Props) {
  const primary = getPrimaryMedia(item)
  const isVideo = isVideoMedia(primary)
  const mediaUrl = isVideo ? primary?.mediaPath : item.img
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setLoaded(false)
    setFailed(false)
  }, [mediaUrl])

  return (
    <span className={`media-thumb${loaded ? ' is-loaded' : ''}${failed ? ' has-error' : ''}`}>
      {!loaded && !failed && <span className="media-thumb-skeleton" aria-hidden="true" />}
      {isVideo ? (
        <>
        <video
          className="media-thumb-video"
          src={mediaUrl}
          muted
          playsInline
          preload="metadata"
          aria-hidden="true"
          onLoadedData={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setFailed(true)
          }}
        />
        <span className="media-thumb-badge" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.54.84l10.5-6.86a1 1 0 0 0 0-1.68L9.54 4.3A1 1 0 0 0 8 5.14z" />
          </svg>
        </span>
        </>
      ) : (
        <img
          src={mediaUrl}
          alt={item.title}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => {
            setLoaded(false)
            setFailed(true)
          }}
        />
      )}
      {failed && (
        <span className="media-thumb-error" role="img" aria-label="Media could not be loaded">
          Media unavailable
        </span>
      )}
    </span>
  )
}
