import { useState, useEffect, useRef, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CONTACT_INFO } from '../constants/contact'
import '../styles/components.css'
import type { GalleryItem } from '../components/galleryData'
import ImageModal from '../components/ImageModal'
import {
  fetchWebsiteContent,
  mapContentToGalleryItem,
  buildCategoryTree,
  toSlug,
} from '../services/websiteContent'

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const ref = useRef<HTMLDivElement>(null)

  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // URL params: ?cat=curtains&sub=lounge-living-room
  const catParam = searchParams.get('cat') ?? 'all'
  const subParam = searchParams.get('sub') ?? ''

  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const loadGalleryData = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchWebsiteContent()
      const mapped = (data.contents || []).map(mapContentToGalleryItem)
      setItems(mapped)
    } catch (err) {
      console.error('Failed to load gallery:', err)
      setError('Unable to load gallery at the moment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadGalleryData()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Gallery – Meem Curtain'
  }, [])

  // ── Category tree (fully derived from API data) ────────────────────────────
  const tree = useMemo(() => buildCategoryTree(items), [items])

  // Active category object (or null = "all")
  const activeCat = tree.categories.find((c) => c.slug === catParam) ?? null

  // Subcategories visible for the selected category
  const visibleSubs = activeCat ? activeCat.subCategories : []

  // ── Filter: which items to display ────────────────────────────────────────
  const displayed = useMemo(() => {
    if (catParam === 'all') return items

    return items.filter((item) => {
      // Match category by slug
      const itemCatSlug = toSlug(item.category || '')
      if (itemCatSlug !== catParam) return false

      // If a subcategory is also active, narrow further
      if (subParam) {
        const itemSubSlug =
          toSlug(item.customFields?.subCategory || item.customFields?.room || item.room || 'other')
        return itemSubSlug === subParam
      }
      return true
    })
  }, [items, catParam, subParam])

  // ── URL navigation helpers ─────────────────────────────────────────────────
  const selectCat = (slug: string) => {
    if (slug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ cat: slug })
    }
  }

  const selectSub = (subSlug: string) => {
    if (!subSlug) {
      setSearchParams({ cat: catParam })
    } else {
      setSearchParams({ cat: catParam, sub: subSlug })
    }
  }

  // ── Active label for heading ───────────────────────────────────────────────
  const activeLabel = (() => {
    if (catParam === 'all') return 'All Collections'
    const cat = activeCat?.label ?? catParam
    if (subParam) {
      const sub = visibleSubs.find((s) => s.slug === subParam)?.label ?? subParam
      return `${cat} · ${sub}`
    }
    return cat
  })()

  // ── IntersectionObserver for fade-in animations ───────────────────────────
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    )
    el.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach((n) => {
      const rect = n.getBoundingClientRect()
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        n.classList.add('visible')
      }
      observer.observe(n)
    })
    return () => observer.disconnect()
  }, [displayed, loading])

  return (
    <main className="page-enter">
      {/* Hero */}
      <section className="gallery-hero">
        <div className="container gallery-hero-content">
          <p className="section-label">Our Portfolio</p>
          <h1 className="section-title" style={{ color: 'var(--white)' }}>
            Gallery &amp; Collections
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem', lineHeight: '1.8', marginTop: '0.5rem' }}>
            Explore our handcrafted curtains — browse by category or room.
          </p>
        </div>
      </section>

      {/* Gallery section */}
      <section className="gallery-section" ref={ref}>
        <div className="container">

          {/* ── CATEGORY FILTER ROW (level 1) ─────────────────────────── */}
          <div className="gallery-filter-wrap">
            <div className="gallery-filter" role="group" aria-label="Filter by category">
              {/* All */}
              <button
                className={`filter-btn${catParam === 'all' ? ' active' : ''}`}
                onClick={() => selectCat('all')}
                id="filter-all"
              >
                All Collections
                {!loading && <span className="filter-count">{items.length}</span>}
              </button>

              {/* One button per unique category from JSON */}
              {tree.categories.map((cat) => (
                <button
                  key={cat.slug}
                  className={`filter-btn${catParam === cat.slug ? ' active' : ''}`}
                  onClick={() => selectCat(cat.slug)}
                  id={`filter-${cat.slug}`}
                >
                  {cat.label}
                  {!loading && <span className="filter-count">{cat.count}</span>}
                </button>
              ))}
            </div>

            {/* ── SUBCATEGORY ROW (level 2) — only shown when a category is selected and it has subs ── */}
            {!loading && visibleSubs.length > 1 && (
              <div className="gallery-subfilter" role="group" aria-label="Filter by subcategory">
                {/* "All in <category>" */}
                <button
                  className={`subfilter-btn${!subParam ? ' active' : ''}`}
                  onClick={() => selectSub('')}
                >
                  All {activeCat?.label}
                  <span className="filter-count">{activeCat?.count}</span>
                </button>

                {visibleSubs.map((sub) => (
                  <button
                    key={sub.slug}
                    className={`subfilter-btn${subParam === sub.slug ? ' active' : ''}`}
                    onClick={() => selectSub(sub.slug)}
                    id={`subfilter-${sub.slug}`}
                  >
                    {sub.label}
                    <span className="filter-count">{sub.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Heading & count ───────────────────────────────────────── */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 className="fade-up" style={{ fontSize: '1.8rem' }}>{activeLabel}</h2>
            <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              {loading
                ? 'Loading collection...'
                : `${displayed.length} piece${displayed.length !== 1 ? 's' : ''} available`}
            </p>
          </div>

          {/* ── Loading skeletons ─────────────────────────────────────── */}
          {loading && (
            <div className="gallery-masonry">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="gallery-skeleton-card"
                  style={{ height: n % 3 === 0 ? '380px' : n % 2 === 0 ? '300px' : '260px' }}
                />
              ))}
            </div>
          )}

          {/* ── Error ─────────────────────────────────────────────────── */}
          {!loading && error && (
            <div className="gallery-empty-state">
              <p style={{ color: '#d9534f', fontSize: '1.1rem', marginBottom: '1rem' }}>{error}</p>
              <button onClick={loadGalleryData} className="btn btn-primary">Retry Loading</button>
            </div>
          )}

          {/* ── Empty state ───────────────────────────────────────────── */}
          {!loading && !error && displayed.length === 0 && (
            <div className="gallery-empty-state">
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧵</div>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>
                No items in this {subParam ? 'subcategory' : 'category'} yet
              </h3>
              <p style={{ color: 'var(--text-body)', marginBottom: '1.5rem' }}>
                Browse our full collection to view all handcrafted designs.
              </p>
              <button onClick={() => selectCat('all')} className="btn btn-primary">
                View All Collections
              </button>
            </div>
          )}

          {/* ── Masonry grid ──────────────────────────────────────────── */}
          {!loading && !error && displayed.length > 0 && (
            <div className="gallery-masonry">
              {displayed.map((item, i) => (
                <div
                  key={item.id}
                  className={`gallery-item fade-up delay-${(i % 5) + 1}`}
                  id={`gallery-item-${item.id}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`View details for ${item.title}`}
                  onClick={() => setActiveItem(item)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setActiveItem(item)
                    }
                  }}
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).src = '/images/lounge.png'
                    }}
                  />
                  <div className="gallery-item-overlay">
                    <span className="gallery-overlay-title">{item.title}</span>
                    {/* Show subcategory badge on card */}
                    {item.room && item.room !== item.category && (
                      <span className="gallery-card-sub">{item.room}</span>
                    )}
                    {typeof item.price === 'number' && (
                      <span className="gallery-card-price">
                        {item.currency === 'ZAR' ? 'R ' : `${item.currency || 'R'} `}
                        {item.price.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── CTA after gallery ─────────────────────────────────────── */}
          <div
            style={{ textAlign: 'center', marginTop: '5rem', padding: '3rem', background: 'var(--accent)', borderRadius: '16px' }}
            className="fade-up"
          >
            <p className="section-label" style={{ justifyContent: 'center', color: 'var(--primary)' }}>
              Like what you see?
            </p>
            <h3 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
              Get a Custom Curtain for Your Space
            </h3>
            <p style={{ color: 'var(--text-body)', marginBottom: '2rem', maxWidth: 460, margin: '0 auto 2rem' }}>
              Send us a photo of your room and we'll recommend the perfect curtain.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn-primary" id="gallery-cta-contact">
                Send Inquiry
              </Link>
              <a
                href={`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=Hi%20Meem%20Curtain%2C%20I%20saw%20your%20gallery%20and%20would%20love%20a%20quote!`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-outline-dark" id="gallery-cta-wa"
              >
                💬 WhatsApp Quote
              </a>
            </div>
          </div>

        </div>
      </section>

      <ImageModal item={activeItem} onClose={() => setActiveItem(null)} />
    </main>
  )
}
