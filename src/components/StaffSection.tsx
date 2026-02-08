import '../App.css'
import { useRef } from 'react'
import { useAutoScroll } from '../hooks/useAutoScroll'

type Person = { name: string; nameEn?: string; role: string; roleEn?: string; img: string }

export default function StaffSection({ staff, t }: { staff: Person[]; t: (k: string) => string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scroll, onMouseEnter, onMouseLeave } = useAutoScroll(ref)
  const isNe = t('nav.home') === 'गृहपृष्ठ' // Hacky check for language, or pass lang prop

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
       <div className="text-center mb-8">
           <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-2 shadow-sm">
             OUR TEAM
           </span>
           <h3 className="text-3xl font-bold text-gray-800">{t('staff.title')}</h3>
        </div>
      <div className="carousel-controls flex justify-end gap-2 mb-4 px-4">
        <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => scroll('left')}>‹</button>
        <button className="btn sm bg-white shadow-md hover:bg-pink-50 border-pink-200 rounded-full w-10 h-10 flex items-center justify-center" onClick={() => scroll('right')}>›</button>
      </div>
      <div className="carousel flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide px-4" ref={ref} style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch' }}>
        {staff.map((s, i) => (
          <div key={`${s.name}-${i}`} className="min-w-[280px] snap-start bg-white rounded-[2rem] p-6 shadow-lg border border-pink-50 hover:shadow-xl transition-all text-center group/card">
            <div className="relative w-[200px] h-[200px] mx-auto mb-4 rounded-full p-1 bg-gradient-to-tr from-[#e43f6f] to-[#c6285b]">
               <img src={s.img} alt={s.name} className="w-full h-full object-cover rounded-full border-4 border-white" />
            </div>
            <div className="font-bold text-lg text-gray-800 group-hover/card:text-[#e43f6f] transition-colors mb-1">
              {isNe ? s.name : (s.nameEn || s.name)}
            </div>
            <div className="text-sm text-gray-500 font-medium uppercase tracking-wide bg-gray-50 inline-block px-3 py-1 rounded-full">
              {isNe ? s.role : (s.roleEn || s.role)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
