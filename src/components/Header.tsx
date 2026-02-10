
import '../App.css'
import { useState } from 'react'
import logo from '../assets/images/logo.jpeg'

// Define the structure of a navigation item
type NavItem = { 
  label: string; 
  href?: string; 
  children?: NavItem[] // Optional nested items for dropdown menus
}

// Header Component: Displays the top navigation bar with branding, links, and action buttons
// Props:
// - nav: Array of navigation items to display
// - route: Current active route path
// - t: Translation function
// - lang: Current language ('en' or 'ne')
// - setLang: Function to toggle language
// - navigate: Function to handle navigation (e.g., useNavigate from react-router)
export default function Header({ nav, route, t, lang, setLang, navigate }: {
  nav: NavItem[]
  route: string
  t: (k: string) => string
  lang: 'en' | 'ne'
  setLang: (l: 'en' | 'ne') => void
  navigate: (path: string) => void
}) {
  // State to toggle the mobile navigation menu
  const [open, setOpen] = useState(false)
  
  // Handle navigation clicks: prevents default browser reload, navigates, and closes mobile menu
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault()
    navigate(path)
    setOpen(false)
  }

  return (
    // 'topbar' class defines the sticky header layout (see App.css .topbar)
    <header className="topbar">
      {/* Brand Logo and Title */}
      {/* 'brand' class uses flexbox to align logo and text (see App.css .brand) */}
      <a href="/" className="brand" onClick={(e) => handleNav(e, '/')}>
        <img src={logo} alt="logo" className="logo" />
        <div className="brand-text">
          <div className="brand-title">{t('brand.title')}</div>
          <div className="brand-sub">{t('brand.sub')}</div>
        </div>
      </a>

      {/* Hamburger Button for Mobile Menu */}
      <button 
        className="hamburger" 
        onClick={() => setOpen(!open)} 
        aria-label={open ? "Close Menu" : "Open Menu"}
      >
        {open ? (
          <span style={{ fontSize: '2rem', lineHeight: '1' }}>×</span>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        )}
      </button>

      {/* Navigation Links */}
      {/* 'nav' class handles the menu layout. 'open' class is toggled by state for mobile visibility. */}
      <nav className={`nav ${open ? 'open' : ''}`}>
        {nav.map(n => (
          <div key={n.label} className="nav-item">
            {/* If item has an href, it's a link; otherwise just a label (for dropdowns) */}
            {n.href ? (
              <a href={n.href} className={route === n.href ? 'active' : ''} onClick={(e) => handleNav(e, n.href!)}>{n.label}</a>
            ) : (
              <button className="nav-label" type="button">{n.label}</button>
            )}
            
            {/* Dropdown Menu for child items - visibility controlled by CSS hover on .nav-item */}
            {n.children && (
              <div className="dropdown">
                {n.children.map(c => (
                  <a key={c.href} href={c.href!} className={route === c.href ? 'active' : ''} onClick={(e) => handleNav(e, c.href!)}>{c.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Action Buttons: Donate & Language Toggle */}
        <div className="nav-actions">
          {/* 'btn sm' classes apply shared button styles with small padding (see App.css .btn) */}
          <a href="/donate" className="btn sm" onClick={(e) => handleNav(e, '/donate')}>{t('nav.donate')}</a>
          <button className="btn sm" onClick={() => { setLang(lang === 'en' ? 'ne' : 'en'); setOpen(false); }}>
            {lang === 'en' ? 'ने' : 'EN'}
          </button>
        </div>
      </nav>
    </header>
  )
}
