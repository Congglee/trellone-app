import { Helmet } from 'react-helmet-async'
import { useLocation } from 'react-router-dom'
import { siteConfig } from '~/constants/site'

interface SEOProps {
  title?: string
  description?: string
  image?: string
}

export default function SEO({ title, description, image }: SEOProps) {
  const location = useLocation()

  const seo = {
    title: title ? `${title} | ${siteConfig.name}` : siteConfig.name,
    description: description || siteConfig.description,
    image: `${siteConfig.url.base}${image || '/og.png'}`,
    url: `${siteConfig.url.base}${location.pathname}`
  }

  return (
    <Helmet>
      {/* Standard metadata tags */}
      <title>{seo.title}</title>
      <meta name='description' content={seo.description} />
      <meta name='keywords' content={siteConfig.keywords.join(', ')} />
      <meta name='author' content={siteConfig.author} />
      <link rel='canonical' href={seo.url} />

      {/* Open Graph / Facebook */}
      <meta property='og:type' content='website' />
      <meta property='og:title' content={seo.title} />
      <meta property='og:description' content={seo.description} />
      <meta property='og:image' content={seo.image} />
      <meta property='og:url' content={seo.url} />
      <meta property='og:site_name' content={siteConfig.name} />

      {/* Twitter */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={seo.title} />
      <meta name='twitter:description' content={seo.description} />
      <meta name='twitter:image' content={seo.image} />
    </Helmet>
  )
}
