import { getMirrorTier } from './mirror';

describe('getMirrorTier', () => {
  it('≥ 70 → sparkle', () => {
    expect(getMirrorTier(70)).toBe('sparkle');
    expect(getMirrorTier(100)).toBe('sparkle');
  });

  it('30–69 → neutral', () => {
    expect(getMirrorTier(30)).toBe('neutral');
    expect(getMirrorTier(69)).toBe('neutral');
  });

  it('< 30 → tired', () => {
    expect(getMirrorTier(29)).toBe('tired');
    expect(getMirrorTier(0)).toBe('tired');
  });
});
