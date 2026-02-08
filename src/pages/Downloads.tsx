
import '../App.css'
import SubHero from '../components/SubHero'
import bannerImg from '../assets/images/hero-slider/scrc-slider-1.jpg'
import AnimatedSection from '../components/AnimatedSection'

// Downloads Component: Provides downloadable resources like reports, policies, and forms
export default function Downloads({ t }: { t: (k: string) => string }) {
  // Data for Annual Reports
  const reports = [
    { title: t('downloads.report_annual_8081'), date: "2081-04-01" },
    { title: t('downloads.report_audit_80'), date: "2081-03-15" },
    { title: t('downloads.report_annual_7980'), date: "2080-04-01" },
  ]

  // Data for Policies and Guidelines
  const policies = [
    { title: t('downloads.policy_constitution'), date: "2075-01-01" },
    { title: t('downloads.policy_membership'), date: "2076-05-12" },
    { title: t('downloads.policy_conduct'), date: "2076-05-12" },
  ]

  // Data for Application Forms
  const forms = [
    { title: t('downloads.form_membership'), type: "PDF" },
    { title: t('downloads.form_donation'), type: "PDF" },
    { title: t('downloads.form_event'), type: "PDF" },
  ]

  return (
    <div className="page pb-20">
      <SubHero title={t('nav.downloads')} img={bannerImg} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <AnimatedSection className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" type="fade-up">
          
          {/* Annual Reports Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
              <span className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">📊</span>
              {t('downloads.reports')}
            </h3>
            <div className="space-y-4">
              {reports.map((r, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div>
                    <div className="font-medium text-gray-700 group-hover:text-blue-500 transition-colors">{r.title}</div>
                    <div className="text-xs text-gray-400">{r.date}</div>
                  </div>
                  <button className="btn sm bg-white border border-gray-200 text-gray-500 hover:bg-blue-500 hover:text-white hover:border-blue-500 shadow-sm">
                    ↓
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Policies Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
              <span className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center">📜</span>
              {t('downloads.policies')}
            </h3>
            <div className="space-y-4">
              {policies.map((p, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div>
                    <div className="font-medium text-gray-700 group-hover:text-purple-500 transition-colors">{p.title}</div>
                    <div className="text-xs text-gray-400">{p.date}</div>
                  </div>
                  <button className="btn sm bg-white border border-gray-200 text-gray-500 hover:bg-purple-500 hover:text-white hover:border-purple-500 shadow-sm">
                    ↓
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Forms Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-gray-100 h-full hover:shadow-xl transition-shadow">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3 pb-4 border-b border-gray-100">
              <span className="w-10 h-10 rounded-full bg-pink-50 text-[#e43f6f] flex items-center justify-center">📝</span>
              {t('downloads.forms')}
            </h3>
            <div className="space-y-4">
              {forms.map((f, i) => (
                <div key={i} className="flex justify-between items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                  <div>
                    <div className="font-medium text-gray-700 group-hover:text-[#e43f6f] transition-colors">{f.title}</div>
                    <div className="text-xs text-gray-400">{f.type}</div>
                  </div>
                  <button className="btn sm bg-white border border-gray-200 text-gray-500 hover:bg-[#e43f6f] hover:text-white hover:border-[#e43f6f] shadow-sm">
                    {t('downloads.download_btn')}
                  </button>
                </div>
              ))}
            </div>
          </div>

        </AnimatedSection>
      </div>
    </div>
  )
}
