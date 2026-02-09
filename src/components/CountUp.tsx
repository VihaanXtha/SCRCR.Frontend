import { useEffect, useState, useRef } from 'react'

const englishToNepaliMap: Record<string, string> = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९'
}

const toNepali = (num: number | string): string => {
  return num.toString().split('').map(c => englishToNepaliMap[c] || c).join('')
}

interface CountUpProps {
  end: number
  duration?: number
  lang?: 'en' | 'ne'
  suffix?: string
  prefix?: string
}

export default function CountUp({ end, duration = 2000, lang = 'en', suffix = '', prefix = '' }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      // Ease out quart
      const easeProgress = 1 - Math.pow(1 - progress, 4)
      
      setCount(Math.floor(easeProgress * end))
      
      if (progress < 1) {
        window.requestAnimationFrame(step)
      }
    }
    window.requestAnimationFrame(step)
  }, [isVisible, end, duration])

  const displayCount = lang === 'ne' ? toNepali(count) : count.toLocaleString()

  return (
    <span ref={ref}>
      {prefix}{displayCount}{suffix}
    </span>
  )
}
