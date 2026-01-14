import { useEffect, useState } from 'react'
import type { NoticeItem } from '../types/content'
import { fetchNotices, createNotice, updateNotice, deleteNotice, uploadImage, reorderContent } from '../services/content'
import { AdminFormActions } from './components/AdminFormActions'

export default function AdminNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [newNotice, setNewNotice] = useState<Omit<NoticeItem, '_id'>>({ title: '', text: '', mediaUrl: '', active: true, popup: false })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image')
  const [draggedItem, setDraggedItem] = useState<NoticeItem | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'image' | 'video'>('all')
  
  // Helper to detect media type
  const getMediaType = (url?: string) => {
    if (!url) return 'text'
    if (url.includes('youtube') || url.includes('youtu.be')) return 'video'
    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(url)) return 'image'
    return 'link'
  }

  const filteredNotices = notices.filter(n => {
    if (viewMode === 'all') return true
    const type = getMediaType(n.mediaUrl)
    return viewMode === 'video' ? type === 'video' : type === 'image'
  })

  useEffect(() => {
    fetchNotices().then(setNotices).catch(() => setNotices([]))
  }, [])

  const onSubmit = async (asDraft = false) => {
    try {
      const payload = { ...newNotice, active: asDraft ? false : newNotice.active }
      if (editingId) {
        const updated = await updateNotice(editingId, payload)
        setNotices(notices.map(n => n._id === editingId ? updated : n))
        setEditingId(null)
      } else {
        const created = await createNotice(payload)
        setNotices([created, ...notices])
      }
      setNewNotice({ title: '', text: '', mediaUrl: '', active: true, popup: false })
    } catch {
      alert(editingId ? 'Failed to update notice' : 'Failed to create notice')
    }
  }

  const onEdit = (n: NoticeItem) => {
    if (!n._id) return
    setEditingId(n._id)
    setNewNotice({
      title: n.title,
      text: n.text,
      mediaUrl: n.mediaUrl,
      active: n.active,
      popup: n.popup
    })
    
    // Auto-detect media type for the tab
    if (n.mediaUrl && (n.mediaUrl.includes('youtube') || n.mediaUrl.includes('youtu.be'))) {
      setMediaType('video')
    } else {
      setMediaType('image')
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onCancelEdit = () => {
    setEditingId(null)
    setNewNotice({ title: '', text: '', mediaUrl: '', active: true, popup: false })
  }

  const onDelete = async (id?: string) => {
    if (!id) return
    if (!confirm('Are you sure you want to delete this notice?')) return
    try {
      await deleteNotice(id)
      setNotices(notices.filter(n => n._id !== id))
      if (editingId === id) onCancelEdit()
    } catch {
      alert('Failed to delete')
    }
  }

  const onTogglePopup = async (n: NoticeItem) => {
    if (!n._id) return
    try {
      const updated = await updateNotice(n._id, { ...n, popup: !n.popup })
      setNotices(notices.map(x => x._id === updated._id ? updated : x))
    } catch {
      alert('Update failed')
    }
  }

  const onToggleActive = async (n: NoticeItem) => {
    if (!n._id) return
    try {
      const updated = await updateNotice(n._id, { ...n, active: !n.active })
      setNotices(notices.map(x => x._id === updated._id ? updated : x))
    } catch {
      alert('Update failed')
    }
  }

  const onDragStart = (e: React.DragEvent, item: NoticeItem) => {
    setDraggedItem(item)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const draggedOverItem = notices[index]
    if (draggedItem === draggedOverItem) return
    
    const items = notices.filter(item => item !== draggedItem)
    items.splice(index, 0, draggedItem!)
    setNotices(items)
  }

  const onDragEnd = async () => {
    setDraggedItem(null)
    const updates = notices.map((n, i) => ({ id: n._id!, rank: i })).filter(u => u.id)
    try {
      await reorderContent('notices', updates)
    } catch (e: any) {
      alert(e.message || 'Failed to save order')
    }
  }

  return (
    <div className="admin-section">
      <h3>Manage Notices</h3>
      
      <div className="admin-grid">
        <div className="form-card">
          <h4>Add Notice</h4>
          <input 
            placeholder="Title" 
            value={newNotice.title} 
            onChange={e => setNewNotice({ ...newNotice, title: e.target.value })} 
          />
          <textarea 
            placeholder="Text" 
            value={newNotice.text} 
            onChange={e => setNewNotice({ ...newNotice, text: e.target.value })} 
          />
          
          <div className="tabs" style={{ marginBottom: 15 }}>
            <button className={`tab ${mediaType === 'image' ? 'active' : ''}`} onClick={() => setMediaType('image')}>Image Upload</button>
            <button className={`tab ${mediaType === 'video' ? 'active' : ''}`} onClick={() => setMediaType('video')}>Video URL</button>
          </div>

          {mediaType === 'video' ? (
            <input 
              placeholder="Video URL (YouTube, etc)" 
              value={newNotice.mediaUrl || ''} 
              onChange={e => setNewNotice({ ...newNotice, mediaUrl: e.target.value })} 
            />
          ) : (
            <div className="form-group">
              <label>Notice Image</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={async e => {
                  if (e.target.files?.[0]) {
                    try {
                      const { url } = await uploadImage(e.target.files[0])
                      setNewNotice({ ...newNotice, mediaUrl: url })
                    } catch {
                      alert('Upload failed')
                    }
                  }
                }} 
              />
              {newNotice.mediaUrl && !newNotice.mediaUrl.includes('youtube') && (
                <img src={newNotice.mediaUrl} alt="Preview" style={{ height: 60, marginTop: 5, objectFit: 'cover' }} />
              )}
            </div>
          )}

          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={newNotice.active} 
                onChange={e => setNewNotice({ ...newNotice, active: e.target.checked })} 
              /> Active
            </label>
            <label>
              <input 
                type="checkbox" 
                checked={newNotice.popup} 
                onChange={e => setNewNotice({ ...newNotice, popup: e.target.checked })} 
              /> Popup
            </label>
          </div>
          
          <AdminFormActions 
            onPublish={() => onSubmit(false)}
            onSaveDraft={() => onSubmit(true)}
            onCancel={editingId ? onCancelEdit : undefined}
            isEditing={!!editingId}
          />
        </div>

        <div className="list-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
             <h4>Notices List</h4>
             <div className="toggle-switch">
                <button className={viewMode === 'all' ? 'active' : ''} onClick={() => setViewMode('all')}>All</button>
                <button className={viewMode === 'video' ? 'active' : ''} onClick={() => setViewMode('video')}>Videos</button>
                <button className={viewMode === 'image' ? 'active' : ''} onClick={() => setViewMode('image')}>Images</button>
             </div>
          </div>
          
          {filteredNotices.map((n, index) => (
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
                  {n.mediaUrl && (
                    <div style={{ marginTop: 6 }}>
                      {/\.(jpg|jpeg|png|gif|webp)$/i.test(n.mediaUrl) ? (
                        <img src={n.mediaUrl} alt={n.title} style={{ height: 40, borderRadius: 4, objectFit: 'cover' }} />
                      ) : (
                        <a href={n.mediaUrl} target="_blank" rel="noreferrer">Open Media</a>
                      )}
                    </div>
                  )}
                  <div className="badges">
                    {n.popup && <span className="badge popup">Popup</span>}
                    {n.active && <span className="badge active">Active</span>}
                  </div>
                </div>
                <div className="actions">
                  <button className="btn sm" onClick={() => onEdit(n)}>Edit</button>
                  <button className="btn sm" onClick={() => onToggleActive(n)}>
                    {n.active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button className="btn sm" onClick={() => onTogglePopup(n)}>
                    {n.popup ? 'Remove Popup' : 'Make Popup'}
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
