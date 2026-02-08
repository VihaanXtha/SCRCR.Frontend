/**
 * Optimizes Cloudinary Image URLs
 * -------------------------------
 * Adds transformation parameters to Cloudinary URLs to request optimized, resized, or cropped images.
 * This helps improve performance by not loading unnecessarily large images.
 * 
 * @param url - The original image URL.
 * @param options - Optimization options (width, height, quality, fit).
 * @returns The transformed URL or the original if not a Cloudinary URL.
 */
export function getOptimizedUrl(url: string, options: { width?: number; height?: number; quality?: string; fit?: string } = {}): string {
  if (!url || !url.includes('cloudinary.com')) return url

  const { width, height, quality = 'auto', fit = 'limit' } = options
  const params = []

  // f_auto: Automatically choose the best format (webp, avif, etc.) supported by the browser
  params.push(`f_auto`)
  // q_auto: Automatically adjust quality to balance size and visual fidelity
  params.push(`q_${quality}`)
  
  if (width) params.push(`w_${width}`)
  if (height) params.push(`h_${height}`)
  if (fit) params.push(`c_${fit}`)

  const transformationString = params.join(',')
  
  // Insert transformation before 'upload/' part in URL is standard, but some URLs are different.
  // Standard: https://res.cloudinary.com/demo/image/upload/v1234/sample.jpg
  // Transformed: https://res.cloudinary.com/demo/image/upload/w_300,h_300,c_fit/v1234/sample.jpg
  
  const parts = url.split('/upload/')
  if (parts.length !== 2) return url // Can't parse, return original

  return `${parts[0]}/upload/${transformationString}/${parts[1]}`
}
