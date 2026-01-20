import { useEffect, useRef, useState } from 'react'
import Intro from '../components/Intro'
import StaffSection from '../components/StaffSection'
import DPMT from '../components/DPMT'
import { fetchNotices, fetchNews, fetchGallery } from '../services/content'
import { activities, dpmt, leaderQuotes, leaders, staff } from '../data/homeData'
import type { NoticeItem } from '../types/content'


export default function Home({ t, lang }: { t: (k: string) => string; lang: 'en' | 'ne' }) {
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const scrollCarousel = (dir: 'left' | 'right') => {
    const el = carouselRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollTo({ left: dir === 'left' ? el.scrollLeft - amount : el.scrollLeft + amount, behavior: 'smooth' })
  }
  const [gallery, setGallery] = useState<string[]>([])
  const [latestNews, setLatestNews] = useState<{ title: string; img?: string; publishedAt?: string }[]>([])
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
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
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
    
    // Fetch gallery preview
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
        <img src="https://placehold.co/1600x520" alt="hero" />
        <div className="hero-steps">
          <div className="step">
            <div className="circle">01</div>
            <div className="label">{t('hero.step1')}</div>
          </div>
          <div className="step">
            <div className="circle">02</div>
            <div className="label">{t('hero.step2')}</div>
          </div>
          <div className="step">
            <div className="circle">03</div>
            <div className="label">{t('hero.step3')}</div>
          </div>
        </div>
      </section>

      <Intro t={t} lang={lang} />

      

      <section className="section">
        <h3>{t('activities.title')}</h3>
        <div className="grid">
          {activities.map(a => (
            <div key={a.title} className="card">
              <img src={a.img} alt={a.title} />
              <div className="card-title">{a.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>{t('leaders.title')}</h3>
        <div className="quotes">
          {leaderQuotes.map(q => (
            <div key={q.name} className="quote-card">
              <div className="quote-top">
                <img src={q.img} alt={q.name} />
                <div>
                  <div className="quote-name">{q.name}</div>
                  <div className="quote-role">{q.role}</div>
                </div>
              </div>
              <p className="quote-text">“{q.quote}”</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>{t('core.title')}</h3>
        <div className="carousel-controls">
          <button className="btn sm" onClick={() => scrollCarousel('left')}>‹</button>
          <button className="btn sm" onClick={() => scrollCarousel('right')}>›</button>
        </div>
        <div className="carousel" ref={carouselRef}>
          {leaders.map(l => (
            <div key={l.name} className="profile">
              <img src={l.img} alt={l.name} />
              <div className="profile-name">{l.name}</div>
              <div className="profile-role">{l.role}</div>
            </div>
          ))}
        </div>
         <StaffSection staff={staff} t={t} />
          <DPMT staff={dpmt} t={t} />

      </section>

      <section className="section">
        <h3>{t('gallery.title')}</h3>
        <div className="grid">
          {gallery.map((g, i) => (
            <div key={i} className="card">
              <img src={g} alt={'img' + i} />
            </div>
          ))}
        </div>
        <div className="center">
          <button className="btn">{lang === 'en' ? 'View more' : 'और देखें'}</button>
        </div>
      </section>

      <section className="section">
        <h3>{t('news.title')}</h3>
        <div className="news">
          {latestNews.map(n => (
            <div key={n.title} className="news-card">
              {n.img && <img src={n.img} alt={n.title} />}
              <div className="news-body">
                <div className="news-title">{n.title}</div>
                <p>{n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : ''}</p>
                <button className="btn sm">{lang === 'en' ? 'Read' : 'पढ़ें'}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h3>{t('subscribe.title')}</h3>
        <form className="subscribe">
          <input placeholder={lang === 'en' ? 'Your email' : 'आपका ईमेल'} />
          <button className="btn">{t('subscribe.cta')}</button>
        </form>
      </section>
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
                  {getEmbedUrl(currentPopup.mediaUrl) ? (
                    <iframe 
                      width="100%" 
                      height={currentPopup.text ? "300" : "400"} 
                      src={getEmbedUrl(currentPopup.mediaUrl)!} 
                      title="Notice Video" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                      style={{ borderRadius: 8 }}
                    />
                  ) : (
                    <img 
                      src={currentPopup.mediaUrl} 
                      alt={currentPopup.title} 
                      style={{ width: '100%', borderRadius: 8, maxHeight: currentPopup.text ? 400 : '60vh', objectFit: 'contain' }} 
                    />
                  )}
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

      <section className="section">
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
      </section>
    </>
  )
}
