import { describe, it, expect } from 'vitest';
import {
  applyNameserversUpdate,
  normalizeNameservers,
  isCloudflareDelegated,
} from '../src/index.js';

describe('applyNameserversUpdate', () => {
  it('updates domain when nameservers change', () => {
    const domain = { id: '1', name: 'foo.eu.cc', nameservers: ['ns1.example.com'] };
    const result = applyNameserversUpdate(domain, ['henry.ns.cloudflare.com', 'natasha.ns.cloudflare.com']);
    expect(result.changed).toBe(true);
    expect(result.domain.nameservers).toEqual(['henry.ns.cloudflare.com', 'natasha.ns.cloudflare.com']);
    expect(isCloudflareDelegated(result.domain)).toBe(true);
  });

  it('returns unchanged when nameservers are the same', () => {
    const domain = { id: '1', name: 'foo.eu.cc', nameservers: ['henry.ns.cloudflare.com'] };
    const result = applyNameserversUpdate(domain, ['Henry.NS.cloudflare.com']);
    expect(result.changed).toBe(false);
  });

  it('clears nameservers when WHOIS returns empty list', () => {
    const domain = { id: '1', name: 'foo.eu.cc', nameservers: ['ns1.example.com'] };
    const result = applyNameserversUpdate(domain, []);
    expect(result.changed).toBe(true);
    expect(result.domain.nameservers).toBeUndefined();
  });
});

describe('normalizeNameservers', () => {
  it('deduplicates case-insensitively', () => {
    expect(normalizeNameservers(['A.NS.cloudflare.com', 'a.ns.cloudflare.com']))
      .toEqual(['a.ns.cloudflare.com']);
  });
});
