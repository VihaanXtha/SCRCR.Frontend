
import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'

export default function Contact({ t }: { t: (k: string) => string }) {
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

  return (
    <div className="page pb-20">
      <SubHero title={t('nav.contact')} img="https://placehold.co/1600x420" />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
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
                  <label className="text-sm font-bold text-gray-600 ml-2">Name</label>
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
                  <label className="text-sm font-bold text-gray-600 ml-2">Phone</label>
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
                <label className="text-sm font-bold text-gray-600 ml-2">Email</label>
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
                <label className="text-sm font-bold text-gray-600 ml-2">Message</label>
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
                  {status === 'submitting' ? 'Sending...' : t('contact.send')}
                </button>
              </div>
              
              {status === 'success' && <p className="text-green-600 font-bold mt-2 text-center bg-green-50 p-3 rounded-xl">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-600 font-bold mt-2 text-center bg-red-50 p-3 rounded-xl">Failed to send message. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
