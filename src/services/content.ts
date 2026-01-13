import type { NewsItem, GalleryItem, NoticeItem, MemoryAlbum } from '../types/content'

type EnvMeta = { env?: { VITE_API_BASE?: string } }
const base = (import.meta as unknown as EnvMeta).env?.VITE_API_BASE || 'https://scrcr.onrender.com'

function getToken(): string | undefined {
  try { return localStorage.getItem('adminToken') ?? undefined } catch { return undefined }
}
function absolute(u: string): string {
  if (!u) return u
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/')) return `${base}${u}`
  return u
}

export async function fetchNews(params?: { active?: boolean; popup?: boolean }): Promise<NewsItem[]> {
  const qs = new URLSearchParams()
  if (params?.active) qs.set('active', 'true')
  if (params?.popup) qs.set('popup', 'true')
  const res = await fetch(`${base}/api/news${qs.toString() ? `?${qs.toString()}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch news')
  return res.json()
}
export async function createNews(body: Omit<NewsItem, '_id'>): Promise<NewsItem> {
  const res = await fetch(`${base}/api/news`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to create news')
  return res.json()
}
export async function updateNews(id: string, body: Partial<NewsItem>): Promise<NewsItem> {
  const res = await fetch(`${base}/api/news/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to update news')
  return res.json()
}
export async function deleteNews(id: string): Promise<NewsItem> {
  const res = await fetch(`${base}/api/news/${id}`, {
    method: 'DELETE',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) }
  })
  if (!res.ok) throw new Error('Failed to delete news')
  return res.json()
}

export async function fetchGallery(): Promise<GalleryItem[]> {
  const res = await fetch(`${base}/api/gallery`)
  if (!res.ok) throw new Error('Failed to fetch gallery')
  return res.json()
}
export async function fetchMemories(): Promise<string[]> {
  const res = await fetch(`${base}/api/memories`)
  if (!res.ok) throw new Error('Failed to fetch memories')
  const items: string[] = await res.json()
  return items.map(absolute)
}
export async function fetchMemoryAlbums(): Promise<MemoryAlbum[]> {
  const res = await fetch(`${base}/api/memories/albums`)
  if (!res.ok) throw new Error('Failed to fetch albums')
  const albums: MemoryAlbum[] = await res.json()
  return albums.map(a => ({ ...a, cover: a.cover ? absolute(a.cover) : undefined }))
}
export async function createMemoryAlbum(name: string): Promise<{ name: string }> {
  const res = await fetch(`${base}/api/memories/albums`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify({ name })
  })
  if (!res.ok) throw new Error('Failed to create album')
  return res.json()
}
export async function deleteMemoryAlbum(name: string): Promise<{ ok: true }> {
  const res = await fetch(`${base}/api/memories/albums/${encodeURIComponent(name)}`, {
    method: 'DELETE',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) }
  })
  if (!res.ok) throw new Error('Failed to delete album')
  return res.json()
}
export async function fetchAlbumImages(name: string): Promise<string[]> {
  const res = await fetch(`${base}/api/memories/${encodeURIComponent(name)}`)
  if (!res.ok) throw new Error('Failed to fetch album images')
  const items: string[] = await res.json()
  return items.map(absolute)
}
export async function uploadAlbumImages(name: string, files: File[]): Promise<{ uploaded: string[] }> {
  const fd = new FormData()
  files.forEach(f => fd.append('images', f))
  const res = await fetch(`${base}/api/memories/${encodeURIComponent(name)}/upload`, {
    method: 'POST',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: fd
  })
  if (!res.ok) throw new Error('Failed to upload images')
  const data: { uploaded: string[] } = await res.json()
  return { uploaded: data.uploaded.map(absolute) }
}
export async function deleteAlbumImage(name: string, filename: string): Promise<{ ok: true }> {
  const res = await fetch(`${base}/api/memories/${encodeURIComponent(name)}/${encodeURIComponent(filename)}`, {
    method: 'DELETE',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) }
  })
  if (!res.ok) throw new Error('Failed to delete image')
  return res.json()
}
export async function createGallery(body: Omit<GalleryItem, '_id'>): Promise<GalleryItem> {
  const res = await fetch(`${base}/api/gallery`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to create gallery item')
  return res.json()
}
export async function updateGallery(id: string, body: Partial<GalleryItem>): Promise<GalleryItem> {
  const res = await fetch(`${base}/api/gallery/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to update gallery item')
  return res.json()
}
export async function deleteGallery(id: string): Promise<GalleryItem> {
  const res = await fetch(`${base}/api/gallery/${id}`, {
    method: 'DELETE',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) }
  })
  if (!res.ok) throw new Error('Failed to delete gallery item')
  return res.json()
}

export async function fetchNotices(params?: { active?: boolean; popup?: boolean }): Promise<NoticeItem[]> {
  const qs = new URLSearchParams()
  if (params?.active) qs.set('active', 'true')
  if (params?.popup) qs.set('popup', 'true')
  const res = await fetch(`${base}/api/notices${qs.toString() ? `?${qs.toString()}` : ''}`)
  if (!res.ok) throw new Error('Failed to fetch notices')
  return res.json()
}
export async function createNotice(body: Omit<NoticeItem, '_id'>): Promise<NoticeItem> {
  const res = await fetch(`${base}/api/notices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to create notice')
  return res.json()
}
export async function updateNotice(id: string, body: Partial<NoticeItem>): Promise<NoticeItem> {
  const res = await fetch(`${base}/api/notices/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: JSON.stringify(body)
  })
  if (!res.ok) throw new Error('Failed to update notice')
  return res.json()
}
export async function deleteNotice(id: string): Promise<NoticeItem> {
  const res = await fetch(`${base}/api/notices/${id}`, {
    method: 'DELETE',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) }
  })
  if (!res.ok) throw new Error('Failed to delete notice')
  return res.json()
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const fd = new FormData()
  fd.append('image', file)
  const res = await fetch(`${base}/api/upload`, {
    method: 'POST',
    headers: { ...(getToken() ? { 'x-admin-token': getToken()! } : {}) },
    body: fd
  })
  if (!res.ok) throw new Error('Failed to upload image')
  const data = await res.json()
  return { url: absolute(data.url) }
}
