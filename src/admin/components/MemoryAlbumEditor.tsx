import { useState, useRef, useEffect } from 'react'
import { uploadAlbumImages, deleteAlbumImage, fetchAlbumImages, reorderContent } from '../../services/content'
import type { MemoryImage } from '../../types/content'

interface MemoryAlbumEditorProps {
  albumName: string
  onBack: () => void
}

export function MemoryAlbumEditor({ albumName, onBack }: MemoryAlbumEditorProps) {
  const [images, setImages] = useState<MemoryImage[]>([])
  const [pendingImages, setPendingImages] = useState<string[]>([])
  const [draggedImage, setDraggedImage] = useState<MemoryImage | null>(null)
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAlbumImages(albumName).then(setImages).catch(() => setImages([]))
  }, [albumName])

  const onUpload = async () => {
    if (!fileInput.current?.files?.length) return
    const files = Array.from(fileInput.current.files)
    
    // Create local previews
    const localPreviews = files.map(file => URL.createObjectURL(file))
    setPendingImages(localPreviews)

    try {
      await uploadAlbumImages(albumName, files)
      const imgs = await fetchAlbumImages(albumName)
      setImages(imgs)
      setPendingImages([]) // Clear previews
      if (fileInput.current) fileInput.current.value = ''
      
      // Revoke object URLs to avoid memory leaks
      localPreviews.forEach(url => URL.revokeObjectURL(url))
    } catch {
      alert('Upload failed')
      setPendingImages([])
      localPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }

  const onDeleteImage = async (img: MemoryImage) => {
    try {
      await deleteAlbumImage(albumName, img.url.split('/').pop() || '')
      setImages(images.filter(i => i._id !== img._id))
    } catch {
      alert('Delete failed')
    }
  }

  const onDragStart = (e: React.DragEvent, img: MemoryImage) => {
    setDraggedImage(img)
    e.dataTransfer.effectAllowed = 'move'
  }

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    const draggedOverImage = images[index]
    if (draggedImage === draggedOverImage) return
    
    const newImages = images.filter(img => img._id !== draggedImage?._id)
    newImages.splice(index, 0, draggedImage!)
    setImages(newImages)
  }

  const onDragEnd = async () => {
    setDraggedImage(null)
    const updates = images.map((img, i) => ({ id: img._id, rank: i }))
    try {
      await reorderContent('memories', updates)
    } catch {
      alert('Failed to save order')
    }
  }

  return (
    <div className="album-view">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <button className="btn sm secondary" onClick={onBack}>← Back to Albums</button>
        <h4>Album: {albumName}</h4>
        <div style={{ fontSize: '12px', color: '#666' }}>Drag images to reorder</div>
      </div>
      
      <div className="upload-box">
        <input 
          type="file" 
          ref={fileInput} 
          accept="image/*" 
          multiple 
          onChange={onUpload}
        />
      </div>

      <div className="image-grid">
        {pendingImages.map((url, i) => (
          <div key={`pending-${i}`} className="image-card pending" style={{ opacity: 0.6 }}>
            <img src={url} alt="uploading..." />
            <div className="loading-overlay" style={{ 
              position: 'absolute', inset: 0, display: 'flex', 
              alignItems: 'center', justifyContent: 'center', 
              background: 'rgba(255,255,255,0.4)', fontSize: '12px', color: '#000'
            }}>
              Uploading...
            </div>
          </div>
        ))}
        {images.map((img, index) => (
          <div 
            key={img._id} 
            className="image-card"
            draggable
            onDragStart={(e) => onDragStart(e, img)}
            onDragOver={(e) => onDragOver(e, index)}
            onDragEnd={onDragEnd}
            style={{ opacity: draggedImage === img ? 0.5 : 1, cursor: 'move' }}
          >
            <img src={img.url} alt="memory" />
            <button className="delete-btn" onClick={() => onDeleteImage(img)}>×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
