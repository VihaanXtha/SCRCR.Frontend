import { useEffect, useState, lazy, Suspense } from 'react' // React hooks for state, side effects, and lazy loading
import './App.css' // Main application styles
import Header from './components/Header' // Navigation header component
import Footer from './components/Footer' // Page footer component
import ScrollToTop from './components/ScrollToTop' // Component to scroll to top on route change
import InstallPrompt from './components/InstallPrompt' // PWA Install Prompt component
import PushNotificationManager from './components/PushNotificationManager' // Push Notification Manager
import { useTranslation } from './hooks/useTranslation' // Custom hook for i18n
import { fetchMembers } from './services/members' // Service to fetch member data

// Fallback component displayed while lazy-loaded components are being fetched
const LoadingFallback = () => <div className="loading">Loading...</div>

// Lazy load pages to improve initial load performance (Code Splitting)
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Members = lazy(() => import('./pages/Members'))
const Admin = lazy(() => import('./pages/Admin'))
const News = lazy(() => import('./pages/News'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Membership = lazy(() => import('./pages/Membership'))

function App() {
  // Destructure translation utilities and language state
  const { t, lang, setLang } = useTranslation()

  // State to manage the current route/path locally (SPA routing)
  const [route, setRoute] = useState<string>(window.location.pathname)
  const [showLangPrompt, setShowLangPrompt] = useState(false)

  // Function to handle client-side navigation without full page reload
  const navigate = (path: string) => {
    window.history.pushState({}, '', path) // Update browser URL
    setRoute(path) // Update local route state
    window.scrollTo(0, 0) // Reset scroll position
  }

  // Effect to pre-fetch member data for smoother experience later
  useEffect(() => {
    // Fire and forget fetch requests for 'Founding' and 'Lifetime' members
    // We catch errors to prevent unhandled promise rejections, but don't act on them here
    fetchMembers('Founding').catch(() => { })
    fetchMembers('Lifetime').catch(() => { })
  }, [])

  // Effect to handle browser Back/Forward buttons
  useEffect(() => {
    // Callback to update route state when history changes
    const onPopState = () => setRoute(window.location.pathname)

    // Add event listener
    window.addEventListener('popstate', onPopState)

    // Cleanup listener on unmount
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    try {
      const saved = localStorage.getItem('lang')
      if (!saved) setShowLangPrompt(true)
    } catch {
      setShowLangPrompt(true)
    }
  }, [])

  const selectLang = (l: 'en' | 'ne') => {
    setLang(l)
    setShowLangPrompt(false)
  }

  // Navigation menu configuration
  const nav = [
    { label: t('nav.about_us'), href: '/about' },
    { label: t('nav.members'), href: '/members' },
    { label: t('nav.news_notices'), href: '/news' },
    { label: t('nav.membership'), href: '/membership' },
    { label: t('nav.gallery'), href: '/gallery' },
    { label: t('nav.contact'), href: '/contact' },
  ]

  return (
    <div className="site">
      {/* Conditionally render Header if not on Admin page */}
      {route !== '/admin' && <Header nav={nav} route={route} t={t} lang={lang} setLang={setLang} navigate={navigate} />}

      {/* Suspense wrapper to handle loading states for lazy-loaded components */}
      <Suspense fallback={<LoadingFallback />}>
        {/* Route Rendering Logic based on current 'route' state */}
        {route === '/' && <Home t={t} lang={lang} navigate={navigate} />}
        {route === '/about' && <About t={t} />}
        {route === '/programs' && <About t={t} initialTab="programs" />} {/* Legacy Redirect to About (programs tab) */}
        {route === '/health-info' && <About t={t} initialTab="health" />} {/* Legacy Redirect to About (health tab) */}

        {route === '/members' && <Members t={t} />}

        {/* Backward compatibility routes for specific member types */}
        {route === '/members-Founding' && <Members t={t} />}
        {route === '/members-Lifetime' && <Members t={t} />}
        {route === '/members-Senior-Citizen' && <Members t={t} />}
        {route === '/members-donation' && <Members t={t} />}
        {route === '/members-Helping' && <Members t={t} />}

        {route === '/news' && <News t={t} />}
        {/* Removed legacy routes commented out below */}
        {/* {route === '/programs' && <Programs t={t} />} */}
        {/* {route === '/health-info' && <HealthInfo t={t} />} */}

        {route === '/membership' && <Membership t={t} />}
        {route === '/downloads' && <About t={t} initialTab="downloads" />}
        {route === '/gallery' && <Gallery t={t} />}
        {route === '/contact' && <Contact t={t} />}
        {route === '/donate' && <Contact t={t} />} {/* Redirect /donate to Contact page (donate tab) */}
        {route === '/notices' && <News t={t} />} {/* Redirect /notices to News component */}

        {/* Admin Dashboard Route */}
        {route === '/admin' && <Admin />}
      </Suspense>

      {/* Conditionally render Footer if not on Admin page */}
      {route !== '/admin' && <Footer t={t} />}

      {/* Utility component to scroll to top on navigation */}
      <ScrollToTop />

      {/* PWA Install Prompt - Appears when the app is installable */}
      {!showLangPrompt && <InstallPrompt />}

      {/* Push Notification Manager - Handles subscriptions */}
      <PushNotificationManager />

      {showLangPrompt && (
        <div className="member-modal" onClick={() => setShowLangPrompt(false)}>
          <div className="notice-modal-content" onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title">Select Language</div>
              <button className="notice-close" onClick={() => setShowLangPrompt(false)}>×</button>
            </div>
            <div className="center" style={{ gap: 12 }}>
              <button className="btn" onClick={() => selectLang('en')}>English</button>
              <button className="btn" onClick={() => selectLang('ne')}>नेपाली</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
