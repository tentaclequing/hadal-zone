## Why

People facing difficult circumstances need access to practical knowledge — how to stay safe, navigate systems, share skills, and know their legal rights. This information exists but is scattered across many sources and often hard to find when you need it most.

hadal-zone creates a decentralised library dedicated to resilience and mutual aid resources. Named after the deepest, most unreachable zone of the ocean, the platform ensures these documents stay online and accessible to everyone — including people with disabilities — by distributing them across multiple networks.

## What Changes

This is a greenfield project. The MVP establishes:

- A static site (Hugo) for browsing, searching, and reading/downloading documents
- IPFS pinning (via Web3.Storage) for decentralised document storage
- GitHub Pages as the primary web host, with IPFS as a resilient fallback
- Client-side search (Pagefind) that works without a backend
- Language-first taxonomy: top-level by language, then by category/topic
- Metadata schema for every document: author, TL;DR summary, language, country, tags, version
- In-browser preview for PDFs, images, markdown, and text files
- Download option for all document types
- Accessible text (.md) version required alongside every PDF
- Notification bots for Telegram and Matrix announcing new documents
- Anonymous author support — unnamed authors are credited as "anemone"
- Localised UI (navigation, buttons, labels) in multiple languages
- Contributions via GitHub Pull Requests (owner-moderated)
- Octopus logo and simple, accessible design

## Capabilities

### New Capabilities
- `static-site`: Hugo-based static site with accessible, simple design, octopus branding, and localised UI
- `document-management`: Document storage structure, metadata schema (author, TL;DR, language, country, tags), version history via git, accessible text versions alongside PDFs
- `search`: Client-side search via Pagefind, filterable by language, category, and tags
- `content-preview`: In-browser viewing for PDFs, images, markdown, and text files, plus download for all formats
- `ipfs-resilience`: IPFS pinning via Web3.Storage for decentralised document distribution, with instructions for community mirroring
- `notification-bots`: Telegram and Matrix bots that announce new documents when merged to the repository
- `contribution-workflow`: GitHub PR-based contribution pipeline for new documents and translations, with owner moderation
- `taxonomy`: Language-first content organisation with categories (skillsharing, protest-safety, movement, mutual-aid, legal, digital-security, wellbeing, accessibility)
- `accessibility`: WCAG 2.1 AA compliance, screen reader support, keyboard navigation, high contrast, cognitive accessibility via TL;DR summaries

### Modified Capabilities
<!-- None — greenfield project -->

## Impact

- **New repository structure**: Hugo project with content organised by language and category
- **New infrastructure**: GitHub Pages deployment, Web3.Storage IPFS pinning, bot hosting (small VPS or serverless)
- **New dependencies**: Hugo (static site generator), Pagefind (search), Web3.Storage SDK/CLI, Telegram Bot API, Matrix SDK
- **External services**: GitHub (hosting + contribution workflow), Web3.Storage (IPFS pinning), Telegram (notifications), Matrix (notifications)
- **Future considerations**: The architecture must support future additions of user accounts, a web-based contribution UI (abstracting git), and a moderation queue for anonymous submissions
