import '../App.css'
import type { Member } from '../types/members'
import { useEffect } from 'react'
import { getOptimizedUrl } from '../utils/image'

export default function MemberDetail({ member, onClose, t }: {
  member: Member
  onClose: () => void
  t: (k: string) => string
}) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="member-modal" onClick={onClose}>
      <div className="member-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{member.name}</h3>
          <button className="btn sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-left">
            <img 
              src={getOptimizedUrl(member.img, { width: 600 })} 
              alt={member.name} 
              loading="lazy"
              width="600"
              height="600"
              style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }}
            />
          </div>
          <div className="modal-right">
            <div className="detail-grid">
              {member.name && <div className="detail-row"><span className="detail-icon" title={t('contact.name')}>👤</span> {member.name}</div>}
              {member.details?.occupation && <div className="detail-row"><span className="detail-icon" title={t('member.occupation')}>💼</span> {member.details.occupation}</div>}
              {member.type && <div className="detail-row"><span className="detail-icon" title={t('member.type')}>🏷️</span> <span style={{ textTransform: 'capitalize' }}>{member.type}</span></div>}
              {member.details?.phone && <div className="detail-row"><span className="detail-icon" title={t('band.phone')}>📞</span> {member.details.phone}</div>}
              {member.details?.email && <div className="detail-row"><span className="detail-icon" title={t('band.email')}>✉️</span> {member.details.email}</div>}
              {member.details?.permanentAddress && <div className="detail-row"><span className="detail-icon" title={t('member.permAddr')}>🏠</span> {member.details.permanentAddress}</div>}
              {member.details?.temporaryAddress && <div className="detail-row"><span className="detail-icon" title={t('member.tempAddr')}>📍</span> {member.details.temporaryAddress}</div>}
              {member.details?.dateOfBirth && <div className="detail-row"><span className="detail-icon" title={t('member.dob')}>🎂</span> {member.details.dateOfBirth}</div>}
              {member.details?.father && <div className="detail-row"><span className="detail-icon" title={t('member.father')}>👨‍👧</span> {member.details.father}</div>}
              {member.details?.mother && <div className="detail-row"><span className="detail-icon" title={t('member.mother')}>👩‍👧</span> {member.details.mother}</div>}
              {member.details?.grandfather && <div className="detail-row"><span className="detail-icon" title={t('member.gf')}>👴</span> {member.details.grandfather}</div>}
              {member.details?.grandmother && <div className="detail-row"><span className="detail-icon" title={t('member.gm')}>👵</span> {member.details.grandmother}</div>}
              {member.details?.donationAmount && <div className="detail-row"><span className="detail-icon" title={t('member.amount')}>💰</span> {member.details.donationAmount}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
