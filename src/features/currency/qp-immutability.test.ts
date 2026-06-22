import { clampQpNonDecreasing, qpCanUpdate } from './qp-immutability';

describe('qpCanUpdate (Story 6.3 — QP không bao giờ giảm)', () => {
  it('increase → hợp lệ', () => {
    expect(qpCanUpdate(100, 120)).toBe(true);
  });
  it('giữ nguyên → hợp lệ', () => {
    expect(qpCanUpdate(100, 100)).toBe(true);
  });
  it('decrease → KHÔNG hợp lệ (trigger sẽ raise)', () => {
    expect(qpCanUpdate(100, 99)).toBe(false);
    expect(qpCanUpdate(100, 0)).toBe(false);
  });
});

describe('clampQpNonDecreasing', () => {
  it('giữ giá trị lớn hơn khi tăng', () => {
    expect(clampQpNonDecreasing(100, 120)).toBe(120);
  });
  it('chặn giảm → giữ giá trị cũ', () => {
    expect(clampQpNonDecreasing(100, 80)).toBe(100);
  });
});
