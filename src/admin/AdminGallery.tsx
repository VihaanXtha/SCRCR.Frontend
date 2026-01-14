import { useEffect, useState } from 'react'
import type { GalleryItem } from '../types/content'
import { fetchGallery, createGallery, deleteGallery, uploadImage, reorderContent } from '../services/content'

export default function AdminGallery() {
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [newGallery, setNewGallery] = useState<Omit<GalleryItem, '_id'>>({ type: 'image', videoUrl: '', title: '', img: '' })
  const [draggedItem, setDraggedItem] = useState<GalleryItem | null>(null)

  useEffect(() => {
    fetchGallery().then(setGallery).catch(() => setGallery([]))
  }, [])

  const onCreate = async () => {
    try {
      const created = await createGallery(newGallery)
      setGallery([created, ...gallery])
      setNewGallery({ type: 'image', videoUrl: '', title: '', img: '' })
    } catch {
      alert('Failed to add gallery item')
    }
  }

  const onDelete = async (id?: string) => {
    if (!id) return
    try {
      await deleteGallery(id)
      setGallery(gallery.filter(g => g._id !== id))
    } catch {
      alert('Failed to delete')
    }
  }

  const onDragStart = (e: React.DragEvent, item: GalleryItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const draggedOverItem = gallery[index]
    if (draggedItem === draggedOverItem) return
    
    const items = gallery.filter(item => item !== draggedItem)
    items.splice(index, 0, draggedItem!)
    setGallery(items)
  }

  const onDragEnd = async () => {
    setDraggedItem(null)
    const updates = gallery.map((g, i) => ({ id: g._id!, rank: i })).filter(u => u.id)
    try {
      await reorderContent('gallery', updates)
    } catch (e: any) {
      alert(e.message || 'Failed to save order')
    }
  }

  const [viewMode, setViewMode] = useState<'video' | 'image'>('video')
  
  return (
    <div className="admin-section">
      <h3>Manage Gallery</h3>
      
      <div className="admin-grid">
        <div className="form-card">
          <h4>Add Item</h4>
          <div className="tabs" style={{ marginBottom: 15 }}>
            <button className={`tab ${newGallery.type === 'image' ? 'active' : ''}`} onClick={() => setNewGallery({ ...newGallery, type: 'image' })}>Image</button>
            <button className={`tab ${newGallery.type === 'video' ? 'active' : ''}`} onClick={() => setNewGallery({ ...newGallery, type: 'video' })}>Video</button>
          </div>

          {newGallery.type === 'video' ? (
            <input 
              placeholder="Video URL (YouTube)" 
              value={newGallery.videoUrl} 
              onChange={e => setNewGallery({ ...newGallery, videoUrl: e.target.value })} 
            />
          ) : (
            <div className="form-group">
              <label>Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={async e => {
                  if (e.target.files?.[0]) {
                    try {
                      const { url } = await uploadImage(e.target.files[0])
                      setNewGallery({ ...newGallery, img: url })
                    } catch {
                      alert('Upload failed')
                    }
                  }
                }} 
              />
              {newGallery.img && <img src={newGallery.img} alt="Preview" style={{ height: 60, marginTop: 5, objectFit: 'cover' }} />}
            </div>
          )}

          <input 
            placeholder="Title" 
            value={newGallery.title} 
            onChange={e => setNewGallery({ ...newGallery, title: e.target.value })} 
          />
          <button className="btn sm" onClick={onCreate}>Add {newGallery.type === 'image' ? 'Image' : 'Video'}</button>
        </div>

          <div className="list-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
               <h4>Gallery Items</h4>
               <div className="toggle-switch">
                  <button className={viewMode === 'video' ? 'active' : ''} onClick={() => setViewMode('video')}>Videos</button>
                  <button className={viewMode === 'image' ? 'active' : ''} onClick={() => setViewMode('image')}>Images</button>
               </div>
            </div>

            {gallery.filter(g => g.type === viewMode).map((g, index) => (
              <div 
                key={g._id} 
                className="list-item"
                draggable
                onDragStart={(e) => onDragStart(e, g)}
                onDragOver={(e) => onDragOver(e, index)}
                onDragEnd={onDragEnd}
                style={{ cursor: 'move', opacity: draggedItem === g ? 0.5 : 1 }}
              >
                <div className="view-item">
                  <div className="info">
                    <strong>{g.title || 'Untitled'}</strong>
                    <small>{g.type === 'video' ? 'Video' : 'Image'}</small>
                    {g.type === 'image' && g.img && <img src={g.img} alt="thumb" style={{ height: 30, marginLeft: 10 }} />}
                  </div>
                  <div className="actions">
                    <button className="btn sm" onClick={() => {
                        setNewGallery(g)
                        onDelete(g._id)
                    }}>Edit</button>
                    <button className="btn sm danger" onClick={() => onDelete(g._id)}>Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  )
}
