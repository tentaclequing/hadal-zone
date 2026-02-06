---
title: "Mirror hadal-zone via IPFS"
description: "Help keep hadal-zone alive by mirroring it on the decentralised web."
translationKey: "mirror"
---

## Why mirror hadal-zone?

hadal-zone is a library of resources for resistance and mutual aid. Centralised hosting relies on a single provider, which means a single point of failure. By mirroring the site on IPFS (the InterPlanetary File System), you help ensure these resources stay accessible to everyone who needs them -- no matter what happens to the primary host.

Every mirror is an act of solidarity.

## What is IPFS?

IPFS is a peer-to-peer protocol for storing and sharing files. Instead of relying on a single server, content is addressed by its cryptographic hash (a **CID** -- Content Identifier). Anyone who pins a CID helps make it available to others.

Key properties:

- **Decentralised**: no single point of failure can make content unavailable.
- **Resilient**: as long as at least one node pins the content, it stays available.
- **Verifiable**: the CID guarantees you have the exact content that was published.

## How to mirror hadal-zone

### 1. Get the current CID

The latest root CID is published in the repository at [`ipfs-manifest.json`](https://github.com/tentaclequing/hadal-zone/blob/main/ipfs-manifest.json).

You can also find it in the site footer.

### 2. Install IPFS

Install [Kubo](https://docs.ipfs.tech/install/command-line/) (the reference IPFS implementation):

```bash
# macOS (Homebrew)
brew install ipfs

# Debian/Ubuntu
wget https://dist.ipfs.tech/kubo/v0.28.0/kubo_v0.28.0_linux-amd64.tar.gz
tar -xvzf kubo_v0.28.0_linux-amd64.tar.gz
cd kubo && sudo bash install.sh

# Windows (winget)
winget install IPFS.IPFS-Desktop
```

Initialise your node (first time only):

```bash
ipfs init
ipfs daemon &
```

### 3. Pin the site

```bash
# Replace <CID> with the current root CID from ipfs-manifest.json
ipfs pin add <CID>
```

This downloads the entire site and tells your node to keep it available. As long as your IPFS daemon is running, you are helping serve hadal-zone to the world.

### 4. Verify it works

Open the site in your browser via your local IPFS gateway:

```
http://localhost:8080/ipfs/<CID>/
```

Or via a public gateway:

```
https://dweb.link/ipfs/<CID>/
https://w3s.link/ipfs/<CID>/
```

## Automatic re-pinning

The CID changes each time the site is updated. To keep your mirror current, set up a cron job or script that checks `ipfs-manifest.json` and re-pins:

```bash
#!/bin/bash
# save as: mirror-hadal-zone.sh
# run via cron: 0 */6 * * * /path/to/mirror-hadal-zone.sh

set -e

MANIFEST_URL="https://raw.githubusercontent.com/tentaclequing/hadal-zone/main/ipfs-manifest.json"
STATE_FILE="$HOME/.hadal-zone-cid"

# Fetch latest CID
NEW_CID=$(curl -s "$MANIFEST_URL" | grep -o '"rootCID": *"[^"]*"' | cut -d'"' -f4)

if [ -z "$NEW_CID" ]; then
  echo "Failed to fetch CID"
  exit 1
fi

# Check if we already have this CID pinned
OLD_CID=""
[ -f "$STATE_FILE" ] && OLD_CID=$(cat "$STATE_FILE")

if [ "$NEW_CID" = "$OLD_CID" ]; then
  echo "Already pinning latest CID: $NEW_CID"
  exit 0
fi

echo "New CID detected: $NEW_CID"
ipfs pin add "$NEW_CID"

# Unpin old CID to free space
if [ -n "$OLD_CID" ]; then
  ipfs pin rm "$OLD_CID" 2>/dev/null || true
fi

echo "$NEW_CID" > "$STATE_FILE"
echo "Mirroring updated."
```

Make it executable and add it to your crontab:

```bash
chmod +x mirror-hadal-zone.sh
crontab -e
# Add: 0 */6 * * * /path/to/mirror-hadal-zone.sh
```

## Using IPFS Desktop

If you prefer a graphical interface, install [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/). Then:

1. Open IPFS Desktop
2. Go to **Files** > **Import** > **From IPFS**
3. Paste the CID
4. Click **Pin**

## Thank you

Every mirror makes hadal-zone more resilient. Whether you run a dedicated node or just pin on your laptop when it is online -- you are part of the network that keeps these resources alive.
