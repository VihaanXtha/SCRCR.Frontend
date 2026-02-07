import { useRef, useEffect, RefObject } from 'react'

export function useAutoScroll(ref: RefObject<HTMLDivElement | null>, interval = 3000) {
  const timer = useRef<NodeJS.Timeout | null>(null)

  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    const amount = el.clientWidth * 0.8 // Scroll 80% of view width
    const maxScroll = el.scrollWidth - el.clientWidth
    
    let newScrollLeft = dir === 'left' ? el.scrollLeft - amount : el.scrollLeft + amount
    
    // Loop logic
    if (dir === 'right' && el.scrollLeft >= maxScroll - 10) {
      newScrollLeft = 0
    }
    if (dir === 'left' && el.scrollLeft <= 0) {
      newScrollLeft = maxScroll
    }

    el.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  const startAutoScroll = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = setInterval(() => {
      scroll('right')
    }, interval)
  }

  const stopAutoScroll = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  useEffect(() => {
    startAutoScroll()
    return stopAutoScroll
  }, [interval])

  return { 
    scroll, 
    onMouseEnter: stopAutoScroll, 
    onMouseLeave: startAutoScroll 
  }
}
