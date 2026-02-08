import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import FolderCard from '../components/FolderCard'
import type { GalleryItem, MemoryAlbum } from '../types/content'
import { fetchGallery, fetchMemoryAlbums, fetchAlbumImages } from '../services/content'
import { getOptimizedUrl } from '../utils/image'
import bannerImg from '../assets/images/hero-slider/scrc-slider-9-1.png'
import AnimatedSection from '../components/AnimatedSection'

type FilterType = 'all' | 'photo' | 'video' | 'album'

export default function Gallery({ t }: { t: (k: string) => string }) {
  const [videos, setVideos] = useState<GalleryItem[]>([])
  const [photos, setPhotos] = useState<GalleryItem[]>([])
  const [albums, setAlbums] = useState<MemoryAlbum[]>([])
  const [filter, setFilter] = useState<FilterType>('all')
  
  // Album view state
  const [activeAlbum, setActiveAlbum] = useState<string>('')
  const [albumImages, setAlbumImages] = useState<string[]>([])

  useEffect(() => {
    Promise.all([
      fetchGallery(),
      fetchMemoryAlbums()
    ]).then(([items, albumData]) => {
      setVideos(items.filter(i => (i.type ?? 'video') === 'video'))
      setPhotos(items.filter(i => i.type === 'image'))
      setAlbums(albumData)
    }).catch(() => {
      setVideos([])
      setPhotos([])
      setAlbums([])
    })
  }, [])

  const toEmbed = (url: string) => {
    try {
      // Cloudinary / Direct Video
      if (url.includes('cloudinary') || url.match(/\.(mp4|webm|mov)$/i)) {
        return { type: 'video', src: getOptimizedUrl(url, { quality: 'auto' }) }
      }

      const u = new URL(url)
      if (u.hostname.includes('youtu.be')) return { type: 'iframe', src: `https://www.youtube.com/embed/${u.pathname.slice(1)}` }
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v')
        if (id) return { type: 'iframe', src: `https://www.youtube.com/embed/${id}` }
        const parts = u.pathname.split('/')
        const idx = parts.findIndex(p => p === 'shorts')
        if (idx !== -1 && parts[idx + 1]) return { type: 'iframe', src: `https://www.youtube.com/embed/${parts[idx + 1]}` }
      }
      return { type: 'iframe', src: url }
    } catch {
      return { type: 'iframe', src: url }
    }
  }

  const renderPhotos = () => (
    <div className="mb-16">
      {(filter === 'all') && (
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             MOMENTS
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('gallery.filter.photo')}</h3>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((p, i) => (
          <div key={p._id ?? i} className="relative group overflow-hidden rounded-[1.5rem] shadow-md hover:shadow-xl transition-all aspect-square cursor-pointer bg-white">
            {p.img && (
              <img 
                src={getOptimizedUrl(p.img, { width: 400, height: 400, fit: 'cover' })} 
                alt={p.title ?? 'photo'} 
                loading="lazy"
                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
              />
            )}
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

  const renderVideos = () => (
    <div className="mb-16">
      {(filter === 'all') && (
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             WATCH
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('gallery.filter.video')}</h3>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-8">
        {videos.map((v, i) => {
           const embed = toEmbed(v.videoUrl ?? '')
           return (
            <div key={v._id ?? i} className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all border border-gray-100">
              <div className="aspect-video w-full">
                {embed.type === 'video' ? (
                  <video 
                    src={embed.src} 
                    controls 
                    preload="metadata" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <iframe 
                    src={embed.src} 
                    title={v.title ?? 'video'} 
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                )}
              </div>
              <div className="p-6">
                <div className="font-bold text-lg text-gray-800 line-clamp-2">{v.title || 'Untitled Video'}</div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const renderAlbums = () => (
    <div className="mb-16">
      {(filter === 'all') && (
        <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             COLLECTIONS
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('gallery.filter.album')}</h3>
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {albums.map(a => (
          <div key={a.name} className="transform transition-transform hover:-translate-y-1">
            <FolderCard
              name={a.name}
              count={a.count}
              cover={getOptimizedUrl(a.cover || '', { width: 300, height: 300, fit: 'cover' })}
              active={activeAlbum === a.name}
              onClick={async () => {
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
      {activeAlbum && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 animate-fade-in">
          {albumImages.map((u, i) => (
            <div key={i} className="relative group overflow-hidden rounded-[1.5rem] shadow-md hover:shadow-xl transition-all aspect-square bg-white">
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
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'all' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('all')}
          >
            {t('gallery.filter.all')}
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'photo' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('photo')}
          >
            {t('gallery.filter.photo')}
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'video' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('video')}
          >
            {t('gallery.filter.video')}
          </button>
          <button 
            className={`px-6 py-2 rounded-full font-bold transition-all ${filter === 'album' ? 'bg-[#e43f6f] text-white shadow-lg' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setFilter('album')}
          >
            {t('gallery.filter.album')}
          </button>
        </div>

        <AnimatedSection className="w-full" type="fade-up">
          {(filter === 'all' || filter === 'photo') && renderPhotos()}
          {(filter === 'all' || filter === 'video') && renderVideos()}
          {(filter === 'all' || filter === 'album') && renderAlbums()}
        </AnimatedSection>
      </div>
    </div>
  )
}
