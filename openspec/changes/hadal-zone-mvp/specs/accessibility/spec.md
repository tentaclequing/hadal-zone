## ADDED Requirements

### Requirement: WCAG 2.1 AA compliance
The site SHALL meet WCAG 2.1 Level AA success criteria across all pages.

#### Scenario: Automated accessibility audit passes
- **WHEN** an accessibility audit tool (e.g., axe, Lighthouse) is run against any page
- **THEN** no Level A or Level AA violations are reported

#### Scenario: Colour contrast meets minimum ratio
- **WHEN** any text is displayed on the site
- **THEN** the contrast ratio between text and background meets at least 4.5:1 for normal text and 3:1 for large text

### Requirement: Full keyboard navigation
All interactive elements and content SHALL be accessible and operable via keyboard alone.

#### Scenario: Tab navigation through page
- **WHEN** a user navigates the site using only the Tab key and Enter/Space
- **THEN** they can reach and activate all links, buttons, search, language switcher, and document actions

#### Scenario: Visible focus indicators
- **WHEN** an element receives keyboard focus
- **THEN** a clearly visible focus indicator is displayed (not suppressed by CSS)

#### Scenario: Skip navigation link
- **WHEN** a user presses Tab on page load
- **THEN** the first focusable element is a "Skip to main content" link

### Requirement: Screen reader compatibility
All content and interactive elements SHALL be properly labelled and structured for screen readers.

#### Scenario: Semantic HTML structure
- **WHEN** a screen reader reads a page
- **THEN** headings, landmarks (nav, main, aside, footer), lists, and links are correctly identified and navigable

#### Scenario: Images have alt text
- **WHEN** any image is present on the site (logo, document images)
- **THEN** the image has descriptive alt text (or empty alt="" if purely decorative)

#### Scenario: Form controls labelled
- **WHEN** a screen reader encounters the search bar or any filter controls
- **THEN** each control has an associated label announced by the screen reader

#### Scenario: Dynamic content announced
- **WHEN** search results update after typing
- **THEN** the screen reader announces the updated result count via an ARIA live region

### Requirement: Cognitive accessibility
The site SHALL support users with cognitive disabilities through clear language, consistent layout, and summary content.

#### Scenario: TL;DR summaries aid comprehension
- **WHEN** a user views a document listing or document page
- **THEN** the TL;DR summary provides a concise overview before they need to engage with the full content

#### Scenario: Consistent navigation across pages
- **WHEN** a user navigates between different pages
- **THEN** the navigation, search bar, and language switcher remain in the same position and behave the same way

#### Scenario: Plain language in UI
- **WHEN** UI labels, buttons, and instructions are displayed
- **THEN** they use plain, clear language without jargon (e.g., "Download" not "Retrieve asset")

### Requirement: Accessible document formats
The platform SHALL ensure documents are available in accessible formats.

#### Scenario: Markdown version offered for all PDFs
- **WHEN** a document includes a PDF
- **THEN** an accessible markdown version is available and prominently linked

#### Scenario: Accessible text version renders cleanly
- **WHEN** a user reads the markdown accessible text version of a document
- **THEN** the content is rendered with proper headings, lists, and semantic structure — not as a raw text dump

### Requirement: High contrast and text scaling
The site SHALL support users who need high contrast or larger text.

#### Scenario: Text scales without breaking layout
- **WHEN** a user zooms to 200% in their browser
- **THEN** all content remains readable and no information is lost or obscured

#### Scenario: No information conveyed by colour alone
- **WHEN** status, category, or any distinction is conveyed visually
- **THEN** the information is also conveyed through text, icons, or other non-colour means
