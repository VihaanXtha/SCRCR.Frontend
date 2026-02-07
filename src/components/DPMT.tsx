import '../App.css'
import { useRef, useEffect } from 'react'

export default function DPMT({ staff, t }: { staff: { name: string; role: string; img: string }[]; t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const autoScrollTimer = useRef<NodeJS.Timeout | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    const maxScroll = el.scrollWidth - el.clientWidth
    
    let newScrollLeft = dir === 'left' ? el.scrollLeft - amount : el.scrollLeft + amount
    
    // Loop back to start if at end
    if (dir === 'right' && el.scrollLeft >= maxScroll - 10) {
      newScrollLeft = 0
    }
    // Loop to end if at start
    if (dir === 'left' && el.scrollLeft <= 0) {
      newScrollLeft = maxScroll
    }

    el.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  // Auto-scroll logic
  useEffect(() => {
    const startAutoScroll = () => {
      autoScrollTimer.current = setInterval(() => {
        scroll('right')
      }, 3000) // Scroll every 3 seconds
    }

    startAutoScroll()

    return () => {
      if (autoScrollTimer.current) clearInterval(autoScrollTimer.current)
    }
  }, [])

  // Pause on hover
  const onMouseEnter = () => {
    if (autoScrollTimer.current) clearInterval(autoScrollTimer.current)
  }

  const onMouseLeave = () => {
    autoScrollTimer.current = setInterval(() => {
      scroll('right')
    }, 3000)
  }

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
