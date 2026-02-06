/**
 * Matrix client-server API integration.
 *
 * Sends notification messages to a Matrix room using the client-server API.
 * Uses native fetch — no heavy Matrix SDK needed for this simple use case.
 */

let txnCounter = 0;

/**
 * Generate a unique transaction ID for Matrix API idempotency.
 */
function generateTxnId() {
  txnCounter++;
  return `hadal_${Date.now()}_${txnCounter}`;
}

/**
 * Send a text message to a Matrix room.
 *
 * @param {string} message - The message text to send
 * @param {{ homeserver: string, accessToken: string, roomId: string }} config
 * @returns {Promise<{ success: boolean, eventId?: string, error?: string }>}
 */
async function sendMatrixMessage(message, config) {
  const encodedRoomId = encodeURIComponent(config.roomId);
  const txnId = generateTxnId();
  const url = `${config.homeserver}/_matrix/client/v3/rooms/${encodedRoomId}/send/m.room.message/${txnId}`;

  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.accessToken}`
      },
      body: JSON.stringify({
        msgtype: 'm.text',
        body: message
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data.error || `HTTP ${response.status}`;
      console.error(`Matrix API error: ${errorMsg}`);
      return { success: false, error: errorMsg };
    }

    return { success: true, eventId: data.event_id };
  } catch (err) {
    console.error(`Matrix send error: ${err.message}`);
    return { success: false, error: err.message };
  }
}

module.exports = { sendMatrixMessage };
