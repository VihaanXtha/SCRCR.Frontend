import { useEffect, useState } from 'react'
import type { MemoryAlbum } from '../types/content'
import { fetchMemoryAlbums, createMemoryAlbum, deleteMemoryAlbum } from '../services/content'
import { MemoryAlbumEditor } from './components/MemoryAlbumEditor'

export default function AdminMemories() {
  const [albums, setAlbums] = useState<MemoryAlbum[]>([])
  const [activeAlbum, setActiveAlbum] = useState<string>('')
  const [newAlbumName, setNewAlbumName] = useState('')

  useEffect(() => {
    fetchMemoryAlbums().then(setAlbums).catch(() => setAlbums([]))
  }, [])

  // Refresh albums when returning from editor to update counts
  useEffect(() => {
    if (!activeAlbum) {
      fetchMemoryAlbums().then(setAlbums).catch(() => setAlbums([]))
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
        <MemoryAlbumEditor 
          albumName={activeAlbum} 
          onBack={() => setActiveAlbum('')} 
        />
      )}
    </div>
  )
}
