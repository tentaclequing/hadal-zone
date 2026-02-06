## ADDED Requirements

### Requirement: Contributions via GitHub Pull Requests
Contributors SHALL submit new documents and translations by forking the repository, adding their content, and opening a Pull Request.

#### Scenario: New document contribution
- **WHEN** a contributor wants to add a new document
- **THEN** they fork the repo, create the document folder with required metadata and files, and open a PR

#### Scenario: Translation contribution
- **WHEN** a contributor wants to translate an existing document
- **THEN** they fork the repo, add the new language version in the appropriate content directory with metadata, and open a PR

#### Scenario: Document correction or update
- **WHEN** a contributor wants to fix or update an existing document
- **THEN** they fork the repo, make the changes, and open a PR with a description of what changed

### Requirement: Owner moderation of all contributions
All Pull Requests SHALL be reviewed and approved by the repository owner (or designated moderators) before merging.

#### Scenario: PR requires approval before merge
- **WHEN** a contributor opens a PR
- **THEN** the PR cannot be merged until the owner reviews and approves it

#### Scenario: PR with incomplete metadata is flagged
- **WHEN** a PR adds a document missing required metadata fields
- **THEN** the CI build fails and the contributor is notified of the missing fields

### Requirement: Contribution guidelines documented
The repository SHALL contain a CONTRIBUTING.md file explaining how to add documents, translate documents, and the metadata requirements.

#### Scenario: Contributor reads guidelines
- **WHEN** a potential contributor visits the repository
- **THEN** they find CONTRIBUTING.md with clear instructions covering:
  - How to add a new document (folder structure, metadata, accessible text requirement)
  - How to submit a translation
  - How to suggest corrections
  - Metadata field requirements and examples
  - The review process

### Requirement: PR template for contributions
The repository SHALL include a Pull Request template that guides contributors through providing necessary information.

#### Scenario: PR template prompts for key information
- **WHEN** a contributor opens a new PR
- **THEN** the PR template pre-fills with prompts for: document type (new/translation/update), language, category, author name (or "anemone" for anonymous), and a checklist (metadata complete, accessible text included if PDF, TL;DR provided)
