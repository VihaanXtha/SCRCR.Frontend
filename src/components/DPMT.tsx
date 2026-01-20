import '../App.css'
import { useRef } from 'react'

type Person = { name: string; role: string; img: string }

export default function StaffSection({ staff, t }: { staff: Person[]; t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollTo({ left: dir === 'left' ? el.scrollLeft - amount : el.scrollLeft + amount, behavior: 'smooth' })
  }
  return (
    <section className="section">
      <h3>{t('dpmt.title')}</h3>
      <div className="carousel-controls">
        <button className="btn sm" onClick={() => scroll('left')}>‹</button>
        <button className="btn sm" onClick={() => scroll('right')}>›</button>
      </div>
      <div className="carousel" ref={ref}>
        {staff.map(s => (
          <div key={s.name} className="profile">
            <img src={s.img} alt={s.name} />
            <div className="profile-name">{s.name}</div>
            <div className="profile-role">{s.role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
