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
          <div key={n._id ?? n.title} className="notice-card" onClick={() => setActivePopup(n)}>
            <div className="post-title">{n.title}</div>
            {n.mediaUrl && (
              <div className="notice-preview">
                {getEmbedUrl(n.mediaUrl) ? (
                  <div className="video-thumb">
                    <img 
                      src={`https://img.youtube.com/vi/${getEmbedUrl(n.mediaUrl)?.split('/').pop()}/mqdefault.jpg`} 
                      alt={n.title} 
                    />
                    <div className="play-icon">▶</div>
                  </div>
                ) : (
                  <img src={n.mediaUrl} alt={n.title} className="image-thumb" />
                )}
              </div>
            )}
            <div className="post-text clip-text">{n.text}</div>
            <div className="post-date">{n.active ? 'Active' : 'Inactive'}</div>
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
