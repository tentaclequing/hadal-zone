## ADDED Requirements

### Requirement: Telegram bot announces new documents
A Telegram bot SHALL post a message to a configured Telegram channel whenever a new document is added to the library.

#### Scenario: New document triggers Telegram notification
- **WHEN** a commit adding a new document is pushed to the main branch
- **THEN** the Telegram bot posts a message to the channel containing: document title, TL;DR summary, category, language, and a link to the document page

#### Scenario: Translation added triggers notification
- **WHEN** a new translation of an existing document is added
- **THEN** the Telegram bot posts a message indicating the new language version, with a link

#### Scenario: Document update does not trigger notification
- **WHEN** an existing document is updated (not newly added)
- **THEN** no notification is sent (to avoid noise)

### Requirement: Matrix bot announces new documents
A Matrix bot SHALL post a message to a configured Matrix room whenever a new document is added to the library.

#### Scenario: New document triggers Matrix notification
- **WHEN** a commit adding a new document is pushed to the main branch
- **THEN** the Matrix bot posts a message to the room containing: document title, TL;DR summary, category, language, and a link to the document page

#### Scenario: Matrix notification matches Telegram format
- **WHEN** both bots send a notification for the same new document
- **THEN** the message content is equivalent (same information, adapted for each platform's formatting)

### Requirement: Bot triggered by GitHub webhook
The notification bots SHALL be triggered by a GitHub webhook on push events to the main branch, not by polling.

#### Scenario: Webhook triggers bot service
- **WHEN** a push event occurs on the main branch
- **THEN** the GitHub webhook sends a payload to the bot service
- **THEN** the bot service determines if new documents were added and sends notifications accordingly

#### Scenario: Non-document changes are ignored
- **WHEN** a push event contains only configuration, theme, or CI changes (no new content)
- **THEN** no notification is sent

### Requirement: Bot message format
Notification messages SHALL be concise and consistently formatted.

#### Scenario: Message format
- **WHEN** a notification is sent for a new document titled "Protest Safety Guide" in English, category "protest-safety", with TL;DR "How to stay safe at protests"
- **THEN** the message follows a format like:
  ```
  New resource on hadal-zone:
  Protest Safety Guide (EN)
  Category: Protest Safety
  TL;DR: How to stay safe at protests
  Read: <link>
  ```
