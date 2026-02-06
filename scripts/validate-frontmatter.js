#!/usr/bin/env node

/**
 * Front matter validator for hadal-zone content files.
 *
 * Reads all content/**\/*.md files (excluding _index.md section pages),
 * parses YAML front matter, and checks that required fields are present:
 *   - title
 *   - tldr
 *   - categories (must be a non-empty array)
 *
 * The "author" field is optional because the site uses a default author
 * ("anemone") configured in hugo.toml via params.defaultAuthor.
 *
 * Exit code 0 = all files valid, exit code 1 = validation errors found.
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const REQUIRED_FIELDS = ['title', 'tldr', 'categories'];

/**
 * Parse YAML front matter from a markdown string.
 * Returns the parsed object, or null if no valid front matter is found.
 */
function parseFrontMatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return null;
  }
  try {
    return yaml.load(match[1]) || {};
  } catch (e) {
    return null;
  }
}

/**
 * Validate front matter data against required fields.
 * Returns an array of error messages (empty if valid).
 */
function validateFrontMatter(data, filePath) {
  const errors = [];

  for (const field of REQUIRED_FIELDS) {
    if (field === 'categories') {
      if (!data.categories || !Array.isArray(data.categories) || data.categories.length === 0) {
        errors.push(`${filePath}: missing or empty required field "categories" (must be a non-empty array)`);
      }
    } else {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors.push(`${filePath}: missing required field "${field}"`);
      }
    }
  }

  return errors;
}

/**
 * Validate a single file. Returns array of error messages.
 */
function validateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const data = parseFrontMatter(content);

  if (data === null) {
    return [`${filePath}: No front matter found`];
  }

  return validateFrontMatter(data, filePath);
}

/**
 * Recursively find all .md files in a directory, excluding _index.md files.
 */
function findContentFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) {
    return results;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findContentFiles(fullPath));
    } else if (
      entry.name.endsWith('.md') &&
      entry.name !== '_index.md'
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Main: validate all content files and report results.
 */
function main() {
  const contentDir = path.resolve(__dirname, '..', 'content');
  const files = findContentFiles(contentDir);

  if (files.length === 0) {
    console.log('No content files to validate (section _index.md files are excluded).');
    process.exit(0);
  }

  let allErrors = [];

  for (const file of files) {
    const relPath = path.relative(path.resolve(__dirname, '..'), file);
    const errors = validateFile(file);
    if (errors.length > 0) {
      allErrors.push(...errors);
    }
  }

  if (allErrors.length > 0) {
    console.error('Front matter validation failed:');
    for (const err of allErrors) {
      console.error(`  - ${err}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${files.length} content file(s) successfully.`);
  process.exit(0);
}

// Export for testing
module.exports = { parseFrontMatter, validateFrontMatter, validateFile };

// Run main when executed directly
if (require.main === module) {
  main();
}
