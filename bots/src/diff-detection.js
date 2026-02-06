/**
 * Parse a GitHub push webhook payload and identify newly added document files.
 *
 * A "document" is any .md file under content/ that is NOT named _index.md.
 * Files named _index.md are Hugo section pages (category listings), not documents.
 *
 * Only files from pushes to the main branch are considered.
 * Only newly added files are considered (not modified or removed).
 */

const CONTENT_DOC_PATTERN = /^content\/.+\.md$/;
const SECTION_INDEX_PATTERN = /_index\.md$/;

function isNewDocument(filePath) {
  return CONTENT_DOC_PATTERN.test(filePath) && !SECTION_INDEX_PATTERN.test(filePath);
}

function detectNewDocuments(payload) {
  // Only process pushes to main branch
  if (payload.ref !== 'refs/heads/main') {
    return [];
  }

  const commits = payload.commits || [];
  const addedFiles = new Set();

  for (const commit of commits) {
    const added = commit.added || [];
    for (const file of added) {
      if (isNewDocument(file)) {
        addedFiles.add(file);
      }
    }
  }

  return Array.from(addedFiles);
}

module.exports = { detectNewDocuments, isNewDocument };
