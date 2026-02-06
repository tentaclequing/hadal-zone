## 1. Project Scaffolding

- [ ] 1.1 Initialise Hugo project in the repository root (`hugo new site . --force`)
- [ ] 1.2 Create a minimal accessible Hugo theme (`themes/hadal/`) with base templates: baseof.html, index.html, single.html, list.html, header/footer partials
- [ ] 1.3 Configure `hugo.toml` with multilingual settings (English as default, structure for adding de/tr/etc.)
- [ ] 1.4 Set up i18n string files (`i18n/en.yaml`) for UI labels (navigation, buttons, search placeholder, footer text)
- [ ] 1.5 Create the octopus logo (simple SVG) and add to `themes/hadal/static/images/`
- [ ] 1.6 Add a `skip to main content` link as the first focusable element in the base template

## 2. Content Structure and Taxonomy

- [ ] 2.1 Create Hugo content directory structure: `content/en/` with subdirectories for each category (skillsharing, protest-safety, movement, mutual-aid, legal, digital-security, wellbeing, accessibility)
- [ ] 2.2 Define Hugo front matter archetype with required fields: title, author, tldr, category, tags, date, lastmod, language, country
- [ ] 2.3 Create Hugo taxonomy configuration for categories with human-readable names and descriptions
- [ ] 2.4 Build category listing template showing documents with title, author, TL;DR, and date
- [ ] 2.5 Build single document page template with: metadata display, TL;DR prominently shown, file list with View/Download buttons, language version links
- [ ] 2.6 Implement "anemone" default author logic in templates (if author is empty or "anemone", display "anemone")

## 3. Document Preview and Download

- [ ] 3.1 Implement PDF preview (link opens PDF in new tab via browser's built-in viewer)
- [ ] 3.2 Implement image preview (link opens image in new tab)
- [ ] 3.3 Implement markdown preview (Hugo renders .md content as HTML page, link opens in new tab)
- [ ] 3.4 Implement plain text preview (link opens .txt in new tab)
- [ ] 3.5 Implement download buttons for all file types with correct `Content-Disposition` headers
- [ ] 3.6 Show "Read accessible text version" link prominently when both PDF and .md versions exist

## 4. Search Integration

- [ ] 4.1 Add Pagefind to the build pipeline (post-Hugo-build indexing step)
- [ ] 4.2 Configure Pagefind to index document titles, TL;DR summaries, body text, categories, and tags
- [ ] 4.3 Add search UI component to the site header (search bar with placeholder text)
- [ ] 4.4 Implement language and category filter controls in the search results view
- [ ] 4.5 Add ARIA live region for search results count announcement (screen reader support)
- [ ] 4.6 Ensure search UI is fully keyboard-navigable (tab to search, arrow through results, Enter to select)

## 5. Accessibility and Styling

- [ ] 5.1 Implement site-wide CSS with high-contrast colour scheme meeting WCAG 2.1 AA contrast ratios
- [ ] 5.2 Add visible focus indicators for all interactive elements
- [ ] 5.3 Ensure responsive layout works at mobile (<768px), tablet, and desktop breakpoints
- [ ] 5.4 Test and fix layout at 200% browser zoom — no content loss or overflow
- [ ] 5.5 Add semantic HTML landmarks throughout all templates (nav, main, aside, footer)
- [ ] 5.6 Add alt text to all images (logo, any decorative/content images)
- [ ] 5.7 Ensure no information is conveyed by colour alone (add text labels or icons alongside colour cues)

## 6. Localisation (UI)

- [ ] 6.1 Implement language switcher component (dropdown or link list in header)
- [ ] 6.2 Wire language switcher to Hugo's multilingual routing (preserves current section/page when switching)
- [ ] 6.3 Create i18n files for initial languages (start with `en.yaml`; add `de.yaml` as template for translators)
- [ ] 6.4 Ensure all hardcoded UI strings go through Hugo's `i18n` function — no raw English in templates

## 7. Cross-Language Document Linking

- [ ] 7.1 Implement document linking via Hugo's `translationKey` or a shared document ID in front matter
- [ ] 7.2 Build "Available in other languages" partial showing linked translations on each document page
- [ ] 7.3 Mark adapted (non-literal) translations with an "Adapted for [country]" note

## 8. GitHub Actions CI/CD Pipeline

- [ ] 8.1 Create GitHub Actions workflow: on push to main → build Hugo site → deploy to GitHub Pages
- [ ] 8.2 Add Pagefind indexing step to the build workflow (after Hugo build, before deploy)
- [ ] 8.3 Add front matter validation step: fail build if required metadata fields are missing
- [ ] 8.4 Add accessibility lint step (e.g., pa11y-ci or axe) to catch regressions

## 9. IPFS Pinning

- [ ] 9.1 Set up Web3.Storage account and API token (store as GitHub secret)
- [ ] 9.2 Add IPFS pinning step to GitHub Actions: after Pages deploy, upload built site to Web3.Storage
- [ ] 9.3 Create CID manifest file (`ipfs-manifest.json`) updated automatically with root CID and timestamp on each deploy
- [ ] 9.4 Create a "Help mirror hadal-zone" page with step-by-step IPFS pinning instructions
- [ ] 9.5 Add IPFS gateway link to site footer pointing to the latest pinned version

## 10. Notification Bots

- [ ] 10.1 Create bot service project (Node.js or Python) with webhook endpoint that receives GitHub push events
- [ ] 10.2 Implement diff detection: parse push payload to identify newly added documents (new content files)
- [ ] 10.3 Extract document metadata (title, TL;DR, category, language) from new files for notification messages
- [ ] 10.4 Implement Telegram bot: register bot with BotFather, configure channel, send formatted messages via Bot API
- [ ] 10.5 Implement Matrix bot: register bot account, configure room, send formatted messages via matrix-bot-sdk
- [ ] 10.6 Format notification messages consistently: title, language, category, TL;DR, link
- [ ] 10.7 Configure GitHub webhook to send push events to the bot service endpoint
- [ ] 10.8 Deploy bot service (serverless function or small VPS)

## 11. Contribution Workflow

- [ ] 11.1 Write CONTRIBUTING.md with instructions for: adding documents, submitting translations, metadata requirements, accessible text requirement, review process
- [ ] 11.2 Create Pull Request template (`.github/PULL_REQUEST_TEMPLATE.md`) with prompts for document type, language, category, author, and checklist
- [ ] 11.3 Configure branch protection on main: require PR review before merge
- [ ] 11.4 Add example/seed documents (3-5 initial resources in English) to demonstrate the expected structure

## 12. Seed Content and Launch

- [ ] 12.1 Add 3-5 seed documents across different categories with full metadata, TL;DR summaries, and accessible .md versions
- [ ] 12.2 Add at least 1 translated/adapted document to demonstrate multi-language linking
- [ ] 12.3 Run full accessibility audit (Lighthouse + manual screen reader test) and fix any issues
- [ ] 12.4 Test IPFS pinning end-to-end: verify site is browsable via IPFS gateway
- [ ] 12.5 Test notification bots end-to-end: verify Telegram and Matrix messages on new document merge
- [ ] 12.6 Write a brief README.md for the repository explaining what hadal-zone is and how to contribute
