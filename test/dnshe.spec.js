import { describe, it, expect } from 'vitest';
import {
  isDnsheDomain,
  getRenewLinkProviderId,
  resolveRenewWindowDays,
  resolveDefaultRenewLinks,
} from '../src/index.js';

describe('isDnsheDomain', () => {
  it('matches DNSHE managed suffixes', () => {
    expect(isDnsheDomain('vibecode.bbroot.com')).toBe(true);
    expect(isDnsheDomain('foo.de5.net')).toBe(true);
    expect(isDnsheDomain('bar.ccwu.cc')).toBe(true);
    expect(isDnsheDomain('baz.onlydev.cc')).toBe(true);
    expect(isDnsheDomain('x.us.ci')).toBe(true);
    expect(isDnsheDomain('y.cn.mt')).toBe(true);
  });

  it('does not match unrelated domains', () => {
    expect(isDnsheDomain('example.com')).toBe(false);
    expect(isDnsheDomain('bbroot.com')).toBe(false);
    expect(isDnsheDomain('foo.eu.cc')).toBe(false);
  });
});

describe('DNSHE provider defaults', () => {
  it('maps to dnshe provider id', () => {
    expect(getRenewLinkProviderId('vibecode.bbroot.com')).toBe('dnshe');
  });

  it('defaults renew window to 180 days', () => {
    const windows = resolveRenewWindowDays(null);
    expect(windows.dnshe).toBe(180);
  });

  it('defaults renew link to DNSHE Domain Hub', () => {
    const links = resolveDefaultRenewLinks(null);
    expect(links.dnshe).toBe('https://my.dnshe.com/index.php?m=domain_hub');
  });
});
