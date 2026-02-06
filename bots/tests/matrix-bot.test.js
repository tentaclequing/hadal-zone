const { sendMatrixMessage } = require('../src/matrix-bot');

const originalFetch = global.fetch;

describe('matrix-bot', () => {
  let mockFetch;

  beforeEach(() => {
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  describe('sendMatrixMessage', () => {
    const config = {
      homeserver: 'https://matrix.org',
      accessToken: 'test-access-token-xyz',
      roomId: '!testroom:matrix.org'
    };

    it('sends a correctly formatted message to the Matrix API', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ event_id: '$event123' })
      });

      const message = 'New resource on hadal-zone:\nTest Document (EN)';
      await sendMatrixMessage(message, config);

      expect(mockFetch).toHaveBeenCalledTimes(1);

      const [url, options] = mockFetch.mock.calls[0];

      // URL should target the room's send endpoint
      expect(url).toMatch(/^https:\/\/matrix\.org\/_matrix\/client\/v3\/rooms\/%21testroom%3Amatrix\.org\/send\/m\.room\.message\//);
      expect(options.method).toBe('PUT');
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.headers['Authorization']).toBe('Bearer test-access-token-xyz');

      const body = JSON.parse(options.body);
      expect(body.msgtype).toBe('m.text');
      expect(body.body).toBe(message);
    });

    it('sends to the configured room', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ event_id: '$evt1' })
      });

      const customConfig = {
        homeserver: 'https://custom.matrix.server',
        accessToken: 'tok',
        roomId: '!customroom:custom.matrix.server'
      };

      await sendMatrixMessage('test', customConfig);

      const url = mockFetch.mock.calls[0][0];
      expect(url).toContain('custom.matrix.server');
      expect(url).toContain(encodeURIComponent('!customroom:custom.matrix.server'));
    });

    it('handles API errors gracefully without throwing', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ errcode: 'M_FORBIDDEN', error: 'User is not in the room' })
      });

      const result = await sendMatrixMessage('test', config);
      expect(result.success).toBe(false);
      expect(result.error).toContain('User is not in the room');
    });

    it('handles network errors gracefully without throwing', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection refused'));

      const result = await sendMatrixMessage('test', config);
      expect(result.success).toBe(false);
      expect(result.error).toContain('Connection refused');
    });

    it('returns success result with event ID on successful send', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ event_id: '$abc123' })
      });

      const result = await sendMatrixMessage('hello', config);
      expect(result.success).toBe(true);
      expect(result.eventId).toBe('$abc123');
    });

    it('uses a unique transaction ID for each request', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({ event_id: '$evt' })
      });

      await sendMatrixMessage('msg1', config);
      await sendMatrixMessage('msg2', config);

      const url1 = mockFetch.mock.calls[0][0];
      const url2 = mockFetch.mock.calls[1][0];

      // Transaction IDs in URLs should be different
      expect(url1).not.toBe(url2);
    });
  });
});
