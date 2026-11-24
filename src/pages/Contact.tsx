import { useState, useEffect, useRef } from 'react'
import type { FormEvent } from 'react'
import { CONTACT_INFO } from '../constants/contact'
import '../styles/components.css'

function useSectionAnimation() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )
    const el = ref.current
    if (el) el.querySelectorAll('.fade-up,.fade-left,.fade-right').forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [])
  return ref
}

const categories = [
  'Lounge Curtain',
  'Bed Room Curtain',
  'Dining Room',
  'Kitchen',
  'Studio',
  'Other / Custom',
]

export default function Contact() {
  const ref = useSectionAnimation()
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', category: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = 'Contact Us – Meem Curtain'
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSending(true)
    // Build WhatsApp message with form data
    const msg = encodeURIComponent(
      `Hi Meem Curtain! 👋

Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}
Category: ${formData.category}

Message:
${formData.message}`
    )
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
      window.open(`https://wa.me/${CONTACT_INFO.whatsappNumber}?text=${msg}`, '_blank')
    }, 800)
  }

  return (
    <main className="page-enter">
      {/* Hero */}
      <section className="contact-hero">
        <div className="container contact-hero-content">
          <p className="section-label">Get in Touch</p>
          <h1 className="section-title" style={{ color: 'var(--white)' }}>
            We'd Love to<br />Hear from You
          </h1>
          <p className="contact-hero-subtitle">
            Whether you're looking for the perfect curtain or need a custom solution —
            reach out and we'll make it happen.
          </p>
        </div>
      </section>

      {/* Main contact section */}
      <section className="contact-section" ref={ref}>
        <div className="container">
          <div className="contact-grid">

            {/* Left – contact info */}
            <div className="fade-left">
              <h2 className="contact-info-title">Contact Channels</h2>
              <p className="contact-info-subtitle">
                Send us a message via WhatsApp for the fastest response,
                or drop us an email and we'll get back to you within 24 hours.
              </p>

              <div className="contact-channels">
                {/* WhatsApp */}
                <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer"
                  className="contact-channel" id="contact-wa-link">
                  <div className="channel-icon whatsapp">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </div>
                  <div className="channel-info">
                    <h4>WhatsApp (Fastest Response)</h4>
                    <span>{CONTACT_INFO.whatsappDisplay} · Tap to chat →</span>
                  </div>
                </a>

                {/* Landline Phone */}
                <a href={CONTACT_INFO.landlineTel} className="contact-channel" id="contact-landline-link">
                  <div className="channel-icon phone">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                    </svg>
                  </div>
                  <div className="channel-info">
                    <h4>Landline Phone</h4>
                    <span>{CONTACT_INFO.landlineDisplay} · Call now →</span>
                  </div>
                </a>

                {/* Email */}
                <a href={CONTACT_INFO.emailMailto} className="contact-channel" id="contact-email-link">
                  <div className="channel-icon email">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                  </div>
                  <div className="channel-info">
                    <h4>Email Us</h4>
                    <span>{CONTACT_INFO.email}</span>
                  </div>
                </a>
              </div>

              {/* Social media links */}
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontSize: '1rem', fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 700, marginBottom: '1rem', letterSpacing: '0.05em' }}>
                  Follow Us
                </h3>
                <div className="social-channels">
                  <a href={CONTACT_INFO.facebookUrl} target="_blank" rel="noopener noreferrer"
                    className="social-channel-btn facebook" id="contact-fb-btn"
                    title={`Facebook: ${CONTACT_INFO.facebookName}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                    Facebook: {CONTACT_INFO.facebookName}
                  </a>
                  <a href={CONTACT_INFO.instagramUrl} target="_blank" rel="noopener noreferrer"
                    className="social-channel-btn instagram" id="contact-ig-btn"
                    title={`Instagram: ${CONTACT_INFO.instagramDisplay}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" strokeWidth="2">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                      <circle cx="12" cy="12" r="4"/>
                    </svg>
                    Instagram: {CONTACT_INFO.instagramDisplay}
                  </a>
                  <a href={CONTACT_INFO.whatsappUrl} target="_blank" rel="noopener noreferrer"
                    className="social-channel-btn whatsapp-btn" id="contact-wa-social-btn"
                    title={`WhatsApp: ${CONTACT_INFO.whatsappDisplay}`}>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Right – inquiry form */}
            <div className="fade-right delay-2">
              <div className="contact-form-card">
                {submitted ? (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h3 className="contact-form-title">Inquiry Sent!</h3>
                    <p className="contact-form-subtitle" style={{ marginBottom: '2rem' }}>
                      Your WhatsApp has opened with your message. We'll get back to you shortly!
                    </p>
                    <button className="btn btn-primary"
                      onClick={() => setSubmitted(false)}>
                      Send Another Inquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="contact-form-title">Send Your Inquiry</h3>
                    <p className="contact-form-subtitle">
                      Fill in the form below — we'll reply via WhatsApp or email.
                    </p>

                    <form onSubmit={handleSubmit} noValidate>
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="name">Full Name *</label>
                          <input id="name" name="name" type="text" required
                            placeholder="Your name"
                            value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone / WhatsApp *</label>
                          <input id="phone" name="phone" type="tel" required
                            placeholder="+27 XX XXX XXXX"
                            value={formData.phone} onChange={handleChange} />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input id="email" name="email" type="email"
                          placeholder="your@email.com"
                          value={formData.email} onChange={handleChange} />
                      </div>

                      <div className="form-group">
                        <label htmlFor="category">Curtain Category</label>
                        <select id="category" name="category"
                          value={formData.category} onChange={handleChange}>
                          <option value="">Select a category...</option>
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label htmlFor="message">Your Message *</label>
                        <textarea id="message" name="message" required
                          placeholder="Tell us about what you need — room size, style preferences, fabric type, etc."
                          value={formData.message} onChange={handleChange} />
                      </div>

                      <button type="submit" className="form-submit" id="contact-form-submit"
                        disabled={sending}>
                        {sending ? '⏳ Sending...' : '💬 Send via WhatsApp'}
                      </button>

                      <p style={{ fontSize: '0.72rem', color: 'var(--text-light)',
                        marginTop: '0.85rem', textAlign: 'center' }}>
                        Your inquiry will be sent directly to our WhatsApp line.
                      </p>
                    </form>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
