---
title: "IPFS für alle: Hilf mit, diese Bibliothek verfügbar zu halten"
author: "anemone"
description: "Eine einsteigerfreundliche Anleitung zum Betreiben eines IPFS-Knotens, damit hadal-zone für alle verfügbar bleibt."
tldr: "Du kannst mithelfen, diese Bibliothek verfügbar zu halten, indem du IPFS Desktop auf deinem Computer nutzt. Keine technischen Kenntnisse nötig -- einfach installieren, einen Link einfügen und auf Pinnen klicken."
categories:
  - mirror
tags:
  - ipfs
  - dezentralisierung
  - einsteiger
  - anleitung
date: 2026-02-07T12:00:00+00:00
lastmod: 2026-02-07T12:00:00+00:00
language: "de"
country: ""
translationKey: "ipfs-for-everyone"
files: []
adapted: false
adaptation_note: ""
---

## Was ist IPFS?

Stell dir eine Bibliothek vor, in der jede Besucherin und jeder Besucher eine Kopie jedes Buches mit nach Hause nehmen kann. Wenn das Bibliotheksgebäude aus irgendeinem Grund schließt, gehen die Bücher nicht verloren -- denn Kopien stehen auf Regalen in der ganzen Nachbarschaft. Wer eine Kopie hat, kann sie mit allen teilen, die sie brauchen.

So funktioniert IPFS im Grunde. IPFS steht für **InterPlanetary File System** (Interplanetares Dateisystem). Es ist eine Methode, Dateien im Internet zu teilen, bei der kein einzelner Computer allein dafür verantwortlich ist, alles verfügbar zu halten. Stattdessen speichern viele Computer jeweils eine Kopie, und wenn jemand eine Datei braucht, kann sie von jedem Computer abgerufen werden, der sie hat.

### Warum ist das wichtig?

Eine herkömmliche Website liegt auf einem Server (oder einer kleinen Gruppe von Servern) bei einem einzigen Anbieter. Wenn dieser Anbieter ausfällt oder der Server nicht erreichbar ist, wird die Seite unzugänglich. Bei IPFS bleibt der Inhalt verfügbar, solange auch nur eine einzige Person irgendwo auf der Welt eine Kopie hat.

**Kein einzelner Ausfallpunkt. Keine einzelne Kontrollinstanz.**

## Wie du helfen kannst

Wenn du einen IPFS-Knoten auf deinem Computer betreibst, wirst du zu einem dieser Bücherregale in der Nachbarschaft. Dein Computer hält eine Kopie der hadal-zone-Bibliothek bereit, und wenn dein Rechner online ist, können andere Menschen über dich darauf zugreifen.

Du musst keine Programmiererin oder kein Programmierer sein. Du brauchst keine Kommandozeile zu benutzen. Es gibt eine kostenlose Anwendung namens **IPFS Desktop**, die alles über eine einfache grafische Oberfläche erledigt.

## Schritt für Schritt: IPFS Desktop einrichten

### Schritt 1: IPFS Desktop herunterladen

Gehe zur Download-Seite von IPFS Desktop:

