import { describe, it, expect } from 'vitest';
import {
  getRenewLinkProviderId,
  resolveDefaultRenewLinks,
  getEffectiveRenewLink,
  resolveRenewWindowDays,
  isRenewLinkAvailable,
  computeDaysLeft,
} from '../src/index.js';

describe('getRenewLinkProviderId', () => {
  it('maps known suffixes to provider ids', () => {
    expect(getRenewLinkProviderId('foo.pp.ua')).toBe('nicUa');
    expect(getRenewLinkProviderId('bar.eu.cc')).toBe('gname');
    expect(getRenewLinkProviderId('x.qzz.io')).toBe('digitalPlat');
    expect(getRenewLinkProviderId('example.com')).toBe(null);
  });
});

describe('resolveDefaultRenewLinks', () => {
  it('returns built-in defaults when nothing stored', () => {
    const links = resolveDefaultRenewLinks(null);
    expect(links.gname).toBe('https://www.gname.com/tld-eu-cc.html#registered');
    expect(links.nicUa).toBe('https://nic.ua/en/my/domains');
  });

  it('overrides built-in with stored safe URLs', () => {
    const links = resolveDefaultRenewLinks({
      gname: 'https://www.gname.com/custom',
    });
    expect(links.gname).toBe('https://www.gname.com/custom');
    expect(links.nicUa).toBe('https://nic.ua/en/my/domains');
  });

  it('ignores unsafe stored URLs', () => {
    const links = resolveDefaultRenewLinks({
      gname: 'javascript:alert(1)',
    });
    expect(links.gname).toBe('https://www.gname.com/tld-eu-cc.html#registered');
  });
});

describe('getEffectiveRenewLink', () => {
  const defaults = resolveDefaultRenewLinks({
    gname: 'https://www.gname.com/tld-eu-cc.html#registered',
  });

  it('prefers domain custom link over provider default', () => {
    const link = getEffectiveRenewLink(
      { name: 'foo.eu.cc', renewLink: 'https://custom.example/renew' },
      defaults,
    );
    expect(link).toBe('https://custom.example/renew');
  });

  it('falls back to provider default when custom is empty', () => {
    const link = getEffectiveRenewLink(
      { name: 'foo.eu.cc', renewLink: '' },
      defaults,
    );
    expect(link).toBe('https://www.gname.com/tld-eu-cc.html#registered');
  });

  it('returns empty for unsupported TLD without custom link', () => {
    const link = getEffectiveRenewLink(
      { name: 'example.com', renewLink: '' },
      defaults,
    );
    expect(link).toBe('');
  });
});

describe('resolveRenewWindowDays', () => {
  it('returns built-in defaults including gname 90 days', () => {
    const windows = resolveRenewWindowDays(null);
    expect(windows.gname).toBe(90);
    expect(windows.nicUa).toBe(0);
  });

  it('overrides stored window days', () => {
    const windows = resolveRenewWindowDays({ gname: 60 });
    expect(windows.gname).toBe(60);
  });
});

describe('isRenewLinkAvailable', () => {
  const windows = resolveRenewWindowDays({ gname: 90 });
  const now = new Date('2026-01-01');

  it('allows custom renew link regardless of window', () => {
    const result = isRenewLinkAvailable(
      { name: 'foo.eu.cc', renewLink: 'https://custom.example', expiryDate: '2027-06-01' },
      windows,
      now,
    );
    expect(result.available).toBe(true);
    expect(result.bypassWindow).toBe(true);
  });

  it('blocks gname domain when more than 90 days remain', () => {
    const result = isRenewLinkAvailable(
      { name: 'foo.eu.cc', renewLink: '', expiryDate: '2026-06-01' },
      windows,
      now,
    );
    expect(result.available).toBe(false);
    expect(result.daysUntilWindow).toBeGreaterThan(0);
  });

  it('allows gname domain within 90 days of expiry', () => {
    const result = isRenewLinkAvailable(
      { name: 'foo.eu.cc', renewLink: '', expiryDate: '2026-02-15' },
      windows,
      now,
    );
    expect(result.available).toBe(true);
  });

  it('allows expired domain within window rules', () => {
    const result = isRenewLinkAvailable(
      { name: 'foo.eu.cc', renewLink: '', expiryDate: '2025-12-01' },
      windows,
      now,
    );
    expect(result.available).toBe(true);
  });
});

describe('computeDaysLeft', () => {
  it('computes days until expiry', () => {
    const days = computeDaysLeft('2026-01-11', new Date('2026-01-01'));
    expect(days).toBe(10);
  });
});
