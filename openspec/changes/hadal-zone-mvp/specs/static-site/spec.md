## ADDED Requirements

### Requirement: Hugo-based static site generation
The system SHALL use Hugo as the static site generator to build all pages from markdown content and templates.

#### Scenario: Site builds successfully
- **WHEN** the Hugo build command is executed
- **THEN** the system generates a complete static site with all document pages, category listings, and navigation

#### Scenario: Build completes within reasonable time
- **WHEN** the site contains up to 1000 documents across multiple languages
- **THEN** the build completes in under 30 seconds

### Requirement: Simple and clean visual design
The site SHALL have a minimalist, uncluttered design prioritising readability and ease of navigation. The design SHALL avoid visual complexity, decorative elements, and unnecessary animations.

#### Scenario: Homepage presents clear navigation
- **WHEN** a user visits the homepage
- **THEN** they see a language selector, a search bar, category navigation, and recently added documents — with no clutter or distracting elements

### Requirement: Octopus logo
The site SHALL display a small, simple octopus logo in the header/navigation area.

#### Scenario: Logo is visible on all pages
- **WHEN** a user visits any page on the site
- **THEN** the octopus logo is visible in the header area

#### Scenario: Logo is accessible
- **WHEN** a screen reader encounters the logo
- **THEN** the logo has appropriate alt text ("hadal-zone — decentralised library for resilience")

### Requirement: Localised user interface
The site UI (navigation, buttons, labels, footer, search placeholder text) SHALL be available in all supported languages. Users SHALL be able to switch languages.

#### Scenario: UI language matches content language
- **WHEN** a user browses the German content section
- **THEN** all UI elements (navigation labels, buttons, footer) are displayed in German

#### Scenario: Language switcher is available
- **WHEN** a user is on any page
- **THEN** a language switcher is visible and allows switching to any supported language

#### Scenario: Language switcher preserves context
- **WHEN** a user switches from English to German while viewing the protest-safety category
- **THEN** they are navigated to the German protest-safety category (if it exists) or the German homepage (if it does not)

### Requirement: Responsive layout
The site SHALL be fully usable on mobile devices, tablets, and desktop screens.

#### Scenario: Mobile usability
- **WHEN** a user accesses the site on a mobile device (viewport width < 768px)
- **THEN** all content, navigation, and functionality remain accessible and usable without horizontal scrolling
