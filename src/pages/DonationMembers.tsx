import '../App.css'
import { useEffect, useState } from 'react'
import MembersGrid from './MembersGrid'
import type { Member } from '../types/members'
import { fetchMembers } from '../services/members'

export default function DonationMembers({ t }: { t: (k: string) => string }) {
  const [members, setMembers] = useState<Member[]>([])
  useEffect(() => {
    fetchMembers('donation').then(setMembers).catch(() => setMembers([]))
  }, [])
  return <MembersGrid title={t('nav.members.donation')} members={members} t={t} />
}
