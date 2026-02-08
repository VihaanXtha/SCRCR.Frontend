/**
 * FolderCard Component
 * --------------------
 * Represents a folder or album in a gallery view.
 * It displays a cover image (if available), a name, and an item count.
 * 
 * Props:
 * @param {string} name - The name of the folder/album.
 * @param {number} count - The number of items inside this folder.
 * @param {string} [cover] - Optional URL for the cover image.
 * @param {boolean} [active] - Optional flag to highlight the card (e.g., when selected).
 * @param {() => void} [onClick] - Optional click handler function.
 */
export default function FolderCard({ name, count, cover, active, onClick }: { name: string; count: number; cover?: string; active?: boolean; onClick?: () => void }) {
  return (
    // Conditionally apply 'active' class if the active prop is true
    <div className={active ? 'card active' : 'card'} onClick={onClick}>
      {/* Render cover image if provided */}
      {cover && <img src={cover} alt={name} />}
      
      {/* Display folder name and count */}
      <div className="card-title">{name} ({count})</div>
    </div>
  )
}
