import '../App.css'

import SubHero from '../components/SubHero'

export default function Donate({ t }: { t: (k: string) => string }) {
  return (
    <div className="page">
      <SubHero title={t('nav.donate')} img="https://placehold.co/1600x420" />
      <div className="donate-layout">
        <div className="donate-left">
          <h3>{t('donate.support')}</h3>
          <div className="qr" />
          <div className="account">
            <div>{t('donate.accTitle')}</div>
            <div>{t('donate.bank')}: ABC Bank Ltd</div>
            <div>{t('donate.accountName')}: Jestha Nagrik Milan Kendra</div>
            <div>{t('donate.accountNo')}: 00112233445566778899</div>
          </div>
        </div>
        <form className="donate-form">
          <h3>{t('donate.formTitle')}</h3>
          <input placeholder={t('contact.name')} />
          <input placeholder={t('contact.email')} />
          <input placeholder={t('contact.phone')} />
          <input placeholder={t('donate.address')} />
          <input placeholder={t('donate.amount')} />
          <button className="btn">{t('contact.send')}</button>
        </form>
      </div>
      
    </div>
  )
}
