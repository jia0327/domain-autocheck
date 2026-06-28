import { describe, it, expect } from 'vitest';
import {
  resolveVendorTemplates,
  sanitizeVendorTemplateItem,
  matchVendorTemplate,
  getRenewLinkProviderId,
  resolveDefaultRenewLinks,
  resolveRenewWindowDays,
  getDnsheApiCredentials,
} from '../src/index.js';

describe('resolveVendorTemplates', () => {
  it('returns built-in templates by default', () => {
    const templates = resolveVendorTemplates(null, null);
    expect(templates.find((t) => t.id === 'dnshe')?.renewWindowDays).toBe(180);
    expect(templates.find((t) => t.id === 'gname')?.renewLink).toContain('gname.com');
  });

  it('migrates legacy renew link overrides', () => {
    const templates = resolveVendorTemplates(null, {
      defaultRenewLinks: { gname: 'https://www.gname.com/custom' },
    });
    expect(templates.find((t) => t.id === 'gname')?.renewLink).toBe('https://www.gname.com/custom');
  });

  it('applies stored vendor template overrides', () => {
    const templates = resolveVendorTemplates([
      { id: 'dnshe', name: 'DNSHE', suffixes: ['.ddns.ge'], renewWindowDays: 120, defaultNotifyDays: 14, whois: 'dnshe' },
    ]);
    expect(templates.find((t) => t.id === 'dnshe')?.renewWindowDays).toBe(120);
    expect(templates.find((t) => t.id === 'dnshe')?.defaultNotifyDays).toBe(14);
  });
});

describe('matchVendorTemplate', () => {
  const templates = resolveVendorTemplates(null, null);

  it('matches longest suffix', () => {
    const vendor = matchVendorTemplate('foo.pp.ua', templates);
    expect(vendor?.id).toBe('nicUa');
  });

  it('matches dnshe suffixes', () => {
    expect(matchVendorTemplate('cpe.ddns.ge', templates)?.id).toBe('dnshe');
  });
});

describe('sanitizeVendorTemplateItem', () => {
  it('accepts custom vendor with suffixes', () => {
    const item = sanitizeVendorTemplateItem({
      id: 'v_custom',
      name: 'My Registrar',
      suffixes: ['.example.io', 'foo.com'],
      renewWindowDays: 30,
      defaultNotifyDays: 7,
      whois: '',
    });
    expect(item?.id).toBe('v_custom');
    expect(item?.suffixes).toContain('.example.io');
    expect(item?.suffixes).toContain('.foo.com');
  });

  it('sanitizes dnshe auth fields', () => {
    const item = sanitizeVendorTemplateItem({
      id: 'dnshe',
      name: 'DNSHE',
      suffixes: ['.ddns.ge'],
      whois: 'dnshe',
      auth: { type: 'dnshe', apiKey: 'key1', apiSecret: 'sec1' },
    });
    expect(item?.auth?.apiKey).toBe('key1');
  });
});

describe('renew helpers with vendor templates', () => {
  it('getRenewLinkProviderId uses template match', () => {
    const config = { vendorTemplates: resolveVendorTemplates(null, null) };
    expect(getRenewLinkProviderId('x.eu.cc', config)).toBe('gname');
  });

  it('resolveDefaultRenewLinks from full config', () => {
    const links = resolveDefaultRenewLinks({ vendorTemplates: resolveVendorTemplates(null, null) });
    expect(links.nicUa).toContain('nic.ua');
  });

  it('resolveRenewWindowDays from full config', () => {
    const windows = resolveRenewWindowDays({ vendorTemplates: resolveVendorTemplates(null, null) });
    expect(windows.dnshe).toBe(180);
  });
});

describe('getDnsheApiCredentials', () => {
  it('prefers template kv credentials over empty env', () => {
    const templates = resolveVendorTemplates([
      {
        id: 'dnshe',
        name: 'DNSHE',
        suffixes: ['.ddns.ge'],
        whois: 'dnshe',
        auth: { type: 'dnshe', apiKey: 'from-kv', apiSecret: 'from-secret' },
      },
    ]);
    const creds = getDnsheApiCredentials(templates);
    expect(creds.key).toBe('from-kv');
    expect(creds.secret).toBe('from-secret');
  });
});
