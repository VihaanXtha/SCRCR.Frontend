import '../App.css'
import { useRef } from 'react'
import { useAutoScroll } from '../hooks/useAutoScroll'

export default function DPMT({ staff, t }: { staff: { name: string; role: string; img: string }[]; t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scroll, onMouseEnter, onMouseLeave } = useAutoScroll(ref)

  return (
    <section className="section" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <h3>{t('dpmt.title')}</h3>
      <div className="carousel-controls">
        <button className="btn sm" onClick={() => scroll('left')}>‹</button>
        <button className="btn sm" onClick={() => scroll('right')}>›</button>
      </div>
      <div className="carousel" ref={ref} style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {staff.map((s, i) => (
          <div key={`${s.name}-${i}`} className="profile" style={{ scrollSnapAlign: 'start', flexShrink: 0 }}>
            <img src={s.img} alt={s.name} />
            <div className="profile-name">{s.name}</div>
            <div className="profile-role">{s.role}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
