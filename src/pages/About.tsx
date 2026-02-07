import '../App.css'
import SubHero from '../components/SubHero'
import img1 from '../assets/images/scrc-aboutus-1-1.jpg';
import AnimatedSection from '../components/AnimatedSection'

export default function About({ t }: { t: (k: string) => string }) {
  return (
    <div className="page pb-20">
      <SubHero title={t('about.title')} img={img1} />
      
      <AnimatedSection className="w-full max-w-7xl mx-auto px-4 py-16" type="fade-up">
        <div className="flex flex-col md:flex-row gap-12 lg:gap-20 items-center">
          {/* Photo Column */}
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
                OUR STORY
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
      
    </div>
  )
}
