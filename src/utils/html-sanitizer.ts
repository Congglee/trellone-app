import DOMPurify from 'dompurify'

export const sanitizeHtml = (html: string): string => {
  if (!html) return ''

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'u',
      's',
      'a',
      'img',
      'h1',
      'h2',
      'h3',
      'ul',
      'ol',
      'li',
      'code',
      'pre',
      'blockquote',
      'hr',
      'span',
      'div'
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'class', 'src', 'alt', 'title'],
    ALLOW_DATA_ATTR: false
  })
}

export const isMarkdownContent = (content: string): boolean => {
  if (!content) return false

  // Check for common markdown patterns
  const markdownPatterns = [
    /^#{1,6}\s/m, // Headers
    /\*\*.*\*\*/, // Bold
    /__.*__/, // Bold alternative
    /\*.*\*/, // Italic
    /_.*_/, // Italic alternative
    /\[.*\]\(.*\)/, // Links
    /^[-*+]\s/m, // Unordered lists
    /^\d+\.\s/m, // Ordered lists
    /`.*`/, // Inline code
    /^```/m, // Code blocks
    /^>/m // Blockquotes
  ]

  return markdownPatterns.some((pattern) => pattern.test(content))
}

export const hasHtmlContent = (html: string): boolean => {
  if (!html) return false

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html

  // Get text content and trim whitespace
  const textContent = tempDiv.textContent || tempDiv.innerText || ''

  // If there's text, it's non-empty
  if (textContent.trim().length > 0) return true

  // Treat non-textual media elements as meaningful content (e.g., images)
  const hasMedia = Boolean(tempDiv.querySelector('img[src], hr'))

  return hasMedia
}
