
import SubHero from '../components/SubHero'

export default function HealthInfo({ t }: { t: (k: string) => string }) {
  return (
    <div className="page">
      <SubHero title={t('health.title')} img="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80" />
      
      <div className="section">
        <h3>{t('health.tips.title')}</h3>
        <div className="grid">
          <div className="card" style={{ padding: '16px' }}>
            <h4 className="card-title">{t('health.tip1.title')}</h4>
            <p style={{ padding: '0 12px 12px', color: '#555' }}>{t('health.tip1.desc')}</p>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <h4 className="card-title">{t('health.tip2.title')}</h4>
            <p style={{ padding: '0 12px 12px', color: '#555' }}>{t('health.tip2.desc')}</p>
          </div>
          <div className="card" style={{ padding: '16px' }}>
            <h4 className="card-title">{t('health.tip3.title')}</h4>
            <p style={{ padding: '0 12px 12px', color: '#555' }}>{t('health.tip3.desc')}</p>
          </div>
        </div>
      </div>

      <div className="section">
        <h3>{t('health.gov.title')}</h3>
        <div className="contact-details">
          <div className="detail-item">
            <strong>{t('health.gov1.title')}</strong>
            <p>{t('health.gov1.desc')}</p>
          </div>
          <div className="detail-item">
            <strong>{t('health.gov2.title')}</strong>
            <p>{t('health.gov2.desc')}</p>
          </div>
          <div className="detail-item">
            <strong>{t('health.gov3.title')}</strong>
            <p>{t('health.gov3.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
