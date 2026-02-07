## Context

hadal-zone is a new, greenfield project: a decentralised library for resilience and mutual aid resources. There is no existing codebase. The repository currently contains only a CC BY-SA 4.0 license file.

The platform serves people who need practical resources — including people with disabilities. Content includes PDFs, spreadsheets, images, markdown, and text documents covering safety, legal rights, guidance, skillsharing, and more.

Key constraints:
- Must be resilient (no single point of failure can make content unavailable)
- Must be highly accessible (WCAG 2.1 AA, screen reader support, cognitive accessibility)
- Must be simple in design — not a complex web app
- Must support multiple languages (both UI and content)
- MVP is owner-curated; community contributions come later via PRs

## Goals / Non-Goals

**Goals:**
- Ship a browsable, searchable, accessible static site with initial content
- Pin all documents to IPFS for decentralised availability
- Notify followers via Telegram and Matrix when new content is added
- Establish a document structure and metadata schema that scales
- Make contributing translations and new documents possible via GitHub PRs
- Ensure the entire site can be mirrored by anyone

**Non-Goals:**
- User accounts or registration (future)
- Web-based contribution UI (future — MVP uses GitHub PRs)
- Moderation queue for anonymous submissions (future)
- Signal notifications (no stable bot API)
- Real-time collaboration or editing
- Hosting the actual files on a traditional server/CDN (IPFS + GitHub Pages only)
- Mobile app

## Decisions

### 1. Static site generator: Hugo

**Choice:** Hugo
**Alternatives considered:** Jekyll, Astro, Eleventy, Next.js (static export)

**Rationale:**
- Hugo is the fastest static site generator — builds in milliseconds even with thousands of pages
- First-class multilingual support built in (content translation, UI string localisation, language switcher)
- Single binary, no Node.js dependency for the site itself
- Markdown-native, which aligns with the accessible text requirement
- Used by Shadow Libraries (proven in this domain)
- Hugo's taxonomy system maps well to language-first + category organisation

### 2. Search: Pagefind

**Choice:** Pagefind (client-side search, built at deploy time)
**Alternatives considered:** Lunr.js, Algolia, ElasticSearch, Meilisearch

**Rationale:**
- Runs entirely client-side — no backend, no API keys, no cost
- Works on IPFS (critical for decentralisation)
- Supports multilingual content and filtering
- Indexes at build time, so search is instant for users
- Accessible (keyboard-navigable, screen reader compatible)
- Lunr.js lacks multilingual support; Algolia/Meilisearch require servers

### 3. IPFS strategy: Web3.Storage pinning service

**Choice:** Web3.Storage for MVP, self-hosted node later
**Alternatives considered:** Pinata, self-hosted IPFS node, torrents only

**Rationale:**
- Web3.Storage offers a free tier (5GB) sufficient for MVP
- No infrastructure to manage — upload via CLI or API after each build
- Content is pinned to the IPFS network and accessible via any IPFS gateway
- Content-addressed (CID-based) means anyone can re-pin with just the hash
- We publish a CID manifest so community members can mirror
- Torrents considered but less suited to frequently-updated small documents
- Self-hosted node adds operational burden with no MVP benefit

### 4. Hosting: GitHub Pages + IPFS

**Choice:** Dual hosting — GitHub Pages as primary, IPFS as resilient fallback
**Alternatives considered:** Netlify, Vercel, IPFS-only, self-hosted

**Rationale:**
- GitHub Pages is free, reliable, supports custom domains, auto-deploys from repo
- IPFS provides a decentralised fallback if the primary host is unavailable
- GitHub Actions pipeline: build Hugo site → deploy to Pages → pin to IPFS → update CID manifest
- Netlify/Vercel add no meaningful benefit over GitHub Pages for a static site
- IPFS-only would hurt discoverability and initial load times

### 5. Notification bots: Standalone lightweight service

**Choice:** Small bot service (Node.js or Python) triggered by GitHub webhooks
**Alternatives considered:** GitHub Actions-only, embedded in Hugo build, third-party integration services

