import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import '../styles/Navbar.css'
import { useNavScroll } from '../hooks/useScrollAnimation'

const galleryCategories = [
  { label: 'Lounge Curtain', to: '/gallery?cat=lounge' },
  { label: 'Bed Room Curtain', to: '/gallery?cat=bedroom' },
  { label: 'Dining Room', to: '/gallery?cat=dining' },
  { label: 'Kitchen', to: '/gallery?cat=kitchen' },
  { label: 'Studio', to: '/gallery?cat=studio' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  useNavScroll()

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Logo */}
            <Link to="/" className="navbar-logo" onClick={closeMenu}>
              <span className="brand-name">Meem Curtain</span>
              <span className="brand-tagline">Elegance in Every Fold</span>
            </Link>

            {/* Desktop Nav */}
            <ul className="navbar-nav">
              <li>
                <NavLink to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} end>
                  Home
                </NavLink>
              </li>

              {/* Gallery Dropdown */}
              <li
                className="nav-item-dropdown"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <NavLink
                  to="/gallery"
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  aria-haspopup="true"
                  aria-expanded={dropdownOpen}
                >
                  Gallery ▾
                </NavLink>
                <div className="dropdown-menu" role="menu">
                  {galleryCategories.map((cat) => (
                    <Link to={cat.to} key={cat.label} onClick={() => setDropdownOpen(false)}>
                      <span className="dropdown-dot" />
                      {cat.label}
                    </Link>
                  ))}
                </div>
              </li>

              <li>
                <NavLink to="/gallery" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  Recent Work
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="nav-link nav-link-cta">
                  Contact Us
                </NavLink>
              </li>
            </ul>

            {/* Hamburger */}
            <div
              className={`navbar-hamburger${menuOpen ? ' open' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              role="button"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span />
              <span />
              <span />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`} role="dialog" aria-modal="true">
        <Link to="/" className="nav-link" onClick={closeMenu}>Home</Link>
        <Link to="/gallery" className="nav-link" onClick={closeMenu}>Gallery</Link>
        {galleryCategories.map((cat) => (
          <Link to={cat.to} key={cat.label} className="nav-link" onClick={closeMenu}
            style={{ fontSize: '1.4rem', opacity: 0.7 }}>
            {cat.label}
          </Link>
        ))}
        <Link to="/gallery" className="nav-link" onClick={closeMenu}>Recent Work</Link>
        <Link to="/contact" className="btn btn-primary mobile-cta" onClick={closeMenu}>
          Contact Us
        </Link>
      </div>
    </>
  )
}