**[https://docs.ipfs.tech/install/ipfs-desktop/](https://docs.ipfs.tech/install/ipfs-desktop/)**

Wähle die Version für dein Betriebssystem:
- **Windows**: Lade die `.exe`-Installationsdatei herunter
- **macOS**: Lade die `.dmg`-Datei herunter
- **Linux**: Lade die `.AppImage`-Datei herunter

### Schritt 2: Installieren

- **Windows**: Doppelklicke auf die heruntergeladene `.exe`-Datei und folge dem Installationsassistenten. Klicke bei den Eingabeaufforderungen auf "Weiter" und dann auf "Installieren".
- **macOS**: Öffne die `.dmg`-Datei und ziehe das IPFS-Desktop-Symbol in deinen Programme-Ordner.
- **Linux**: Mache die `.AppImage`-Datei ausführbar (Rechtsklick, Eigenschaften, Berechtigungen, "Datei als Programm ausführen erlauben") und doppelklicke sie dann.

Nach der Installation öffne IPFS Desktop. Du wirst ein kleines IPFS-Symbol im Infobereich sehen (der Bereich neben deiner Uhr, normalerweise unten rechts auf dem Bildschirm bei Windows oder oben rechts bei macOS).

### Schritt 3: Warten, bis dein Knoten gestartet ist

Wenn IPFS Desktop zum ersten Mal geöffnet wird, richtet es deinen Knoten automatisch ein. Du siehst einen Statusbildschirm, der anzeigt, dass dein Knoten läuft. Das kann ein oder zwei Minuten dauern.

Wenn du einen grünen Indikator oder eine Meldung "Connected to IPFS" siehst, bist du bereit für den nächsten Schritt.

### Schritt 4: Die hadal-zone-Bibliothek pinnen

Pinnen bedeutet, deinem Knoten zu sagen: "Behalte eine Kopie dieses Inhalts und teile sie mit anderen, die danach fragen."

1. Finde die aktuelle **CID** (Content Identifier, Inhalts-Kennung) von hadal-zone. Das ist eine lange Zeichenkette aus Buchstaben und Zahlen, die die neueste Version der Seite eindeutig identifiziert. Du findest sie:
   - In der Fußzeile dieser Website (wenn ein IPFS-Link angezeigt wird)
   - In der Datei [`ipfs-manifest.json`](https://github.com/tentaclequing/hadal-zone/blob/main/ipfs-manifest.json) auf GitHub

2. Klicke in IPFS Desktop auf **"Files"** (Dateien) in der linken Seitenleiste.

3. Klicke auf den **"Import"**-Button (normalerweise ein **+**-Symbol oder eine "Import"-Beschriftung oben).

4. Wähle **"From IPFS"** (Von IPFS) -- manchmal auch "From CID" oder "From Path" genannt.

5. Füge die CID in das Textfeld ein.

6. Klicke auf **"Import"** oder **"Pin"**.

IPFS Desktop wird jetzt die hadal-zone-Bibliothek auf deinen Computer herunterladen. Je nach Internetverbindung kann das einige Minuten dauern. Sobald der Vorgang abgeschlossen ist, teilt dein Knoten die Inhalte automatisch mit allen, die sie anfordern.

### Schritt 5: Überprüfen, ob es funktioniert

Nachdem das Pinnen abgeschlossen ist, kannst du prüfen, ob alles geklappt hat:

1. Öffne deinen Webbrowser.
2. Gehe zu: `http://localhost:8080/ipfs/` gefolgt von der CID, die du gerade gepinnt hast.
   Zum Beispiel: `http://localhost:8080/ipfs/bafybeie...` (deine tatsächliche CID wird anders aussehen)
3. Du solltest die hadal-zone-Website sehen.

Wenn du die Seite siehst -- herzlichen Glückwunsch! Du hilfst jetzt dabei, diese Bibliothek verfügbar zu halten.

## Deinen Spiegel aktuell halten

Der Inhalt von hadal-zone ändert sich im Laufe der Zeit, wenn neue Ressourcen hinzugefügt werden. Jede Aktualisierung erzeugt eine neue CID. Um deinen Spiegel aktuell zu halten:

1. Überprüfe regelmäßig die Datei [`ipfs-manifest.json`](https://github.com/tentaclequing/hadal-zone/blob/main/ipfs-manifest.json) auf neue CIDs.
2. Wenn eine neue CID erscheint, wiederhole Schritt 4 mit der neuen CID.
3. Optional kannst du den alten Pin entfernen, um Speicherplatz freizugeben: Gehe zu Files, finde den alten Eintrag, klicke mit der rechten Maustaste darauf und wähle "Remove pin".

Wenn du diesen Vorgang automatisieren möchtest, findest du in der [technischen Spiegelungsanleitung]({{< relref "/mirror" >}}) ein Skript, das dies automatisch erledigt.

## Häufig gestellte Fragen

**Verbraucht das viel Bandbreite oder Speicherplatz?**
Die hadal-zone-Bibliothek ist relativ klein (hauptsächlich Text und kleine Dateien). Sie sollte nur wenig Speicherplatz beanspruchen. In IPFS Desktop kannst du Bandbreitenlimits festlegen, wenn du kontrollieren möchtest, wie viele Daten dein Knoten teilt.

**Muss mein Computer die ganze Zeit laufen?**
Nein. Dein Knoten hilft, wann immer er online ist. Selbst wenn du deinen Computer nur ein paar Stunden am Tag eingeschaltet hast, trägst du in dieser Zeit bei. Jedes bisschen hilft.

**Ist das sicher?**
IPFS Desktop ist eine quelloffene Software, die von einem bekannten Projekt (Protocol Labs) gepflegt wird. Inhalte zu pinnen bedeutet einfach, dass du eine Kopie von öffentlich verfügbaren Dateien vorhältst. Es ist ähnlich wie ein Lesezeichen oder eine gespeicherte Webseite.

**Kann ich sehen, wer über meinen Knoten auf Inhalte zugreift?**
Nein. IPFS ist so konzipiert, dass Inhalte durch das Netzwerk fließen, ohne zu verraten, wer was anfordert. Du teilst die Inhalte, aber du siehst nicht, wer sie herunterlädt.

**Ich bin überhaupt nicht technisch versiert. Ist das wirklich etwas für mich?**
Ja. Wenn du eine Anwendung installieren und ein paar Mal klicken kannst, kannst du einen IPFS-Knoten betreiben. Mehr braucht es wirklich nicht.

## Danke

Jeder Knoten macht das Netzwerk stärker. Indem du IPFS Desktop nutzt und hadal-zone pinnst, hilfst du sicherzustellen, dass diese Ressourcen für alle verfügbar bleiben, die sie brauchen -- egal, was mit einem einzelnen Server passiert.

Du bist jetzt Teil der Bibliothek.
