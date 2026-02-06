const { extractMetadata, parseLanguage, parseCategory } = require('../src/metadata-extraction');

describe('metadata-extraction', () => {
  describe('extractMetadata', () => {
    it('extracts title, tldr, category, and language from YAML front matter', () => {
      const content = `---
title: "Protest Safety Guide"
tldr: "How to stay safe at protests"
categories:
  - protest-safety
date: 2025-01-15
---

This is the document body.
`;
      const filePath = 'content/en/protest-safety/staying-safe/index.md';
      const result = extractMetadata(content, filePath);

      expect(result.title).toBe('Protest Safety Guide');
      expect(result.tldr).toBe('How to stay safe at protests');
      expect(result.category).toBe('Protest Safety');
      expect(result.language).toBe('EN');
    });

    it('handles TOML front matter (Hugo +++ delimiters)', () => {
      const content = `+++
title = "Digital Security Basics"
tldr = "Essential digital security practices"
categories = ["digital-security"]
+++

Content here.
`;
      const filePath = 'content/en/digital-security/basics/index.md';
      const result = extractMetadata(content, filePath);

      expect(result.title).toBe('Digital Security Basics');
      expect(result.tldr).toBe('Essential digital security practices');
      expect(result.category).toBe('Digital Security');
      expect(result.language).toBe('EN');
    });

    it('handles missing tldr field gracefully', () => {
      const content = `---
title: "Untitled Guide"
---

Body text.
`;
      const filePath = 'content/en/mutual-aid/guide/index.md';
      const result = extractMetadata(content, filePath);

      expect(result.title).toBe('Untitled Guide');
      expect(result.tldr).toBe('');
      expect(result.category).toBe('Mutual Aid');
      expect(result.language).toBe('EN');
    });

    it('handles missing title field gracefully', () => {
      const content = `---
tldr: "Some summary"
---

Body.
`;
      const filePath = 'content/en/legal/know-your-rights.md';
      const result = extractMetadata(content, filePath);

      expect(result.title).toBe('Untitled');
      expect(result.tldr).toBe('Some summary');
    });

    it('handles missing categories field and infers from path', () => {
      const content = `---
title: "Test Doc"
---
`;
      const filePath = 'content/de/wellbeing/self-care/index.md';
      const result = extractMetadata(content, filePath);

      expect(result.category).toBe('Wellbeing');
      expect(result.language).toBe('DE');
    });

    it('uses "anemone" as default author', () => {
      const content = `---
title: "Community Guide"
---
`;
      const filePath = 'content/en/mutual-aid/community/index.md';
      const result = extractMetadata(content, filePath);

      expect(result.author).toBe('anemone');
    });

    it('uses specified author when provided', () => {
      const content = `---
title: "Expert Guide"
author: "contributor42"
---
`;
      const filePath = 'content/en/movement/organizing/index.md';
      const result = extractMetadata(content, filePath);

      expect(result.author).toBe('contributor42');
    });

    it('handles empty content gracefully', () => {
      const result = extractMetadata('', 'content/en/test/doc.md');

      expect(result.title).toBe('Untitled');
      expect(result.tldr).toBe('');
      expect(result.author).toBe('anemone');
    });

    it('handles content with no front matter gracefully', () => {
      const content = 'Just some plain text without front matter.';
      const result = extractMetadata(content, 'content/en/test/doc.md');

      expect(result.title).toBe('Untitled');
      expect(result.tldr).toBe('');
    });
  });

  describe('parseLanguage', () => {
    it('extracts language code from content path', () => {
      expect(parseLanguage('content/en/some/path.md')).toBe('EN');
      expect(parseLanguage('content/de/some/path.md')).toBe('DE');
    });

    it('returns UNKNOWN for unexpected paths', () => {
      expect(parseLanguage('other/path.md')).toBe('UNKNOWN');
    });
  });

  describe('parseCategory', () => {
    it('converts slug to human-readable category', () => {
      expect(parseCategory('protest-safety')).toBe('Protest Safety');
      expect(parseCategory('digital-security')).toBe('Digital Security');
      expect(parseCategory('mutual-aid')).toBe('Mutual Aid');
      expect(parseCategory('wellbeing')).toBe('Wellbeing');
    });
  });
});
