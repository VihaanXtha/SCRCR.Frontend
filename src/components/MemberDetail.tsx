import '../App.css'
import type { Member } from '../types/members'

export default function MemberDetail({ member, onClose, t }: {
  member: Member
  onClose: () => void
  t: (k: string) => string
}) {
  return (
    <div className="member-modal" onClick={onClose}>
      <div className="member-modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{member.name}</h3>
          <button className="btn sm" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-left">
            <img src={member.img} alt={member.name} />
          </div>
          <div className="modal-right">
            <div className="detail-grid">
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('contact.name')}>👤</span> {member.name}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.occupation')}>💼</span> {member.details?.occupation ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.type')}>🏷️</span> <span style={{ textTransform: 'capitalize' }}>{member.type}</span></div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('band.phone')}>📞</span> {member.details?.phone ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('band.email')}>✉️</span> {member.details?.email ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.permAddr')}>🏠</span> {member.details?.permanentAddress ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.tempAddr')}>📍</span> {member.details?.temporaryAddress ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.dob')}>🎂</span> {member.details?.dateOfBirth ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.father')}>👨‍👧</span> {member.details?.father ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.mother')}>👩‍👧</span> {member.details?.mother ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.gf')}>👴</span> {member.details?.grandfather ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.gm')}>👵</span> {member.details?.grandmother ?? '—'}</div>
              <div className="detail-row"><span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }} title={t('member.amount')}>💰</span> {member.details?.donationAmount ?? '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
