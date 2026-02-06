/**
 * hadal-zone notification bot
 *
 * Main entry point: receives GitHub push webhooks and sends notifications
 * to Telegram and Matrix when new documents are added to the library.
 */

const { createWebhookServer } = require('./webhook-server');
const { detectNewDocuments } = require('./diff-detection');
const { extractMetadata } = require('./metadata-extraction');
const { formatNotification, buildDocumentUrl } = require('./message-format');
const { sendTelegramMessage } = require('./telegram-bot');
const { sendMatrixMessage } = require('./matrix-bot');

// Configuration from environment variables
const config = {
  port: process.env.PORT || 3000,
  webhookSecret: process.env.WEBHOOK_SECRET || '',
  siteBaseUrl: process.env.SITE_BASE_URL || 'https://tentaclequing.github.io/hadal-zone',
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    channelId: process.env.TELEGRAM_CHANNEL_ID || ''
  },
  matrix: {
    homeserver: process.env.MATRIX_HOMESERVER || '',
    accessToken: process.env.MATRIX_ACCESS_TOKEN || '',
    roomId: process.env.MATRIX_ROOM_ID || ''
  }
};

/**
 * Fetch file content from GitHub for a given commit and path.
 * Uses the raw.githubusercontent.com URL to avoid needing API tokens.
 */
async function fetchFileContent(repoFullName, commitSha, filePath) {
  const url = `https://raw.githubusercontent.com/${repoFullName}/${commitSha}/${filePath}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Failed to fetch ${url}: HTTP ${response.status}`);
      return null;
    }
    return await response.text();
  } catch (err) {
    console.error(`Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

/**
 * Process a GitHub push event payload.
 *
 * Pipeline:
 *   1. Detect new document files in the push
 *   2. Fetch and extract metadata from each new document
 *   3. Format notification messages
 *   4. Send to Telegram and Matrix in parallel
 */
async function handlePushEvent(payload) {
  const newFiles = detectNewDocuments(payload);

  if (newFiles.length === 0) {
    console.log('No new documents detected in push event.');
    return;
  }

  console.log(`Detected ${newFiles.length} new document(s):`, newFiles);

  const repoFullName = payload.repository?.full_name || '';
  const headCommitSha = payload.head_commit?.id || payload.after || '';

  for (const filePath of newFiles) {
    try {
      // Fetch file content from GitHub
      const content = await fetchFileContent(repoFullName, headCommitSha, filePath);
      if (!content) {
        console.error(`Skipping ${filePath}: could not fetch content`);
        continue;
      }

      // Extract metadata
      const metadata = extractMetadata(content, filePath);

      // Build document URL
      const url = buildDocumentUrl(filePath, config.siteBaseUrl);

      // Format message
      const message = formatNotification(metadata, url);

      console.log(`Sending notification for: ${metadata.title}`);

      // Send to both platforms in parallel
      const results = await Promise.allSettled([
        config.telegram.botToken
          ? sendTelegramMessage(message, config.telegram)
          : Promise.resolve({ success: false, error: 'Telegram not configured' }),
        config.matrix.accessToken
          ? sendMatrixMessage(message, config.matrix)
          : Promise.resolve({ success: false, error: 'Matrix not configured' })
      ]);

      for (const result of results) {
        if (result.status === 'rejected') {
          console.error('Notification send failed:', result.reason);
        } else if (!result.value.success) {
          console.warn('Notification send unsuccessful:', result.value.error);
        }
      }
    } catch (err) {
      console.error(`Error processing ${filePath}:`, err);
    }
  }
}

// Create and start the server
const app = createWebhookServer({
  webhookSecret: config.webhookSecret,
  onPushEvent: handlePushEvent
});

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`hadal-zone notification bot listening on port ${config.port}`);
    console.log(`Telegram: ${config.telegram.botToken ? 'configured' : 'not configured'}`);
    console.log(`Matrix: ${config.matrix.accessToken ? 'configured' : 'not configured'}`);
  });
}

module.exports = { handlePushEvent, app };
