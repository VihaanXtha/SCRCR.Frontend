export type NewsItem = { _id?: string; title: string; text: string; img: string; publishedAt?: string; active: boolean; popup: boolean }
export interface GalleryItem {
  _id?: string
  id?: string // Supabase alias
  type: 'image' | 'video'
  img?: string
  videoUrl?: string
  title: string
  created_at?: string
  active?: boolean
  rank?: number
}
export type NoticeItem = { _id?: string; title: string; text: string; mediaUrl?: string; active: boolean; popup: boolean }
export type MemoryAlbum = { name: string; count: number; cover?: string }
export type MemoryImage = { _id: string; url: string; rank: number }
