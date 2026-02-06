const { formatNotification, buildDocumentUrl } = require('../src/message-format');

describe('message-format', () => {
  describe('formatNotification', () => {
    it('formats a complete notification message', () => {
      const metadata = {
        title: 'Protest Safety Guide',
        tldr: 'How to stay safe at protests',
        category: 'Protest Safety',
        language: 'EN',
        author: 'anemone'
      };
      const url = 'https://tentaclequing.github.io/hadal-zone/en/protest-safety/staying-safe/';

      const result = formatNotification(metadata, url);

      expect(result).toContain('New resource on hadal-zone:');
      expect(result).toContain('Protest Safety Guide (EN)');
      expect(result).toContain('Category: Protest Safety');
      expect(result).toContain('TL;DR: How to stay safe at protests');
      expect(result).toContain('Read: https://tentaclequing.github.io/hadal-zone/en/protest-safety/staying-safe/');
    });

    it('includes the document emoji indicator', () => {
      const metadata = {
        title: 'Test Doc',
        tldr: 'A test',
        category: 'Testing',
        language: 'EN',
        author: 'anemone'
      };
      const url = 'https://example.com/doc';

      const result = formatNotification(metadata, url);
      // The spec shows a document emoji before the title
      expect(result).toMatch(/\u{1F4C4}\s*Test Doc \(EN\)/u);
    });

    it('omits TL;DR line when tldr is empty', () => {
      const metadata = {
        title: 'Minimal Doc',
        tldr: '',
        category: 'Legal',
        language: 'DE',
        author: 'anemone'
      };
      const url = 'https://example.com/doc';

      const result = formatNotification(metadata, url);

      expect(result).not.toContain('TL;DR:');
      expect(result).toContain('Minimal Doc (DE)');
      expect(result).toContain('Category: Legal');
    });

    it('produces consistent format matching the spec', () => {
      const metadata = {
        title: 'Protest Safety Guide',
        tldr: 'How to stay safe at protests',
        category: 'Protest Safety',
        language: 'EN',
        author: 'anemone'
      };
      const url = 'https://tentaclequing.github.io/hadal-zone/en/protest-safety/staying-safe/';

      const expected = [
        'New resource on hadal-zone:',
        '\u{1F4C4} Protest Safety Guide (EN)',
        'Category: Protest Safety',
        'TL;DR: How to stay safe at protests',
        'Read: https://tentaclequing.github.io/hadal-zone/en/protest-safety/staying-safe/'
      ].join('\n');

      expect(formatNotification(metadata, url)).toBe(expected);
    });
  });

  describe('buildDocumentUrl', () => {
    const baseUrl = 'https://tentaclequing.github.io/hadal-zone';

    it('builds URL from content file path with index.md', () => {
      const filePath = 'content/en/protest-safety/staying-safe/index.md';
      const result = buildDocumentUrl(filePath, baseUrl);
      expect(result).toBe('https://tentaclequing.github.io/hadal-zone/en/protest-safety/staying-safe/');
    });

    it('builds URL from content file path with named .md file', () => {
      const filePath = 'content/en/digital-security/vpn-guide.md';
      const result = buildDocumentUrl(filePath, baseUrl);
      expect(result).toBe('https://tentaclequing.github.io/hadal-zone/en/digital-security/vpn-guide/');
    });

    it('builds URL for German content', () => {
      const filePath = 'content/de/protest-safety/sicher-bleiben/index.md';
      const result = buildDocumentUrl(filePath, baseUrl);
      expect(result).toBe('https://tentaclequing.github.io/hadal-zone/de/protest-safety/sicher-bleiben/');
    });

    it('strips trailing slash from base URL to avoid double slashes', () => {
      const filePath = 'content/en/test/doc/index.md';
      const result = buildDocumentUrl(filePath, 'https://example.com/site/');
      expect(result).toBe('https://example.com/site/en/test/doc/');
    });
  });
});
