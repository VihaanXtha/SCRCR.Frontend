
import '../App.css'
import { useState } from 'react'
import logo from '../assets/images/logo.jpeg'

type NavItem = { label: string; href?: string; children?: NavItem[] }

export default function Header({ nav, route, t, lang, setLang, navigate }: {
  nav: NavItem[]
  route: string
  t: (k: string) => string
  lang: 'en' | 'ne'
  setLang: (l: 'en' | 'ne') => void
  navigate: (path: string) => void
}) {
  const [open, setOpen] = useState(false)
  
  const handleNav = (e: React.MouseEvent, path: string) => {
    e.preventDefault()
    navigate(path)
    setOpen(false)
  }

  return (
    <header className="topbar">
      <a href="/" className="brand" onClick={(e) => handleNav(e, '/')}>
        <img src={logo} alt="logo" className="logo" />
        <div className="brand-text">
          <div className="brand-title">{t('brand.title')}</div>
          <div className="brand-sub">{t('brand.sub')}</div>
        </div>
      </a>
      <button className="hamburger" onClick={() => setOpen(!open)} aria-label="Menu">☰</button>
      <nav className={`nav ${open ? 'open' : ''}`}>
        {nav.map(n => (
          <div key={n.label} className="nav-item">
            {n.href ? (
              <a href={n.href} className={route === n.href ? 'active' : ''} onClick={(e) => handleNav(e, n.href!)}>{n.label}</a>
            ) : (
              <button className="nav-label" type="button">{n.label}</button>
            )}
            {n.children && (
              <div className="dropdown">
                {n.children.map(c => (
                  <a key={c.href} href={c.href!} className={route === c.href ? 'active' : ''} onClick={(e) => handleNav(e, c.href!)}>{c.label}</a>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="nav-actions">
          <a href="/donate" className="btn sm" onClick={(e) => handleNav(e, '/donate')}>{t('nav.donate')}</a>
          <button className="btn sm" onClick={() => { setLang(lang === 'en' ? 'ne' : 'en'); setOpen(false); }}>
            {lang === 'en' ? 'ने' : 'EN'}
          </button>
        </div>
      </nav>
    </header>
  )
}
