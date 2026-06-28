import { describe, it, expect } from 'vitest';
import {
  sanitizePushChannels,
  resolvePushChannels,
  isAnyPushChannelConfigured,
} from '../src/index.js';

describe('sanitizePushChannels', () => {
  it('keeps enabled flag and string fields', () => {
    const out = sanitizePushChannels({
      bark: { enabled: true, push: 'abc123', group: 'domain' },
      dingtalk: { enabled: false, token: 'tok' },
    });
    expect(out.bark.enabled).toBe(true);
    expect(out.bark.push).toBe('abc123');
    expect(out.dingtalk.enabled).toBe(false);
  });
});

describe('resolvePushChannels', () => {
  it('returns disabled channels without values', () => {
    const ch = resolvePushChannels({});
    expect(ch.bark.enabled).toBe(false);
    expect(ch.bark.value).toBe('');
  });

  it('reads kv config values', () => {
    const ch = resolvePushChannels({
      bark: { enabled: true, push: 'my-device-key' },
    });
    expect(ch.bark.enabled).toBe(true);
    expect(ch.bark.value).toBe('my-device-key');
  });
});

describe('isAnyPushChannelConfigured', () => {
  it('true when telegram enabled with credentials', () => {
    expect(isAnyPushChannelConfigured({
      enabled: true,
      botToken: 't',
      chatId: 'c',
      pushChannels: {},
    })).toBe(true);
  });

  it('true when push channel enabled with key', () => {
    expect(isAnyPushChannelConfigured({
      enabled: false,
      pushChannels: { bark: { enabled: true, push: 'key123' } },
    })).toBe(true);
  });

  it('false when nothing configured', () => {
    expect(isAnyPushChannelConfigured({ enabled: false, pushChannels: {} })).toBe(false);
  });
});
