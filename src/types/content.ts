export type NewsItem = { _id?: string; title: string; text: string; img: string; publishedAt?: string; active: boolean; popup: boolean }
export type GalleryItem = { _id?: string; type?: 'video' | 'image'; img?: string; videoUrl?: string; title?: string }
export type NoticeItem = { _id?: string; title: string; text: string; mediaUrl?: string; active: boolean; popup: boolean }
export type MemoryAlbum = { name: string; count: number; cover?: string }
