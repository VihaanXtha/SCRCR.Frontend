import '../App.css'
import logo from '../assets/images/logo.jpeg'

export default function Footer({ t }: { t: (k: string) => string }) {
  return (
    <footer className="footer">
      <div className="band">
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
            <a href="#">FB</a>
            <a href="#">YT</a>
            <a href="#">IG</a>
          </div>
        </div>
      </div>
    </div>
    </footer>
  )
}
