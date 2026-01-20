import '../App.css'
import { useEffect, useState } from 'react'
import MembersGrid from './MembersGrid'
import type { Member } from '../types/members'
import { fetchMembers } from '../services/members'

export default function Helping({ t }: { t: (k: string) => string }) {
  const [members, setMembers] = useState<Member[]>([])
  useEffect(() => {
    fetchMembers('helper').then(setMembers).catch(() => setMembers([]))
  }, [])
  return <MembersGrid title={t('nav.members.Helping')} members={members} t={t} />
}
