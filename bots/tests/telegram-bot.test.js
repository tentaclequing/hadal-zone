const { sendTelegramMessage, _testInternals } = require('../src/telegram-bot');

// Mock the global fetch
const originalFetch = global.fetch;

describe('telegram-bot', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('sendTelegramMessage', () => {
    const config = {
      botToken: 'test-bot-token-123',
      channelId: '@test_channel'
    };

    it('sends a correctly formatted message to the Telegram API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, result: { message_id: 42 } })
      });

      const message = 'New resource on hadal-zone:\nTest Document (EN)';
      await sendTelegramMessage(message, config);

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];
      expect(url).toBe('https://api.telegram.org/bottest-bot-token-123/sendMessage');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toBe('application/json');

      const body = JSON.parse(options.body);
      expect(body.chat_id).toBe('@test_channel');
      expect(body.text).toBe(message);
      expect(body.disable_web_page_preview).toBe(false);
    });

    it('sends to the configured channel ID', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, result: { message_id: 1 } })
      });

      const customConfig = { botToken: 'tok', channelId: '-1001234567890' };
      await sendTelegramMessage('test', customConfig);

      const body = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(body.chat_id).toBe('-1001234567890');
    });

    it('handles API errors gracefully without throwing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ ok: false, description: 'Forbidden: bot was blocked' })
      });

      // Should not throw
      const result = await sendTelegramMessage('test', config);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Forbidden');
    });

    it('handles network errors gracefully without throwing', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await sendTelegramMessage('test', config);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Network error');
    });

    it('returns success result on successful send', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ ok: true, result: { message_id: 99 } })
      });

      const result = await sendTelegramMessage('hello', config);
      expect(result.success).toBe(true);
      expect(result.messageId).toBe(99);
    });
  });
});
