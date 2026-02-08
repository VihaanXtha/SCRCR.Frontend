import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-8-1.jpg'
import donateBanner from '../assets/images/activites/3.jpg'
import AnimatedSection from '../components/AnimatedSection'

type TabType = 'contact' | 'donate'

export default function Contact({ t }: { t: (k: string) => string }) {
  const [activeTab, setActiveTab] = useState<TabType>('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('submitting')
    
    try {
      const res = await fetch('https://scrcr-backend.vercel.app/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!res.ok) throw new Error('Failed to send')
      
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      console.error(error)
      setStatus('error')
    }
  }

  const getBanner = () => activeTab === 'donate' ? donateBanner : bannerImg
  const getTitle = () => activeTab === 'donate' ? t('nav.donate') : t('nav.contact')

  return (
    <div className="page pb-20">
      <SubHero title={getTitle()} img={getBanner()} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-center gap-4 mb-12">
          <button 
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              activeTab === 'contact' 
                ? 'bg-[#e43f6f] text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('contact')}
          >
            {t('nav.contact')}
          </button>
          <button 
            className={`px-8 py-3 rounded-full font-bold transition-all ${
              activeTab === 'donate' 
                ? 'bg-[#e43f6f] text-white shadow-lg transform scale-105' 
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
            onClick={() => setActiveTab('donate')}
          >
            {t('nav.donate')}
          </button>
        </div>

        {activeTab === 'contact' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
              <div className="md:w-5/12 bg-[#e43f6f] p-12 text-white flex flex-col justify-center relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20"></div>
                 <div className="relative z-10">
                   <h3 className="text-3xl font-bold mb-6">{t('contact.title')}</h3>
                   <p className="mb-8 opacity-90">{t('contact.details')}</p>
                   <div className="flex flex-col gap-4">
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">📍</div>
                       <span className="text-lg">{t('band.addr')}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">✉️</div>
                       <span className="text-lg">{t('band.email')}</span>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">📞</div>
                       <span className="text-lg">{t('band.phone')}</span>
                     </div>
                   </div>
                 </div>
              </div>
              
              <div className="md:w-7/12 p-12">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('contact.formTitle')}</h3>
                <form className="grid gap-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.name')}</label>
                      <input 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                        placeholder={t('contact.name')} 
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
                        placeholder={t('contact.phone')} 
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
                      placeholder={t('contact.email')} 
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
                      placeholder={t('contact.message')} 
                      rows={4} 
                      required 
                      className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors resize-none" 
                    />
                  </div>
                  
                  <div className="mt-4">
                    <button 
                      className="btn w-full bg-[#e43f6f] hover:bg-[#c6285b] text-white font-bold py-4 rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 disabled:opacity-70 disabled:cursor-not-allowed"
                      disabled={status === 'submitting'}
                    >
                      {status === 'submitting' ? t('contact.sending') : t('contact.send')}
                    </button>
                  </div>
                  
                  {status === 'success' && <p className="text-green-600 font-bold mt-2 text-center bg-green-50 p-3 rounded-xl">{t('contact.success')}</p>}
                  {status === 'error' && <p className="text-red-600 font-bold mt-2 text-center bg-red-50 p-3 rounded-xl">{t('contact.error')}</p>}
                </form>
              </div>
            </div>
          </AnimatedSection>
        )}

        {activeTab === 'donate' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">{t('donate.support')}</h3>
                <div className="bg-gray-100 rounded-2xl p-6 mb-8 flex items-center justify-center">
                  <div className="w-64 h-64 bg-white rounded-xl shadow-inner flex items-center justify-center border-2 border-dashed border-gray-300">
                    <span className="text-gray-400 font-bold text-xl">QR CODE HERE</span>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-[#e43f6f] to-[#c6285b] text-white p-8 rounded-[2rem] shadow-lg">
                  <div className="font-bold text-xl mb-6 opacity-90 border-b border-white/20 pb-4">{t('donate.accTitle')}</div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="opacity-80 text-sm">{t('donate.bank')}</span>
                      <span className="font-bold text-lg">ABC Bank Ltd</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="opacity-80 text-sm">{t('donate.accountName')}</span>
                      <span className="font-bold text-lg text-right">Jestha Nagrik Milan Kendra</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="opacity-80 text-sm">{t('donate.accountNo')}</span>
                      <span className="font-mono text-xl font-bold bg-white/20 px-3 py-1 rounded">00112233445566778899</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-2xl border border-gray-100">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{t('donate.formTitle')}</h3>
                <form className="grid gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.name')}</label>
                    <input placeholder={t('contact.name')} className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.email')}</label>
                      <input placeholder={t('contact.email')} className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-sm font-bold text-gray-600 ml-2">{t('contact.phone')}</label>
                      <input placeholder={t('contact.phone')} className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('donate.address')}</label>
                    <input placeholder={t('donate.address')} className="bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold text-gray-600 ml-2">{t('donate.amount')}</label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-gray-400">Rs.</span>
                      <input placeholder="1000" className="bg-gray-50 border border-gray-200 rounded-2xl pl-16 pr-6 py-4 focus:outline-none focus:border-[#e43f6f] transition-colors w-full font-bold text-lg" />
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
