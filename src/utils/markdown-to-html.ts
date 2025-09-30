import { marked } from 'marked'
import { isMarkdownContent, sanitizeHtml } from '~/utils/html-sanitizer'

marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true // GitHub Flavored Markdown
})

export const convertMarkdownToHtml = (markdown: string) => {
  if (!markdown) return ''

  try {
    // Convert markdown to HTML
    const rawHtml = marked.parse(markdown) as string

    // Sanitize the HTML output
    return sanitizeHtml(rawHtml)
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    // Return sanitized plain text as fallback
    return sanitizeHtml(markdown)
  }
}

export const prepareContentForDisplay = (content: string) => {
  if (!content) return ''

  // If it looks like HTML already, just sanitize it
  if (content.trim().startsWith('<')) {
    return sanitizeHtml(content)
  }

  // Check if it's markdown and convert
  if (isMarkdownContent(content)) {
    return convertMarkdownToHtml(content)
  }

  // Otherwise just sanitize plain text
  return sanitizeHtml(content)
}
