export function getOptimizedUrl(url: string, options: { width?: number; height?: number; quality?: string; fit?: string } = {}): string {
  if (!url || !url.includes('cloudinary.com')) return url

  const { width, height, quality = 'auto', fit = 'limit' } = options
  const params = []

  params.push(`f_auto`)
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
