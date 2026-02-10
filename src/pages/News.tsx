import '../App.css'
import { useState, useEffect } from 'react' // React hooks for state and side effects
import SubHero from '../components/SubHero' // Page banner component
import bannerImg from '../assets/images/hero-slider/scrc-slider-7-1.jpg' // Default banner image
import { fetchNews, fetchNotices } from '../services/content' // API services for fetching content
import type { NewsItem, NoticeItem } from '../types/content' // TypeScript interfaces
import { getOptimizedUrl } from '../utils/image' // Image optimization utility

// Define a unified type for content items (News + Notices) to handle them together
// This intersection type adds a 'type' discriminator and normalized 'date'/'image' fields
type CombinedItem = (NewsItem | NoticeItem) & { 
  type: 'news' | 'notice'
  date: string
  image?: string
  mediaUrl?: string
}

// News Component: Displays a feed of news and notices with filtering and popup details
export default function News({ t }: { t: (k: string) => string }) {
  // State to store all fetched items
  const [items, setItems] = useState<CombinedItem[]>([])
  // State to filter items by type ('all', 'news', or 'notice')
  const [filter, setFilter] = useState<'all' | 'news' | 'notice'>('all')
  // State to track the currently active item for the popup modal
  const [activePopup, setActivePopup] = useState<CombinedItem | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    // Execute both fetch requests in parallel for better performance
    Promise.all([
      fetchNews({ active: true }),
      fetchNotices({ active: true })
    ]).then(([news, notices]) => {
      // Process and normalize News items
      const newsItems = news.map(n => ({
        ...n,
        type: 'news' as const,
        // Fallback strategy for date: updated -> published -> created -> now
        date: n.updated_at || n.publishedAt || n.created_at || new Date().toISOString(),
        image: n.img,
        mediaUrl: n.img // Normalize to 'mediaUrl' for consistent access in popup
      }))
      
      // Process and normalize Notice items
      const noticeItems = notices.map(n => ({
        ...n,
        type: 'notice' as const,
        date: n.updated_at || n.created_at || new Date().toISOString(),
        image: n.mediaUrl, // Normalize to 'image' for card display
        mediaUrl: n.mediaUrl
      }))

      // Combine both lists into a single array
      const combined = [...newsItems, ...noticeItems] as CombinedItem[]
      
      // Sort items by date (newest first)
      const sorted = combined.sort((a, b) => {
        const da = new Date(a.date).getTime()
        const db = new Date(b.date).getTime()
        return db - da
      })
      
      setItems(sorted)
    }).catch(() => setItems([])) // Handle errors gracefully by setting empty list
  }, [])

  // Filter items based on the selected filter state
  const filteredItems = items.filter(i => filter === 'all' || i.type === filter)

  // Helper function to detect and format video URLs for embedding
  const getEmbedUrl = (url: string) => {
    // Check for direct video files (Cloudinary or standard extensions)
    if (url.includes('cloudinary') || url.match(/\.(mp4|webm|mov)$/i)) {
      return { type: 'video', src: getOptimizedUrl(url, { quality: 'auto' }) }
    }
    
    // Check for YouTube links and extract Video ID
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)
    // Return iframe source for YouTube, or null if not a video
    return match ? { type: 'iframe', src: `https://www.youtube.com/embed/${match[1]}` } : null
  }

  return (
    <div className="page">
      <SubHero title={t('nav.news_notices')} img={bannerImg} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Filter Controls */}
        <div className="flex overflow-x-auto justify-start md:justify-center gap-4 mb-8 pb-2">
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'all' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            {t('news.filter.all')}
          </button>
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'news' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('news')}
          >
            {t('news.filter.news')}
          </button>
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'notice' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('notice')}
          >
            {t('news.filter.notice')}
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {filteredItems.map((p, i) => (
            <div key={`${p.type}-${p._id || i}`} className="post-card group cursor-pointer" onClick={() => setActivePopup(p)}>
              <div className="relative h-48 overflow-hidden rounded-t-[2rem]">
                {p.image ? (
                   <>
                    {/* Media Handling: Check if it's a video/iframe to show play icon or generic image */}
                    {getEmbedUrl(p.image)?.type === 'iframe' || getEmbedUrl(p.image)?.type === 'video' ? (
                      <div className="w-full h-full bg-black/10 flex items-center justify-center relative">
                        {/* Show YouTube thumbnail if available, else generic video placeholder */}
                        {getEmbedUrl(p.image)?.type === 'iframe' ? (
                             <img 
                              src={`https://img.youtube.com/vi/${p.image.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i)?.[1]}/hqdefault.jpg`}
                              alt={p.title}
                              className="w-full h-full object-cover"
                             />
                        ) : (
                             <video src={p.image} className="w-full h-full object-cover" />
                        )}
                        {/* Play Icon Overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                           <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-[#e43f6f]">▶</div>
                        </div>
                      </div>
                    ) : (
                      // Standard Image
                      <img 
                        src={getOptimizedUrl(p.image, { width: 400, height: 300, fit: 'cover' })} 
                        alt={p.title} 
                        className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-105"
                      />
                    )}
                   </>
                ) : (
                  // Fallback if no image available
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
                {/* Type Badge (News/Notice) */}
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
                     {t('news.updated')} {new Date(p.date).toLocaleDateString()}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Popup Modal */}
      {activePopup && (
        <div className="member-modal" onClick={() => setActivePopup(null)}>
          <div className={`notice-modal-content ${activePopup.mediaUrl && activePopup.text ? 'wide' : ''}`} onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title">{activePopup.title}</div>
              <button className="notice-close" onClick={() => setActivePopup(null)}>×</button>
            </div>
            <div className={activePopup.mediaUrl && activePopup.text ? "notice-body-grid" : "notice-body-single"}>
              {/* Media Section in Popup */}
              {activePopup.mediaUrl && (
                <div className={activePopup.text ? "notice-media-col" : "notice-media-full"}>
                   {(() => {
                    const embed = getEmbedUrl(activePopup.mediaUrl!)
                    // Render Video
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
                    // Render YouTube Iframe
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
                    // Render Image
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
              {/* Text Content Section */}
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