#!/usr/bin/env node
/**
 * Tests that verify Hugo template HTML structure for accessibility and correctness.
 * Run with: node scripts/tests/template-structure.test.js
 *
 * Requires Hugo build output in public/ directory.
 */
const fs = require('fs');
const path = require('path');

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

function readPublicHTML(relPath) {
  const filePath = path.join(__dirname, '..', '..', 'public', relPath);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf-8');
}

// --- Skip-to-content link (task 1.6) ---
console.log('\n--- Skip-to-content link ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<header/i);
    assert(bodyMatch !== null, 'has content between <body> and <header>');
    if (bodyMatch) {
      assert(
        bodyMatch[1].includes('skip') || bodyMatch[1].includes('Skip'),
        'skip-to-content link appears before <header>'
      );
      assert(
        bodyMatch[1].includes('#main-content') || bodyMatch[1].includes('#main'),
        'skip link targets main content area'
      );
    }
    // Hugo minification may strip attribute quotes: class=skip-link or class="skip-link"
    assert(
      html.includes('class="skip-link"') || html.includes('class=skip-link'),
      'skip link has class="skip-link"'
    );
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

// --- Footer content (task 9.5) ---
console.log('\n--- Footer content ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
    assert(footerMatch !== null, 'page has a <footer> element');
    if (footerMatch) {
      assert(
        footerMatch[1].includes('CC BY-SA') || footerMatch[1].includes('licensed'),
        'footer contains license text'
      );
      assert(
        footerMatch[1].includes('github.com') || footerMatch[1].includes('GitHub'),
        'footer contains source code link'
      );
      // IPFS link is conditional — only shown when ipfsGateway is configured in hugo.toml
      // When gateway is empty, the link should NOT appear (correct behavior)
    }
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

// --- Language switcher (task 6.1) ---
console.log('\n--- Language switcher ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    assert(
      html.includes('language-switcher') || html.includes('lang-switcher'),
      'page contains a language switcher element'
    );
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

// --- Semantic landmarks (task 5.5) ---
console.log('\n--- Semantic landmarks ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    assert(html.includes('<header'), 'page has <header> landmark');
    assert(html.includes('<main'), 'page has <main> landmark');
    assert(html.includes('<footer'), 'page has <footer> landmark');
    assert(html.includes('<nav'), 'page has <nav> landmark');
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
process.exit(failed > 0 ? 1 : 0);
