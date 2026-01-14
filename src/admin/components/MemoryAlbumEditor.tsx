import { useState, useRef, useEffect } from 'react'
import { uploadAlbumImages, deleteAlbumImage, fetchAlbumImages, reorderContent } from '../../services/content'
import type { MemoryImage } from '../../types/content'

interface MemoryAlbumEditorProps {
  albumName: string
  onBack: () => void
}

export function MemoryAlbumEditor({ albumName, onBack }: MemoryAlbumEditorProps) {
  const [images, setImages] = useState<MemoryImage[]>([])
  const [stagedFiles, setStagedFiles] = useState<File[]>([])
  const [draggedImage, setDraggedImage] = useState<MemoryImage | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchAlbumImages(albumName).then(setImages).catch(() => setImages([]))
  }, [albumName])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Force array conversion and update state immediately
      const newFiles = Array.from(e.target.files)
      setStagedFiles(prev => [...prev, ...newFiles])
      
      // Clear input value to allow selecting same file again
      e.target.value = ''
    }
  }

  const removeStagedFile = (index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleUploadStaged = async () => {
    if (!stagedFiles.length) return
    setUploading(true)
    
    // Batch upload to avoid payload limits (e.g., 3 images at a time)
    const BATCH_SIZE = 3
    const total = stagedFiles.length
    let uploadedCount = 0

    try {
        for (let i = 0; i < stagedFiles.length; i += BATCH_SIZE) {
            const batch = stagedFiles.slice(i, i + BATCH_SIZE)
            setProgress(`Uploading ${uploadedCount + 1}-${Math.min(uploadedCount + batch.length, total)} of ${total}...`)
            
            await uploadAlbumImages(albumName, batch)
            uploadedCount += batch.length
        }
        
        // Refresh
        const imgs = await fetchAlbumImages(albumName)
        setImages(imgs)
        setStagedFiles([])
        setProgress('')
    } catch (e) {
        alert('Some images failed to upload. Please try again.')
    } finally {
        setUploading(false)
        setProgress('')
    }
  }

  const onDeleteImage = async (img: MemoryImage) => {
    if (!confirm('Delete this image?')) return
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
      
      <div className="upload-box" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 10, display: 'flex', gap: 10 }}>
            <button className="btn sm" onClick={() => fileInput.current?.click()} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Add Images'}
            </button>
            <input 
                type="file" 
                ref={fileInput} 
                accept="image/*" 
                multiple 
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
        </div>

        {/* Staged Files Area */}
        {stagedFiles.length > 0 && (
            <div className="staged-area" style={{ background: '#f8f9fa', padding: 15, borderRadius: 8, marginBottom: 15 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                    <strong>Selected ({stagedFiles.length})</strong>
                    {uploading && <span>{progress}</span>}
                </div>
                <div className="image-grid" style={{ marginBottom: 15 }}>
                    {stagedFiles.map((file, i) => (
                        <div key={i} className="image-card staged">
                            <img src={URL.createObjectURL(file)} alt="preview" onLoad={(e) => URL.revokeObjectURL(e.currentTarget.src)} />
                            {!uploading && (
                                <button className="delete-btn" onClick={() => removeStagedFile(i)}>×</button>
                            )}
                        </div>
                    ))}
                </div>
                <button className="btn sm active" onClick={handleUploadStaged} disabled={uploading} style={{ width: '100%' }}>
                    {uploading ? 'Uploading...' : 'Confirm Upload'}
                </button>
            </div>
        )}
      </div>

      <h5 style={{ marginBottom: 10 }}>Album Images ({images.length})</h5>
      <div className="image-grid">
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
