import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '~/constants/site'

interface SEOProps {
  title?: string
  description?: string
  /**
   * Accepts either an absolute URL (https://...) or an absolute path (/og.png).
   * If omitted, falls back to `siteConfig.ogImage`.
   */
  image?: string
  imageAlt?: string
  /**
   * Overrides default keywords from `siteConfig.keywords`.
   */
  keywords?: string[]
  /**
   * Overrides canonical URL generation.
   * - Use `canonicalUrl` for a full URL
   * - Use `canonicalPath` for a pathname (e.g. `/boards`)
   */
  canonicalUrl?: string
  canonicalPath?: string
  /**
   * SEO directives for crawlers (recommended `true` for authenticated/private pages).
   */
  noIndex?: boolean
  noFollow?: boolean
  /**
   * Open Graph / Twitter options
   */
  ogType?: 'website' | 'article' | 'profile' | string
  twitterCard?: 'summary' | 'summary_large_image' | string
}

const isAbsoluteUrl = (value: string) => /^https?:\/\//i.test(value)

const resolveUrl = (baseUrl: string, value: string) => {
  if (isAbsoluteUrl(value)) return value
  if (value.startsWith('/')) return `${baseUrl}${value}`
  return `${baseUrl}/${value}`
}

export default function SEO({
  title,
  description,
  image,
  imageAlt,
  keywords,
  canonicalUrl,
  canonicalPath,
  noIndex,
  noFollow,
  ogType = 'website',
  twitterCard = 'summary_large_image'
}: SEOProps) {
  const location = useLocation()
  const baseUrl = siteConfig.url.base || (typeof window !== 'undefined' ? window.location.origin : '')

  const resolvedTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const resolvedDescription = description || siteConfig.description

  const resolvedImage = image
    ? resolveUrl(baseUrl, image)
    : siteConfig.ogImage
      ? resolveUrl(baseUrl, siteConfig.ogImage)
      : resolveUrl(baseUrl, '/og.png')

  const resolvedCanonicalUrl = canonicalUrl
    ? canonicalUrl
    : canonicalPath
      ? resolveUrl(baseUrl, canonicalPath)
      : resolveUrl(baseUrl, location.pathname)

  const resolvedKeywords = (keywords && keywords.length > 0 ? keywords : siteConfig.keywords).join(', ')

  const robots = (() => {
    if (noIndex && noFollow) return 'noindex, nofollow'
    if (noIndex) return 'noindex, follow'
    if (noFollow) return 'index, nofollow'
    // Modern defaults: allow rich previews while remaining indexable
    return 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
  })()

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{resolvedTitle}</title>
      <meta name='description' content={resolvedDescription} />
      <meta name='keywords' content={resolvedKeywords} />
      <meta name='author' content={siteConfig.author} />
      <meta name='robots' content={robots} />
      <link rel='canonical' href={resolvedCanonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content={ogType} />
      <meta property='og:title' content={resolvedTitle} />
      <meta property='og:description' content={resolvedDescription} />
      <meta property='og:image' content={resolvedImage} />
      <meta property='og:url' content={resolvedCanonicalUrl} />
      <meta property='og:site_name' content={siteConfig.name} />
      {imageAlt && <meta property='og:image:alt' content={imageAlt} />}

      {/* Twitter */}
      <meta name='twitter:card' content={twitterCard} />
      <meta name='twitter:title' content={resolvedTitle} />
      <meta name='twitter:description' content={resolvedDescription} />
      <meta name='twitter:image' content={resolvedImage} />
      {imageAlt && <meta name='twitter:image:alt' content={imageAlt} />}
    </Helmet>
  )
}
