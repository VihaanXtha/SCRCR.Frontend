import { useEffect, useState } from 'react'
import type { NewsItem } from '../types/content'
import { fetchNews, createNews, updateNews, deleteNews, uploadImage, reorderContent } from '../services/content'
import { AdminFormActions } from './components/AdminFormActions'

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [newNews, setNewNews] = useState<Omit<NewsItem, '_id'>>({ title: '', text: '', img: '', active: true, popup: false })
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Drag state
  const [draggedItem, setDraggedItem] = useState<NewsItem | null>(null)

  useEffect(() => {
    fetchNews().then(setNews).catch(() => setNews([]))
  }, [])

  const onSubmit = async (asDraft = false) => {
    try {
      const payload = { ...newNews, active: asDraft ? false : newNews.active }
      
      if (editingId) {
        const updated = await updateNews(editingId, payload)
        setNews(news.map(n => n._id === editingId ? updated : n))
        setEditingId(null)
      } else {
        const created = await createNews(payload)
        setNews([created, ...news])
      }
      setNewNews({ title: '', text: '', img: '', active: true, popup: false })
    } catch {
      alert(editingId ? 'Failed to update news' : 'Failed to create news')
    }
  }

  const onEdit = (n: NewsItem) => {
    if (!n._id) return
    setEditingId(n._id)
    setNewNews({
      title: n.title,
      text: n.text,
      img: n.img,
      active: n.active,
      popup: n.popup
    })
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onCancelEdit = () => {
    setEditingId(null)
    setNewNews({ title: '', text: '', img: '', active: true, popup: false })
  }

  const onDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this news item?')) return
    try {
      await deleteNews(id)
      setNews(news.filter(n => n._id !== id))
      if (editingId === id) onCancelEdit()
    } catch {
      alert('Failed to delete news')
    }
  }

  const onToggleActive = async (n: NewsItem) => {
    if (!n._id) return
    try {
      const updated = await updateNews(n._id, { ...n, active: !n.active })
      setNews(news.map(x => x._id === updated._id ? updated : x))
    } catch {
      alert('Update failed')
    }
  }

  // Drag Handlers
  const onDragStart = (e: React.DragEvent, item: NewsItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const draggedOverItem = news[index]
    if (draggedItem === draggedOverItem) return
    
    const items = news.filter(item => item !== draggedItem)
    items.splice(index, 0, draggedItem!)
    setNews(items)
  }

  const onDragEnd = async () => {
    setDraggedItem(null)
    const updates = news.map((n, i) => ({ id: n._id!, rank: i })).filter(u => u.id)
    try {
      await reorderContent('news', updates)
    } catch (e: any) {
      alert(e.message || 'Failed to save order')
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage News</h3>
      
      <div className="admin-grid">
        <div className="form-card">
          <h4>Add News</h4>
          <input 
            placeholder="Title" 
            value={newNews.title} 
            onChange={e => setNewNews({ ...newNews, title: e.target.value })} 
          />
          <textarea 
            placeholder="Text" 
            value={newNews.text} 
            onChange={e => setNewNews({ ...newNews, text: e.target.value })} 
          />
          <div className="form-group">
            <label>Image</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={async e => {
                if (e.target.files?.[0]) {
                  try {
                    const { url } = await uploadImage(e.target.files[0])
                    setNewNews({ ...newNews, img: url })
                  } catch {
                    alert('Upload failed')
                  }
                }
              }} 
            />
            {newNews.img && <img src={newNews.img} alt="Preview" style={{ height: 60, marginTop: 5, objectFit: 'cover' }} />}
          </div>
          <label>
            <input 
              type="checkbox" 
              checked={newNews.active} 
              onChange={e => setNewNews({ ...newNews, active: e.target.checked })} 
            /> Active
          </label>
          
          <AdminFormActions 
            onPublish={() => onSubmit(false)}
            onSaveDraft={() => onSubmit(true)}
            onCancel={editingId ? onCancelEdit : undefined}
            isEditing={!!editingId}
          />
        </div>

        <div className="list-card">
          <h4>News List</h4>
          {news.map((n, index) => (
            <div 
              key={n._id} 
              className="list-item"
              draggable
              onDragStart={(e) => onDragStart(e, n)}
              onDragOver={(e) => onDragOver(e, index)}
              onDragEnd={onDragEnd}
              style={{ cursor: 'move', opacity: draggedItem === n ? 0.5 : 1 }}
            >
              <div className="view-item">
                <div className="info">
                  <strong>{n.title}</strong>
                  <span className={`status ${n.active ? 'active' : 'inactive'}`}>
                    {n.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="actions">
                  <button className="btn sm" onClick={() => onEdit(n)}>Edit</button>
                  <button className="btn sm" onClick={() => onToggleActive(n)}>
                    {n.active ? 'Hide' : 'Show'}
                  </button>
                  <button className="btn sm danger" onClick={() => onDelete(n._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
