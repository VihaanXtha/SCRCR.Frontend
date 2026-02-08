
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-4-1.jpeg'

export default function Downloads({ t }: { t: (k: string) => string }) {
  const reports = [
    { title: "Annual Report 2080/81", date: "2081-04-01" },
    { title: "Financial Audit 2080", date: "2081-03-15" },
    { title: "Annual Report 2079/80", date: "2080-04-01" },
  ]

  const policies = [
    { title: "SCRC Constitution 2075", date: "2075-01-01" },
    { title: "Membership Guidelines", date: "2076-05-12" },
    { title: "Code of Conduct", date: "2076-05-12" },
  ]

  const forms = [
    { title: "Membership Application Form", type: "PDF" },
    { title: "Donation Pledge Form", type: "PDF" },
    { title: "Event Registration Form", type: "PDF" },
  ]

  return (
    <div className="page">
      <SubHero title={t('downloads.title')} img={bannerImg} />
      
      <div className="section">
        <div className="grid">
          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ borderLeft: '4px solid #e43f6f', paddingLeft: '12px', marginBottom: '16px' }}>{t('downloads.reports')}</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {reports.map((item, i) => (
                <div key={i} style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.date}</div>
                  </div>
                  <button className="btn sm">{t('downloads.download_btn')}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ borderLeft: '4px solid #e43f6f', paddingLeft: '12px', marginBottom: '16px' }}>{t('downloads.policies')}</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {policies.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.date}</div>
                  </div>
                  <button className="btn sm">{t('downloads.download_btn')}</button>
                </div>
              ))}
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ borderLeft: '4px solid #e43f6f', paddingLeft: '12px', marginBottom: '16px' }}>{t('downloads.forms')}</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              {forms.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px dashed #eee', paddingBottom: '8px' }}>
                  <div>
                    <div style={{ fontWeight: '600' }}>{item.title}</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.type}</div>
                  </div>
                  <button className="btn sm">{t('downloads.download_btn')}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
