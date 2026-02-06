const { parseFrontMatter, validateFrontMatter, validateFile } = require('../validate-frontmatter');
const path = require('path');
const fs = require('fs');
const os = require('os');

describe('parseFrontMatter', () => {
  test('parses valid YAML front matter', () => {
    const content = [
      '---',
      'title: Test Article',
      'tldr: A short summary',
      'categories:',
      '  - mutual-aid',
      'author: someone',
      '---',
      '',
      'Body content here.',
    ].join('\n');
    const result = parseFrontMatter(content);
    expect(result).toEqual({
      title: 'Test Article',
      tldr: 'A short summary',
      categories: ['mutual-aid'],
      author: 'someone',
    });
  });

  test('returns null for content without front matter', () => {
    const content = 'Just some text without front matter.';
    const result = parseFrontMatter(content);
    expect(result).toBeNull();
  });

  test('returns null for malformed front matter', () => {
    const content = [
      '---',
      'title: Missing closing delimiter',
      '',
      'Body content.',
    ].join('\n');
    const result = parseFrontMatter(content);
    expect(result).toBeNull();
  });
});

describe('validateFrontMatter', () => {
  test('passes for valid front matter with all required fields', () => {
    const data = {
      title: 'How to Organize a Mutual Aid Network',
      tldr: 'Step-by-step guide to building community resilience through mutual aid.',
      categories: ['mutual-aid', 'skillsharing'],
      author: 'anemone',
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors).toEqual([]);
  });

  test('fails for missing title', () => {
    const data = {
      tldr: 'A summary.',
      categories: ['mutual-aid'],
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('title');
  });

  test('fails for missing tldr', () => {
    const data = {
      title: 'Some Title',
      categories: ['mutual-aid'],
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('tldr');
  });

  test('fails for missing categories', () => {
    const data = {
      title: 'Some Title',
      tldr: 'A summary.',
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('categories');
  });

  test('fails for empty categories array', () => {
    const data = {
      title: 'Some Title',
      tldr: 'A summary.',
      categories: [],
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('categories');
  });

  test('fails for multiple missing fields', () => {
    const data = {};
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors.length).toBe(3);
  });

  test('handles anemone default author (no author field needed)', () => {
    const data = {
      title: 'Anonymous Guide',
      tldr: 'Written by the default author.',
      categories: ['digital-security'],
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors).toEqual([]);
  });

  test('passes when author is explicitly set to anemone', () => {
    const data = {
      title: 'Anonymous Guide',
      tldr: 'Written by anemone.',
      categories: ['digital-security'],
      author: 'anemone',
    };
    const errors = validateFrontMatter(data, 'test-file.md');
    expect(errors).toEqual([]);
  });
});

describe('validateFile', () => {
  let tmpDir;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'frontmatter-test-'));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  test('returns no errors for a valid content file', () => {
    const filePath = path.join(tmpDir, 'valid-article.md');
    fs.writeFileSync(filePath, [
      '---',
      'title: Valid Article',
      'tldr: This article is valid.',
      'categories:',
      '  - protest-safety',
      '---',
      '',
      'Content here.',
    ].join('\n'));

    const errors = validateFile(filePath);
    expect(errors).toEqual([]);
  });

  test('returns errors for a file with missing required fields', () => {
    const filePath = path.join(tmpDir, 'invalid-article.md');
    fs.writeFileSync(filePath, [
      '---',
      'title: Only Title',
      '---',
      '',
      'Content here.',
    ].join('\n'));

    const errors = validateFile(filePath);
    expect(errors.length).toBe(2);
    expect(errors.some(e => e.includes('tldr'))).toBe(true);
    expect(errors.some(e => e.includes('categories'))).toBe(true);
  });

  test('returns error for file without front matter', () => {
    const filePath = path.join(tmpDir, 'no-frontmatter.md');
    fs.writeFileSync(filePath, 'Just plain text.');

    const errors = validateFile(filePath);
    expect(errors.length).toBe(1);
    expect(errors[0]).toContain('No front matter found');
  });
});
