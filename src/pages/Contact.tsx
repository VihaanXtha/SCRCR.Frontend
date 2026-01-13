import '../App.css'

import SubHero from '../components/SubHero'

export default function Contact({ t }: { t: (k: string) => string }) {
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
        <form className="contact-form">
          <h3>{t('contact.formTitle')}</h3>
          <input placeholder={t('contact.name')} />
          <input placeholder={t('contact.email')} />
          <input placeholder={t('contact.phone')} />
          <textarea placeholder={t('contact.message')} rows={6} />
          <button className="btn">{t('contact.send')}</button>
        </form>
      </div>
    
    </div>
  )
}
