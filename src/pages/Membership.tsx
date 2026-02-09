
import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-8-1.jpg'

// Membership Component: Handles membership application process and displays benefits
export default function Membership({ t }: { t: (k: string) => string }) {
  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries()) as Record<string, string>
    
    const subject = `Membership Application - ${data.fname} ${data.lname}`
    const body = `Name: ${data.fname} ${data.mname || ''} ${data.lname}%0ADOB: ${data.dob}%0ACitizenship No: ${data.citizenship_no}%0AGender: ${data.gender}%0AAddress: ${data.address}%0APhone: ${data.phone}%0AEmail: ${data.email}%0A%0ANOTE: Please attach your Photo and Citizenship Copy to this email.`
    
    window.location.href = `mailto:${t('band.email')}?subject=${subject}&body=${body}`
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
            
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff8e1', borderRadius: '8px', border: '1px solid #ffe0b2' }}>
              <p style={{ margin: 0, fontSize: '14px', color: '#d84315', fontWeight: 'bold' }}>
                ⚠️ Important: Please attach your Photo and Citizenship Copy to the email that will open after clicking Submit.
              </p>
            </div>

            <button className="btn" style={{ marginTop: '16px' }}>{t('membership.form.submit')}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
