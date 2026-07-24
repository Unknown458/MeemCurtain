import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import type { GalleryItem } from './galleryData'
import { filters } from './galleryData'
import ImageZoom from './ImageZoom'
import '../styles/components.css'

const WHATSAPP_NUMBER = '27000000000'

type Props = {
  item: GalleryItem | null
  onClose: () => void
}

export default function ImageModal({ item, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  const open = item !== null

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

  const catLabel = filters.find((f) => f.slug === item.cat)?.label ?? item.cat
  const waText = encodeURIComponent(
    `Hi Meem Curtain, I'm interested in the "${item.title}" (${catLabel}) from your gallery. Could you share a quote?`
  )

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

        {/* ─── LEFT: image stage with Flipkart-style magnifier ─────────── */}
        <div className="image-modal-stage">
          <ImageZoom src={item.img} alt={item.title} />
        </div>

        {/* ─── RIGHT: info panel ────────────────────────────────────────── */}
        <div className="image-modal-info">
          <span className="image-modal-cat-badge">{catLabel}</span>
          <h2 className="image-modal-title">{item.title}</h2>

          <p className="image-modal-desc">{item.description}</p>

          <dl className="image-modal-facts">
            <div className="image-modal-fact">
              <dt>Fabric</dt>
              <dd>{item.fabric}</dd>
            </div>
            <div className="image-modal-fact">
              <dt>Room</dt>
              <dd>{item.room}</dd>
            </div>
            <div className="image-modal-fact">
              <dt>Light</dt>
              <dd>{item.light}</dd>
            </div>
            <div className="image-modal-fact">
              <dt>Care</dt>
              <dd>{item.care}</dd>
            </div>
          </dl>

          <div className="image-modal-actions">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`}
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
