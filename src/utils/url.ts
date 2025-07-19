export const getFaviconUrl = (url: string, size: number = 64) => {
  try {
    const domain = new URL(url).hostname
    return `https://www.google.com/s2/favicons?sz=${size}&domain_url=${domain}`
  } catch (error) {
    console.error('Invalid URL provided to getFaviconUrl:', error)
    return ''
  }
}

export const extractDomain = (url: string) => {
  try {
    return new URL(url).hostname
  } catch (error) {
    console.error('Invalid URL provided to extractDomain:', error)
    return ''
  }
}

export const getDomainFromUrl = (url: string) => {
  try {
    const domain = new URL(url).hostname
    return domain.replace('www.', '')
  } catch {
    return url
  }
}
