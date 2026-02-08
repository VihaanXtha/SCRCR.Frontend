
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-5-1.png'

export default function Services({ t }: { t: (k: string) => string }) {
  const services = [
    { title: 'Health Support', icon: '🏥', desc: 'Regular health camps, medicine distribution, and emergency medical assistance for seniors.' },
    { title: 'Legal Aid', icon: '⚖️', desc: 'Free legal counseling and support for senior citizens regarding property and rights.' },
    { title: 'Day Care Center', icon: '🏠', desc: 'A safe and engaging environment for seniors to spend their day with peers.' },
    { title: 'Emergency Response', icon: '🚑', desc: '24/7 emergency contact and ambulance coordination for members.' },
  ]

  return (
    <div className="page">
      <SubHero title="Services & Support" img={bannerImg} />
      
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
          <h3 className="band-title">{t('services.emergency.title') || 'Emergency Contact'}</h3>
          <p>{t('services.emergency.desc') || 'For immediate assistance, please contact our emergency hotline.'}</p>
        </div>
        <div style={{ display: 'grid', placeItems: 'center', flex: '1 1 auto' }}>
          <a href="tel:+9779800000000" className="btn" style={{ fontSize: 'clamp(1rem, 4vw, 1.25rem)', whiteSpace: 'nowrap' }}>📞 +977 9800000000</a>
        </div>
      </div>
    </div>
  )
}
