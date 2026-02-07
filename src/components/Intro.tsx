import '../App.css'
import img1 from '../assets/images/scrc-aboutus-1-1.jpg';

export default function Intro({ t, lang }: { t: (k: string) => string; lang: 'en' | 'ne' }) {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4">
      <div className="flex flex-col md:flex-row gap-8 lg:gap-16 items-center">
        {/* Left Column: Photo */}
        <div className="relative w-full md:w-5/12 flex justify-center group">
          {/* Decorative background shapes */}
          <div className="absolute inset-0 bg-[#e43f6f] opacity-5 rounded-[2.5rem] transform rotate-6 scale-90 translate-x-4 transition-transform duration-500 group-hover:rotate-3"></div>
          <div className="absolute inset-0 bg-[#c6285b] opacity-10 rounded-[2.5rem] transform -rotate-3 scale-95 -translate-x-2 transition-transform duration-500 group-hover:-rotate-1"></div>
          
          {/* Main Photo Frame */}
          <div className="relative z-10 bg-white p-3 rounded-[2.5rem] shadow-2xl transform transition-transform duration-500 group-hover:scale-[1.02] w-full">
            <img 
              src={img1} 
              alt="building" 
              className="w-full h-auto object-cover rounded-[2rem] aspect-[4/3] shadow-inner"
            />
            
            {/* Label Overlay */}
            <div className="absolute bottom-8 left-0 bg-gradient-to-r from-[#e43f6f] to-[#c6285b] text-white px-8 py-4 rounded-r-full shadow-lg max-w-[90%] transform transition-transform duration-500 group-hover:translate-x-2">
              <div className="font-bold text-lg md:text-xl uppercase tracking-wide leading-tight">SCRC</div>
              <div className="text-xs md:text-sm font-medium opacity-90 mt-1 uppercase tracking-wider">Rupandehi</div>
            </div>
          </div>
        </div>

        {/* Right Column: Text */}
        <div className="w-full md:w-7/12">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-[2.5rem] p-8 md:p-12 shadow-lg border border-gray-100 relative h-full flex flex-col justify-center transform transition-all duration-500 hover:shadow-xl">
             {/* Decorative Icon */}
            <div className="absolute top-8 right-8 text-[#e43f6f] opacity-5">
               <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
            </div>

            <div className="relative z-10">
              <span className="inline-block px-4 py-1 bg-[#e43f6f] text-white text-xs font-bold tracking-widest rounded-full mb-6 shadow-sm">
                WHO WE ARE
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                {t('intro.heading')}
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8 text-justify">
                {t('intro.p')}
              </p>
              <button className="btn self-start hover:scale-105 transform transition-transform duration-200 shadow-md">
                {lang === 'en' ? 'Learn more' : 'और जानें'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
