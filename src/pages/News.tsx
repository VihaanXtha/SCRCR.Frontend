import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import type { NewsItem, NoticeItem } from '../types/content'
import { fetchNews, fetchNotices } from '../services/content'
import bannerImg from '../assets/images/hero-slider/scrc-slider-7-1.jpg'
import { getOptimizedUrl } from '../utils/image'

type CombinedItem = (NewsItem | NoticeItem) & { 
  type: 'news' | 'notice'
  date: string
  image?: string
  mediaUrl?: string
}

export default function News({ t }: { t: (k: string) => string }) {
  const [items, setItems] = useState<CombinedItem[]>([])
  const [filter, setFilter] = useState<'all' | 'news' | 'notice'>('all')
  const [activePopup, setActivePopup] = useState<CombinedItem | null>(null)

  useEffect(() => {
    Promise.all([
      fetchNews({ active: true }),
      fetchNotices({ active: true })
    ]).then(([news, notices]) => {
      const newsItems = news.map(n => ({
        ...n,
        type: 'news' as const,
        date: n.updated_at || n.publishedAt || n.created_at || new Date().toISOString(),
        image: n.img,
        mediaUrl: n.img // Normalize for popup
      }))
      
      const noticeItems = notices.map(n => ({
        ...n,
        type: 'notice' as const,
        date: n.updated_at || n.created_at || new Date().toISOString(),
        image: n.mediaUrl, // Normalize for card
        mediaUrl: n.mediaUrl
      }))

      const combined = [...newsItems, ...noticeItems] as CombinedItem[]
      
      const sorted = combined.sort((a, b) => {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return db - da
      })
      
      setItems(sorted)
    }).catch(() => setItems([]))
  }, [])

  const filteredItems = items.filter(i => filter === 'all' || i.type === filter)

  const getEmbedUrl = (url: string) => {
    // Check for direct video files
    if (url.includes('cloudinary') || url.match(/\.(mp4|webm|mov)$/i)) {
      return { type: 'video', src: getOptimizedUrl(url, { quality: 'auto' }) }
    }
    
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    return match ? { type: 'iframe', src: `https://www.youtube.com/embed/${match[1]}` } : null
  }

  return (
    <div className="page">
      <SubHero title={t('nav.news_notices')} img={bannerImg} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-8">
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'all' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            {t('news.filter.all')}
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'news' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('news')}
          >
            {t('news.filter.news')}
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'notice' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('notice')}
          >
            {t('news.filter.notice')}
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filteredItems.map((p, i) => (
            <div key={`${p.type}-${p._id || i}`} className="post-card group cursor-pointer" onClick={() => setActivePopup(p)}>
              <div className="relative h-48 overflow-hidden rounded-t-[2rem]">
                {p.image ? (
                   <>
                    {/* Check if it's a video/iframe to show play icon or generic image */}
                    {getEmbedUrl(p.image)?.type === 'iframe' || getEmbedUrl(p.image)?.type === 'video' ? (
                      <div className="w-full h-full bg-black/10 flex items-center justify-center relative">
                        {getEmbedUrl(p.image)?.type === 'iframe' ? (
                             <img 
                              src={`https://img.youtube.com/vi/${p.image.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1]}/hqdefault.jpg`}
                              alt={p.title}
                              className="w-full h-full object-cover"
                             />
                        ) : (
                             <video src={p.image} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                           <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#e43f6f]">▶</div>
                        </div>
                      </div>
                    ) : (
                      <img 
                        src={getOptimizedUrl(p.image, { width: 400, height: 300, fit: 'cover' })} 
                        alt={p.title} 
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                   </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[#e43f6f] shadow-sm uppercase">
                  {p.type === 'news' ? t('news.filter.news') : t('news.filter.notice')}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="post-title mb-2 text-lg font-bold line-clamp-2">{p.title}</div>
                <div className="post-text text-sm text-gray-500 mb-4 line-clamp-3">
                  {typeof p.text === 'string' ? p.text : ''}
                </div>
                <div className="mt-auto flex justify-between items-center">
                   <span className="text-[#e43f6f] font-bold text-sm uppercase tracking-wider">{t('news.read_more')}</span>
                   <div className="text-xs text-gray-400">
                     {new Date(p.date).toLocaleDateString()}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activePopup && (
        <div className="member-modal" onClick={() => setActivePopup(null)}>
          <div className={`notice-modal-content ${activePopup.mediaUrl && activePopup.text ? 'wide' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title">{activePopup.title}</div>
              <button className="notice-close" onClick={() => setActivePopup(null)}>×</button>
            </div>
            <div className={activePopup.mediaUrl && activePopup.text ? "notice-body-grid" : "notice-body-single"}>
              {activePopup.mediaUrl && (
                <div className={activePopup.text ? "notice-media-col" : "notice-media-full"}>
                   {(() => {
                    const embed = getEmbedUrl(activePopup.mediaUrl!)
                    if (embed?.type === 'video') {
                      return (
                        <video 
                          src={embed.src} 
                          controls 
                          autoPlay 
                          className="w-full rounded-lg max-h-[60vh] object-contain"
                        />
                      )
                    }
                    if (embed?.type === 'iframe') {
                      return (
                        <iframe 
                          src={embed.src} 
                          title="Notice Video" 
                          className="w-full aspect-video rounded-lg border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                          allowFullScreen 
                        />
                      )
                    }
                    return (
                      <img 
                        src={getOptimizedUrl(activePopup.mediaUrl!, { width: 800 })} 
                        alt={activePopup.title} 
                        className="w-full rounded-lg max-h-[60vh] object-contain"
                      />
                    )
                  })()}
                </div>
              )}
              <div className={activePopup.mediaUrl ? "notice-text-col" : "notice-text-full"}>
                <div style={{ whiteSpace: 'pre-wrap' }}>{activePopup.text}</div>
                <div className="mt-6 text-sm text-gray-400 border-t pt-4">
                  {t('news.filter.all')}: {new Date(activePopup.date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
