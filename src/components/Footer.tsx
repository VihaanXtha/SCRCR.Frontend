import '../App.css'
import logo from '../assets/images/logo.jpeg'

export default function Footer({ t }: { t: (k: string) => string }) {
  return (
    <footer className="footer">
      <div className="band !grid !grid-cols-1 md:!grid-cols-3 gap-8">
      <div className="band-left">
        <div className="band-title">{t('band.title')}</div>
      </div>
      <div className="contact">
        <div className="contact-brand">
          <img src={logo} alt="logo" className="logo" />
          <div>
            <div className="contact-name">{t('band.org')}</div>
            <div className="contact-tag">{t('band.tag')}</div>
          </div>
        </div>
        <div className="contact-info">
          <div>{t('band.addr')}</div>
          <div>{t('band.phone')}</div>
          <div>{t('band.email')}</div>
          <div className="social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">FB</a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YT</a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">IG</a>
          </div>
        </div>
      </div>
      <div className="map-container h-full min-h-[250px] rounded-2xl overflow-hidden border border-gray-200 shadow-md">
        <iframe 
          width="100%" 
          height="100%" 
          id="gmap_canvas" 
          src="https://maps.google.com/maps?q=Senior%20Citizen%20Recreation%20Centre%20Rupandehi&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0}
          title="SCRC Location"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
    </footer>
  )
}
