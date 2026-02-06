#!/usr/bin/env node
/**
 * Simple test runner for validate-frontmatter that avoids Jest CLI issues.
 * Run with: node scripts/run-tests.js
 */
const path = require('path');
const fs = require('fs');
const os = require('os');
const { parseFrontMatter, validateFrontMatter, validateFile } = require('./validate-frontmatter');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`  FAIL: ${message}`);
    failed++;
  } else {
    console.log(`  PASS: ${message}`);
    passed++;
  }
}

function assertEqual(actual, expected, message) {
  const a = JSON.stringify(actual);
  const e = JSON.stringify(expected);
  assert(a === e, `${message} (got ${a}, expected ${e})`);
}

console.log('\n--- parseFrontMatter ---');

{
  const content = '---\ntitle: Test Article\ntldr: A short summary\ncategories:\n  - mutual-aid\nauthor: someone\n---\n\nBody content here.';
  const result = parseFrontMatter(content);
  assert(result !== null, 'parses valid YAML front matter');
  assertEqual(result.title, 'Test Article', 'extracts title');
  assertEqual(result.tldr, 'A short summary', 'extracts tldr');
  assertEqual(result.categories, ['mutual-aid'], 'extracts categories');
}

{
  const result = parseFrontMatter('Just some text without front matter.');
  assertEqual(result, null, 'returns null for content without front matter');
}

{
  const content = '---\ntitle: Missing closing delimiter\n\nBody content.';
  const result = parseFrontMatter(content);
  assertEqual(result, null, 'returns null for malformed front matter');
}

console.log('\n--- validateFrontMatter ---');

{
  const data = {
    title: 'How to Organize a Mutual Aid Network',
    tldr: 'Step-by-step guide to building community resilience.',
    categories: ['mutual-aid', 'skillsharing'],
    author: 'anemone',
  };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 0, 'passes for valid front matter with all required fields');
}

{
  const data = { tldr: 'A summary.', categories: ['mutual-aid'] };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 1, 'fails for missing title');
  assert(errors[0].includes('title'), 'error message mentions title');
}

{
  const data = { title: 'Some Title', categories: ['mutual-aid'] };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 1, 'fails for missing tldr');
  assert(errors[0].includes('tldr'), 'error message mentions tldr');
}

{
  const data = { title: 'Some Title', tldr: 'A summary.' };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 1, 'fails for missing categories');
  assert(errors[0].includes('categories'), 'error message mentions categories');
}

{
  const data = { title: 'Some Title', tldr: 'A summary.', categories: [] };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 1, 'fails for empty categories array');
}

{
  const data = {};
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 3, 'fails for multiple missing fields');
}

{
  const data = {
    title: 'Anonymous Guide',
    tldr: 'Written by the default author.',
    categories: ['digital-security'],
  };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 0, 'handles anemone default author (no author field needed)');
}

{
  const data = {
    title: 'Anonymous Guide',
    tldr: 'Written by anemone.',
    categories: ['digital-security'],
    author: 'anemone',
  };
  const errors = validateFrontMatter(data, 'test.md');
  assertEqual(errors.length, 0, 'passes when author is explicitly set to anemone');
}

console.log('\n--- validateFile ---');

{
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-test-'));
  try {
    const filePath = path.join(tmpDir, 'valid-article.md');
    fs.writeFileSync(filePath, '---\ntitle: Valid Article\ntldr: This article is valid.\ncategories:\n  - protest-safety\n---\n\nContent here.');
    const errors = validateFile(filePath);
    assertEqual(errors.length, 0, 'returns no errors for a valid content file');

    const filePath2 = path.join(tmpDir, 'invalid-article.md');
    fs.writeFileSync(filePath2, '---\ntitle: Only Title\n---\n\nContent here.');
    const errors2 = validateFile(filePath2);
    assertEqual(errors2.length, 2, 'returns errors for a file with missing required fields');
    assert(errors2.some(e => e.includes('tldr')), 'error includes tldr');
    assert(errors2.some(e => e.includes('categories')), 'error includes categories');

    const filePath3 = path.join(tmpDir, 'no-frontmatter.md');
    fs.writeFileSync(filePath3, 'Just plain text.');
    const errors3 = validateFile(filePath3);
    assertEqual(errors3.length, 1, 'returns error for file without front matter');
    assert(errors3[0].includes('No front matter found'), 'error mentions no front matter');
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
process.exit(failed > 0 ? 1 : 0);
