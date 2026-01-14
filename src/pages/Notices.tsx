import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import type { NoticeItem } from '../types/content'
import { fetchNotices } from '../services/content'

export default function Notices({ t }: { t: (k: string) => string }) {
  const [items, setItems] = useState<NoticeItem[]>([])
  const [activePopup, setActivePopup] = useState<NoticeItem | null>(null)

  useEffect(() => {
    fetchNotices().then(setItems).catch(() => setItems([]))
  }, [])

  const getEmbedUrl = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    return match ? `https://www.youtube.com/embed/${match[1]}` : null
  }

  return (
    <div className="page">
      <SubHero title={t('nav.notices')} img="https://placehold.co/1600x420" />
      <div className="posts">
        {items.map(n => (
          <div key={n._id ?? n.title} className="post-card" onClick={() => setActivePopup(n)}>
            {n.mediaUrl && (
              <div style={{ width: '100%' }}>
                {getEmbedUrl(n.mediaUrl) ? (
                  <iframe 
                    src={getEmbedUrl(n.mediaUrl) || undefined}
                    title={n.title}
                    style={{ width: '100%', aspectRatio: '16/9', border: 0 }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                ) : (
                  <img src={n.mediaUrl} alt={n.title} style={{ width: '100%', height: 200, objectFit: 'cover' }} />
                )}
              </div>
            )}
            <div style={{ padding: 15, display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div className="post-title">{n.title}</div>
              <div className="post-text">{n.text && n.text.length > 100 ? n.text.slice(0, 100) + '...' : n.text}</div>
              <span className="post-link" onClick={(e) => { e.stopPropagation(); setActivePopup(n); }}>{t('news.read_more')}</span>
              <div className="post-date">{n.active ? 'Active' : 'Inactive'}</div>
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
              {activePopup.mediaUrl && (
                <div style={{ marginBottom: 16 }}>
                  {getEmbedUrl(activePopup.mediaUrl) ? (
                    <iframe 
                      width="100%" 
                      height="300" 
                      src={getEmbedUrl(activePopup.mediaUrl)! + "?autoplay=1"} 
                      title="Notice Video" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen 
                      style={{ borderRadius: 8 }}
                    />
                  ) : (
                    <img 
                      src={activePopup.mediaUrl} 
                      alt={activePopup.title} 
                      style={{ width: '100%', borderRadius: 8, maxHeight: 400, objectFit: 'contain' }} 
                    />
                  )}
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>{activePopup.text}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
