import { useRef, useEffect, type RefObject } from 'react'

/**
 * useAutoScroll Hook
 * ------------------
 * Provides functionality for an automatic infinite scrolling carousel.
 * It handles automatic scrolling at a set interval and allows pausing on interaction.
 * 
 * @param ref - React Ref to the scrollable container element.
 * @param interval - Time in milliseconds between auto-scrolls (default: 3000ms).
 */
export function useAutoScroll(ref: RefObject<HTMLDivElement | null>, interval = 3000) {
  // Ref to store the timer ID so we can clear it later
  const timer = useRef<number | null>(null)

  /**
   * Performs the scroll action.
   * Handles wrapping around to the beginning/end for an "infinite" feel.
   * @param dir - Direction to scroll ('left' or 'right')
   */
  const scroll = (dir: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    const amount = el.clientWidth * 0.8 // Scroll 80% of view width
    const maxScroll = el.scrollWidth - el.clientWidth
    
    let newScrollLeft = dir === 'left' ? el.scrollLeft - amount : el.scrollLeft + amount
    
    // Loop logic: If at the end, jump to start; if at start, jump to end
    if (dir === 'right' && el.scrollLeft >= maxScroll - 10) {
      newScrollLeft = 0
    }
    if (dir === 'left' && el.scrollLeft <= 0) {
      newScrollLeft = maxScroll
    }

    el.scrollTo({ left: newScrollLeft, behavior: 'smooth' })
  }

  // Starts the auto-scroll timer
  const startAutoScroll = () => {
    if (timer.current) clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      scroll('right')
    }, interval)
  }

  // Stops the auto-scroll timer (e.g., when user hovers)
  const stopAutoScroll = () => {
    if (timer.current) {
      clearInterval(timer.current)
      timer.current = null
    }
  }

  // Effect to start scrolling on mount and cleanup on unmount
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
