import { describe, it, expect } from 'vitest';
import {
  normalizeDomainName,
  findDomainByName,
} from '../src/index.js';

describe('normalizeDomainName', () => {
  it('trims and lowercases domain names', () => {
    expect(normalizeDomainName('  Example.COM  ')).toBe('example.com');
    expect(normalizeDomainName('Rando.CC.cd')).toBe('rando.cc.cd');
  });
});

describe('findDomainByName', () => {
  const domains = [
    { id: '1', name: 'rando.cc.cd' },
    { id: '2', name: 'Example.COM' },
  ];

  it('finds duplicates case-insensitively', () => {
    expect(findDomainByName(domains, 'RANDO.CC.CD')?.id).toBe('1');
    expect(findDomainByName(domains, 'example.com')?.id).toBe('2');
  });

  it('excludes the current record when updating', () => {
    expect(findDomainByName(domains, 'rando.cc.cd', '1')).toBe(null);
    expect(findDomainByName(domains, 'example.com', '1')?.id).toBe('2');
  });

  it('returns null when no duplicate exists', () => {
    expect(findDomainByName(domains, 'new.example.com')).toBe(null);
  });
});
