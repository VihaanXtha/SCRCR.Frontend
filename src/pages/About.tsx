import '../App.css'
import { useState } from 'react'
import SubHero from '../components/SubHero'
import img1 from '../assets/images/scrc-aboutus-1-1.jpg'
import programsBanner from '../assets/images/activites/scrc-gallery-32.jpg'
import healthBanner from '../assets/images/hero-slider/scrc-slider-3-1.png'
import AnimatedSection from '../components/AnimatedSection'

// Define possible values for the active tab to ensure type safety
type TabType = 'about' | 'programs' | 'health'

// About Component: Displays information about the organization, programs, and health tips
// Props:
// - t: Translation function
export default function About({ t }: { t: (k: string) => string }) {
  // State to track which tab is currently active (default: 'about')
  const [activeTab, setActiveTab] = useState<TabType>('about')

  // Helper function to get the correct banner image based on the active tab
  const getBanner = () => {
    switch(activeTab) {
      case 'programs': return programsBanner
      case 'health': return healthBanner
      default: return img1
    }
  }

  // Helper function to get the correct page title based on the active tab
  const getTitle = () => {
    switch(activeTab) {
      case 'programs': return t('programs.title')
      case 'health': return t('health.title')
      default: return t('about.title')
    }
  }

  // Configuration for the tabs
  const tabs: { id: TabType; label: string }[] = [
    { id: 'about', label: t('nav.about') },
    { id: 'programs', label: t('nav.programs') },
    { id: 'health', label: t('nav.health') }
  ]

  return (
    <div className="page pb-20">
      {/* SubHero displays the banner image and title */}
      <SubHero title={getTitle()} img={getBanner()} />
      
      <div className="w-full max-w-7xl mx-auto px-4 py-8">
        {/* Tab Navigation Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {tabs.map(tab => (
            <button 
              key={tab.id}
              // Apply active styling if this tab is selected
              className={`px-8 py-3 rounded-full font-bold transition-all text-sm md:text-base ${
                activeTab === tab.id 
                  ? 'bg-[#e43f6f] text-white shadow-lg transform scale-105' 
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
            <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
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
                    <img src="https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=800&q=80" alt="Yoga" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">{t('programs.daily_yoga')}</h4>
                    <p className="text-sm text-[#e43f6f] font-bold uppercase tracking-wider">{t('programs.daily_yoga_time')}</p>
                  </div>
                </div>
                {/* Program Card 2 */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1576267423048-15c0040fec78?auto=format&fit=crop&w=800&q=80" alt="Health Checkup" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-gray-800">{t('programs.health_checkup')}</h4>
                    <p className="text-sm text-[#e43f6f] font-bold uppercase tracking-wider">{t('programs.health_checkup_time')}</p>
                  </div>
                </div>
                {/* Program Card 3 */}
                <div className="bg-white rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
                  <div className="h-48 overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80" alt="Bhajan" className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110" />
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
                <img src="https://images.unsplash.com/photo-1526976668912-1a811878dd37?auto=format&fit=crop&w=600&q=80" alt="Winter Relief" className="w-full md:w-1/3 h-64 object-cover rounded-2xl shadow-md" />
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
      </div>
    </div>
  )
}
