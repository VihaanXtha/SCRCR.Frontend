import '../App.css'

/**
 * SubHero Component
 * -----------------
 * This component renders a sub-hero section (banner) typically used at the top of inner pages.
 * It can display a title with a background image or just a solid color background.
 * 
 * Props:
 * @param {string} title - The text to display in the banner.
 * @param {string} [img] - Optional URL for the background image.
 * @param {boolean} [solid] - Optional flag. If true, renders a solid background instead of an image.
 */
export default function SubHero({ title, img, solid }: { title: string; img?: string; solid?: boolean }) {
  // If 'solid' is true, render a simple div with the 'solid' class (no image)
  if (solid) {
    return (
      <div className="subhero solid">
        <div className="subhero-title">{title}</div>
      </div>
    )
  }

  // Default rendering: Display the image and the title overlaid on top
  return (
    <div className="subhero">
      {/* Only render the img tag if an image URL is provided */}
      {img && <img src={img} alt="banner" />}
      <div className="subhero-title">{title}</div>
    </div>
  )
}
