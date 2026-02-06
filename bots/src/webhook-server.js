const express = require('express');
const crypto = require('crypto');

function createWebhookServer({ webhookSecret, onPushEvent }) {
  const app = express();

  // Parse raw body for signature verification, then JSON
  app.use(express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    }
  }));

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  // GitHub webhook endpoint
  app.post('/webhook', (req, res) => {
    // Verify signature if secret is configured
    if (webhookSecret) {
      const signature = req.headers['x-hub-signature-256'];
      if (!signature) {
        return res.status(401).json({ error: 'Missing signature' });
      }

      const expected = 'sha256=' + crypto
        .createHmac('sha256', webhookSecret)
        .update(req.rawBody)
        .digest('hex');

      if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const event = req.headers['x-github-event'];
    if (event !== 'push') {
      return res.status(200).json({ message: 'Event ignored', event });
    }

    // Process push event asynchronously
    if (onPushEvent) {
      onPushEvent(req.body).catch(err => {
        console.error('Error processing push event:', err);
      });
    }

    res.status(200).json({ message: 'Push event received' });
  });

  return app;
}

module.exports = { createWebhookServer };
