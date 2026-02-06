/**
 * Format notification messages for new documents.
 *
 * Produces a consistent plain-text format used by both
 * the Telegram and Matrix notification bots.
 */

/**
 * Build the public URL for a document from its content file path.
 *
 * @param {string} filePath - Repo-relative path, e.g. "content/en/protest-safety/guide/index.md"
 * @param {string} baseUrl  - Site base URL, e.g. "https://tentaclequing.github.io/hadal-zone"
 * @returns {string} Full public URL
 */
function buildDocumentUrl(filePath, baseUrl) {
  // Strip "content/" prefix
  let urlPath = filePath.replace(/^content\//, '');

  // Remove index.md or .md extension
  if (urlPath.endsWith('/index.md')) {
    urlPath = urlPath.replace(/\/index\.md$/, '/');
  } else if (urlPath.endsWith('.md')) {
    urlPath = urlPath.replace(/\.md$/, '/');
  }

  // Ensure base URL has no trailing slash
  const base = baseUrl.replace(/\/+$/, '');

  return `${base}/${urlPath}`;
}

/**
 * Format a notification message for a newly added document.
 *
 * @param {{ title: string, tldr: string, category: string, language: string }} metadata
 * @param {string} url - Full URL to the document
 * @returns {string} Formatted notification message
 */
function formatNotification(metadata, url) {
  const lines = [
    'New resource on hadal-zone:',
    `\u{1F4C4} ${metadata.title} (${metadata.language})`,
    `Category: ${metadata.category}`
  ];

  if (metadata.tldr) {
    lines.push(`TL;DR: ${metadata.tldr}`);
  }

  lines.push(`Read: ${url}`);

  return lines.join('\n');
}

module.exports = { formatNotification, buildDocumentUrl };
