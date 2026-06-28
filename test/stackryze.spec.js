import { describe, it, expect } from 'vitest';
import {
  isStackryzeDomain,
  getRenewLinkProviderId,
  resolveRenewWindowDays,
} from '../src/index.js';

describe('isStackryzeDomain', () => {
  it('matches Stackryze managed suffixes', () => {
    expect(isStackryzeDomain('yourproject.indevs.in')).toBe(true);
    expect(isStackryzeDomain('foo.sryze.cc')).toBe(true);
    expect(isStackryzeDomain('bar.ryzedns.org')).toBe(true);
    expect(isStackryzeDomain('baz.nx.kg')).toBe(true);
  });

  it('does not match unrelated domains', () => {
    expect(isStackryzeDomain('example.com')).toBe(false);
    expect(isStackryzeDomain('foo.eu.cc')).toBe(false);
    expect(isStackryzeDomain('indevs.in')).toBe(false);
  });
});

describe('Stackryze provider defaults', () => {
  it('maps to stackryze provider id', () => {
    expect(getRenewLinkProviderId('yourproject.indevs.in')).toBe('stackryze');
  });

  it('defaults renew window to 60 days', () => {
    const windows = resolveRenewWindowDays(null);
    expect(windows.stackryze).toBe(60);
  });
});
