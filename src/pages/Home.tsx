import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import '../styles/components.css'

const WHATSAPP_NUMBER = '27000000000'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Meem%20Curtain%2C%20I%27d%20like%20to%20inquire%20about%20your%20curtains.`

// ─── Curtain image data ────────────────────────────────────────────────────
const categories = [
  {
    slug: 'lounge',
    label: 'Our Collection',
    title: 'Lounge Curtain',
    image: '/images/lounge.png',
    featured: true,
  },
  {
    slug: 'bedroom',
    label: 'Collection',
    title: 'Bed Room Curtain',
    image: '/images/bedroom.png',
  },
  {
    slug: 'dining',
    label: 'Collection',
    title: 'Dining Room',
    image: '/images/dining.png',
  },
  {
    slug: 'kitchen',
    label: 'Collection',
    title: 'Kitchen',
    image: '/images/kitchen.png',
  },
  {
    slug: 'studio',
    label: 'Collection',
    title: 'Studio',
    image: '/images/studio.png',
  },
]

const recentWork = [
  { id: 1, title: 'Modern Lounge', cat: 'Lounge', img: '/images/lounge.png' },
  { id: 2, title: 'Master Bedroom', cat: 'Bedroom', img: '/images/bedroom.png' },
  { id: 3, title: 'Elegant Dining', cat: 'Dining', img: '/images/dining.png' },
  { id: 4, title: 'Studio Setup', cat: 'Studio', img: '/images/studio.png' },
]

const features = [
  { icon: '✦', text: 'Custom Made to Measure' },
  { icon: '✦', text: 'Premium Fabric Selection' },
  { icon: '✦', text: 'Expert Installation' },
  { icon: '✦', text: 'Free Consultation' },
]

// ─── Scroll-animation hook (inline so Home is self-contained) ─────────────
function useSectionAnimation() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    const el = ref.current
    if (el) {
      el.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach((node) =>
        observer.observe(node)
      )
    }
    return () => observer.disconnect()
  }, [])

  return ref
}

// ─── Arrow SVG ────────────────────────────────────────────────────────────
const ArrowRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
)

// ─── Hero Section ─────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="hero-curtain-left" />
      <div className="hero-curtain-right" />
      <div className="hero-bg" />
      <div className="hero-overlay" />

      <div className="container">
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="hero-eyebrow-line" />
            <span className="hero-eyebrow-text">Premium Curtains · South Africa</span>
          </div>

          <h1 className="hero-title">
            <span>Elegance</span>
            <span className="hero-title-bold">in Every Fold</span>
          </h1>

          <p className="hero-subtitle">
            Transform your living spaces with handcrafted curtains that blend timeless beauty
            with modern sophistication. Made to measure, made to last.
          </p>

          <div className="hero-actions">
            <Link to="/gallery" className="btn btn-primary" id="hero-explore-btn">
              Explore Collection <ArrowRight />
            </Link>
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="btn btn-outline" id="hero-whatsapp-btn">
              💬 WhatsApp Us
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="hero-stats">
        {[
          { number: '500+', label: 'Happy Clients' },
          { number: '5+', label: 'Years Experience' },
          { number: '20+', label: 'Fabric Choices' },
        ].map((s) => (
          <div className="hero-stat" key={s.label}>
            <span className="hero-stat-number">{s.number}</span>
            <span className="hero-stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="hero-scroll-indicator" aria-hidden="true">
        <span>Scroll</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}

// ─── Categories Grid ──────────────────────────────────────────────────────
function Categories() {
  const ref = useSectionAnimation()

  // Featured (lounge) + 4 others → 3-column asymmetric grid
  const [featured, ...rest] = categories

  return (
    <section className="categories" ref={ref} id="categories">
      <div className="container">
        <div className="categories-header">
          <p className="section-label">Our Gallery</p>
          <h2 className="section-title fade-up">Curtains for Every Room</h2>
          <p style={{ color: 'var(--text-body)', maxWidth: 520, margin: '0 auto' }}
            className="fade-up delay-1">
            Discover our handcrafted collections designed to complement every corner of your home.
          </p>
        </div>

        <div className="categories-grid">
          {/* Featured card */}
          <Link to={`/gallery?cat=${featured.slug}`}
            className="category-card featured fade-left delay-1">
            <img src={featured.image} alt={featured.title} loading="lazy" />
            <div className="category-overlay">
              <span className="category-label">{featured.label}</span>
              <h3 className="category-title">{featured.title}</h3>
              <span className="category-link">View All <ArrowRight /></span>
            </div>
          </Link>

          {/* Other 4 cards */}
          {rest.map((cat, i) => (
            <Link to={`/gallery?cat=${cat.slug}`}
              key={cat.slug}
              className={`category-card fade-up delay-${i + 2}`}>
              <img src={cat.image} alt={cat.title} loading="lazy" />
              <div className="category-overlay">
                <span className="category-label">{cat.label}</span>
                <h3 className="category-title">{cat.title}</h3>
                <span className="category-link">View All <ArrowRight /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── About / How We Work ─────────────────────────────────────────────────
function About() {
  const ref = useSectionAnimation()

  return (
    <section className="about-section" ref={ref} id="about">
      <div className="container">
        <div className="about-grid">
          {/* Image side */}
          <div className="about-image-wrapper fade-left">
            <img src="/images/lounge.png" alt="Meem Curtain showroom"
              className="about-image-main" />
            <img src="/images/bedroom.png" alt="Bedroom curtain detail"
              className="about-image-accent" />
            <div className="about-badge">
              <span className="about-badge-number">5+</span>
              <span className="about-badge-text">Years of<br />Excellence</span>
            </div>
          </div>

          {/* Text side */}
          <div className="about-content fade-right delay-2">
            <p className="section-label">About Meem Curtain</p>
            <h2 className="section-title">Crafting Beautiful Spaces, One Curtain at a Time</h2>
            <p className="about-description">
              At Meem Curtain, we believe that the right curtain can completely transform a room.
              Every piece we create is carefully crafted using premium fabrics, tailored to your
              exact specifications and style preferences.
            </p>
            <p className="about-description">
              From contemporary sheers to luxurious blackout drapes — our collection covers every
              room in your home with elegance and precision.
            </p>

            <div className="about-features">
              {features.map((f, i) => (
                <div className={`about-feature delay-${i + 2}`} key={f.text}>
                  <span className="about-feature-icon">{f.icon}</span>
                  <span className="about-feature-text">{f.text}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/contact" className="btn btn-primary" id="about-contact-btn">
                Get a Free Quote
              </Link>
              <Link to="/gallery" className="btn btn-outline-dark" id="about-gallery-btn">
                View Our Work
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Recent Work ─────────────────────────────────────────────────────────
function RecentWork() {
  const ref = useSectionAnimation()

  return (
    <section className="recent-work" ref={ref} id="recent-work">
      <div className="container">
        <div className="recent-work-header">
          <div>
            <p className="section-label">Portfolio</p>
            <h2 className="section-title fade-up">Recent Work</h2>
          </div>
          <Link to="/gallery" className="btn btn-outline-dark fade-up delay-2" id="rw-view-all-btn">
            View All <ArrowRight />
          </Link>
        </div>

        <div className="recent-work-grid">
          {recentWork.map((item, i) => (
            <Link to={`/gallery?cat=${item.cat.toLowerCase()}`}
              key={item.id}
              className={`work-card fade-up delay-${i + 1}`}
              id={`work-card-${item.id}`}>
              <img src={item.img} alt={item.title} loading="lazy" />
              <div className="work-card-overlay">
                <div className="work-card-info">
                  <h4>{item.title}</h4>
                  <span>{item.cat}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Testimonial / Marquee strip ─────────────────────────────────────────
function MarqueeStrip() {
  const items = [
    'Lounge Curtain', '·', 'Bedroom Curtain', '·', 'Dining Room', '·',
    'Kitchen', '·', 'Studio', '·', 'Custom Made', '·', 'Premium Fabric', '·',
  ]
  const doubled = [...items, ...items]

  return (
    <div style={{
      background: 'var(--primary)',
      padding: '1rem 0',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <div style={{
        display: 'flex',
        gap: '2rem',
        whiteSpace: 'nowrap',
        animation: 'marqueeScroll 25s linear infinite',
      }}>
        {doubled.map((item, i) => (
          <span key={i} style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: item === '·' ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.9)',
            flexShrink: 0,
          }}>
            {item}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}

// ─── CTA Section ─────────────────────────────────────────────────────────
function CTASection() {
  const ref = useSectionAnimation()

  return (
    <section className="cta-section" ref={ref} id="cta">
      <div className="container">
        <p className="section-label cta-label fade-up" style={{ justifyContent: 'center' }}>
          Get Started
        </p>
        <h2 className="section-title cta-title fade-up delay-1">
          Ready to Transform<br />Your Space?
        </h2>
        <p className="cta-subtitle fade-up delay-2">
          Send us your inquiry and we'll help you choose the perfect curtains.
          Available via WhatsApp, email, or our contact form.
        </p>
        <div className="cta-actions fade-up delay-3">
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
            className="cta-whatsapp" id="cta-whatsapp-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Chat on WhatsApp
          </a>
          <a href="mailto:info@meemcurtain.co.za" className="btn btn-outline" id="cta-email-btn">
            ✉ Email Us
          </a>
          <Link to="/contact" className="btn btn-primary" id="cta-contact-btn">
            Send Inquiry
          </Link>
        </div>
      </div>
    </section>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────
export default function Home() {
  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Meem Curtain – Elegance in Every Fold'
  }, [])

  return (
    <main className="page-enter">
      <Hero />
      <MarqueeStrip />
      <Categories />
      <About />
      <RecentWork />
      <CTASection />
    </main>
  )
}
