import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-8-1.jpg'
import donateBanner from '../assets/images/activites/3.jpg'
import QRScan from '../assets/images/qr-payment.png'
import AnimatedSection from '../components/AnimatedSection'


// Define the available tabs for this page
type TabType = 'contact' | 'donate'

// Contact Component: Handles general inquiries and donation information
export default function Contact({ t }: { t: (k: string) => string }) {
  // State to toggle between 'Contact' and 'Donate' views
  const [activeTab, setActiveTab] = useState<TabType>('contact')

  // State to manage form input values
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  // State to manage donate form
  const [donateForm, setDonateForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    amount: ''
  })

  // Handle donate form submission
  const handleDonateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, email, phone, address, amount } = donateForm
    const subject = `Donation Pledge from ${name}`
    const body = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0AAddress: ${address}%0AAmount: Rs. ${amount}`
    window.location.href = `mailto:${t('band.email')}?subject=${subject}&body=${body}`
  }

  // Handle input changes for form fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const { name, phone, email, message } = formData
    const subject = `New Contact Request from ${name}`
    const body = `Name: ${name}%0APhone: ${phone}%0AEmail: ${email}%0AMessage: ${message}`
    window.location.href = `mailto:${t('band.email')}?subject=${subject}&body=${body}`
  }

  // Dynamic banner image and title based on active tab
  const getBanner = () => activeTab === 'donate' ? donateBanner : bannerImg
  const getTitle = () => activeTab === 'donate' ? t('nav.donate') : t('nav.contact')

  return (
    <div className="page pb-20">
      <SubHero title={getTitle()} img={getBanner()} />

      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-6 px-1">
          <button
            className={`flex-1 md:flex-none shrink-0 px-4 py-3 md:px-8 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'contact'
              ? 'bg-[#e43f6f] text-white shadow-md transform scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            onClick={() => setActiveTab('contact')}
          >
            {t('nav.contact')}
          </button>
          <button
            className={`flex-1 md:flex-none shrink-0 px-4 py-3 md:px-8 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${activeTab === 'donate'
              ? 'bg-[#e43f6f] text-white shadow-md transform scale-105'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            onClick={() => setActiveTab('donate')}
          >
            {t('nav.donate')}
          </button>
        </div>

        {/* CONTACT VIEW */}
        {activeTab === 'contact' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              {/* Contact Info Column (Left) */}
              <div className="md:w-5/12 bg-[#e43f6f] p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{t('contact.title')}</h3>
                  <p className="mb-6 md:mb-8 opacity-90 text-sm md:text-base">{t('contact.details')}</p>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-lg md:text-xl">📍</div>
                      <span className="text-base md:text-lg">{t('band.addr')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-lg md:text-xl">✉️</div>
                      <span className="text-base md:text-lg">{t('band.email')}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-lg md:text-xl">📞</div>
                      <span className="text-base md:text-lg">{t('band.phone')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form Column (Right) */}
              <div className="md:w-7/12 p-6 md:p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.formTitle')}</h3>
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.name')}</label>
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={t('common.name_placeholder')}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.phone')}</label>
                      <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={t('common.phone_placeholder')}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.email')}</label>
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('common.email_placeholder')}
                      type="email"
                      required
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.message')}</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('common.message_placeholder')}
                      rows={4}
                      required
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors resize-none"
                    />
                  </div>

                  <div className="mt-8">
                    <button
                      className="btn w-full bg-[#e43f6f] hover:bg-[#c6285b] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                    >
                      {t('contact.send')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* DONATE VIEW */}
        {activeTab === 'donate' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Donation Info Card */}
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100 flex flex-col gap-8">
                <h3 className="text-3xl font-bold text-gray-800">{t('donate.support')}</h3>
                {/* QR Code */}
                <div className="bg-gray-100 rounded-2xl p-6 flex items-center justify-center">
                  <img src={QRScan} alt="QR Code for Donations" className="w-95 h-95 md:w-95 md:h-95 object-contain" />
                </div>
                {/* Bank Details */}
                <div className="bg-gradient-to-r from-[#e43f6f] to-[#c6285b] text-white p-8 rounded-[2rem] shadow-lg">
                  <div className="font-bold text-xl mb-6 opacity-90 border-b border-white/20 pb-4">{t('donate.accTitle')}</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80 text-sm">{t('donate.bank')}</span>
                      <span className="font-bold text-lg">{t('donate.bank_name')}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-80 text-sm">{t('donate.accountName')}</span>
                      <span className="font-bold text-lg text-right">{t('donate.acc_name_val')}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="opacity-80 text-sm">{t('donate.accountNo')}</span>
                      <span className="font-mono text-xl font-bold bg-white/20 px-3 py-1 rounded">00112233445566778899</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Donation Form */}
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('donate.formTitle')}</h3>
                <form className="grid gap-6" onSubmit={handleDonateSubmit}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.name')}</label>
                    <input
                      value={donateForm.name}
                      onChange={e => setDonateForm({ ...donateForm, name: e.target.value })}
                      placeholder={t('contact.name')}
                      required
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.email')}</label>
                      <input
                        value={donateForm.email}
                        onChange={e => setDonateForm({ ...donateForm, email: e.target.value })}
                        placeholder={t('contact.email')}
                        type="email"
                        required
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.phone')}</label>
                      <input
                        value={donateForm.phone}
                        onChange={e => setDonateForm({ ...donateForm, phone: e.target.value })}
                        placeholder={t('contact.phone')}
                        required
                        className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('donate.address')}</label>
                    <input
                      value={donateForm.address}
                      onChange={e => setDonateForm({ ...donateForm, address: e.target.value })}
                      placeholder={t('donate.address')}
                      required
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('donate.amount')}</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rs.</span>
                      <input
                        value={donateForm.amount}
                        onChange={e => setDonateForm({ ...donateForm, amount: e.target.value })}
                        placeholder="1000"
                        required
                        type="number"
                        className="bg-gray-50 border border-gray-200 rounded-2xl pl-16 pr-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors w-full font-bold text-lg"
                      />
                    </div>
                  </div>
                  <button className="btn w-full bg-[#e43f6f] hover:bg-[#c6285b] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 mt-4">
                    {t('contact.send')}
                  </button>
                </form>
              </div>
            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}