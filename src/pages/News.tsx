import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import type { NewsItem } from '../types/content'
import { fetchNews } from '../services/content'

export default function News({ t }: { t: (k: string) => string }) {
  const [items, setItems] = useState<NewsItem[]>([])
  const [activePopup, setActivePopup] = useState<NewsItem | null>(null)

  useEffect(() => {
    fetchNews().then(setItems).catch(() => setItems([]))
  }, [])

  return (
    <div className="page">
      <SubHero title={t('nav.news')} img="https://placehold.co/1600x420" />
      <div className="posts">
        {items.map(p => (
          <div key={p._id ?? p.title} className="post-card" onClick={() => setActivePopup(p)} style={{ cursor: 'pointer' }}>
            {p.img && <img src={p.img} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '4px 4px 0 0' }} />}
            <div style={{ padding: 15 }}>
              <div className="post-title">{p.title}</div>
              <div className="post-text">{p.text && p.text.length > 100 ? p.text.slice(0, 100) + '...' : p.text}</div>
              <span className="post-link" onClick={(e) => { e.stopPropagation(); setActivePopup(p); }}>{t('news.read_more')}</span>
              <div className="post-date">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}</div>
            </div>
          </div>
        ))}
      </div>

      {activePopup && (
        <div className="member-modal" onClick={() => setActivePopup(null)}>
          <div className="notice-modal-content" onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title">{activePopup.title}</div>
              <button className="notice-close" onClick={() => setActivePopup(null)}>×</button>
            </div>
            <div className="notice-body">
              {activePopup.img && (
                <div style={{ marginBottom: 16 }}>
                  <img 
                    src={activePopup.img} 
                    alt={activePopup.title} 
                    style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'contain' }} 
                  />
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>{activePopup.text}</div>
              <div className="post-date" style={{ marginTop: 20 }}>
                {activePopup.publishedAt ? new Date(activePopup.publishedAt).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
