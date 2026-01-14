import type { NewsItem, GalleryItem, NoticeItem, MemoryAlbum } from '../types/content'

type EnvMeta = { env?: { VITE_API_BASE?: string } }
const base = (import.meta as unknown as EnvMeta).env?.VITE_API_BASE || 'https://scrcr-backend.vercel.app'

function getToken(): string | undefined {
  try { return localStorage.getItem('adminToken') ?? undefined } catch { return undefined }
}
function absolute(u: string): string {
  if (!u) return u
  if (/^https?:\/\//i.test(u)) return u
  if (u.startsWith('/')) return `${base}${u}`
  return u
}

const TIMEOUT_MS = 8000
async function requestJson<T>(input: string, init?: RequestInit, fallback?: T): Promise<T> {
  try {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
    const res = await fetch(input, { ...(init || {}), signal: controller.signal })
    clearTimeout(timer)
    if (!res.ok) {
      if (fallback !== undefined) return fallback
      throw new Error(`Request failed: ${res.status}`)
    }
    return res.json()
  } catch {
    if (fallback !== undefined) return fallback
    throw new Error('Network error')
  }
}

export async function fetchNews(params?: { active?: boolean; popup?: boolean }): Promise<NewsItem[]> {
  const qs = new URLSearchParams()
  if (params?.active) qs.set('active', 'true')
  if (params?.popup) qs.set('popup', 'true')
  return requestJson<NewsItem[]>(`${base}/api/news${qs.toString() ? `?${qs.toString()}` : ''}`, undefined, [])
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
  return requestJson<GalleryItem[]>(`${base}/api/gallery`, undefined, [])
}
export async function fetchMemories(): Promise<string[]> {
  const items: string[] = await requestJson<string[]>(`${base}/api/memories`, undefined, [])
  return items.map(absolute)
}
export async function fetchMemoryAlbums(): Promise<MemoryAlbum[]> {
  const albums: MemoryAlbum[] = await requestJson<MemoryAlbum[]>(`${base}/api/memories/albums`, undefined, [])
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
  const items: string[] = await requestJson<string[]>(`${base}/api/memories/${encodeURIComponent(name)}`, undefined, [])
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
  return requestJson<NoticeItem[]>(`${base}/api/notices${qs.toString() ? `?${qs.toString()}` : ''}`, undefined, [])
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

export async function reorderContent(resource: 'news' | 'gallery' | 'notices', updates: { id: string; rank: number }[]): Promise<void> {
  const res = await fetch(`${base}/api/${resource}/reorder`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(getToken() ? { 'x-admin-token': getToken()! } : {})
    },
    body: JSON.stringify({ updates })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error || `Failed to reorder ${resource}`)
  }
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
