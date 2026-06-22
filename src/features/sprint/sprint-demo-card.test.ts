import { buildShareText, isShareable } from './sprint-demo-card';

const HOUR_MS = 60 * 60 * 1000;

describe('buildShareText', () => {
  it('đúng format với sprint number', () => {
    expect(buildShareText(3)).toBe('Mình vừa complete sprint #3 cùng Bugsy! 🐣');
  });
});

describe('isShareable', () => {
  it('true trong vòng 48h', () => {
    expect(isShareable(0, 47 * HOUR_MS)).toBe(true);
  });

  it('false sau 48h', () => {
    expect(isShareable(0, 49 * HOUR_MS)).toBe(false);
  });
});
