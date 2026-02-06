const { detectNewDocuments } = require('../src/diff-detection');

describe('diff-detection', () => {
  describe('detectNewDocuments', () => {
    it('identifies newly added content markdown files', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: ['content/en/protest-safety/staying-safe/index.md'],
            modified: [],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual(['content/en/protest-safety/staying-safe/index.md']);
    });

    it('identifies content .md files (not just index.md)', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: ['content/en/digital-security/vpn-guide.md'],
            modified: [],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual(['content/en/digital-security/vpn-guide.md']);
    });

    it('ignores _index.md files (section pages, not documents)', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: ['content/en/new-category/_index.md'],
            modified: [],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([]);
    });

    it('ignores non-content changes (config, theme, CI)', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: [
              'hugo.toml',
              '.github/workflows/deploy.yml',
              'themes/hadal/layouts/index.html',
              'static/css/style.css'
            ],
            modified: [],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([]);
    });

    it('handles multiple new files across multiple commits', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: ['content/en/protest-safety/staying-safe/index.md'],
            modified: [],
            removed: []
          },
          {
            added: ['content/de/protest-safety/sicher-bleiben/index.md'],
            modified: ['hugo.toml'],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([
        'content/en/protest-safety/staying-safe/index.md',
        'content/de/protest-safety/sicher-bleiben/index.md'
      ]);
    });

    it('ignores modified files (only newly added)', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: [],
            modified: ['content/en/protest-safety/staying-safe/index.md'],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([]);
    });

    it('ignores pushes to non-main branches', () => {
      const payload = {
        ref: 'refs/heads/feature/new-docs',
        commits: [
          {
            added: ['content/en/protest-safety/staying-safe/index.md'],
            modified: [],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([]);
    });

    it('deduplicates files added in multiple commits', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: [
          {
            added: ['content/en/protest-safety/staying-safe/index.md'],
            modified: [],
            removed: []
          },
          {
            added: ['content/en/protest-safety/staying-safe/index.md'],
            modified: [],
            removed: []
          }
        ]
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual(['content/en/protest-safety/staying-safe/index.md']);
    });

    it('handles empty commits array', () => {
      const payload = {
        ref: 'refs/heads/main',
        commits: []
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([]);
    });

    it('handles missing commits field gracefully', () => {
      const payload = {
        ref: 'refs/heads/main'
      };

      const result = detectNewDocuments(payload);
      expect(result).toEqual([]);
    });
  });
});
