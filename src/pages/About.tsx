import '../App.css'
import SubHero from '../components/SubHero'

export default function About({ t }: { t: (k: string) => string }) {
  return (
    <div className="page">
      <SubHero title={t('about.title')} img="https://placehold.co/1600x420" />
      <div className="about">
        <div className="about-grid">
          <div className="about-photo">
            <img src="https://placehold.co/600x520" alt="about" />
            <div className="about-accent" />
          </div>
          <div className="about-text">
            <h2>{t('about.heading')}</h2>
            <p>{t('about.p1')}</p>
            <p>{t('about.p2')}</p>
          </div>
        </div>
      </div>
      
    </div>
  )
}
