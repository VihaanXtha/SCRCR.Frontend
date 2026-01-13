import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import type { NewsItem } from '../types/content'
import { fetchNews } from '../services/content'

export default function News({ t }: { t: (k: string) => string }) {
  const [items, setItems] = useState<NewsItem[]>([])
  useEffect(() => {
    fetchNews().then(setItems).catch(() => setItems([]))
  }, [])
  return (
    <div className="page">
      <SubHero title={t('nav.news')} img="https://placehold.co/1600x420" />
      <div className="posts">
        {items.map(p => (
          <div key={p._id ?? p.title} className="post-card">
            {p.img && <img src={p.img} alt={p.title} style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: '4px 4px 0 0' }} />}
            <div style={{ padding: 15 }}>
              <div className="post-title">{p.title}</div>
              <div className="post-text">{p.text && p.text.length > 100 ? p.text.slice(0, 100) + '...' : p.text}</div>
              <a className="post-link" href="#/news">{t('news.read_more')}</a>
              <div className="post-date">{p.publishedAt ? new Date(p.publishedAt).toLocaleDateString() : ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
