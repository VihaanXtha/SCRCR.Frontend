import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import type { NoticeItem } from '../types/content'
import { fetchNotices } from '../services/content'

export default function Notices({ t }: { t: (k: string) => string }) {
  const [items, setItems] = useState<NoticeItem[]>([])
  useEffect(() => {
    fetchNotices().then(setItems).catch(() => setItems([]))
  }, [])
  return (
    <div className="page">
      <SubHero title={t('nav.notices')} img="https://placehold.co/1600x420" />
      <div className="posts">
        {items.map(n => (
          <div key={n._id ?? n.title} className="notice-card">
            <div className="post-title">{n.title}</div>
            <div className="post-text">{n.text}</div>
            <div className="post-date">{n.active ? 'Active' : 'Inactive'}{n.popup ? ' • Popup' : ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
