import { useEffect, useState } from 'react'
import type { NoticeItem } from '../types/content'
import { fetchNotices, createNotice, updateNotice, deleteNotice } from '../services/content'

export default function AdminNotices() {
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [newNotice, setNewNotice] = useState<Omit<NoticeItem, '_id'>>({ title: '', text: '', mediaUrl: '', active: true, popup: false })

  useEffect(() => {
    fetchNotices().then(setNotices).catch(() => setNotices([]))
  }, [])

  const onCreate = async () => {
    try {
      const created = await createNotice(newNotice)
      setNotices([created, ...notices])
      setNewNotice({ title: '', text: '', mediaUrl: '', active: true, popup: false })
    } catch {
      alert('Failed to create notice')
    }
  }

  const onDelete = async (id?: string) => {
    if (!id) return
    try {
      await deleteNotice(id)
      setNotices(notices.filter(n => n._id !== id))
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
          <input 
            placeholder="Image or Video URL" 
            value={newNotice.mediaUrl || ''} 
            onChange={e => setNewNotice({ ...newNotice, mediaUrl: e.target.value })} 
          />
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
          <button className="btn sm" onClick={onCreate}>Create</button>
        </div>

        <div className="list-card">
          <h4>Notices List</h4>
          {notices.map(n => (
            <div key={n._id} className="list-item">
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
