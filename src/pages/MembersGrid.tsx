import '../App.css'

import SubHero from '../components/SubHero'
import MemberDetail from '../components/MemberDetail'
import { getOptimizedUrl } from '../utils/image'

import { useState } from 'react'
import type { Member } from '../types/members'

 

export default function MembersGrid({ title, members, t }: { title: string; members: Member[]; t: (k: string) => string }) {
  const [selected, setSelected] = useState<Member | null>(null)
  return (
    <div className="page">
      <SubHero title={title} solid />
      <div className="members-grid">
        {members.map((m, i) => (
          <div key={`${m.name}-${i}`} className="member-card" onClick={() => setSelected(m)}>
            {m.img && (
              <img 
                src={getOptimizedUrl(m.img, { width: 300, height: 300, fit: 'cover' })} 
                alt={m.name} 
                loading="lazy"
                width="300"
                height="300"
              />
            )}
            <div className="member-name">{m.name}</div>
          </div>
        ))}
      </div>
      {selected && (
        <MemberDetail member={selected} onClose={() => setSelected(null)} t={t} />
      )}
    </div>
  )
}
