
import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-8-1.jpg'

// Membership Component: Handles membership application process and displays benefits
export default function Membership({ t }: { t: (k: string) => string }) {
  // State to manage loading status during form submission
  const [loading, setLoading] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      // Send form data (including files) to backend
      const res = await fetch('https://scrcr-backend.vercel.app/api/membership', {
        method: 'POST',
        body: formData
      })
      
      if (!res.ok) throw new Error('Failed to submit')
      
      // Show success message and reset form
      alert(t('membership.submit_success'))
      form.reset()
    } catch (error) {
      // Show error message
      alert(t('membership.submit_error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <SubHero title={t('membership.title')} img={bannerImg} />
      
      <div className="section">
        <div className="contact-layout">
          {/* Information Column */}
          <div>
            {/* Membership Process Steps */}
            <h3>{t('membership.process.title')}</h3>
            <ul style={{ lineHeight: '1.8', color: '#555', paddingLeft: '20px' }}>
              <li>{t('membership.process.step1')}</li>
              <li>{t('membership.process.step2')}</li>
              <li>{t('membership.process.step3')}</li>
              <li>{t('membership.process.step4')}</li>
              <li>{t('membership.process.step5')}</li>
            </ul>

            {/* Membership Benefits */}
            <h3 style={{ marginTop: '24px' }}>{t('membership.benefits.title')}</h3>
            <ul style={{ lineHeight: '1.8', color: '#555', paddingLeft: '20px' }}>
              <li>{t('membership.benefit1')}</li>
              <li>{t('membership.benefit2')}</li>
              <li>{t('membership.benefit3')}</li>
              <li>{t('membership.benefit4')}</li>
            </ul>
          </div>

          {/* Application Form */}
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

            <button className="btn" style={{ marginTop: '16px' }} disabled={loading}>{loading ? t('membership.submitting') : t('membership.form.submit')}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
