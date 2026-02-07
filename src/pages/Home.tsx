import { useEffect, useRef, useState } from 'react'
import HeroSlider from '../components/HeroSlider'
import StaffSection from '../components/StaffSection'
import DPMT from '../components/DPMT'
import { fetchNotices, fetchNews, fetchGallery } from '../services/content'
import { activities, dpmt, leaderQuotes, leaders, staff } from '../data/homeData'
import type { NoticeItem, NewsItem } from '../types/content'
import Intro from '../components/Intro'
import { getOptimizedUrl } from '../utils/image'
import AnimatedSection from '../components/AnimatedSection'
import { useAutoScroll } from '../hooks/useAutoScroll'


export default function Home({ t, lang }: { t: (k: string) => string; lang: 'en' | 'ne' }) {
  const carouselRef = useRef<HTMLDivElement>(null)
  const activitiesRef = useRef<HTMLDivElement>(null)
  const { scroll: scrollLeaders, onMouseEnter: onMouseEnterLeaders, onMouseLeave: onMouseLeaveLeaders } = useAutoScroll(carouselRef)
  const { scroll: scrollActivities, onMouseEnter: onMouseEnterActivities, onMouseLeave: onMouseLeaveActivities } = useAutoScroll(activitiesRef)
  
  const [gallery, setGallery] = useState<string[]>([])
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [popupQueue, setPopupQueue] = useState<NoticeItem[]>([])
  const [currentPopup, setCurrentPopup] = useState<NoticeItem | null>(null)

  useEffect(() => {
    // If no popup is showing but we have items in queue, show the next one
    if (!currentPopup && popupQueue.length > 0) {
      setCurrentPopup(popupQueue[0])
      setPopupQueue(prev => prev.slice(1))
    }
  }, [popupQueue, currentPopup])

  const closePopup = () => {
    setCurrentPopup(null)
    // Effect will trigger next one automatically
  }

  const getEmbedUrl = (url: string) => {
    // Check for Cloudinary or direct video files
    if (url.includes('cloudinary') || url.match(/\.(mp4|webm|mov)$/i)) {
      return { type: 'video', src: getOptimizedUrl(url, { quality: 'auto' }) }
    }
    
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    return match ? { type: 'iframe', src: `https://www.youtube.com/embed/${match[1]}` } : null
  }

  useEffect(() => {
    // 1. Fetch Popup Notices
    const p1 = fetchNotices({ active: true, popup: true })
      .then(items => items.filter(i => {
        const dateStr = i.created_at || i.updated_at
        if (!dateStr) return false
        const date = new Date(dateStr)
        const age = Date.now() - date.getTime()
        return age < 24 * 60 * 60 * 1000
      }))

    // 2. Fetch Popup News
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

    // Fetch Latest News for Section
    fetchNews({ active: true }).then(items => {
      const sorted = items.sort((a, b) => {
        const ta = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const tb = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
        return tb - ta
      })
      setLatestNews(sorted.slice(0, 3))
    }).catch(() => setLatestNews([]))
    fetchGallery().then(items => {
      // Filter for images and take first 8
      const images = items
        .filter(i => i.type === 'image' && i.img)
        .map(i => i.img!)
        .slice(0, 8)
      
      setGallery(images)
    }).catch(() => setGallery([]))
  }, [])

  return (
    <>
      <section className="hero">
        <HeroSlider />
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

      <AnimatedSection type="fade-up" delay={200}>
        <Intro t={t} lang={lang} />
      </AnimatedSection>

      <AnimatedSection className="section" type="fade-left">
        <h3>{t('activities.title')}</h3>
        <div className="relative group" onMouseEnter={onMouseEnterActivities} onMouseLeave={onMouseLeaveActivities}>
          <div className="carousel-controls">
            <button className="btn sm" onClick={() => scrollActivities('left')}>‹</button>
            <button className="btn sm" onClick={() => scrollActivities('right')}>›</button>
          </div>
          <div className="carousel" ref={activitiesRef} style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {activities.map((a, i) => (
              <div key={`${a.title}-${i}`} className="card min-w-[420px]" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                {a.img && <img src={a.img} alt={a.title} className="h-[312px] w-full object-cover" />}
                <div className="card-title">{a.title}</div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section" type="zoom-in">
        <div className="flex flex-col gap-24 py-12">
          {leaderQuotes.map((q, i) => (
            <div key={`${q.name}-${i}`} className="w-full max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-4 shadow-sm">
                  WELCOME TO SCRC
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
                  Message From <span className="text-[#e43f6f]">{q.role}</span>
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
                {/* Left Column: Photo */}
                <div className="relative w-full md:w-5/12 flex justify-center group">
                  {/* Decorative background shapes */}
                  <div className="absolute inset-0 bg-[#e43f6f] opacity-5 rounded-[2.5rem] transform rotate-6 scale-90 translate-x-4 transition-transform duration-500 group-hover:rotate-3"></div>
                  <div className="absolute inset-0 bg-[#c6285b] opacity-10 rounded-[2.5rem] transform -rotate-3 scale-95 -translate-x-2 transition-transform duration-500 group-hover:-rotate-1"></div>
                  
                  {/* Main Photo Frame */}
                  <div className="relative z-10 bg-white p-3 rounded-[2.5rem] shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                    <img 
                      src={getOptimizedUrl(q.img, { width: 500, height: 600, fit: 'cover' })} 
                      alt={q.name}
                      className="w-full aspect-[3/4] object-cover rounded-[2rem]"
                    />
                    
                    {/* Name Label Overlay */}
                    <div className="absolute bottom-8 left-0 bg-gradient-to-r from-[#e43f6f] to-[#c6285b] text-white px-8 py-4 rounded-r-full shadow-lg max-w-[90%] transform transition-transform duration-500 group-hover:translate-x-2">
                      <div className="font-bold text-lg md:text-xl uppercase tracking-wide leading-tight">{q.name}</div>
                      <div className="text-xs md:text-sm font-medium opacity-90 mt-1 uppercase tracking-wider">{q.role}</div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Message */}
                <div className="w-full md:w-7/12">
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-gray-100 relative h-full flex flex-col justify-center transform transition-all duration-500 hover:shadow-xl">
                    {/* Quote Icon */}
                    <div className="absolute top-8 left-8 text-[#e43f6f] opacity-10">
                      <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01697C7.91243 16 7.01697 16.8954 7.01697 18L7.01697 21H14.017ZM14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01697C7.91243 16 7.01697 16.8954 7.01697 18L7.01697 21H14.017Z" /></svg>
                    </div>
                    
                    <div className="relative z-10">
                      <p className="text-gray-600 text-lg md:text-xl leading-relaxed italic font-light">
                        "{q.quote}"
                      </p>
                      <div className="mt-8 flex items-center gap-3">
                        <div className="h-1 w-12 bg-[#e43f6f] rounded-full"></div>
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">SCRC Leader</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="section" type="fade-right">
        <h3>{t('core.title')}</h3>
        <div className="relative group" onMouseEnter={onMouseEnterLeaders} onMouseLeave={onMouseLeaveLeaders}>
          <div className="carousel-controls">
            <button className="btn sm" onClick={() => scrollLeaders('left')}>‹</button>
            <button className="btn sm" onClick={() => scrollLeaders('right')}>›</button>
          </div>
          <div className="carousel" ref={carouselRef} style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
            {leaders.map((l, i) => (
              <div key={`${l.name}-${i}`} className="profile" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
                {l.img && (
                  <img 
                    src={getOptimizedUrl(l.img, { width: 200, height: 200, fit: 'cover' })} 
                    alt={l.name} 
                    loading="lazy"
                  />
                )}
                <div className="profile-name">{l.name}</div>
                <div className="profile-role">{l.role}</div>
              </div>
            ))}
          </div>
        </div>
         <StaffSection staff={staff} t={t} />
          <DPMT staff={dpmt} t={t} />

      </AnimatedSection>

      <AnimatedSection className="section" type="fade-up">
        <h3>{t('gallery.title')}</h3>
        <div className="grid">
          {gallery.map((g, i) => (
            <div key={i} className="card">
              <img 
                src={getOptimizedUrl(g, { width: 400, height: 300, fit: 'cover' })} 
                alt={'img' + i} 
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className="center">
          <button className="btn">{lang === 'en' ? 'View more' : 'और देखें'}</button>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section" type="scale-up">
        <h3>{t('news.title')}</h3>
        <div className="news">
          {latestNews.map((n, i) => (
            <div key={n._id || i} className="news-card">
              {n.img && (
                <img 
                  src={getOptimizedUrl(n.img, { width: 400, height: 300, fit: 'cover' })} 
                  alt={n.title} 
                  loading="lazy"
                />
              )}
              <div className="news-body">
                <div className="news-title">{n.title}</div>
                <p>{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ''}</p>
                <button className="btn sm">{lang === 'en' ? 'Read' : 'पढ़ें'}</button>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>

      <AnimatedSection className="section" type="fade-down">
        <h3>{t('subscribe.title')}</h3>
        <form className="subscribe" style={{ flexWrap: 'wrap' }}>
          <input placeholder={lang === 'en' ? 'Your email' : 'आपका ईमेल'} style={{ minWidth: '200px' }} />
          <button className="btn" style={{ flex: '1 0 auto' }}>{t('subscribe.cta')}</button>
        </form>
      </AnimatedSection>
      {currentPopup && (
        <div className="member-modal" onClick={closePopup}>
          <div className={`notice-modal-content ${currentPopup.mediaUrl && currentPopup.text ? 'wide' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title">{currentPopup.title}</div>
              <button className="notice-close" onClick={closePopup}>×</button>
            </div>
            <div className={currentPopup.mediaUrl && currentPopup.text ? "notice-body-grid" : "notice-body-single"}>
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
            </div>
          </div>
        </div>
      )}

      <AnimatedSection className="section" type="zoom-in" delay={100}>
        <h3>{t('contact.title')}</h3>
        <form className="form">
          <div className="form-row">
            <input placeholder={lang === 'en' ? 'Name' : 'नाम'} />
            <input placeholder={lang === 'en' ? 'Mobile' : 'मोबाइल'} />
            <input placeholder={lang === 'en' ? 'Email' : 'ईमेल'} />
          </div>
          <textarea placeholder={lang === 'en' ? 'Message' : 'संदेश'} rows={5} />
          <div className="center">
            <button className="btn">{lang === 'en' ? 'Send' : 'भेजें'}</button>
          </div>
        </form>
      </AnimatedSection>
    </>
  )
}
