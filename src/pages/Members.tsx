import '../App.css'
import { useEffect, useState } from 'react'
import SubHero from '../components/SubHero'
import MemberDetail from '../components/MemberDetail'
import { getOptimizedUrl } from '../utils/image'
import bannerImg from '../assets/images/hero-slider/scrc-slider-1-1.jpg'
import type { Member } from '../types/members'
import { fetchMembers } from '../services/members'

type MemberType = 'Founding' | 'Lifetime' | 'Senior-Citizen' | 'donation' | 'helper'

export default function Members({ t }: { t: (k: string) => string }) {
  const [activeTab, setActiveTab] = useState<MemberType>('Founding')
  const [membersCache, setMembersCache] = useState<Record<MemberType, Member[]>>({
    'Founding': [],
    'Lifetime': [],
    'Senior-Citizen': [],
    'donation': [],
    'helper': []
  })
  const [loading, setLoading] = useState(false)
  const [selected, setSelected] = useState<Member | null>(null)

  const tabs: { id: MemberType; label: string }[] = [
    { id: 'Founding', label: t('nav.members.Founding') },
    { id: 'Lifetime', label: t('nav.members.Lifetime') },
    { id: 'Senior-Citizen', label: t('nav.members.Senior-Citizen') },
    { id: 'donation', label: t('nav.members.donation') },
    { id: 'helper', label: t('nav.members.Helping') }
  ]

  useEffect(() => {
    // Fetch data for the active tab if not already cached (or empty)
    if (membersCache[activeTab].length === 0) {
      setLoading(true)
      fetchMembers(activeTab)
        .then(data => {
          setMembersCache(prev => ({ ...prev, [activeTab]: data }))
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [activeTab])

  return (
    <div className="page">
      <SubHero title={t('nav.members')} img={bannerImg} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-12">
        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 px-1">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              className={`flex-1 md:flex-none shrink-0 px-4 py-3 md:px-6 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${
                activeTab === tab.id 
                  ? 'bg-[#e43f6f] text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Members Grid */}
        {loading && membersCache[activeTab].length === 0 ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#e43f6f]"></div>
          </div>
        ) : (
          <>
             {membersCache[activeTab].length === 0 ? (
                <div className="text-center py-20 text-gray-500">{t('members.no_found')}</div>
             ) : (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                 {membersCache[activeTab].map((m, i) => (
                   <div 
                     key={`${m.name}-${i}`} 
                     className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-gray-100 transform hover:-translate-y-2"
                     onClick={() => setSelected(m)}
                   >
                     <div className="aspect-square overflow-hidden relative bg-gray-100">
                       {m.img ? (
                         <img 
                           src={getOptimizedUrl(m.img, { width: 400, height: 400, fit: 'cover' })} 
                           alt={m.name} 
                           loading="lazy"
                           className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                         />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-300">
                           <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                         <span className="text-white font-bold tracking-wider text-sm uppercase">{t('members.view_details')}</span>
                       </div>
                     </div>
                     <div className="p-4 text-center">
                       <h3 className="font-bold text-gray-800 group-hover:text-[#e43f6f] transition-colors line-clamp-1">{m.name}</h3>
                       {m.type && <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">{t(`nav.members.${activeTab}`)}</p>}
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </>
        )}
      </div>

      {selected && (
        <MemberDetail member={selected} onClose={() => setSelected(null)} t={t} />
      )}
    </div>
  )
}