**Rationale:**
- GitHub webhook fires on push to main → bot formats message → posts to Telegram + Matrix
- Decoupled from the static site (bots don't affect site build or deployment)
- Can run on a tiny VPS ($5/mo), a serverless function (Cloudflare Workers, free tier), or even GitHub Actions
- Telegram Bot API is straightforward (HTTP POST to send messages)
- Matrix SDK (matrix-bot-sdk for Node.js) is well-supported
- Bot announces: document title, TL;DR, language, category, and link

### 6. Document metadata: YAML front matter + metadata.yaml

**Choice:** Hugo front matter in each .md file + a metadata.yaml per document group
**Alternatives considered:** Separate JSON database, headless CMS, Airtable

**Rationale:**
- Front matter is native to Hugo — no custom tooling needed
- metadata.yaml at the document folder level ties translations together
- Git provides version history for free — no database needed
- Schema:
  ```yaml
  # metadata.yaml (per document group)
  id: protest-safety
  category: protest-safety
  translations:
    en:
      title: "Protest Safety Guide"
      authors: ["anemone"]
      tldr: "How to stay safe at protests: legal, physical, digital."
      adapted: false
      files:
        - guide.pdf
        - guide.md
    de:
      title: "Sicher Demonstrieren"
      authors: ["anemone"]
      tldr: "Sicherheit bei Demos in Deutschland."
      adapted: true
      adaptation_note: "Adapted for German protest law"
      files:
        - guide.pdf
        - guide.md
  ```

### 7. Content structure: Language-first taxonomy

**Choice:** Top-level directories by language, then by category
**Alternatives considered:** Category-first, flat structure, tag-only

**Rationale:**
- Language is the primary filter for users — you need content in your language first
- Categories within each language allow localised adaptation (DE protest guide ≠ EN protest guide)
- Hugo's built-in multilingual routing handles this natively
- Categories (MVP): skillsharing, protest-safety, movement, mutual-aid, legal, digital-security, wellbeing, accessibility

### 8. Accessible text requirement

**Choice:** Every PDF must have an accompanying .md accessible text version
**Alternatives considered:** PDF accessibility tags only, HTML conversion, optional text version

**Rationale:**
- Many PDFs are not screen-reader accessible regardless of tagging
- Markdown renders natively in Hugo and is inherently accessible
- Serves as a fallback for low-bandwidth users
- TL;DR summaries in metadata provide cognitive accessibility
- Contribution guidelines will document this requirement

## Risks / Trade-offs

- **[IPFS gateway reliability]** IPFS gateways can be slow or unreliable → Mitigation: GitHub Pages is the primary host; IPFS is the fallback, not the default experience. We link to multiple gateways.

- **[Web3.Storage longevity]** Free pinning services may change terms or shut down → Mitigation: CIDs are portable. We maintain a manifest of all CIDs so content can be re-pinned anywhere. Document the "pin it yourself" process for community members.

- **[Translation quality]** Community translations may be inaccurate or harmful → Mitigation: All contributions go through PR review. Establish a reviewer network per language over time.

- **[GitHub as single point for contributions]** GitHub could become unavailable → Mitigation: The repo can be forked/mirrored. Git is decentralised by design. Document how to set up an alternative contribution endpoint.

- **[Content moderation at scale]** As the platform grows, owner-only moderation won't scale → Mitigation: Design the contribution pipeline with moderation roles in mind. MVP is owner-curated; add trusted moderators before opening anonymous submissions.

- **[Pagefind index size]** With thousands of documents in many languages, the search index could become large → Mitigation: Pagefind supports index splitting and lazy loading. Monitor index size and optimise if needed.

## Migration Plan

Not applicable — greenfield project. Deployment sequence:

1. Scaffold Hugo site with theme, layouts, and i18n strings
2. Create initial content (seed documents in English)
3. Configure GitHub Actions: build → deploy to Pages → pin to IPFS
4. Set up notification bots (Telegram + Matrix)
5. Publish CID manifest and mirroring instructions
6. Announce and invite first contributors

Rollback: Git revert on any commit. IPFS pins of previous versions remain accessible by CID.

## Open Questions

- **Domain name**: Should hadal-zone have a custom domain? If so, what TLD? (.org, .net, something else?)
- **Hugo theme**: Build a custom minimal theme or adapt an existing accessible theme (e.g., hugo-book, PaperMod)?
- **Bot hosting**: GitHub Actions (free, but less real-time) vs. small VPS vs. serverless function?
- **Initial content**: What are the first 5-10 documents to seed the library with?
- **Octopus logo**: Commission an artist, use/adapt open-source artwork, or generate one?
