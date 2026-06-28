import { describe, it, expect } from 'vitest';
import {
  normalizeNameservers,
  isCloudflareNameserver,
  isCloudflareDelegated,
  getCloudflareHostInfo,
} from '../src/index.js';

describe('isCloudflareNameserver', () => {
  it('detects Cloudflare NS hostnames', () => {
    expect(isCloudflareNameserver('henry.ns.cloudflare.com')).toBe(true);
    expect(isCloudflareNameserver('natasha.ns.cloudflare.com')).toBe(true);
  });

  it('rejects non-Cloudflare NS hostnames', () => {
    expect(isCloudflareNameserver('ns1.dnshe.com')).toBe(false);
    expect(isCloudflareNameserver('ns2.dnshe.org')).toBe(false);
  });
});

describe('isCloudflareDelegated', () => {
  it('returns true when Cloudflare NS is present', () => {
    expect(isCloudflareDelegated({
      nameservers: ['henry.ns.cloudflare.com', 'natasha.ns.cloudflare.com'],
    })).toBe(true);
  });

  it('returns false when only zone id is present without Cloudflare NS', () => {
    expect(isCloudflareDelegated({ cloudflareZoneId: 'zone123' })).toBe(false);
    expect(isCloudflareDelegated({
      cloudflareZoneId: 'zone123',
      nameservers: ['ns1.dnshe.com', 'ns2.dnshe.com'],
    })).toBe(false);
  });

  it('returns false for DNSHE-only nameservers', () => {
    expect(isCloudflareDelegated({
      nameservers: ['ns1.dnshe.com', 'ns2.dnshe.com'],
    })).toBe(false);
  });
});

describe('getCloudflareHostInfo', () => {
  it('shows badge only when delegated via NS', () => {
    const info = getCloudflareHostInfo({
      nameservers: ['henry.ns.cloudflare.com', 'natasha.ns.cloudflare.com'],
    });
    expect(info?.label).toBe('已托管 CF');
    expect(info?.title).toContain('henry.ns.cloudflare.com');
  });

  it('returns null when suffix is delegatable but NS is not Cloudflare', () => {
    expect(getCloudflareHostInfo({
      name: 'rando.cc.cd',
      nameservers: ['ns1.dnshe.com'],
    })).toBe(null);
  });

  it('returns null without Cloudflare NS', () => {
    expect(getCloudflareHostInfo({ nameservers: [] })).toBe(null);
  });
});

describe('normalizeNameservers', () => {
  it('lowercases and deduplicates', () => {
    expect(normalizeNameservers(['Henry.NS.cloudflare.com', 'henry.ns.cloudflare.com']))
      .toEqual(['henry.ns.cloudflare.com']);
  });
});
