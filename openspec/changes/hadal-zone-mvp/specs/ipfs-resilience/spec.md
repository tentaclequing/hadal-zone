## ADDED Requirements

### Requirement: IPFS pinning of all site content
The complete built static site (including all documents) SHALL be pinned to IPFS via Web3.Storage after every deployment.

#### Scenario: Automatic pinning on deploy
- **WHEN** the GitHub Actions pipeline deploys a new version of the site
- **THEN** the entire built site is uploaded and pinned to Web3.Storage, producing a new root CID

#### Scenario: Content accessible via IPFS gateway
- **WHEN** a user accesses the site's root CID via any public IPFS gateway (e.g., dweb.link, w3s.link)
- **THEN** the full site is browsable and functional, including search

### Requirement: CID manifest for community mirroring
The repository SHALL maintain a manifest file listing the current root CID and individual document CIDs, enabling community members to re-pin content.

#### Scenario: Manifest updated on each deploy
- **WHEN** a new deployment is pinned to IPFS
- **THEN** the CID manifest file in the repository is updated with the new root CID and timestamp

#### Scenario: Community member mirrors content
- **WHEN** a community member runs `ipfs pin add <root-CID>` using the CID from the manifest
- **THEN** they have a full copy of the site pinned on their IPFS node

### Requirement: Mirroring instructions published
The site SHALL include a page explaining how community members can help keep hadal-zone alive by pinning content to IPFS.

#### Scenario: Mirroring guide accessible
- **WHEN** a user navigates to the mirroring/resilience page
- **THEN** they see step-by-step instructions for installing IPFS, pinning the site's CID, and setting up automatic re-pinning

### Requirement: IPFS link on the site
The site SHALL display a link to its IPFS-hosted version so users can access it even if the primary host goes down.

#### Scenario: IPFS fallback link visible
- **WHEN** a user views the site footer or an "Access" page
- **THEN** they see a link to the latest IPFS-hosted version of the site with an explanation of why it exists
