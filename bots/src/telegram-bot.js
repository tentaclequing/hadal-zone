/**
 * Telegram Bot API integration.
 *
 * Sends notification messages to a Telegram channel using the Bot API.
 * Uses native fetch (Node 18+) — no external HTTP library needed.
 */

const TELEGRAM_API_BASE = 'https://api.telegram.org';

/**
 * Send a text message to a Telegram channel.
 *
 * @param {string} message - The message text to send
 * @param {{ botToken: string, channelId: string }} config - Telegram bot configuration
 * @returns {Promise<{ success: boolean, messageId?: number, error?: string }>}
 */
async function sendTelegramMessage(message, config) {
  const url = `${TELEGRAM_API_BASE}/bot${config.botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: config.channelId,
        text: message,
        disable_web_page_preview: false
      })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      const errorMsg = data.description || `HTTP ${response.status}`;
      console.error(`Telegram API error: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }

    return { success: true, messageId: data.result.message_id };
  } catch (err) {
    console.error(`Telegram send error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = { sendTelegramMessage };
