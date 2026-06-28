import { describe, it, expect } from 'vitest';
import { isRenewalDetected } from '../src/index.js';

describe('isRenewalDetected', () => {
  it('returns true when WHOIS expiry is later than stored', () => {
    expect(isRenewalDetected('2026-05-29', '2027-05-29')).toBe(true);
    expect(isRenewalDetected('2028-05-29', '2029-05-29')).toBe(true);
  });

  it('returns false when dates are equal', () => {
    expect(isRenewalDetected('2029-05-29', '2029-05-29')).toBe(false);
  });

  it('returns false when WHOIS expiry is earlier (local record ahead)', () => {
    expect(isRenewalDetected('2029-05-29', '2028-05-29')).toBe(false);
  });

  it('returns false for missing or invalid input', () => {
    expect(isRenewalDetected('', '2029-05-29')).toBe(false);
    expect(isRenewalDetected('2029-05-29', '')).toBe(false);
    expect(isRenewalDetected(null, '2029-05-29')).toBe(false);
  });
});
