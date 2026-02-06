## ADDED Requirements

### Requirement: In-browser preview for supported formats
The platform SHALL offer in-browser viewing for PDFs, images (PNG, JPG, GIF, SVG), markdown files, and plain text files. The preview SHALL open in a new browser window or tab.

#### Scenario: PDF preview
- **WHEN** a user clicks "View" on a PDF document
- **THEN** the PDF is displayed in the browser's built-in PDF viewer in a new tab

#### Scenario: Image preview
- **WHEN** a user clicks "View" on an image file
- **THEN** the image is displayed in the browser in a new tab

#### Scenario: Markdown preview
- **WHEN** a user clicks "View" on a markdown file
- **THEN** the rendered markdown is displayed as an HTML page in a new tab

#### Scenario: Plain text preview
- **WHEN** a user clicks "View" on a .txt file
- **THEN** the text content is displayed in the browser in a new tab

### Requirement: Download option for all formats
The platform SHALL offer a download option for all document types, including PDFs, images, text files, markdown files, and any other file format (spreadsheets, .doc files, etc.).

#### Scenario: Download any document
- **WHEN** a user clicks "Download" on any document
- **THEN** the file is downloaded to their device with its original filename

#### Scenario: Formats without preview offer download only
- **WHEN** a document is a spreadsheet (.xlsx, .csv), .doc/.docx, or other non-previewable format
- **THEN** only the "Download" option is shown (no "View" button)

### Requirement: Clear view/download buttons on document page
Each document page SHALL clearly present the available actions (View and/or Download) for each file associated with the document.

#### Scenario: Document with both viewable and downloadable files
- **WHEN** a document page shows a PDF and an .md file
- **THEN** each file has clearly labelled "View" and "Download" buttons

#### Scenario: Accessible text version prominently offered
- **WHEN** a document has both a PDF and an accessible .md version
- **THEN** the .md version is offered with a label like "Read accessible text version"
