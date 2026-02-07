import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import FolderCard from '../components/FolderCard'
import type { GalleryItem, MemoryAlbum } from '../types/content'
import { fetchGallery, fetchMemoryAlbums, fetchAlbumImages } from '../services/content'
import { getOptimizedUrl } from '../utils/image'

export default function Gallery({ t }: { t: (k: string) => string }) {
  const [videos, setVideos] = useState<GalleryItem[]>([])
  const [photos, setPhotos] = useState<GalleryItem[]>([])
  const [albums, setAlbums] = useState<MemoryAlbum[]>([])
  const [active, setActive] = useState<string>('')
  const [albumImages, setAlbumImages] = useState<string[]>([])
  useEffect(() => {
    fetchGallery().then(items => {
      setVideos(items.filter(i => (i.type ?? 'video') === 'video'))
      setPhotos(items.filter(i => i.type === 'image'))
    }).catch(() => {
      setVideos([])
      setPhotos([])
    })
    fetchMemoryAlbums().then(setAlbums).catch(() => setAlbums([]))
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
  return (
    <div className="page pb-20">
      <SubHero title={t('nav.gallery')} img="https://placehold.co/1600x420" />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             MOMENTS
           </span>
           <h3 className="text-3xl md:text-4xl font-bold text-gray-800">{t('gallery.title')}</h3>
        </div>
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
      
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             VIDEOS
           </span>
           <h3 className="text-3xl md:text-4xl font-bold text-gray-800">{t('gallery.video')}</h3>
        </div>
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
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <iframe 
                      src={embed.src} 
                      title={v.title ?? 'video'} 
                      style={{ width: '100%', height: '100%', border: 0 }}
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

      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             COLLECTIONS
           </span>
           <h3 className="text-3xl md:text-4xl font-bold text-gray-800">Albums</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {albums.map(a => (
            <div key={a.name} className="transform transition-transform hover:-translate-y-1">
              <FolderCard
                name={a.name}
                count={a.count}
                cover={getOptimizedUrl(a.cover || '', { width: 300, height: 300, fit: 'cover' })}
                active={active === a.name}
                onClick={async () => {
                  if (active === a.name) {
                    setActive('')
                    setAlbumImages([])
                    return
                  }
                  setActive(a.name)
                  const imgs = await fetchAlbumImages(a.name)
                  setAlbumImages(imgs.map(img => img.url))
                }}
              />
            </div>
          ))}
        </div>
        {active && (
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
    </div>
  )
}
