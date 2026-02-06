---
title: "hadal-zone via IPFS spiegeln"
description: "Hilf mit, hadal-zone am Leben zu halten, indem du die Seite im dezentralen Web spiegelst."
translationKey: "mirror"
---

## Warum hadal-zone spiegeln?

hadal-zone ist eine Bibliothek mit Ressourcen fuer Widerstand und gegenseitige Hilfe. Zentrales Hosting hat eine einzige Schwachstelle -- den Anbieter selbst. Indem du die Seite auf IPFS (dem InterPlanetary File System) spiegelst, hilfst du sicherzustellen, dass diese Ressourcen fuer alle zugaenglich bleiben -- egal was mit dem primaeren Host passiert.

Jeder Spiegel ist ein Akt der Solidaritaet.

## Was ist IPFS?

IPFS ist ein Peer-to-Peer-Protokoll zum Speichern und Teilen von Dateien. Anstatt sich auf einen einzelnen Server zu verlassen, werden Inhalte ueber ihren kryptografischen Hash adressiert (eine **CID** -- Content Identifier). Jeder, der eine CID pinnt, hilft dabei, den Inhalt fuer andere verfuegbar zu machen.

Wichtige Eigenschaften:

- **Dezentral**: Kein einzelner Ausfallpunkt kann Inhalte unerreichbar machen.
- **Widerstandsfaehig**: Solange mindestens ein Knoten den Inhalt pinnt, bleibt er verfuegbar.
- **Verifizierbar**: Die CID garantiert, dass du genau den Inhalt hast, der veroeffentlicht wurde.

## So spiegelst du hadal-zone

### 1. Aktuelle CID abrufen

Die neueste Root-CID wird im Repository unter [`ipfs-manifest.json`](https://github.com/tentaclequing/hadal-zone/blob/main/ipfs-manifest.json) veroeffentlicht.

Du findest sie auch in der Fusszeile der Website.

### 2. IPFS installieren

Installiere [Kubo](https://docs.ipfs.tech/install/command-line/) (die Referenz-IPFS-Implementierung):

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

Initialisiere deinen Knoten (nur beim ersten Mal):

```bash
ipfs init
ipfs daemon &
```

### 3. Die Seite pinnen

```bash
# Ersetze <CID> mit der aktuellen Root-CID aus ipfs-manifest.json
ipfs pin add <CID>
```

Dies laedt die gesamte Seite herunter und weist deinen Knoten an, sie verfuegbar zu halten. Solange dein IPFS-Daemon laeuft, hilfst du dabei, hadal-zone der Welt bereitzustellen.

### 4. Ueberpruefen, ob es funktioniert

Oeffne die Seite in deinem Browser ueber dein lokales IPFS-Gateway:

```
http://localhost:8080/ipfs/<CID>/
```

Oder ueber ein oeffentliches Gateway:

```
https://dweb.link/ipfs/<CID>/
https://w3s.link/ipfs/<CID>/
```

## Automatisches Neu-Pinnen

Die CID aendert sich bei jeder Aktualisierung der Seite. Um deinen Spiegel aktuell zu halten, richte einen Cron-Job oder ein Skript ein, das `ipfs-manifest.json` ueberprueft und neu pinnt:

```bash
#!/bin/bash
# speichern als: mirror-hadal-zone.sh
# per cron ausfuehren: 0 */6 * * * /pfad/zu/mirror-hadal-zone.sh

set -e

MANIFEST_URL="https://raw.githubusercontent.com/tentaclequing/hadal-zone/main/ipfs-manifest.json"
STATE_FILE="$HOME/.hadal-zone-cid"

# Neueste CID abrufen
NEW_CID=$(curl -s "$MANIFEST_URL" | grep -o '"rootCID": *"[^"]*"' | cut -d'"' -f4)

if [ -z "$NEW_CID" ]; then
  echo "CID konnte nicht abgerufen werden"
  exit 1
fi

# Pruefen ob diese CID bereits gepinnt ist
OLD_CID=""
[ -f "$STATE_FILE" ] && OLD_CID=$(cat "$STATE_FILE")

if [ "$NEW_CID" = "$OLD_CID" ]; then
  echo "Neueste CID wird bereits gepinnt: $NEW_CID"
  exit 0
fi

echo "Neue CID erkannt: $NEW_CID"
ipfs pin add "$NEW_CID"

# Alte CID entpinnen um Speicher freizugeben
if [ -n "$OLD_CID" ]; then
  ipfs pin rm "$OLD_CID" 2>/dev/null || true
fi

echo "$NEW_CID" > "$STATE_FILE"
echo "Spiegelung aktualisiert."
```

Mache es ausfuehrbar und fuege es zu deinem Crontab hinzu:

```bash
chmod +x mirror-hadal-zone.sh
crontab -e
# Hinzufuegen: 0 */6 * * * /pfad/zu/mirror-hadal-zone.sh
```

## IPFS Desktop verwenden

Wenn du eine grafische Oberflaeche bevorzugst, installiere [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/). Dann:

1. Oeffne IPFS Desktop
2. Gehe zu **Dateien** > **Importieren** > **Von IPFS**
3. Fuege die CID ein
4. Klicke auf **Pinnen**

## Danke

Jeder Spiegel macht es hadal-zone widerstandsfaehiger. Ob du einen dedizierten Knoten betreibst oder einfach auf deinem Laptop pinnst, wenn er online ist -- du bist Teil des Netzwerks, das diese Ressourcen am Leben haelt.
