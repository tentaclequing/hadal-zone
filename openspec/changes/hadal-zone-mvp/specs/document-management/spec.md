## ADDED Requirements

### Requirement: Document storage structure
Each document group SHALL be stored as a folder containing a metadata.yaml file and one subfolder per language, each containing the document files.

#### Scenario: Standard document folder structure
- **WHEN** a new document is added to the library
- **THEN** it follows the structure: `content/<lang>/<category>/<document-slug>/` containing the document files and front matter metadata

#### Scenario: Multi-language document group
- **WHEN** a document exists in multiple languages
- **THEN** each language version lives in its respective language content directory, linked by a shared document ID in metadata

### Requirement: Metadata schema
Every document SHALL have metadata including: title, author(s), TL;DR summary, language, country (if country-specific), category, tags, date added, and date last modified.

#### Scenario: Complete metadata present
- **WHEN** a document page is rendered
- **THEN** the title, author, TL;DR, language, category, and date are all displayed

#### Scenario: Metadata validation at build time
- **WHEN** a document is missing required metadata fields (title, author, tldr, category)
- **THEN** the Hugo build fails with a clear error message identifying the document and missing fields

### Requirement: Anonymous author support
When a document has no named author, the author field SHALL display "anemone" as the attribution.

#### Scenario: Document with no author specified
- **WHEN** a document's author field is empty or set to "anemone"
- **THEN** the document page displays "anemone" as the author name

#### Scenario: Document with named author
- **WHEN** a document's author field contains one or more names
- **THEN** the document page displays those names as attribution

### Requirement: TL;DR summary
Every document SHALL have a TL;DR summary displayed prominently before the user views or downloads the full document.

#### Scenario: TL;DR displayed on document page
- **WHEN** a user navigates to a document's page
- **THEN** the TL;DR summary is visible above the document preview/download area

#### Scenario: TL;DR displayed in search results
- **WHEN** a document appears in search results
- **THEN** the TL;DR summary is shown alongside the title

### Requirement: Version history via git
All documents SHALL be version-controlled via git. Users SHALL be able to see when a document was last modified.

#### Scenario: Last modified date displayed
- **WHEN** a user views a document page
- **THEN** the date of the last modification is displayed

#### Scenario: Full history available via repository
- **WHEN** a user wants to see the complete change history of a document
- **THEN** they can access the git history via the repository link

### Requirement: Accessible text version alongside PDFs
Every PDF document SHALL have an accompanying markdown (.md) accessible text version containing the same information.

#### Scenario: Accessible text version exists for PDF
- **WHEN** a document includes a PDF file
- **THEN** an .md file with equivalent content exists in the same directory

#### Scenario: Accessible text version is linked from document page
- **WHEN** a user views a document that has both PDF and .md versions
- **THEN** both versions are offered (view/download PDF, or read accessible text version)
