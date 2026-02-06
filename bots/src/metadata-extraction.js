/**
 * Extract document metadata from markdown file content and file path.
 *
 * Supports both YAML (---) and TOML (+++) front matter delimiters.
 * Falls back to path-based inference when front matter fields are missing.
 */

/**
 * Parse language code from content file path.
 * Expects paths like content/en/... or content/de/...
 */
function parseLanguage(filePath) {
  const match = filePath.match(/^content\/([a-z]{2})\//);
  if (match) {
    return match[1].toUpperCase();
  }
  return 'UNKNOWN';
}

/**
 * Convert a slug like "protest-safety" to "Protest Safety".
 */
function parseCategory(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Parse front matter from markdown content.
 * Returns an object with raw key-value pairs.
 */
function parseFrontMatter(content) {
  if (!content || !content.trim()) {
    return {};
  }

  const trimmed = content.trim();

  // Try YAML front matter (---)
  const yamlMatch = trimmed.match(/^---\s*\n([\s\S]*?)\n---/);
  if (yamlMatch) {
    return parseYamlLike(yamlMatch[1]);
  }

  // Try TOML front matter (+++)
  const tomlMatch = trimmed.match(/^\+\+\+\s*\n([\s\S]*?)\n\+\+\+/);
  if (tomlMatch) {
    return parseTomlLike(tomlMatch[1]);
  }

  return {};
}

/**
 * Simple YAML-like parser for front matter.
 * Handles basic key: value pairs, quoted strings, and simple arrays.
 */
function parseYamlLike(text) {
  const result = {};
  const lines = text.split('\n');
  let currentKey = null;

  for (const line of lines) {
    // Skip empty lines and comments
    if (!line.trim() || line.trim().startsWith('#')) continue;

    // Check for key: value pair
    const kvMatch = line.match(/^(\w[\w-]*)\s*:\s*(.*)/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].trim();
      if (value) {
        // Remove surrounding quotes
        result[currentKey] = value.replace(/^["'](.*)["']$/, '$1');
      } else {
        result[currentKey] = [];
      }
      continue;
    }

    // Check for array item (  - value)
    const arrayMatch = line.match(/^\s+-\s+(.*)/);
    if (arrayMatch && currentKey) {
      if (!Array.isArray(result[currentKey])) {
        result[currentKey] = [];
      }
      result[currentKey].push(arrayMatch[1].trim().replace(/^["'](.*)["']$/, '$1'));
    }
  }

  return result;
}

/**
 * Simple TOML-like parser for front matter.
 * Handles basic key = value pairs and simple arrays.
 */
function parseTomlLike(text) {
  const result = {};
  const lines = text.split('\n');

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue;

    const kvMatch = line.match(/^(\w[\w-]*)\s*=\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1];
      let value = kvMatch[2].trim();

      // Handle arrays like ["value1", "value2"]
      const arrayMatch = value.match(/^\[(.*)\]$/);
      if (arrayMatch) {
        result[key] = arrayMatch[1]
          .split(',')
          .map(v => v.trim().replace(/^["'](.*)["']$/, '$1'))
          .filter(v => v);
      } else {
        // Remove surrounding quotes
        result[key] = value.replace(/^["'](.*)["']$/, '$1');
      }
    }
  }

  return result;
}

/**
 * Infer category from file path.
 * Path pattern: content/{lang}/{category}/...
 */
function inferCategory(filePath) {
  const match = filePath.match(/^content\/[a-z]{2}\/([^/]+)/);
  if (match) {
    return parseCategory(match[1]);
  }
  return '';
}

/**
 * Extract metadata from markdown content and file path.
 *
 * @param {string} content - Raw markdown file content
 * @param {string} filePath - Path relative to repo root (e.g. content/en/protest-safety/doc/index.md)
 * @returns {{ title: string, tldr: string, category: string, language: string, author: string }}
 */
function extractMetadata(content, filePath) {
  const frontMatter = parseFrontMatter(content);

  // Extract category from front matter or infer from path
  let category = '';
  if (frontMatter.categories) {
    const cats = Array.isArray(frontMatter.categories)
      ? frontMatter.categories
      : [frontMatter.categories];
    category = cats.length > 0 ? parseCategory(cats[0]) : inferCategory(filePath);
  } else {
    category = inferCategory(filePath);
  }

  return {
    title: frontMatter.title || 'Untitled',
    tldr: frontMatter.tldr || '',
    category,
    language: parseLanguage(filePath),
    author: frontMatter.author || 'anemone'
  };
}

module.exports = { extractMetadata, parseLanguage, parseCategory };
