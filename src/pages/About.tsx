import '../App.css'
import { useState, useEffect } from 'react'
import SubHero from '../components/SubHero'
import img1 from '../assets/images/scrc-aboutus-1-1.jpg'
import programsBanner from '../assets/images/activites/scrc-gallery-32.jpg'
import healthBanner from '../assets/images/hero-slider/scrc-slider-3-1.png'
import downloadsBanner from '../assets/images/hero-slider/scrc-slider-1-1.jpg'
import AnimatedSection from '../components/AnimatedSection'

// Define possible values for the active tab to ensure type safety
type TabType = 'about' | 'programs' | 'health' | 'downloads'

// About Component: Displays information about the organization, programs, health tips, and downloads
// Props:
// - t: Translation function
// - initialTab: Optional initial tab to show
export default function About({ t, initialTab }: { t: (k: string) => string; initialTab?: TabType }) {
  // State to track which tab is currently active
  const [activeTab, setActiveTab] = useState<TabType>(initialTab || 'about')

  // Update active tab when initialTab prop changes
  useEffect(() => {
    if (initialTab) setActiveTab(initialTab)
  }, [initialTab])

  // Helper function to get the correct banner image based on the active tab
  const getBanner = () => {
    switch(activeTab) {
      case 'programs': return programsBanner
      case 'health': return healthBanner
      case 'downloads': return downloadsBanner
      default: return img1
    }
  }

  // Helper function to get the correct page title based on the active tab
  const getTitle = () => {
    switch(activeTab) {
      case 'programs': return t('programs.title')
      case 'health': return t('health.title')
      case 'downloads': return t('nav.downloads')
      default: return t('about.title')
    }
  }

  // Configuration for the tabs
  const tabs: { id: TabType; label: string }[] = [
    { id: 'about', label: t('nav.about') },
    { id: 'programs', label: t('nav.programs') },
    { id: 'health', label: t('nav.health') },
    { id: 'downloads', label: t('nav.downloads') }
  ]

  // Data for Downloads
  const reports = [
    { title: t('downloads.report_annual_8081'), date: "2081-04-01" },
    { title: t('downloads.report_audit_80'), date: "2081-03-15" },
    { title: t('downloads.report_annual_7980'), date: "2080-04-01" },
  ]

  const policies = [
    { title: t('downloads.policy_constitution'), date: "2075-01-01" },
    { title: t('downloads.policy_membership'), date: "2076-05-12" },
    { title: t('downloads.policy_conduct'), date: "2076-05-12" },
  ]

  const forms = [
    { title: t('downloads.form_membership'), type: "PDF" },
    { title: t('downloads.form_donation'), type: "PDF" },
    { title: t('downloads.form_event'), type: "PDF" },
  ]

  return (
    <div className="page pb-20">
      {/* SubHero displays the banner image and title */}
      <SubHero title={getTitle()} img={getBanner()} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Tab Navigation Buttons */}
        <div className="flex overflow-x-auto md:flex-wrap justify-start md:justify-center gap-2 md:gap-3 mb-6 pb-2 scrollbar-hide px-1">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              // Apply active styling if this tab is selected
              className={`whitespace-nowrap shrink-0 px-4 py-1.5 md:px-8 md:py-3 rounded-full font-bold transition-all text-sm md:text-base ${
                activeTab === tab.id 
                  ? 'bg-[#e43f6f] text-white shadow-md transform scale-105' 
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content for 'About Us' Tab */}
        {activeTab === 'about' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="flex flex-col md:flex-row gap-8 lg:gap-20 items-center">
              {/* Photo Column with decorative elements */}
              <div className="w-full md:w-1/2 relative group">
                <div className="absolute inset-0 bg-[#e43f6f] opacity-5 rounded-[3rem] transform rotate-3 scale-95 transition-transform duration-500 group-hover:rotate-6"></div>
                <div className="absolute inset-0 bg-[#c6285b] opacity-10 rounded-[3rem] transform -rotate-3 scale-95 transition-transform duration-500 group-hover:-rotate-6"></div>
                <img 
                  src="https://placehold.co/600x520" 
                  alt="about" 
                  className="relative z-10 w-full h-auto rounded-[2.5rem] shadow-2xl border-4 border-white transform transition-transform duration-500 group-hover:scale-[1.01]" 
                />
                {/* Accent Bar */}
                <div className="absolute -right-4 top-12 bottom-12 w-2 bg-gradient-to-b from-[#e43f6f] to-[#c6285b] rounded-full opacity-80"></div>
              </div>

              {/* Text Column */}
              <div className="w-full md:w-1/2">
                 <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-6 shadow-sm">
                    {t('about.our_story')}
                 </span>
                 <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8 leading-tight">
                   {t('about.heading')}
                 </h2>
                 <div className="prose prose-lg text-gray-600 text-justify">
                   <p className="mb-6 leading-relaxed">{t('about.p1')}</p>
                   <p className="leading-relaxed">{t('about.p2')}</p>
                 </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Content for 'Programs' Tab */}
        {activeTab === 'programs' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="section mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('programs.regular')}</h3>
                <p className="text-gray-500 max-w-2xl mx-auto">{t('programs.desc')}</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Program Card 1 */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src="https://placehold.co/800x600/e43f6f/ffffff?text=Daily+Yoga" alt="Yoga" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">{t('programs.daily_yoga')}</h4>
                    <p className="text-sm text-[#e43f6f] font-bold uppercase tracking-wider">{t('programs.daily_yoga_time')}</p>
                  </div>
                </div>
                {/* Program Card 2 */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src="https://placehold.co/800x600/e43f6f/ffffff?text=Health+Checkup" alt="Health Checkup" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">{t('programs.health_checkup')}</h4>
                    <p className="text-sm text-[#e43f6f] font-bold uppercase tracking-wider">{t('programs.health_checkup_time')}</p>
                  </div>
                </div>
                {/* Program Card 3 */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src="https://placehold.co/800x600/e43f6f/ffffff?text=Bhajan+Kirtan" alt="Bhajan" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">{t('programs.bhajan')}</h4>
                    <p className="text-sm text-[#e43f6f] font-bold uppercase tracking-wider">{t('programs.bhajan_time')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="text-center mb-12">
                 <h3 className="text-3xl font-bold text-gray-800 mb-4">{t('programs.ongoing')}</h3>
              </div>
              <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-8 items-center">
                <img src="https://placehold.co/600x400/e43f6f/ffffff?text=Winter+Relief" alt="Winter Relief" className="w-full md:w-1/3 h-64 object-cover rounded-2xl shadow-md" />
                <div className="flex-1">
                  <h4 className="text-2xl font-bold text-gray-800 mb-4">{t('programs.winter_relief')}</h4>
                  <p className="text-gray-600 mb-6 text-lg leading-relaxed">{t('programs.winter_relief_desc')}</p>
                  <button className="px-8 py-3 bg-[#e43f6f] hover:bg-[#c6285b] text-white font-bold rounded-full shadow-lg transition-all transform hover:-translate-y-1">{t('common.learn_more')}</button>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Content for 'Health' Tab */}
        {activeTab === 'health' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="section mb-16">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-800">{t('health.tips.title')}</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-green-50 rounded-[2rem] p-8 border border-green-100 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-6">🏃‍♂️</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{t('health.tip1.title')}</h4>
                  <p className="text-gray-600 leading-relaxed">{t('health.tip1.desc')}</p>
                </div>
                <div className="bg-orange-50 rounded-[2rem] p-8 border border-orange-100 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-3xl mb-6">🥗</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{t('health.tip2.title')}</h4>
                  <p className="text-gray-600 leading-relaxed">{t('health.tip2.desc')}</p>
                </div>
                <div className="bg-blue-50 rounded-[2rem] p-8 border border-blue-100 hover:shadow-lg transition-all">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl mb-6">💧</div>
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{t('health.tip3.title')}</h4>
                  <p className="text-gray-600 leading-relaxed">{t('health.tip3.desc')}</p>
                </div>
              </div>
            </div>

            <div className="section">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-gray-800">{t('health.gov.title')}</h3>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="bg-white rounded-[2rem] p-8 shadow-lg border-l-8 border-[#e43f6f] hover:-translate-y-1 transition-transform">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{t('health.gov1.title')}</h4>
                  <p className="text-gray-600">{t('health.gov1.desc')}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 shadow-lg border-l-8 border-[#e43f6f] hover:-translate-y-1 transition-transform">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{t('health.gov2.title')}</h4>
                  <p className="text-gray-600">{t('health.gov2.desc')}</p>
                </div>
                <div className="bg-white rounded-[2rem] p-8 shadow-lg border-l-8 border-[#e43f6f] hover:-translate-y-1 transition-transform">
                  <h4 className="text-xl font-bold text-gray-800 mb-4">{t('health.gov3.title')}</h4>
                  <p className="text-gray-600">{t('health.gov3.desc')}</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        )}

        {/* Content for 'Downloads' Tab */}
        {activeTab === 'downloads' && (
          <AnimatedSection className="w-full" type="fade-up">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              
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

            </div>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
