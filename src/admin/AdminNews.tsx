import { useEffect, useState } from 'react'
import type { NewsItem } from '../types/content'
import { fetchNews, createNews, updateNews, deleteNews, uploadImage } from '../services/content'

export default function AdminNews() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [newNews, setNewNews] = useState<Omit<NewsItem, '_id'>>({ title: '', text: '', img: '', active: true, popup: false })

  useEffect(() => {
    fetchNews().then(setNews).catch(() => setNews([]))
  }, [])

  const onCreate = async () => {
    try {
      const created = await createNews(newNews)
      setNews([created, ...news])
      setNewNews({ title: '', text: '', img: '', active: true, popup: false })
    } catch {
      alert('Failed to create news')
    }
  }

  const onDelete = async (id?: string) => {
    if (!id) return
    try {
      await deleteNews(id)
      setNews(news.filter(n => n._id !== id))
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
          <button className="btn sm" onClick={onCreate}>Publish</button>
        </div>

        <div className="list-card">
          <h4>News List</h4>
          {news.map(n => (
            <div key={n._id} className="list-item">
              <div className="view-item">
                <div className="info">
                  <strong>{n.title}</strong>
                  <span className={`status ${n.active ? 'active' : 'inactive'}`}>
                    {n.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="actions">
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
