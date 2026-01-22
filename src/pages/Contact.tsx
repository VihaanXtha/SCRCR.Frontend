
import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'

export default function Contact({ t }: { t: (k: string) => string }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    try {
      const res = await fetch('https://scrcr-backend.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok) throw new Error('Failed to send')
      
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  return (
    <div className="page">
      <SubHero title={t('nav.contact')} img="https://placehold.co/1600x420" />
      <div className="contact-layout">
        <div className="contact-details">
          <h3>{t('contact.details')}</h3>
          <div className="detail-item">📍 {t('band.addr')}</div>
          <div className="detail-item">✉️ {t('band.email')}</div>
          <div className="detail-item">📞 {t('band.phone')}</div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <h3>{t('contact.formTitle')}</h3>
          <input name="name" value={formData.name} onChange={handleChange} placeholder={t('contact.name')} required />
          <input name="email" value={formData.email} onChange={handleChange} placeholder={t('contact.email')} type="email" required />
          <input name="phone" value={formData.phone} onChange={handleChange} placeholder={t('contact.phone')} required />
          <textarea name="message" value={formData.message} onChange={handleChange} placeholder={t('contact.message')} rows={6} required />
          
          <button className="btn" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending...' : t('contact.send')}
          </button>
          
          {status === 'success' && <p style={{ color: 'green', marginTop: '10px' }}>Message sent successfully!</p>}
          {status === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Failed to send message. Please try again.</p>}
        </form>
      </div>
    
    </div>
  )
}
