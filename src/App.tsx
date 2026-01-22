import { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { useTranslation } from './hooks/useTranslation'
import { fetchMembers } from './services/members'
import type { Member } from './types/members'
import HealthInfo from './pages/HealthInfo'

const LoadingFallback = () => <div className="loading">Loading...</div>

// Lazy load pages
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const MembersGrid = lazy(() => import('./pages/MembersGrid'))
const Admin = lazy(() => import('./pages/Admin'))
const Helping = lazy(() => import('./pages/Helpers'))
const News = lazy(() => import('./pages/News'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Contact = lazy(() => import('./pages/Contact'))
const Donate = lazy(() => import('./pages/Donate'))
const Notices = lazy(() => import('./pages/Notices'))
const SeniorCitizenMembers = lazy(() => import('./pages/SeniorMembers'))
const DonationMembers = lazy(() => import('./pages/DonationMembers'))
const Membership = lazy(() => import('./pages/Membership'))
const Downloads = lazy(() => import('./pages/Downloads'))
const Programs = lazy(() => import('./pages/Programs'))

function App() {
  const { t, lang, setLang } = useTranslation()
  const [route, setRoute] = useState<string>(window.location.pathname)

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setRoute(path)
    window.scrollTo(0, 0)
  }

  // Pre-fetch some data or keep state here if needed across pages
  const [Founding, setFounding] = useState<Member[]>([])
  const [Lifetime, setLifetime] = useState<Member[]>([])

  useEffect(() => {
    const onPopState = () => setRoute(window.location.pathname)
    window.addEventListener('popstate', onPopState)
    
    // Pre-fetch members for smoother navigation
    fetchMembers('Founding').then(setFounding).catch(() => setFounding([]))
    fetchMembers('Lifetime').then(setLifetime).catch(() => setLifetime([]))

    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  const nav = [
    { label: t('nav.about'), href: '/about' },
    {
      label: t('nav.members'),
      href: undefined,
      children: [
        { label: t('nav.members.Founding'), href: '/members-Founding' },
        { label: t('nav.members.Lifetime'), href: '/members-Lifetime' },
        { label: t('nav.members.Senior-Citizen'), href: '/members-Senior-Citizen' },
        { label: t('nav.members.donation'), href: '/members-donation' },
        { label: t('nav.members.Helping'), href: '/members-Helping' }
      ]
    },
    { label: t('nav.news'), href: '/news' },
    { label: t('nav.programs'), href: '/programs' },
    { label: t('nav.health'), href: '/health-info' },
    { label: t('nav.membership'), href: '/membership' },
    { label: t('nav.gallery'), href: '/gallery' },
    { label: t('nav.downloads'), href: '/downloads' },
    { label: t('nav.notices'), href: '/notices' },
    { label: t('nav.contact'), href: '/contact' },
    
  ]

  return (
    <div className="site">
      {route !== '/admin' && <Header nav={nav} route={route} t={t} lang={lang} setLang={setLang} navigate={navigate} />}

      <Suspense fallback={<LoadingFallback />}>
        {route === '/' && <Home t={t} lang={lang} />}
        {route === '/about' && <About t={t} />}
        {route === '/members-Founding' && (
          <MembersGrid title={t('nav.members.Founding')} members={Founding} t={t} />
        )}
        {route === '/members-Lifetime' && (
          <MembersGrid title={t('nav.members.Lifetime')} members={Lifetime} t={t} />
        )}
        {route === '/members-Senior-Citizen' && <SeniorCitizenMembers t={t} />}
        {route === '/members-donation' && <DonationMembers t={t} />}
        {route === '/members-Helping' && <Helping t={t} />}
        {route === '/news' && <News t={t} />}
        {route === '/programs' && <Programs t={t} />}
        {route === '/health-info' && <HealthInfo t={t} />}
        {route === '/membership' && <Membership t={t} />}
        {route === '/downloads' && <Downloads t={t} />}
        {route === '/gallery' && <Gallery t={t} />}
        {route === '/contact' && <Contact t={t} />}
        {route === '/donate' && <Donate t={t} />}
        {route === '/notices' && <Notices t={t} />}
        {route === '/admin' && <Admin />}
      </Suspense>

      {route !== '/admin' && <Footer t={t} />}
    </div>
  )
}

export default App
