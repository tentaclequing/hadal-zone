## ADDED Requirements

### Requirement: Client-side search via Pagefind
The site SHALL provide full-text search using Pagefind, operating entirely client-side with no backend dependency.

#### Scenario: Search returns relevant results
- **WHEN** a user types a query into the search bar
- **THEN** matching documents are displayed with title, TL;DR, category, and language

#### Scenario: Search works without server
- **WHEN** the site is accessed via IPFS or a local copy
- **THEN** search functionality works identically to the GitHub Pages version

### Requirement: Search index built at deploy time
The Pagefind search index SHALL be generated during the Hugo build process and included in the deployed static site.

#### Scenario: Index includes all document content
- **WHEN** the site is built
- **THEN** the search index includes document titles, TL;DR summaries, body text of .md files, metadata tags, and category names

#### Scenario: Index updates on new deploy
- **WHEN** a new document is added and the site is rebuilt
- **THEN** the search index includes the new document

### Requirement: Search filtering
Users SHALL be able to filter search results by language and category.

#### Scenario: Filter by language
- **WHEN** a user searches and selects a language filter (e.g., "German")
- **THEN** only documents in that language are shown in results

#### Scenario: Filter by category
- **WHEN** a user searches and selects a category filter (e.g., "skillsharing")
- **THEN** only documents in that category are shown in results

#### Scenario: Combined filters
- **WHEN** a user searches with both language and category filters active
- **THEN** results match both filters simultaneously

### Requirement: Search accessibility
The search interface SHALL be fully keyboard-navigable and screen reader compatible.

#### Scenario: Keyboard navigation
- **WHEN** a user navigates search using only the keyboard
- **THEN** they can focus the search bar, type a query, navigate results with arrow keys, and select a result with Enter

#### Scenario: Screen reader announces results
- **WHEN** search results appear
- **THEN** the screen reader announces the number of results and each result's title and summary
