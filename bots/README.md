# hadal-zone notification bot

A lightweight Node.js service that receives GitHub push webhooks and sends notifications to Telegram and Matrix when new documents are added to the hadal-zone library.

## Architecture

```
GitHub Push Webhook
        |
        v
  webhook-server.js   (Express, signature verification)
        |
        v
  diff-detection.js    (identify new content files)
        |
        v
  metadata-extraction.js  (parse front matter)
        |
        v
  message-format.js    (format notification text)
        |
   +----+----+
   |         |
   v         v
telegram  matrix
 -bot.js   -bot.js
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|----------|-------------|
| `WEBHOOK_SECRET` | GitHub webhook secret for signature validation |
| `TELEGRAM_BOT_TOKEN` | Telegram Bot API token (from @BotFather) |
| `TELEGRAM_CHANNEL_ID` | Telegram channel/group ID to post to |
| `MATRIX_HOMESERVER` | Matrix homeserver URL (e.g. `https://matrix.org`) |
| `MATRIX_ACCESS_TOKEN` | Matrix access token for the bot account |
| `MATRIX_ROOM_ID` | Matrix room ID to post to (e.g. `!roomid:matrix.org`) |
| `SITE_BASE_URL` | Base URL of the hadal-zone site |

### 3. Set up GitHub webhook

1. Go to your repository Settings > Webhooks > Add webhook
2. Payload URL: `https://your-server:3000/webhook`
3. Content type: `application/json`
4. Secret: same as your `WEBHOOK_SECRET`
5. Events: select "Just the push event"

### 4. Run

```bash
npm start
```

The server listens on port 3000 by default (override with `PORT` env var).

## Deployment with Docker

```bash
docker build -t hadal-zone-bot .
docker run -d \
  --name hadal-zone-bot \
  --env-file .env \
  -p 3000:3000 \
  hadal-zone-bot
```

## Testing

```bash
npm test
```

Tests use Jest and mock all external HTTP calls. No real API tokens are needed to run the test suite.

## How it works

1. GitHub sends a push webhook when commits are pushed to `main`
2. The bot checks which files were newly added (not modified)
3. Only content markdown files are considered (files matching `content/**/*.md`, excluding `_index.md` section pages)
4. For each new document, the bot fetches the file content and extracts metadata (title, TL;DR, category, language) from the front matter
5. A formatted notification message is sent to both Telegram and Matrix
