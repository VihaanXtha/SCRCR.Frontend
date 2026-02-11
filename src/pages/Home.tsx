import { useEffect, useRef, useState } from 'react'
import HeroSlider from '../components/HeroSlider'
import StaffSection from '../components/StaffSection'
import DPMT from '../components/DPMT'
import { fetchNotices, fetchNews, fetchGallery, fetchMemoryAlbums, fetchAlbumImages } from '../services/content'
import { activities, dpmt, leaderQuotes, leaders, staff } from '../data/homeData'
import type { NoticeItem, NewsItem, GalleryItem, MemoryAlbum } from '../types/content'
import Intro from '../components/Intro'
import CountUp from '../components/CountUp'
import { getOptimizedUrl } from '../utils/image'
import AnimatedSection from '../components/AnimatedSection'
import { useAutoScroll } from '../hooks/useAutoScroll'


// Home Component: The main landing page of the application
// Props:
// - t: Translation function to translate text based on key
// - lang: Current language ('en' or 'ne') to handle bilingual data
// - navigate: Function to handle navigation
export default function Home({ t, lang, navigate }: { t: (k: string) => string; lang: 'en' | 'ne'; navigate: (path: string) => void }) {
  // useRef hooks to get references to DOM elements for auto-scrolling
  const carouselRef = useRef<HTMLDivElement>(null)
  const activitiesRef = useRef<HTMLDivElement>(null)

  // Custom hook to handle auto-scrolling logic for carousels
  const { scroll: scrollLeaders, onMouseEnter: onMouseEnterLeaders, onMouseLeave: onMouseLeaveLeaders } = useAutoScroll(carouselRef)
  const { scroll: scrollActivities, onMouseEnter: onMouseEnterActivities, onMouseLeave: onMouseLeaveActivities } = useAutoScroll(activitiesRef)

  // State variables to manage dynamic data and UI state
  const [activeLeaderIndex, setActiveLeaderIndex] = useState(0) // Tracks which leader quote is currently displayed
  const [latestImage, setLatestImage] = useState<GalleryItem | null>(null) // Stores the latest image for the gallery section
  const [latestVideo, setLatestVideo] = useState<GalleryItem | null>(null) // Stores the latest video for the gallery section
  const [latestAlbum, setLatestAlbum] = useState<MemoryAlbum | null>(null) // Stores the latest album
  // Stores combined list of news and notices, sorted by date
  const [latestUpdates, setLatestUpdates] = useState<(NewsItem | NoticeItem & { type: 'news' | 'notice', date: string, image?: string })[]>([])

  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' })

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, phone, email, message } = contactForm
    const subject = `New Contact Request from ${name}`
    const body = `Name: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AMessage: ${message}`
    window.location.href = `mailto:${t('band.email')}?subject=${subject}&body=${body}`
  }

  // Effect to cycle through leader quotes automatically every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveLeaderIndex((prev) => (prev + 1) % leaderQuotes.length)
    }, 5000)
    return () => clearInterval(timer) // Cleanup timer on component unmount
  }, [])

  // State for popup notices
  const [popupQueue, setPopupQueue] = useState<NoticeItem[]>([]) // Queue of notices to show as popups
  const [currentPopup, setCurrentPopup] = useState<NoticeItem | null>(null) // The currently visible popup
  const [albumImages, setAlbumImages] = useState<string[]>([]) // Store album images for popup

  // Effect to manage popup queue: shows the next popup when current one is closed
  useEffect(() => {
    // If no popup is showing but we have items in queue, show the next one
    if (!currentPopup && popupQueue.length > 0) {
      setCurrentPopup(popupQueue[0])
      setPopupQueue(prev => prev.slice(1)) // Remove the shown item from queue
    }
  }, [popupQueue, currentPopup])

  // Function to close the current popup
  const closePopup = () => {
    setCurrentPopup(null)
    // The useEffect above will trigger next one automatically
  }

  // Helper function to process video URLs and return embeddable format
  const getEmbedUrl = (url: string) => {
    // Check for Cloudinary or direct video files
    if (url.includes('cloudinary') || url.match(/\.(mp4|webm|mov)$/i)) {
      return { type: 'video', src: getOptimizedUrl(url, { quality: 'auto' }) }
    }

    // Extract YouTube video ID and create embed URL
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    return match ? { type: 'iframe', src: `https://www.youtube.com/embed/${match[1]}` } : null
  }

  // Main data fetching effect: loads content when component mounts
  useEffect(() => {
    // 1. Fetch Popup Notices (active and marked as popup, less than 24 hours old)
    const p1 = fetchNotices({ active: true, popup: true })
      .then(items => items.filter(i => {
        const dateStr = i.created_at || i.updated_at
        if (!dateStr) return false
        const date = new Date(dateStr)
        const age = Date.now() - date.getTime()
        return age < 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      }))

    // 2. Fetch Popup News (similar logic to notices)
    const p2 = fetchNews({ active: true, popup: true })
      .then(items => items.filter(i => {
        // Use updated_at if available (for recently toggled items), else published/created
        const dateStr = i.updated_at || i.publishedAt || i.created_at
        if (!dateStr) return false
        const date = new Date(dateStr)
        const age = Date.now() - date.getTime()
        return age < 24 * 60 * 60 * 1000
      }))
      .then(items => items.map(n => ({
        _id: n._id,
        title: n.title,
        text: n.text,
        mediaUrl: n.img,
        active: n.active,
        popup: n.popup,
        created_at: n.created_at,
        type: 'news' // Marker to identify news
      } as NoticeItem & { type?: string })))

    // Combine and sort popups
    Promise.all([p1, p2]).then(([notices, news]) => {
      // Sort: News first, then Notices. Within category, sort by date (newest first).

      const sortedNews = news.sort((a, b) => {
        const da = new Date(a.created_at || 0).getTime()
        const db = new Date(b.created_at || 0).getTime()
        return db - da
      })

      const sortedNotices = notices.sort((a, b) => {
        const da = new Date(a.created_at || 0).getTime()
        const db = new Date(b.created_at || 0).getTime()
        return db - da
      })

      // Combine: News First, Then Notices
      const finalQueue = [...sortedNews, ...sortedNotices]

      if (finalQueue.length > 0) {
        setPopupQueue(finalQueue)
      }
    }).catch(() => setPopupQueue([]))

    // Fetch Latest News & Notices for Updates Section
    Promise.all([
      fetchNews({ active: true }),
      fetchNotices({ active: true })
    ]).then(([news, notices]) => {
      // Normalize news items
      const newsItems = news.map(n => ({
        ...n,
        type: 'news' as const,
        date: n.updated_at || n.publishedAt || n.created_at || new Date().toISOString(),
        image: n.img
      }))

      // Normalize notice items
      const noticeItems = notices.map(n => ({
        ...n,
        type: 'notice' as const,
        date: n.updated_at || n.created_at || new Date().toISOString(),
        image: n.mediaUrl
      }))

      // Combine and sort by date
      const combined = [...newsItems, ...noticeItems]

      const sorted = combined.sort((a, b) => {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return db - da
      })

      setLatestUpdates(sorted.slice(0, 3)) // Keep only top 3 items
    }).catch(() => setLatestUpdates([]))

    // Fetch Gallery items for Moments section
    fetchGallery().then(items => {
      // Get latest image
      const img = items.find(i => i.type === 'image' && i.img)
      if (img) setLatestImage(img)

      // Get latest video
      const vid = items.find(i => (i.type === 'video' || !i.type) && i.videoUrl)
      if (vid) setLatestVideo(vid)
    }).catch(() => { })

    // Fetch latest album
    fetchMemoryAlbums().then(albums => {
      if (albums.length > 0) setLatestAlbum(albums[0])
    }).catch(() => { })
  }, [])

  return (
    <>
      {/* Hero Section: The big slider at the top */}
      <section className="hero">
        <HeroSlider />
        {/* Step indicators overlay on the hero slider */}
        <div className="hero-steps">
          <div className="step">
            <div className="circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div className="label">{t('hero.step1')}</div>
          </div>
          <div className="step">
            <div className="circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3v9a5 5 0 0 0 5 5h3a5 5 0 0 0 5-5V3" />
                <path d="M12 17v1" />
                <circle cx="12" cy="20" r="2" />
              </svg>
            </div>
            <div className="label">{t('hero.step2')}</div>
          </div>
          <div className="step">
            <div className="circle">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div className="label">{t('hero.step3')}</div>
          </div>
        </div>
      </section>

      {/* Intro Section: Animated introduction text */}
      <AnimatedSection type="zoom-in" delay={200}>
        <Intro t={t} lang={lang} navigate={navigate} />
      </AnimatedSection>

      {/* Experience / Stats Section */}
      {/* Experience / Stats Section */}
      <div className="w-full bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 py-12 md:py-24 px-4 md:px-12 relative overflow-hidden flex items-center min-h-[auto] md:min-h-[60vh]">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full relative z-10">
          <div className="flex flex-col justify-center items-center text-center space-y-8">
            <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight drop-shadow-lg">
              {t('home.stats.exp_prefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500"><CountUp end={7} lang={lang} /> {lang === 'en' ? 'Years' : 'वर्ष'}</span> <br />{t('home.stats.exp_suffix')}
            </h2>
            <p className="text-blue-100 text-xl font-light max-w-lg leading-relaxed">{t('home.stats.desc')}</p>
            <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-fit">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2 group">
              <div className="mb-6 p-4 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-8 h-8"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>
              </div>
              <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight"><CountUp end={500} lang={lang} suffix="+" /></h3>
              <p className="text-sm text-blue-200 font-bold uppercase tracking-widest">{t('home.stats.members')}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2 group mt-0 md:-mt-8">
              <div className="mb-6 p-4 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-8 h-8"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight"><CountUp end={100} lang={lang} suffix="+" /></h3>
              <p className="text-sm text-blue-200 font-bold uppercase tracking-widest">{t('home.stats.senior_citizens')}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 flex flex-col items-center text-center hover:bg-white/10 transition-all duration-300 shadow-2xl hover:shadow-purple-500/20 transform hover:-translate-y-2 group">
              <div className="mb-6 p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white w-8 h-8"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
              </div>
              <h3 className="text-4xl lg:text-5xl font-extrabold text-white mb-2 tracking-tight"><CountUp end={1} lang={lang} prefix="#" /></h3>
              <p className="text-sm text-blue-200 font-bold uppercase tracking-widest">{t('home.stats.ranking')}</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>
      </div>



      {/* Leader Quotes Section: Carousel of quotes from leaders */}
      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12" type="zoom-in">
        <div className="py-8">
          <div className="w-full max-w-7xl mx-auto min-h-[auto] md:min-h-[600px] flex flex-col justify-center">
            {leaderQuotes.map((q, i) => (
              <div
                key={`${q.name}-${i}`}
                // Conditionally render active quote with animation
                className={`transition-all duration-700 ease-in-out w-full max-w-7xl mx-auto left-0 right-0 ${i === activeLeaderIndex ? 'opacity-100 translate-x-0 relative z-10' : 'opacity-0 translate-x-8 absolute top-0 -z-10 pointer-events-none'}`}
              >
                <div className="text-center mb-12">
                  <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-4 shadow-sm">
                    {t('home.welcome')}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                    {/* Dynamic text based on language */}
                    {t('home.message_from')} <span className="text-[#e43f6f]">{lang === 'en' ? (q.roleEn || q.role) : q.role}</span>
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
                  {/* Left Column: Photo */}
                  <div className="relative w-full md:w-1/2 flex justify-center group">
                    {/* Decorative background shapes */}
                    <div className="absolute inset-0 bg-[#e43f6f] opacity-5 rounded-[2.5rem] transform rotate-6 scale-90 translate-x-4 transition-transform duration-500 group-hover:rotate-3"></div>
                    <div className="absolute inset-0 bg-[#c6285b] opacity-10 rounded-[2.5rem] transform -rotate-3 scale-95 -translate-x-2 transition-transform duration-500 group-hover:-rotate-1"></div>

                    {/* Main Photo Frame */}
                    <div className="relative z-10 bg-white p-3 rounded-[2.5rem] shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] w-full max-w-[500px]">
                      <img
                        src={getOptimizedUrl(q.img, { width: 600, height: 750, fit: 'cover' })}
                        alt={lang === 'en' ? (q.nameEn || q.name) : q.name}
                        className="w-full aspect-[3/4] object-cover rounded-[2rem]"
                      />

                      {/* Name Label Overlay */}
                      <div className="absolute bottom-8 left-0 bg-gradient-to-r from-[#e43f6f] to-[#c6285b] text-white px-8 py-4 rounded-r-full shadow-lg max-w-[90%] transform transition-transform duration-500 group-hover:translate-x-2">
                        <div className="font-bold text-lg md:text-xl uppercase tracking-wide leading-tight">{lang === 'en' ? (q.nameEn || q.name) : q.name}</div>
                        <div className="text-xs md:text-sm font-medium opacity-90 mt-1 uppercase tracking-wider">{lang === 'en' ? (q.roleEn || q.role) : q.role}</div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Message */}
                  <div className="w-full md:w-1/2">
                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-gray-100 relative h-full flex flex-col justify-center transform transition-all duration-500 hover:shadow-xl">
                      {/* Quote Icon */}
                      <div className="absolute top-8 left-8 text-[#e43f6f] opacity-10">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01697C7.91243 16 7.01697 16.8954 7.01697 18L7.01697 21H14.017ZM14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01697C7.91243 16 7.01697 16.8954 7.01697 18L7.01697 21H14.017Z" /></svg>
                      </div>

                      <div className="relative z-10">
                        <p className="text-gray-600 text-lg md:text-xl leading-relaxed italic font-light">
                          "{lang === 'en' ? (q.quoteEn || q.quote) : q.quote}"
                        </p>
                        <div className="mt-8 flex items-center gap-3">
                          <div className="h-1 w-12 bg-[#e43f6f] rounded-full"></div>
                          <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{t('home.scrc_leader')}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center gap-3 mt-8">
            {leaderQuotes.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveLeaderIndex(i)}
                className={`h-3 rounded-full transition-all duration-300 ${i === activeLeaderIndex ? 'bg-[#e43f6f] w-10' : 'bg-gray-300 w-3 hover:bg-[#f2b9c8]'}`}
                aria-label={`View leader ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12" type="fade-up">
        <div className="bg-gradient-to-br from-pink-50 to-white rounded-[3rem] p-8 md:p-12 shadow-xl border border-pink-100 relative overflow-hidden">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
                  {t('home.what_we_do')}
                </span>
                <h3 className="text-3xl font-bold text-gray-800">{t('activities.title')}</h3>
              </div>
              <div className="carousel-controls flex gap-2">
                <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200" onClick={() => scrollActivities('left')}>‹</button>
                <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200" onClick={() => scrollActivities('right')}>›</button>
              </div>
            </div>

            <div className="relative group" onMouseEnter={onMouseEnterActivities} onMouseLeave={onMouseLeaveActivities}>
              <div className="carousel flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide" ref={activitiesRef}>
                {activities.map((a, i) => (
                  <div key={`${a.title}-${i}`} className="min-w-[85vw] md:min-w-[380px] snap-start">
                    <div
                      className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full cursor-pointer group"
                      onClick={() => setCurrentPopup({
                        title: lang === 'en' ? (a.titleEn || a.title) : a.title,
                        mediaUrl: a.img,
                        text: '',
                        active: true,
                        popup: true,
                        created_at: '',
                        updated_at: ''
                      })}
                    >
                      <div className="relative h-[280px] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        {a.img && (
                          <img
                            src={a.img}
                            alt={lang === 'en' ? (a.titleEn || a.title) : a.title}
                            className="w-full h-full object-cover transform transition-transform duration-700 hover:scale-110"
                          />
                        )}
                        <div className="absolute bottom-4 left-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                          <span className="px-3 py-1 bg-[#e43f6f] text-white text-xs font-bold rounded-full">{t('home.scrc_activity')}</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="text-xl font-bold text-gray-800 mb-2">{lang === 'en' ? (a.titleEn || a.title) : a.title}</div>
                        <div className="h-1 w-12 bg-pink-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12" type="fade-right">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
            {t('home.leadership')}
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800">{t('core.title')}</h3>
        </div>
        <div className="relative group" onMouseEnter={onMouseEnterLeaders} onMouseLeave={onMouseLeaveLeaders}>
          <div className="carousel-controls flex justify-end gap-2 mb-4 px-4">
            <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => scrollLeaders('left')}>‹</button>
            <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => scrollLeaders('right')}>›</button>
          </div>
          <div className="carousel flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4" ref={carouselRef} style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {leaders.map((l, i) => (
              <div key={`${l.name}-${i}`} className="min-w-[280px] snap-start bg-white rounded-[2rem] p-6 shadow-lg border border-pink-50 hover:shadow-xl transition-all text-center group/card">
                <div className="relative w-[200px] h-[200px] mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#e43f6f] to-[#c6285b]">
                  {l.img && (
                    <img
                      src={getOptimizedUrl(l.img, { width: 200, height: 200, fit: 'cover' })}
                      alt={lang === 'en' ? (l.nameEn || l.name) : l.name}
                      loading="lazy"
                      className="w-full h-full object-cover rounded-full border-4 border-white"
                    />
                  )}
                </div>
                <div className="font-bold text-xl text-gray-800 group-hover/card:text-[#e43f6f] transition-colors mb-1">{lang === 'en' ? (l.nameEn || l.name) : l.name}</div>
                <div className="text-sm text-gray-500 font-medium uppercase tracking-wide bg-gray-50 inline-block px-3 py-1 rounded-full">{lang === 'en' ? (l.roleEn || l.role) : l.role}</div>
              </div>
            ))}
          </div>
        </div>
        <StaffSection staff={staff} t={t} lang={lang} />
        <DPMT staff={dpmt} t={t} lang={lang} />

      </AnimatedSection>

      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12" type="fade-up">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
            {t('home.moments')}
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800">{t('gallery.title')}</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Latest Image */}
          {latestImage && (
            <div
              className="relative group overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all h-[300px] md:h-[400px] cursor-pointer"
              onClick={() => setCurrentPopup({
                title: latestImage.title || t('home.latest_photo'),
                mediaUrl: latestImage.img,
                text: '',
                active: true,
                popup: true,
                created_at: latestImage.created_at || '',
                updated_at: ''
              })}
            >
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#e43f6f] shadow-sm z-20">
                {t('home.latest_photo')}
              </div>
              <img
                src={getOptimizedUrl(latestImage.img!, { width: 600, height: 600, fit: 'cover' })}
                alt={latestImage.title || 'Latest Photo'}
                loading="lazy"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-100 transition-opacity duration-300 flex items-end p-6">
                <span className="text-white text-lg font-bold">{latestImage.title || 'Gallery Image'}</span>
              </div>
            </div>
          )}

          {/* Latest Video */}
          {latestVideo && (
            <div
              className="relative group overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all h-[300px] md:h-[400px] bg-black cursor-pointer"
              onClick={() => setCurrentPopup({
                title: latestVideo.title || t('home.latest_video'),
                mediaUrl: latestVideo.videoUrl,
                text: '',
                active: true,
                popup: true,
                created_at: latestVideo.created_at || '',
                updated_at: ''
              })}
              onMouseEnter={(e) => { const v = e.currentTarget.querySelector('video'); if (v) v.play(); }}
              onMouseLeave={(e) => { const v = e.currentTarget.querySelector('video'); if (v) v.pause(); }}
            >
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#e43f6f] shadow-sm z-20">
                {t('home.latest_video')}
              </div>
              <div className="absolute inset-0 z-10 bg-transparent"></div>
              {(() => {
                const embed = getEmbedUrl(latestVideo.videoUrl!)
                if (embed?.type === 'video') {
                  return (
                    <video
                      src={embed.src}
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      muted
                      loop
                    />
                  )
                }
                return (
                  <iframe
                    src={embed?.src}
                    title={latestVideo.title || 'Video'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )
              })()}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none flex items-end p-6 z-20">
                <span className="text-white text-lg font-bold">{latestVideo.title || 'Watch Video'}</span>
              </div>
            </div>
          )}

          {/* Latest Album */}
          {latestAlbum && (
            <div
              className="relative group overflow-hidden rounded-[2rem] shadow-lg hover:shadow-2xl transition-all h-[300px] md:h-[400px] cursor-pointer"
              onClick={async () => {
                const imgs = await fetchAlbumImages(latestAlbum.name)
                setAlbumImages(imgs.map(i => i.url))
                setCurrentPopup({
                  type: 'album',
                  title: latestAlbum.name,
                  mediaUrl: '',
                  text: '',
                  active: true,
                  popup: true,
                  created_at: '',
                  updated_at: ''
                } as any)
              }}
            >
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#e43f6f] shadow-sm z-20">
                {t('home.latest_album')}
              </div>
              <img
                src={getOptimizedUrl(latestAlbum.cover || '', { width: 600, height: 600, fit: 'cover' })}
                alt={latestAlbum.name}
                loading="lazy"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300"></div>

              {/* Stack effect */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 transform rotate-6 group-hover:rotate-12 transition-transform">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" /></svg>
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-white/80 text-sm font-medium mb-1">{latestAlbum.count} {t('common.items')}</span>
                <span className="text-white text-xl font-bold">{latestAlbum.name}</span>
              </div>
            </div>
          )}
        </div>
        <div className="center mt-10">
          <button className="btn rounded-full px-8 py-3 shadow-lg hover:shadow-pink-200/50 bg-white border-[#e43f6f] text-[#e43f6f] hover:bg-[#e43f6f] hover:text-white transition-all duration-300 font-bold tracking-wide">
            {t('common.view_full_gallery')}
          </button>
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12" type="scale-up">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
            {t('home.updates')}
          </span>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-800">{t('news.title')} & {t('nav.notices')}</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {latestUpdates.map((n, i) => (
            <div
              key={n._id || i}
              className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 flex flex-col h-full group transform hover:-translate-y-2 duration-300 cursor-pointer"
              onClick={() => setCurrentPopup({
                ...n,
                mediaUrl: 'image' in n ? n.image : undefined,
                text: 'text' in n ? n.text : '',
                active: true,
                popup: true
              } as any)}
            >
              <div className="h-56 overflow-hidden relative">
                {'image' in n && n.image ? (
                  <img
                    src={getOptimizedUrl('image' in n ? n.image : '', { width: 400, height: 300, fit: 'cover' })}
                    alt={n.title}
                    loading="lazy"
                    className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#e43f6f] shadow-sm uppercase">
                  {'type' in n && t('nav.' + n.type)}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-1">
                <h4 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-[#e43f6f] transition-colors">{n.title}</h4>
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                  <span>{t('news.updated')} {'date' in n && n.date ? new Date(n.date).toLocaleDateString() : t('common.na')}</span>
                </div>
                <button className="mt-auto self-start text-[#e43f6f] font-bold text-sm uppercase tracking-wider flex items-center gap-2 group/btn">
                  {t('common.read_more')}
                  <span className="transform transition-transform group-hover/btn:translate-x-1">→</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12" type="fade-down">
        <div className="bg-[#0c2f5f] rounded-[3rem] p-12 md:p-20 relative overflow-hidden text-center text-white shadow-2xl">
          {/* Decorative Circles */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e43f6f] opacity-10 rounded-full translate-x-1/3 translate-y-1/3 blur-3xl"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold mb-6">{t('subscribe.title')}</h3>
            <p className="text-blue-100 mb-8 text-lg">{t('home.subscribe_desc')}</p>

            {/* Social Links */}
            <div className="flex justify-center gap-6 mb-10">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-[#1877F2] rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-[#FF0000] rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-[#E4405F] rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zm0 10.162a3.999 3.999 0 110-7.998 3.999 3.999 0 010 7.998zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
              </a>
              <a href="https://wa.me/9779857032166" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-white/10 hover:bg-[#25D366] rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 group">
                <svg className="w-6 h-6 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
              </a>
            </div>

            <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                placeholder={t('common.your_email')}
                className="flex-1 px-6 py-4 rounded-full bg-white/10 border border-white/20 text-white placeholder-blue-200 focus:outline-none focus:bg-white/20 backdrop-blur-sm transition-all"
              />
              <button className="px-8 py-4 bg-[#e43f6f] hover:bg-[#c6285b] text-white font-bold rounded-full shadow-lg hover:shadow-[#e43f6f]/50 transition-all duration-300 transform hover:scale-105">
                {t('subscribe.cta')}
              </button>
            </form>
          </div>
        </div>
      </AnimatedSection>

      {currentPopup && (
        <div className="member-modal" onClick={closePopup}>
          <div className={`notice-modal-content ${currentPopup.mediaUrl && currentPopup.text ? 'wide' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title">{currentPopup.title}</div>
              <button className="notice-close" onClick={closePopup}>×</button>
            </div>
            <div className={currentPopup.mediaUrl && currentPopup.text ? "notice-body-grid" : "notice-body-single"}>
              {(currentPopup as any).type === 'album' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                  {albumImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setCurrentPopup({
                        type: 'image',
                        title: (currentPopup as any).title,
                        mediaUrl: img,
                        text: '',
                        active: true,
                        popup: true,
                        created_at: '',
                        updated_at: ''
                      } as any)}
                    >
                      <img src={getOptimizedUrl(img, { width: 300, height: 300, fit: 'cover' })} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {currentPopup.mediaUrl && (
                    <div className={currentPopup.text ? "notice-media-col" : "notice-media-full"}>
                      {(() => {
                        const embed = getEmbedUrl(currentPopup.mediaUrl)
                        if (embed?.type === 'video') {
                          return (
                            <video
                              src={embed.src}
                              controls
                              autoPlay
                              muted
                              playsInline
                              style={{ width: '100%', borderRadius: 8, maxHeight: currentPopup.text ? 400 : '60vh', objectFit: 'contain' }}
                            />
                          )
                        }
                        if (embed?.type === 'iframe') {
                          return (
                            <iframe
                              width="100%"
                              height={currentPopup.text ? "300" : "400"}
                              src={embed.src}
                              title="Notice Video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              style={{ borderRadius: 8 }}
                            />
                          )
                        }
                        return (
                          <img
                            src={getOptimizedUrl(currentPopup.mediaUrl, { width: 800 })}
                            alt={currentPopup.title}
                            style={{ width: '100%', borderRadius: 8, maxHeight: currentPopup.text ? 400 : '60vh', objectFit: 'contain' }}
                          />
                        )
                      })()}
                    </div>
                  )}
                  {currentPopup.text && (
                    <div className={currentPopup.mediaUrl ? "notice-text-col" : "notice-text-full"}>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{currentPopup.text}</div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-12 mb-12" type="zoom-in" delay={100}>
        <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-5/12 bg-[#e43f6f] p-12 text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
            <div className="relative z-10">
              <h3 className="text-3xl font-bold mb-6">{t('contact.title')}</h3>
              <p className="mb-8 opacity-90">{t('home.contact_desc')}</p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">📍</div>
                  <span>{t('band.addr')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">📞</div>
                  <span>{t('band.phone')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">✉️</div>
                  <span>{t('band.email')}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="md:w-7/12 p-6 md:p-12">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.formTitle')}</h3>
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.name')}</label>
                  <input
                    name="name"
                    required
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder={t('common.name_placeholder')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.phone')}</label>
                  <input
                    name="phone"
                    required
                    value={contactForm.phone}
                    onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                    placeholder={t('common.phone_placeholder')}
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.email')}</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder={t('common.email_placeholder')}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.message')}</label>
                <textarea
                  name="message"
                  required
                  value={contactForm.message}
                  onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                  placeholder={t('common.message_placeholder')}
                  rows={4}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors resize-none"
                />
              </div>
              <div className="mt-8">
                <button type="submit" className="btn w-full bg-[#e43f6f] hover:bg-[#c6285b] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                  {t('contact.send')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
