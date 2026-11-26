import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { CONTACT_INFO } from '../constants/contact'
import type { GalleryItem, GalleryMedia } from './galleryData'
import { filters, getPrimaryMedia, isVideoMedia } from './galleryData'
import ImageZoom from './ImageZoom'
import VideoPlayer from './VideoPlayer'
import '../styles/components.css'

type Props = {
  item: GalleryItem | null
  onClose: () => void
}

export default function ImageModal({ item, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const [selectedMedia, setSelectedMedia] = useState<GalleryMedia | null>(null)

  const open = item !== null

  // Keep the selected media in sync when item changes
  useEffect(() => {
    if (item) {
      setSelectedMedia(getPrimaryMedia(item) || null)
    }
  }, [item])

  // ─── Lifecycle: Esc to close, body scroll lock, focus close button ────────
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 30)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      window.clearTimeout(t)
    }
  }, [open, onClose])

  if (!open || !item) return null

  const catLabel =
    filters.find((f) => f.slug === item.cat)?.label ?? item.category ?? item.room ?? item.cat

  const priceFormatted =
    typeof item.price === 'number'
      ? `${item.currency === 'ZAR' ? 'R ' : (item.currency ? `${item.currency} ` : 'R ')}${item.price.toLocaleString('en-ZA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
      : null

  const waText = encodeURIComponent(
    `Hi Meem Curtain, I'm interested in the "${item.title}" (${priceFormatted ? `${priceFormatted} · ` : ''}${catLabel}) from your gallery. Could you share more details?`
  )

  const mediaList = item.media && item.media.length > 0 ? item.media : []

  const activeKey = selectedMedia?.mediaId ?? selectedMedia?.mediaPath
  const selectedIsVideo = isVideoMedia(selectedMedia)

  return createPortal(
    <div
      className="image-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="image-modal"
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeBtnRef}
          className="image-modal-close"
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {/* ─── LEFT: media stage (video player or image magnifier) ──────── */}
        <div className={`image-modal-stage${selectedIsVideo ? ' is-video' : ''}`}>
          {selectedIsVideo ? (
            <VideoPlayer
              key={selectedMedia?.mediaPath}
              src={selectedMedia?.mediaPath || ''}
              alt={item.title}
            />
          ) : (
            <ImageZoom src={selectedMedia?.mediaPath || item.img} alt={item.title} />
          )}

          {/* Thumbnails when a product has more than one media item */}
          {mediaList.length > 1 && (
            <div className="image-modal-thumbs">
              {mediaList.map((m, idx) => {
                const key = m.mediaId ?? m.mediaPath
                return (
                  <button
                    type="button"
                    key={key || idx}
                    className={`image-modal-thumb${activeKey === key ? ' active' : ''}`}
                    onClick={() => setSelectedMedia(m)}
                    title={m.imageDescription || `Media ${idx + 1}`}
                  >
                    {isVideoMedia(m) ? (
                      <>
                        <video src={m.mediaPath} muted playsInline preload="metadata" />
                        <span className="image-modal-thumb-badge">▶</span>
                      </>
                    ) : (
                      <img src={m.mediaPath} alt={m.altText || item.title} />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* ─── RIGHT: info panel ────────────────────────────────────────── */}
        <div className="image-modal-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <span className="image-modal-cat-badge">{catLabel}</span>
            {item.warranty && (
              <span className="image-modal-warranty">🛡️ {item.warranty} Warranty</span>
            )}
          </div>

          <h2 className="image-modal-title">{item.title}</h2>

          {priceFormatted && (
            <div className="image-modal-price-box">
              <span className="image-modal-price">{priceFormatted}</span>
            </div>
          )}

          {item.shortDescription && item.shortDescription !== item.description && (
            <p className="image-modal-short-desc">{item.shortDescription}</p>
          )}

          <p className="image-modal-desc">{item.description}</p>

          <dl className="image-modal-facts">
            {item.fabric && (
              <div className="image-modal-fact">
                <dt>Fabric</dt>
                <dd>{item.fabric}</dd>
              </div>
            )}
            {item.room && (
              <div className="image-modal-fact">
                <dt>Room</dt>
                <dd>{item.room}</dd>
              </div>
            )}
            {item.light && (
              <div className="image-modal-fact">
                <dt>Light</dt>
                <dd>{item.light}</dd>
              </div>
            )}
            {item.care && (
              <div className="image-modal-fact">
                <dt>Care</dt>
                <dd>{item.care}</dd>
              </div>
            )}
          </dl>

          <div className="image-modal-actions">
            <a
              href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              💬 Ask on WhatsApp
            </a>
            <Link to="/contact" onClick={onClose} className="btn btn-outline-dark">
              Send Inquiry
            </Link>
          </div>

          <p className="image-modal-foot">
            All curtains are custom-made to your measurements · Free consultation
          </p>
        </div>
      </div>
    </div>,
    document.body
  )
}
