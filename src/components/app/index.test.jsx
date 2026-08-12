import {
  describe, it, afterEach, beforeAll,
} from 'vitest';
import { render, cleanup } from '@testing-library/react';

// @dsplay/template-utils reads window.dsplay_media/dsplay_config at import time,
// so these must be set before App (and therefore @dsplay/template-utils) is imported.
beforeAll(() => {
  window.dsplay_media = {
    duration: 10000,
    result: {
      data: {
        user: { name: 'Test User', username: 'testuser', pic: '' },
        posts: [{ id: '1', text: 'Hello #world', created: '2024-01-01T00:00:00.000Z', media: [] }],
      },
    },
  };
  window.dsplay_config = {
    locale: 'en', orientation: 'landscape', width: 1920, height: 1080, osVersion: 30,
  };
});

afterEach(cleanup);

describe('App', () => {
  it('renders without crashing', async () => {
    const { default: App } = await import('.');
    render(<App />);
  });
});
