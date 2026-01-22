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
    <div className="page">
      <SubHero title={t('nav.gallery')} img="https://placehold.co/1600x420" />
      
      <div className="section">
        <h3>{t('gallery.title')}</h3>
        <div className="gallery-grid">
          {photos.map((p, i) => (
            <div key={p._id ?? i} className="card">
              {p.img && (
                <img 
                  src={getOptimizedUrl(p.img, { width: 400, height: 300, fit: 'cover' })} 
                  alt={p.title ?? 'photo'} 
                  loading="lazy"
                />
              )}
              {p.title && <div className="card-title">{p.title}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <h3>{t('gallery.video')}</h3>
        <div className="video-grid">
          {videos.map((v, i) => {
             const embed = toEmbed(v.videoUrl ?? '')
             return (
              <div key={v._id ?? i} className="video-card">
                {embed.type === 'video' ? (
                  <video 
                    src={embed.src} 
                    controls 
                    preload="metadata" 
                    style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }} 
                  />
                ) : (
                  <iframe 
                    src={embed.src} 
                    title={v.title ?? 'video'} 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen 
                  />
                )}
                <div className="video-info">
                  <div className="video-title">{v.title || 'Untitled Video'}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className="section">
        <h3>Albums</h3>
        <div className="gallery-grid">
          {albums.map(a => (
            <FolderCard
              key={a.name}
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
                // imgs is now MemoryImage[], not string[]
                setAlbumImages(imgs.map(img => img.url))
              }}
            />
          ))}
        </div>
        {active && (
          <div className="gallery-grid">
            {albumImages.map((u, i) => (
              <img 
                key={i} 
                src={getOptimizedUrl(u, { width: 400, height: 300, fit: 'cover' })} 
                alt={'a' + i} 
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
