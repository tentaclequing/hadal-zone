## ADDED Requirements

### Requirement: Language-first content organisation
Content SHALL be organised with language as the top-level directory, followed by category, then individual documents.

#### Scenario: Content directory structure
- **WHEN** a document about protest safety exists in English and German
- **THEN** it is stored at `content/en/protest-safety/protest-safety-guide/` and `content/de/protest-safety/sicher-demonstrieren/`

#### Scenario: New language added
- **WHEN** content in a new language (e.g., Turkish) is added for the first time
- **THEN** a new `content/tr/` directory is created with the appropriate category subdirectories

### Requirement: Standard category set
The platform SHALL support the following categories at MVP launch: skillsharing, protest-safety, movement, mutual-aid, legal, digital-security, wellbeing, and accessibility.

#### Scenario: All categories navigable
- **WHEN** a user browses the site in any supported language
- **THEN** they can navigate to each of the defined categories

#### Scenario: Category has descriptive label and description
- **WHEN** a user views a category listing page
- **THEN** the category has a human-readable name (e.g., "Protest Safety" not "protest-safety") and a brief description of what it contains

### Requirement: Category definitions
Each category SHALL have a defined scope:

- **skillsharing**: Teaching and learning practical skills (first aid, legal observing, tech skills, repair, food preservation)
- **protest-safety**: Staying safe at demonstrations (know your rights, de-escalation, digital security at protests, what to bring)
- **movement**: Crossing borders, leaving, arriving (visa guidance, safe transit, asylum information, embassy contacts)
- **mutual-aid**: Community support structures (organising templates, supply networks, fundraising, resource sharing)
- **legal**: Legal rights and resources (country-specific rights, lawyer networks, legal observer guides)
- **digital-security**: Protecting yourself online (encryption, secure communications, device security, anti-surveillance)
- **wellbeing**: Mental health, burnout, care (activist burnout, trauma resources, peer support frameworks)
- **accessibility**: Resources about accessibility itself (making events accessible, communication aids, disability rights)

#### Scenario: Document assigned to correct category
- **WHEN** a document about encrypting your phone is submitted
- **THEN** it is placed in the "digital-security" category

#### Scenario: Category listing shows all documents
- **WHEN** a user views the "skillsharing" category page
- **THEN** all documents tagged with the skillsharing category in that language are listed with their titles, authors, and TL;DR summaries

### Requirement: Cross-language document linking
Documents that are translations or adaptations of each other SHALL be linked so users can discover other language versions.

#### Scenario: Language versions shown on document page
- **WHEN** a user views the English version of a document that also exists in German and Turkish
- **THEN** the page shows links to the German and Turkish versions (labelled in their respective languages: "Deutsch", "Turkce")

#### Scenario: Adapted documents clearly marked
- **WHEN** a document is a localised adaptation (not a direct translation)
- **THEN** the link to that version includes a note indicating it has been adapted for a specific country/context
