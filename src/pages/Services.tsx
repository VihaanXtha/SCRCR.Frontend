
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-5-1.png'

export default function Services({ t }: { t: (k: string) => string }) {
  const services = [
    { title: t('services.health.title'), icon: '🏥', desc: t('services.health.desc') },
    { title: t('services.legal.title'), icon: '⚖️', desc: t('services.legal.desc') },
    { title: t('services.daycare.title'), icon: '🏠', desc: t('services.daycare.desc') },
    { title: t('services.emergency.title'), icon: '🚑', desc: t('services.emergency.desc') },
  ]

  return (
    <div className="page">
      <SubHero title={t('services.title')} img={bannerImg} />
      
      <div className="section">
        <div className="grid">
          {services.map(s => (
            <div key={s.title} className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>{s.icon}</div>
              <h3 className="card-title">{s.title}</h3>
              <p style={{ color: '#666' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section band" style={{ flexWrap: 'wrap' }}>
        <div className="band-left" style={{ flex: '1 1 300px' }}>
          <h3 className="band-title">{t('services.emergency.contact.title')}</h3>
          <p>{t('services.emergency.contact.desc')}</p>
        </div>
        <div style={{ display: 'grid', placeItems: 'center', flex: '1 1 auto' }}>
          <a href="tel:+9779800000000" className="btn" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', whiteSpace: 'nowrap' }}>📞 +977 9800000000</a>
        </div>
      </div>
    </div>
  )
}
