
import '../App.css'
import React from 'react'
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
            <h3 className="text-xl font-bold text-gray-800 mb-4">{t('membership.process.title')}</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
              <li>{t('membership.process.step1')}</li>
              <li>{t('membership.process.step2')}</li>
              <li>{t('membership.process.step3')}</li>
              <li>{t('membership.process.step4')}</li>
              <li>{t('membership.process.step5')}</li>
            </ul>

            {/* Membership Benefits */}
            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">{t('membership.benefits.title')}</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 leading-relaxed">
              <li>{t('membership.benefit1')}</li>
              <li>{t('membership.benefit2')}</li>
              <li>{t('membership.benefit3')}</li>
              <li>{t('membership.benefit4')}</li>
            </ul>
          </div>

          {/* Application Form */}
          <form className="contact-form bg-white p-6 rounded-2xl shadow-lg border border-gray-100" onSubmit={handleSubmit}>
            <h3 className="text-xl font-bold text-gray-800 mb-6">{t('membership.form.title')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input name="fname" type="text" placeholder={t('membership.form.fname')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
              <input name="mname" type="text" placeholder={t('membership.form.mname')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
              <input name="lname" type="text" placeholder={t('membership.form.lname')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input name="dob" type="date" placeholder={t('membership.form.dob')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
              <input name="citizenship_no" type="text" placeholder={t('membership.form.citizenship')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
              <select name="gender" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors">
                <option value="Male">{t('membership.form.male')}</option>
                <option value="Female">{t('membership.form.female')}</option>
                <option value="Other">{t('membership.form.other')}</option>
              </select>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <input name="address" type="text" placeholder={t('membership.form.address')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
              <input name="phone" type="tel" placeholder={t('membership.form.phone')} required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
              <input name="email" type="email" placeholder={t('membership.form.email')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#e43f6f] transition-colors" />
            </div>
            
            <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-200">
              <p className="m-0 text-sm text-orange-800 font-bold flex items-start gap-2">
                <span>⚠️</span>
                <span>Important: Please attach your Photo and Citizenship Copy to the email that will open after clicking Submit.</span>
              </p>
            </div>

            <button className="btn w-full mt-6 py-4 text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">{t('membership.form.submit')}</button>
          </form>
        </div>
      </div>
    </div>
  )
}
