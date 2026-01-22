
import SubHero from '../components/SubHero'

export default function Programs({ t }: { t: (k: string) => string }) {
  return (
    <div className="page">
      <SubHero title={t('programs.title')} img="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80" />
      
      <div className="section">
        <h3>{t('programs.regular')}</h3>
        <p style={{ marginBottom: '24px', color: '#555' }}>{t('programs.desc')}</p>
        
        <div className="grid">
          <div className="card">
            <img src="https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80" alt="Yoga" />
            <div style={{ padding: '16px' }}>
              <h4 className="card-title">Daily Yoga & Meditation</h4>
              <p style={{ color: '#555', fontSize: '14px' }}>Every morning 6:00 AM - 7:30 AM</p>
            </div>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=800&q=80" alt="Health Checkup" />
            <div style={{ padding: '16px' }}>
              <h4 className="card-title">Monthly Health Checkup</h4>
              <p style={{ color: '#555', fontSize: '14px' }}>First Saturday of every month</p>
            </div>
          </div>
          <div className="card">
            <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" alt="Bhajan" />
            <div style={{ padding: '16px' }}>
              <h4 className="card-title">Bhajan Kirtan</h4>
              <p style={{ color: '#555', fontSize: '14px' }}>Every evening 5:00 PM - 7:00 PM</p>
            </div>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>{t('programs.ongoing')}</h3>
        <div className="notice-card full-width" style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', border: '1px solid #eee', padding: '16px', borderRadius: '12px' }}>
          <img src="https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=300&q=80" alt="Winter Relief" style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} />
          <div>
            <h4 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>Winter Relief Distribution Program</h4>
            <p style={{ color: '#555', marginBottom: '12px' }}>We are distributing warm clothes and blankets to senior citizens in need during this winter season.</p>
            <button className="btn sm">Learn More</button>
          </div>
        </div>
      </div>
    </div>
  )
}
