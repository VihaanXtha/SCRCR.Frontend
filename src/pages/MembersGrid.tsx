import '../App.css'

import SubHero from '../components/SubHero'
import MemberDetail from '../components/MemberDetail'

import { useState } from 'react'
import type { Member } from '../types/members'

 

export default function MembersGrid({ title, members, t }: { title: string; members: Member[]; t: (k: string) => string }) {
  const [selected, setSelected] = useState<Member | null>(null)
  return (
    <div className="page">
      <SubHero title={title} solid />
      <div className="members-grid">
        {members.map(m => (
          <div key={m.name} className="member-card" onClick={() => setSelected(m)}>
            <img src={m.img} alt={m.name} />
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
