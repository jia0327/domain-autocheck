import { describe, it, expect } from 'vitest';
import {
  isCloudflareDelegatable,
  getCloudflareHostInfo,
} from '../src/index.js';

describe('isCloudflareDelegatable', () => {
  it('matches known PSL suffixes', () => {
    expect(isCloudflareDelegatable('foo.de5.net')).toBe(true);
    expect(isCloudflareDelegatable('rando.cc.cd')).toBe(true);
    expect(isCloudflareDelegatable('onlydev.ccwu.cc')).toBe(true);
    expect(isCloudflareDelegatable('bar.us.ci')).toBe(true);
    expect(isCloudflareDelegatable('yourproject.indevs.in')).toBe(true);
    expect(isCloudflareDelegatable('x.eu.cc')).toBe(true);
  });

  it('does not match unsupported DNSHE suffixes', () => {
    expect(isCloudflareDelegatable('cpe.ddns.ge')).toBe(false);
    expect(isCloudflareDelegatable('vibecode.bbroot.com')).toBe(false);
    expect(isCloudflareDelegatable('foo.bot.cd')).toBe(false);
  });
});

describe('getCloudflareHostInfo', () => {
  it('shows delegated when zone id exists', () => {
    const info = getCloudflareHostInfo('rando.cc.cd', 'zone123');
    expect(info.status).toBe('delegated');
    expect(info.label).toBe('已托管 CF');
  });

  it('shows supported for delegatable suffix without zone id', () => {
    const info = getCloudflareHostInfo('rando.cc.cd', '');
    expect(info.status).toBe('supported');
    expect(info.label).toBe('可托管 CF');
  });

  it('shows dnshe_only for non-delegatable DNSHE suffix', () => {
    const info = getCloudflareHostInfo('cpe.ddns.ge', '');
    expect(info.status).toBe('dnshe_only');
    expect(info.label).toBe('仅 DNSHE');
  });

  it('returns null for regular domains', () => {
    expect(getCloudflareHostInfo('example.com', '')).toBe(null);
  });
});
