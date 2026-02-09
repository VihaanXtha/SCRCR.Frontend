import '../App.css'
import { useRef } from 'react'
import { useAutoScroll } from '../hooks/useAutoScroll'

// Type definition for DPMT members (supports English and Nepali fields)
type Person = { name: string; nameEn?: string; role: string; roleEn?: string; img: string }

/**
 * DPMT (Daily Program Management Team) Component
 * ----------------------------------------------
 * Similar to StaffSection, this displays the management committee members in a carousel.
 * 
 * Props:
 * @param {Person[]} staff - List of committee members.
 * @param {function} t - Translation function.
 * @param {string} lang - Current language.
 */
export default function DPMT({ staff, t, lang }: { staff: Person[]; t: (k: string) => string; lang: 'en' | 'ne' }) {
  const ref = useRef<HTMLDivElement>(null)
  // Use custom hook for auto-scrolling functionality
  const { scroll, onMouseEnter, onMouseLeave } = useAutoScroll(ref)

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
       <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             {t('dpmt.our_committee')}
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('dpmt.title')}</h3>
        </div>
      
      {/* Navigation Buttons */}
      <div className="carousel-controls flex justify-end gap-2 mb-4 px-4">
        <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => scroll('left')}>‹</button>
        <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => scroll('right')}>›</button>
      </div>
      
      {/* Scrollable Container */}
      <div className="carousel flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4" ref={ref} style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {staff.map((s, i) => (
          <div key={`${s.name}-${i}`} className="min-w-[280px] snap-start bg-white rounded-[2rem] p-6 shadow-lg border border-pink-50 hover:shadow-xl transition-all text-center group/card">
            <div className="relative w-[200px] h-[200px] mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#e43f6f] to-[#c6285b]">
               <img src={s.img} alt={s.name} className="w-full h-full object-cover rounded-full border-4 border-white" />
            </div>
            {/* Bilingual Name */}
            <div className="font-bold text-lg text-gray-800 group-hover/card:text-[#e43f6f] transition-colors mb-1">
              {lang === 'en' ? (s.nameEn || s.name) : s.name}
            </div>
            {/* Bilingual Role */}
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide bg-gray-50 inline-block px-3 py-1 rounded-full">
              {lang === 'en' ? (s.roleEn || s.role) : s.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
