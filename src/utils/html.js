// Lightweight HTML-to-plain-text conversion for job descriptions pulled
// from APIs/pages. Doesn't need to be perfect — just clean enough for an
// LLM to read; no DOM available outside of the Playwright scrape paths.
export function stripHtml(html) {
  if (!html) return '';
  return html
    // Some sources (e.g. Greenhouse) return HTML that's itself entity-encoded
    // (literal "&lt;h2&gt;"), so entities must be decoded before tags can be
    // matched/stripped at all — decoding after stripping would just
    // reintroduce real tags from their encoded form.
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<(br|\/p|\/li|\/div|\/h[1-6])\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
