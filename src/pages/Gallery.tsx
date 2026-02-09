import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import FolderCard from '../components/FolderCard'
import type { GalleryItem, MemoryAlbum } from '../types/content'
import { fetchGallery, fetchMemoryAlbums, fetchAlbumImages } from '../services/content'
import { getOptimizedUrl } from '../utils/image'
import bannerImg from '../assets/images/hero-slider/scrc-slider-9-1.png'
import AnimatedSection from '../components/AnimatedSection'

// Define filter types for the gallery view
type FilterType = 'all' | 'photo' | 'video' | 'album'

// Gallery Component: Displays a collection of photos, videos, and albums
export default function Gallery({ t }: { t: (k: string) => string }) {
  // State variables to store fetched content
  const [videos, setVideos] = useState<GalleryItem[]>([])
  const [photos, setPhotos] = useState<GalleryItem[]>([])
  const [albums, setAlbums] = useState<MemoryAlbum[]>([])
  // State to track the active filter
  const [filter, setFilter] = useState<FilterType>('all')
  
  // Album view state: tracks which album is currently open and its images
  const [activeAlbum, setActiveAlbum] = useState<string>('')
  const [albumImages, setAlbumImages] = useState<string[]>([])

  // State to track the currently active item for the popup modal
  const [activePopup, setActivePopup] = useState<{ type: 'image' | 'video' | 'iframe', src: string, title?: string } | null>(null)

  // Fetch all gallery data when component mounts
  useEffect(() => {
    Promise.all([
      fetchGallery(),
      fetchMemoryAlbums()
    ]).then(([items, albumData]) => {
      // Filter items into photos and videos
      setVideos(items.filter(i => (i.type ?? 'video') === 'video'))
      setPhotos(items.filter(i => i.type === 'image'))
      setAlbums(albumData)
    }).catch(() => {
      // Handle errors by clearing state
      setVideos([])
      setPhotos([])
      setAlbums([])
    })
  }, [])

  // Helper function to convert video URLs into embeddable format
  const toEmbed = (url: string) => {
    try {
      // Check for Cloudinary or direct video files
      if (url.includes('cloudinary') || url.match(/\.(mp4|webm|mov)$/i)) {
        return { type: 'video', src: getOptimizedUrl(url, { quality: 'auto' }) }
      }

      // Handle YouTube URLs
      const u = new URL(url)
      if (u.hostname.includes('youtu.be')) return { type: 'iframe', src: `https://www.youtube.com/embed/${u.pathname.slice(1)}` }
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v')
        if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` }
        // Handle YouTube Shorts
        const parts = u.pathname.split('/')
        const idx = parts.findIndex(p => p === 'shorts')
        if (idx !== -1 && parts[idx + 1]) return { type: 'iframe', src: `https://www.youtube.com/embed/${parts[idx + 1]}` }
      }
      // Default fallback
      return { type: 'iframe', src: url }
    } catch {
      return { type: 'iframe', src: url }
    }
  }

  // Render function for the Photos section
  const renderPhotos = () => (
    <div className="mb-16">
      {/* Show header only when viewing 'all' to avoid redundancy */}
      {(filter === 'all') && (
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             {t('home.moments')}
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('gallery.filter.photo')}</h3>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((p, i) => (
          <div 
            key={p._id ?? i} 
            className="relative group overflow-hidden rounded-[1.5rem] shadow-md hover:shadow-xl transition-all aspect-square cursor-pointer bg-white"
            onClick={() => setActivePopup({ type: 'image', src: p.img || '', title: p.title })}
          >
            {p.img && (
              <img 
                src={getOptimizedUrl(p.img, { width: 400, height: 400, fit: 'cover' })} 
                alt={p.title ?? 'photo'} 
                loading="lazy"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            )}
            {/* Overlay title on hover */}
            {p.title && (
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                 <span className="text-white text-sm font-bold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">{p.title}</span>
               </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  // Render function for the Videos section
  const renderVideos = () => (
    <div className="mb-16">
      {(filter === 'all') && (
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             {t('gallery.watch')}
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('gallery.filter.video')}</h3>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-8">
        {videos.map((v, i) => {
           const embed = toEmbed(v.videoUrl ?? '')
           return (
            <div 
              key={v._id ?? i} 
              className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100 group cursor-pointer relative"
              onClick={() => setActivePopup({ type: embed.type as any, src: embed.src, title: v.title })}
            >
              <div className="aspect-video w-full relative">
                {/* Overlay to intercept clicks */}
                <div className="absolute inset-0 z-10 bg-transparent"></div>
                {embed.type === 'video' ? (
                  <video 
                    src={embed.src} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe 
                    src={embed.src} 
                    title={v.title ?? 'video'} 
                    className="w-full h-full border-0"
                  />
                )}
                {/* Play Icon Overlay */}
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors pointer-events-none">
                   <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center text-[#e43f6f] shadow-lg transform group-hover:scale-110 transition-transform">
                     <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><path d="M8 5v14l11-7z"/></svg>
                   </div>
                </div>
              </div>
              <div className="p-6">
                <div className="font-bold text-lg text-gray-800 line-clamp-2 group-hover:text-[#e43f6f] transition-colors">{v.title || t('gallery.untitled_video')}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  // Render function for the Albums section
  const renderAlbums = () => (
    <div className="mb-16">
      {(filter === 'all') && (
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             {t('gallery.collections')}
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('gallery.filter.album')}</h3>
        </div>
      )}
      {/* Grid of Album Folders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {albums.map(a => (
          <div key={a.name} className="transform transition-transform hover:-translate-y-1">
            <FolderCard
              name={a.name}
              count={a.count}
              cover={getOptimizedUrl(a.cover || '', { width: 300, height: 300, fit: 'cover' })}
              active={activeAlbum === a.name}
              onClick={async () => {
                // Toggle album: close if open, else open and fetch images
                if (activeAlbum === a.name) {
                  setActiveAlbum('')
                  setAlbumImages([])
                  return
                }
                setActiveAlbum(a.name)
                const imgs = await fetchAlbumImages(a.name)
                setAlbumImages(imgs.map(img => img.url))
              }}
            />
          </div>
        ))}
      </div>
      
      {/* Display images of the currently active album */}
      {activeAlbum && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 animate-fade-in">
          {albumImages.map((u, i) => (
            <div 
              key={i} 
              className="relative group overflow-hidden rounded-[1.5rem] shadow-md hover:shadow-xl transition-all aspect-square bg-white cursor-pointer"
              onClick={() => setActivePopup({ type: 'image', src: u, title: activeAlbum })}
            >
              <img 
                src={getOptimizedUrl(u, { width: 400, height: 400, fit: 'cover' })} 
                alt={'a' + i} 
                loading="lazy"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="page pb-20">
      <SubHero title={t('nav.gallery')} img={bannerImg} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Filter Navigation Buttons */}
        <div className="flex overflow-x-auto md:flex-wrap justify-start md:justify-center gap-3 mb-12 pb-2">
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'all' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            {t('gallery.filter.all')}
          </button>
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'photo' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('photo')}
          >
            {t('gallery.filter.photo')}
          </button>
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'video' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('video')}
          >
            {t('gallery.filter.video')}
          </button>
          <button 
            className={`whitespace-nowrap shrink-0 px-6 py-2 rounded-full font-bold transition-all ${filter === 'album' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('album')}
          >
            {t('gallery.filter.album')}
          </button>
        </div>

        {/* Animated container for gallery content */}
        <AnimatedSection className="w-full" type="fade-up">
          {(filter === 'all' || filter === 'photo') && renderPhotos()}
          {(filter === 'all' || filter === 'video') && renderVideos()}
          {(filter === 'all' || filter === 'album') && renderAlbums()}
        </AnimatedSection>
      </div>

      {/* Media Detail Popup Modal */}
      {activePopup && (
        <div className="member-modal" onClick={() => setActivePopup(null)}>
          <div className="notice-modal-content wide" onClick={e => e.stopPropagation()}>
            <div className="notice-header">
              <div className="notice-title line-clamp-1">{activePopup.title || t('gallery.filter.photo')}</div>
              <button className="notice-close" onClick={() => setActivePopup(null)}>×</button>
            </div>
            <div className="notice-body-single">
              <div className="notice-media-full bg-black/5 rounded-xl overflow-hidden flex items-center justify-center">
                {activePopup.type === 'video' ? (
                   <video 
                     src={activePopup.src} 
                     controls 
                     autoPlay 
                     className="w-full max-h-[70vh] object-contain"
                   />
                ) : activePopup.type === 'iframe' ? (
                   <iframe 
                     src={activePopup.src} 
                     title={activePopup.title || 'video'} 
                     className="w-full aspect-video border-0"
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowFullScreen 
                   />
                ) : (
                   <img 
                     src={getOptimizedUrl(activePopup.src, { width: 1200 })} 
                     alt={activePopup.title || 'gallery-image'} 
                     className="w-full max-h-[70vh] object-contain"
                   />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}