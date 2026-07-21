import { useState, useEffect, useRef } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import '../styles/components.css'

function useSectionAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    )
    const el = ref.current
    if (el) el.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])
  return ref
}

// ─── All gallery items ────────────────────────────────────────────────────
const allItems = [
  // Lounge
  { id: 1,  cat: 'lounge',   title: 'Classic Lounge Drape',      img: '/images/lounge.png'   },
  { id: 2,  cat: 'lounge',   title: 'Sheer Lounge Panel',        img: '/images/lounge.png'   },
  { id: 3,  cat: 'lounge',   title: 'Velvet Lounge Curtain',     img: '/images/lounge.png'   },
  // Bedroom
  { id: 4,  cat: 'bedroom',  title: 'Golden Bedroom Sheer',      img: '/images/bedroom.png'  },
  { id: 5,  cat: 'bedroom',  title: 'Blackout Bedroom Panel',    img: '/images/bedroom.png'  },
  { id: 6,  cat: 'bedroom',  title: 'Linen Master Bedroom',      img: '/images/bedroom.png'  },
  // Dining
  { id: 7,  cat: 'dining',   title: 'Elegant Dining Room',       img: '/images/dining.png'   },
  { id: 8,  cat: 'dining',   title: 'Formal Dining Drape',       img: '/images/dining.png'   },
  { id: 9,  cat: 'dining',   title: 'Dining Room Sheer',         img: '/images/dining.png'   },
  // Kitchen
  { id: 10, cat: 'kitchen',  title: 'Café Kitchen Curtain',      img: '/images/kitchen.png'  },
  { id: 11, cat: 'kitchen',  title: 'Farmhouse Kitchen Panel',   img: '/images/kitchen.png'  },
  { id: 12, cat: 'kitchen',  title: 'Linen Kitchen Tier',        img: '/images/kitchen.png'  },
  // Studio
  { id: 13, cat: 'studio',   title: 'Studio Blackout Panel',     img: '/images/studio.png'   },
  { id: 14, cat: 'studio',   title: 'Creative Studio Drape',     img: '/images/studio.png'   },
  { id: 15, cat: 'studio',   title: 'Minimal Studio Curtain',    img: '/images/studio.png'   },
]

const filters = [
  { slug: 'all',     label: 'All Collections' },
  { slug: 'lounge',  label: 'Lounge Curtain'  },
  { slug: 'bedroom', label: 'Bed Room Curtain' },
  { slug: 'dining',  label: 'Dining Room'      },
  { slug: 'kitchen', label: 'Kitchen'          },
  { slug: 'studio',  label: 'Studio'           },
]

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const ref = useSectionAnimation()

  const catParam = searchParams.get('cat') ?? 'all'
  const [active, setActive] = useState(catParam)

  // Sync URL param → active filter
  useEffect(() => {
    setActive(catParam)
  }, [catParam])

  const handleFilter = (slug: string) => {
    setActive(slug)
    if (slug === 'all') {
      setSearchParams({})
    } else {
      setSearchParams({ cat: slug })
    }
  }

  const displayed = active === 'all'
    ? allItems
    : allItems.filter((i) => i.cat === active)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Gallery – Meem Curtain'
  }, [])

  return (
    <main className="page-enter">
      {/* Hero */}
      <section className="gallery-hero">
        <div className="container gallery-hero-content">
          <p className="section-label">Our Portfolio</p>
          <h1 className="section-title" style={{ color: 'var(--white)' }}>
            Gallery &amp; Collections
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '1rem',
            lineHeight: '1.8', marginTop: '0.5rem' }}>
            Explore our full range of handcrafted curtains for every room in your home.
          </p>
        </div>
      </section>

      {/* Gallery section */}
      <section className="gallery-section" ref={ref}>
        <div className="container">

          {/* Filter tabs */}
          <div className="gallery-filter" role="group" aria-label="Filter by category">
            {filters.map((f) => (
              <button
                key={f.slug}
                className={`filter-btn${active === f.slug ? ' active' : ''}`}
                onClick={() => handleFilter(f.slug)}
                id={`filter-${f.slug}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Title */}
          <div style={{ marginBottom: '2rem' }}>
            <h2 className="fade-up" style={{ fontSize: '1.8rem' }}>
              {filters.find((f) => f.slug === active)?.label ?? 'All Collections'}
            </h2>
            <p style={{ color: 'var(--text-body)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
              {displayed.length} piece{displayed.length !== 1 ? 's' : ''} available
            </p>
          </div>

          {/* Masonry grid */}
          <div className="gallery-masonry">
            {displayed.map((item, i) => (
              <div
                key={item.id}
                className={`gallery-item fade-up delay-${(i % 5) + 1}`}
                id={`gallery-item-${item.id}`}
              >
                <img src={item.img} alt={item.title} loading="lazy" />
                <div className="gallery-item-overlay">
                  <span>{item.title}</span>
                </div>
              </div>
            ))}
          </div>

          {/* CTA after gallery */}
          <div style={{ textAlign: 'center', marginTop: '5rem', padding: '3rem',
            background: 'var(--accent)', borderRadius: '16px' }}
            className="fade-up">
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
              <a href={`https://wa.me/27000000000?text=Hi%20Meem%20Curtain%2C%20I%20saw%20your%20gallery%20and%20would%20love%20a%20quote!`}
                target="_blank" rel="noopener noreferrer"
                className="btn btn-outline-dark" id="gallery-cta-wa">
                💬 WhatsApp Quote
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
