import '../App.css'
import img1 from '../assets/images/scrc-aboutus-1-1.jpg';
export default function Intro({ t, lang }: { t: (k: string) => string; lang: 'en' | 'ne' }) {
  return (
    <section className="intro">
      <div className="intro-grid">
        <img src={img1} alt="building" />
        <div className="intro-text">
          <h2>{t('intro.heading')}</h2>
          <p>{t('intro.p')}</p>
          <button className="btn">{lang === 'en' ? 'Learn more' : 'और जानें'}</button>
        </div>
      </div>
    </section>
  )
}
