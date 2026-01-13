export default function FolderCard({ name, count, cover, active, onClick }: { name: string; count: number; cover?: string; active?: boolean; onClick?: () => void }) {
  return (
    <div className={active ? 'card active' : 'card'} onClick={onClick}>
      {cover && <img src={cover} alt={name} />}
      <div className="card-title">{name} ({count})</div>
    </div>
  )
}
