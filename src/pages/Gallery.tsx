import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import FolderCard from '../components/FolderCard'
import type { GalleryItem, MemoryAlbum } from '../types/content'
import { fetchGallery, fetchMemoryAlbums, fetchAlbumImages } from '../services/content'

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
      const u = new URL(url)
      if (u.hostname.includes('youtu.be')) return `https://www.youtube.com/embed/${u.pathname.slice(1)}`
      if (u.hostname.includes('youtube.com')) {
        const id = u.searchParams.get('v')
        if (id) return `https://www.youtube.com/embed/${id}`
        const parts = u.pathname.split('/')
        const idx = parts.findIndex(p => p === 'shorts')
        if (idx !== -1 && parts[idx + 1]) return `https://www.youtube.com/embed/${parts[idx + 1]}`
      }
      return url
    } catch {
      return url
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
              {p.img && <img src={p.img} alt={p.title ?? 'photo'} />}
              {p.title && <div className="card-title">{p.title}</div>}
            </div>
          ))}
        </div>
      </div>
      <div className="section">
        <h3>{t('gallery.video')}</h3>
        <div className="video-row">
          {videos.map((v, i) => (
            <iframe key={v._id ?? i} src={toEmbed(v.videoUrl ?? '')} title={v.title ?? 'video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen width={360} height={200} />
          ))}
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
              cover={a.cover}
              active={active === a.name}
              onClick={async () => {
                if (active === a.name) {
                  setActive('')
                  setAlbumImages([])
                  return
                }
                setActive(a.name)
                const imgs = await fetchAlbumImages(a.name)
                setAlbumImages(imgs)
              }}
            />
          ))}
        </div>
        {active && (
          <div className="gallery-grid">
            {albumImages.map((u, i) => (
              <img key={i} src={u} alt={'a' + i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
