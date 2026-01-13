import { useEffect, useRef, useState } from 'react'
import Intro from '../components/Intro'
import StaffSection from '../components/StaffSection'
import { fetchNotices, fetchNews, fetchGallery } from '../services/content'
import { activities, leaderQuotes, leaders, staff } from '../data/homeData'
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
  const [popupNotice, setPopupNotice] = useState<NoticeItem | null>(null)

  useEffect(() => {
    fetchNotices({ active: true, popup: true }).then(items => setPopupNotice(items[0] ?? null)).catch(() => setPopupNotice(null))
    fetchNews().then(items => {
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
        </div> <StaffSection staff={staff} t={t} />

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
      {popupNotice && (
        <div className="member-modal" onClick={() => setPopupNotice(null)}>
          <div className="modal-body" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">{popupNotice.title}</div>
              <button className="modal-close" onClick={() => setPopupNotice(null)}>×</button>
            </div>
            <div className="modal-grid">
              <div>{popupNotice.text}</div>
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
