import '../App.css'

export default function SubHero({ title, img, solid }: { title: string; img?: string; solid?: boolean }) {
  if (solid) {
    return (
      <div className="subhero solid">
        <div className="subhero-title">{title}</div>
      </div>
    )
  }
  return (
    <div className="subhero">
      {img && <img src={img} alt="banner" />}
      <div className="subhero-title">{title}</div>
    </div>
  )
}
