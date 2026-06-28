import { describe, it, expect } from 'vitest';
import {
  isDnsheDomain,
  getRenewLinkProviderId,
  resolveRenewWindowDays,
  resolveDefaultRenewLinks,
  parseDnsheApiJsonBody,
  getDnsheSubdomainFullName,
  mapDnsheSubdomainToDomainData,
} from '../src/index.js';

describe('isDnsheDomain', () => {
  it('matches DNSHE managed suffixes', () => {
    expect(isDnsheDomain('vibecode.bbroot.com')).toBe(true);
    expect(isDnsheDomain('foo.de5.net')).toBe(true);
    expect(isDnsheDomain('bar.ccwu.cc')).toBe(true);
    expect(isDnsheDomain('baz.onlydev.cc')).toBe(true);
    expect(isDnsheDomain('x.us.ci')).toBe(true);
    expect(isDnsheDomain('y.cn.mt')).toBe(true);
    expect(isDnsheDomain('cpe.ddns.ge')).toBe(true);
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

describe('parseDnsheApiJsonBody', () => {
  it('detects HTML error pages', () => {
    const parsed = parseDnsheApiJsonBody('<!DOCTYPE html><html><body>Login</body></html>');
    expect(parsed.ok).toBe(false);
    expect(parsed.html).toBe(true);
    expect(parsed.error).toContain('HTML');
  });

  it('parses valid JSON payloads', () => {
    const parsed = parseDnsheApiJsonBody('{"success":true,"domain":"foo.cc.cd"}');
    expect(parsed.ok).toBe(true);
    expect(parsed.data.domain).toBe('foo.cc.cd');
  });
});

describe('DNSHE import helpers', () => {
  it('builds full domain name from subdomain payload', () => {
    expect(getDnsheSubdomainFullName({ full_domain: 'Rando.CC.cd' })).toBe('rando.cc.cd');
    expect(getDnsheSubdomainFullName({ subdomain: 'cpe', rootdomain: 'ddns.ge' })).toBe('cpe.ddns.ge');
  });

  it('maps subdomain list item to domain record', () => {
    const record = mapDnsheSubdomainToDomainData({
      full_domain: 'rando.cc.cd',
      created_at: '2026-06-27 19:41',
      expires_at: '2027-06-27 19:41',
      status: 'active',
    }, resolveDefaultRenewLinks(null), 'cat_dnshe');

    expect(record.name).toBe('rando.cc.cd');
    expect(record.registrar).toBe('DNSHE');
    expect(record.registrationDate).toBe('2026-06-27');
    expect(record.expiryDate).toBe('2027-06-27');
    expect(record.categoryId).toBe('cat_dnshe');
    expect(record.renewLink).toContain('dnshe.com');
  });
});
