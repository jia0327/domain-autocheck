import { describe, it, expect } from 'vitest';
import {
  sanitizePushChannels,
  resolvePushChannels,
  isAnyPushChannelConfigured,
  resolveNotifyChannel,
  sanitizeNotifyChannel,
  NOTIFY_CHANNEL_IDS,
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

describe('sanitizeNotifyChannel', () => {
  it('accepts known channel ids', () => {
    expect(sanitizeNotifyChannel('telegram')).toBe('telegram');
    expect(sanitizeNotifyChannel('bark')).toBe('bark');
  });

  it('rejects unknown ids', () => {
    expect(sanitizeNotifyChannel('invalid')).toBe('');
    expect(sanitizeNotifyChannel('')).toBe('');
  });

  it('includes telegram in channel list', () => {
    expect(NOTIFY_CHANNEL_IDS).toContain('telegram');
    expect(NOTIFY_CHANNEL_IDS).toContain('bark');
  });
});

describe('resolveNotifyChannel', () => {
  it('uses explicit notifyChannel when set', () => {
    expect(resolveNotifyChannel({ notifyChannel: 'bark', pushChannels: {} })).toBe('bark');
    expect(resolveNotifyChannel({ notifyChannel: '', enabled: true, botToken: 't', chatId: 'c' })).toBe('');
  });

  it('migrates legacy telegram enabled config', () => {
    expect(resolveNotifyChannel({
      enabled: true,
      botToken: 't',
      chatId: 'c',
      pushChannels: {},
    })).toBe('telegram');
  });

  it('migrates legacy push channel enabled config', () => {
    expect(resolveNotifyChannel({
      enabled: false,
      pushChannels: { bark: { enabled: true, push: 'key123' } },
    })).toBe('bark');
  });
});

describe('isAnyPushChannelConfigured', () => {
  it('true when telegram is selected with credentials', () => {
    expect(isAnyPushChannelConfigured({
      notifyChannel: 'telegram',
      botToken: 't',
      chatId: 'c',
      pushChannels: {},
    })).toBe(true);
  });

  it('true when push channel is selected with key', () => {
    expect(isAnyPushChannelConfigured({
      notifyChannel: 'bark',
      pushChannels: { bark: { push: 'key123' } },
    })).toBe(true);
  });

  it('false when notify disabled', () => {
    expect(isAnyPushChannelConfigured({ notifyChannel: '', pushChannels: {} })).toBe(false);
  });

  it('false when channel selected but not configured', () => {
    expect(isAnyPushChannelConfigured({
      notifyChannel: 'bark',
      pushChannels: {},
    })).toBe(false);
  });
});
