import { useEffect, useState, useRef } from 'react'
import type { MemoryAlbum } from '../types/content'
import { fetchMemoryAlbums, createMemoryAlbum, deleteMemoryAlbum, fetchAlbumImages, uploadAlbumImages, deleteAlbumImage } from '../services/content'

export default function AdminMemories() {
  const [albums, setAlbums] = useState<MemoryAlbum[]>([])
  const [activeAlbum, setActiveAlbum] = useState<string>('')
  const [albumImages, setAlbumImages] = useState<string[]>([])
  const [newAlbumName, setNewAlbumName] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchMemoryAlbums().then(setAlbums).catch(() => setAlbums([]))
  }, [])

  useEffect(() => {
    if (activeAlbum) {
      fetchAlbumImages(activeAlbum).then(setAlbumImages).catch(() => setAlbumImages([]))
    }
  }, [activeAlbum])

  const onCreateAlbum = async () => {
    if (!newAlbumName) return
    try {
      await createMemoryAlbum(newAlbumName)
      setAlbums([...albums, { name: newAlbumName, count: 0 }])
      setNewAlbumName('')
    } catch {
      alert('Failed to create album')
    }
  }

  const onDeleteAlbum = async (name: string) => {
    if (!confirm('Delete album and all photos?')) return
    try {
      await deleteMemoryAlbum(name)
      setAlbums(albums.filter(a => a.name !== name))
      if (activeAlbum === name) setActiveAlbum('')
    } catch {
      alert('Failed to delete album')
    }
  }

  const onUpload = async () => {
    if (!fileInput.current?.files?.length) return
    const files = Array.from(fileInput.current.files)
    try {
      await uploadAlbumImages(activeAlbum, files)
      const imgs = await fetchAlbumImages(activeAlbum)
      setAlbumImages(imgs)
      if (fileInput.current) fileInput.current.value = ''
    } catch {
      alert('Upload failed')
    }
  }

  const onDeleteImage = async (img: string) => {
    try {
      await deleteAlbumImage(activeAlbum, img)
      setAlbumImages(albumImages.filter(i => i !== img))
    } catch {
      alert('Delete failed')
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Memories</h3>
      
      {!activeAlbum ? (
        <div className="admin-grid">
          <div className="form-card">
            <h4>Create Album</h4>
            <input 
              placeholder="Album Name" 
              value={newAlbumName} 
              onChange={e => setNewAlbumName(e.target.value)} 
            />
            <button className="btn sm" onClick={onCreateAlbum}>Create</button>
          </div>

          <div className="list-card">
            <h4>Albums</h4>
            {albums.map(a => (
              <div key={a.name} className="list-item">
                <div className="view-item">
                  <div className="info">
                    <strong>{a.name}</strong>
                    <small>{a.count} photos</small>
                  </div>
                  <div className="actions">
                    <button className="btn sm" onClick={() => setActiveAlbum(a.name)}>Open</button>
                    <button className="btn sm danger" onClick={() => onDeleteAlbum(a.name)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="album-view">
          <button className="btn sm secondary" onClick={() => setActiveAlbum('')}>← Back to Albums</button>
          <h4>Album: {activeAlbum}</h4>
          
          <div className="upload-box">
            <input type="file" ref={fileInput} accept="image/*" />
            <button className="btn sm" onClick={onUpload}>Upload Image</button>
          </div>

          <div className="image-grid">
            {albumImages.map(img => (
              <div key={img} className="image-card">
                <img src={img} alt="memory" />
                <button className="delete-btn" onClick={() => onDeleteImage(img.split('/').pop() || '')}>×</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
