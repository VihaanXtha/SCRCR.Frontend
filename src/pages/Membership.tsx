
import SubHero from '../components/SubHero'
import { useState } from 'react'

export default function Membership({ t }: { t: (k: string) => string }) {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const form = e.target as HTMLFormElement
    const formData = new FormData(form)

    try {
      const res = await fetch('https://scrcr-backend.vercel.app/api/membership', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Failed to submit')
      alert('Application submitted successfully! We will contact you soon.')
      form.reset()
    } catch (error) {
      alert('Failed to submit application. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <SubHero title={t('membership.title')} img="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80" />
      
      <div className="section">
        <div className="contact-layout">
          <div>
            <h3>{t('membership.process.title')}</h3>
            <ul style={{ lineHeight: '1.8', color: '#555', paddingLeft: '20px' }}>
              <li>{t('membership.process.step1')}</li>
              <li>{t('membership.process.step2')}</li>
              <li>{t('membership.process.step3')}</li>
              <li>{t('membership.process.step4')}</li>
              <li>{t('membership.process.step5')}</li>
            </ul>

            <h3 style={{ marginTop: '24px' }}>{t('membership.benefits.title')}</h3>
            <ul style={{ lineHeight: '1.8', color: '#555', paddingLeft: '20px' }}>
              <li>{t('membership.benefit1')}</li>
              <li>{t('membership.benefit2')}</li>
              <li>{t('membership.benefit3')}</li>
              <li>{t('membership.benefit4')}</li>
            </ul>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 style={{ margin: 0 }}>{t('membership.form.title')}</h3>
            <div className="form-row">
              <input name="fname" type="text" placeholder={t('membership.form.fname')} required />
              <input name="mname" type="text" placeholder={t('membership.form.mname')} />
              <input name="lname" type="text" placeholder={t('membership.form.lname')} required />
            </div>
            <div className="form-row">
              <input name="dob" type="date" placeholder={t('membership.form.dob')} required />
              <input name="citizenship_no" type="text" placeholder={t('membership.form.citizenship')} required />
              <select name="gender" style={{ padding: '10px', border: '1px solid #ddd', borderRadius: '8px' }}>
                <option value="Male">{t('membership.form.male')}</option>
                <option value="Female">{t('membership.form.female')}</option>
                <option value="Other">{t('membership.form.other')}</option>
              </select>
            </div>
            <input name="address" type="text" placeholder={t('membership.form.address')} required />
            <input name="phone" type="tel" placeholder={t('membership.form.phone')} required />
            <input name="email" type="email" placeholder={t('membership.form.email')} />
            
            <label style={{ fontSize: '14px', color: '#666', marginTop: '10px', display: 'block' }}>{t('membership.form.photo')}</label>
            <input name="photo" type="file" accept="image/*" required />
            
            <label style={{ fontSize: '14px', color: '#666', marginTop: '10px', display: 'block' }}>{t('membership.form.citizenship_copy')}</label>
            <input name="citizenship" type="file" accept="image/*,application/pdf" required />

            <button className="btn" style={{ marginTop: '16px' }} disabled={loading}>{loading ? 'Submitting...' : t('membership.form.submit')}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
