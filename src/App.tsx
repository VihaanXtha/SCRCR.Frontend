import { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { useTranslation } from './hooks/useTranslation'
import { fetchMembers } from './services/members'

const LoadingFallback = () => <div className="loading">Loading...</div>

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Members = lazy(() => import('./pages/Members'))
const Admin = lazy(() => import('./pages/Admin'))
const News = lazy(() => import('./pages/News'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Membership = lazy(() => import('./pages/Membership'))
const Downloads = lazy(() => import('./pages/Downloads'))

function App() {
  const { t, lang, setLang } = useTranslation()
  const [route, setRoute] = useState<string>(window.location.pathname)

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo(0, 0)
  }

  useEffect(() => {
    // Only fetch for pre-loading purposes, ignore result
    fetchMembers('Founding').catch(() => {})
    fetchMembers('Lifetime').catch(() => {})
  }, [])

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const nav = [
    { label: t('nav.about_us'), href: '/about' },
    { label: t('nav.members'), href: '/members' },
    { label: t('nav.news_notices'), href: '/news' },
    { label: t('nav.membership'), href: '/membership' },
    { label: t('nav.gallery'), href: '/gallery' },
    { label: t('nav.downloads'), href: '/downloads' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  return (
    <div className="site">
      {route !== '/admin' && <Header nav={nav} route={route} t={t} lang={lang} setLang={setLang} navigate={navigate} />}

      <Suspense fallback={<LoadingFallback />}>
        {route === '/' && <Home t={t} lang={lang} />}
        {route === '/about' && <About t={t} />}
        {route === '/programs' && <About t={t} />} {/* Redirect to About (programs tab) */}
        {route === '/health-info' && <About t={t} />} {/* Redirect to About (health tab) */}
        
        {route === '/members' && <Members t={t} />}
        {/* Backward compatibility routes - redirect to main members page if possible, or just render it */}
        {route === '/members-Founding' && <Members t={t} />}
        {route === '/members-Lifetime' && <Members t={t} />}
        {route === '/members-Senior-Citizen' && <Members t={t} />}
        {route === '/members-donation' && <Members t={t} />}
        {route === '/members-Helping' && <Members t={t} />}
        
        {route === '/news' && <News t={t} />}
        {/* Redirect old routes */}
        {/* {route === '/programs' && <Programs t={t} />} Removed */}
        {/* {route === '/health-info' && <HealthInfo t={t} />} Removed */}
        {route === '/membership' && <Membership t={t} />}
        {route === '/downloads' && <Downloads t={t} />}
        {route === '/gallery' && <Gallery t={t} />}
        {route === '/contact' && <Contact t={t} />}
        {route === '/donate' && <Contact t={t} />} {/* Redirect to Contact (donate tab) */}
        {route === '/notices' && <News t={t} />} {/* Redirect notices route to News component as well for backward compatibility */}
        {route === '/admin' && <Admin />}
      </Suspense>

      {route !== '/admin' && <Footer t={t} />}
    </div>
  )
}

export default App
