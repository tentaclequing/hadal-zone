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

// --- Document license display ---
console.log('\n--- Document license display ---');
{
  // Test default license on a document WITHOUT a license field
  const html = readPublicHTML('en/digital-security/phone-security-at-protests/index.html');
  if (html) {
    // Should have a meta-license element inside document-meta
    assert(
      html.includes('meta-license'),
      'document page has a meta-license element'
    );
    // Extract the document-meta section and check license is in there
    const metaMatch = html.match(/class=["']?document-meta["']?[^>]*>([\s\S]*?)<\/div>\s*<\/header>/i);
    assert(
      metaMatch && metaMatch[1].includes('CC BY-SA 4.0'),
      'document-meta section shows default CC BY-SA 4.0 when no license in front matter'
    );
    // Should have the i18n "License" label inside meta
    assert(
      metaMatch && metaMatch[1].includes('License'),
      'document-meta section has a License label'
    );
  } else {
    console.log('  SKIP: public/en/digital-security/phone-security-at-protests/index.html not found — run hugo build first');
  }

  // Test custom license on a document WITH a license field
  const htmlCustom = readPublicHTML('en/protest-safety/test-doc/index.html');
  if (htmlCustom) {
    assert(
      htmlCustom.includes('meta-license'),
      'test-doc page has a meta-license element'
    );
    // test-doc has license: "CC0 1.0" set in its front matter
    assert(
      htmlCustom.includes('CC0 1.0'),
      'test-doc with custom license shows CC0 1.0'
    );
  } else {
    console.log('  SKIP: public/en/protest-safety/test-doc/index.html not found — run hugo build first');
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

// --- Homepage category library (homepage redesign) ---
console.log('\n--- Homepage category library ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    assert(
      html.includes('class="category-grid"') || html.includes('class=category-grid'),
      'homepage has a category-grid section'
    );
    assert(
      html.includes('class="category-card"') || html.includes('class=category-card'),
      'homepage has category-card elements'
    );
    assert(
      html.includes('category-library') || html.includes('Content Library') || html.includes('content-library'),
      'homepage has a content library heading or section identifier'
    );
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

// --- Homepage "Latest" section ---
console.log('\n--- Homepage latest section ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    assert(
      html.includes('class="latest-section"') || html.includes('class=latest-section'),
      'homepage has a latest-section element'
    );
    const latestMatch = html.match(/class=["']?latest-section["']?[^>]*>([\s\S]*?)(?:<section|<\/main)/i);
    assert(
      latestMatch && (latestMatch[1].includes('latest-item') || latestMatch[1].includes('latest-list')),
      'latest section contains latest-item or latest-list elements'
    );
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

// --- Footer "Help keep this page up" link ---
console.log('\n--- Footer mirror link ---');
{
  const html = readPublicHTML('en/index.html');
  if (html) {
    const footerMatch = html.match(/<footer[^>]*>([\s\S]*?)<\/footer>/i);
    assert(footerMatch !== null, 'page has a <footer> element (mirror link test)');
    if (footerMatch) {
      assert(
        footerMatch[1].includes('/mirror') || footerMatch[1].includes('/mirror/'),
        'footer contains a link to the mirror page'
      );
      assert(
        footerMatch[1].includes('footer-mirror') || footerMatch[1].includes('keep') || footerMatch[1].includes('Keep'),
        'footer contains help keep this page up link text or class'
      );
    }
  } else {
    console.log('  SKIP: public/en/index.html not found — run hugo build first');
  }
}

// --- Mirror section with IPFS sub-pages ---
console.log('\n--- Mirror section and IPFS node help page ---');
{
  // EN: mirror section should list sub-pages
  const mirrorEN = readPublicHTML('en/mirror/index.html');
  if (mirrorEN) {
    assert(
      mirrorEN.includes('ipfs-for-everyone') || mirrorEN.includes('IPFS for Everyone'),
      'EN mirror section links to ipfs-for-everyone sub-page'
    );
  } else {
    console.error('  FAIL: public/en/mirror/index.html not found');
    failed++;
  }

  // EN: ipfs-for-everyone page exists and has expected content
  const ipfsEN = readPublicHTML('en/mirror/ipfs-for-everyone/index.html');
  if (ipfsEN) {
    assert(
      ipfsEN.includes('IPFS Desktop'),
      'EN ipfs-for-everyone page mentions IPFS Desktop'
    );
    // Check that page has the document-page wrapper (rendered via page.html layout)
    assert(
      ipfsEN.includes('document-page') || ipfsEN.includes('document-content'),
      'EN ipfs-for-everyone page uses document layout'
    );
  } else {
    console.error('  FAIL: public/en/mirror/ipfs-for-everyone/index.html not found');
    failed++;
  }

  // DE: mirror section should list sub-pages
  const mirrorDE = readPublicHTML('de/mirror/index.html');
  if (mirrorDE) {
    assert(
      mirrorDE.includes('ipfs-fuer-alle') || mirrorDE.includes('IPFS für alle'),
      'DE mirror section links to ipfs-fuer-alle sub-page'
    );
  } else {
    console.error('  FAIL: public/de/mirror/index.html not found');
    failed++;
  }

  // DE: ipfs-fuer-alle page exists and has expected content
  const ipfsDE = readPublicHTML('de/mirror/ipfs-fuer-alle/index.html');
  if (ipfsDE) {
    assert(
      ipfsDE.includes('IPFS Desktop'),
      'DE ipfs-fuer-alle page mentions IPFS Desktop'
    );
    assert(
      ipfsDE.includes('document-page') || ipfsDE.includes('document-content'),
      'DE ipfs-fuer-alle page uses document layout'
    );
  } else {
    console.error('  FAIL: public/de/mirror/ipfs-fuer-alle/index.html not found');
    failed++;
  }
}

console.log(`\n--- Results: ${passed} passed, ${failed} failed ---\n`);
process.exit(failed > 0 ? 1 : 0);
