import type {
  BoundaryAttackQuestion,
  CompleteTestCaseQuestion,
  PrioritySeverityDuelQuestion,
  RiskRadarQuestion,
  RootCauseChainQuestion,
} from './question-types';
import {
  gradeBoundaryAttack,
  gradeCompleteTestCase,
  gradePrioritySeverityDuel,
  gradeRiskRadar,
  gradeRootCauseChain,
} from './question-types';

const duel: PrioritySeverityDuelQuestion = {
  id: 'd',
  format: 'priority_severity_duel',
  prompt: 'p',
  bugDescription: 'bug',
  correctPriority: 'high',
  correctSeverity: 'low',
};

const boundary: BoundaryAttackQuestion = {
  id: 'b',
  format: 'boundary_attack',
  prompt: 'p',
  scenario: 'range 1–10',
  expectedValues: ['0', '1', '10', '11'],
};

const chain: RootCauseChainQuestion = {
  id: 'c',
  format: 'root_cause_chain',
  prompt: 'p',
  events: [{ id: 'e1', text: '1' }, { id: 'e2', text: '2' }, { id: 'e3', text: '3' }],
  correctOrder: ['e1', 'e2', 'e3'],
};

const radar: RiskRadarQuestion = {
  id: 'r',
  format: 'risk_radar',
  prompt: 'p',
  items: [
    { id: 'i1', text: '1' },
    { id: 'i2', text: '2' },
    { id: 'i3', text: '3' },
    { id: 'i4', text: '4' },
    { id: 'i5', text: '5' },
  ],
  correctRanking: ['i1', 'i2', 'i3', 'i4', 'i5'],
};

const testCase: CompleteTestCaseQuestion = {
  id: 't',
  format: 'complete_test_case',
  prompt: 'p',
  fields: [
    { key: 'precondition', label: 'Precondition', keywords: ['đăng nhập', 'logged in'] },
    { key: 'expected', label: 'Expected', keywords: ['thành công', 'success'] },
  ],
};

describe('grade · priority_severity_duel', () => {
  it('đúng quadrant', () => {
    expect(gradePrioritySeverityDuel(duel, 'high', 'low')).toBe(true);
  });
  it('sai priority', () => {
    expect(gradePrioritySeverityDuel(duel, 'low', 'low')).toBe(false);
  });
  it('sai severity', () => {
    expect(gradePrioritySeverityDuel(duel, 'high', 'high')).toBe(false);
  });
});

describe('grade · boundary_attack', () => {
  it('đủ value (normalize, phân tách đa dạng) → đúng, không thiếu', () => {
    const r = gradeBoundaryAttack(boundary, ' 0, 1 ; 10  11 ');
    expect(r.isCorrect).toBe(true);
    expect(r.missing).toEqual([]);
  });
  it('thiếu value → sai + liệt kê thiếu', () => {
    const r = gradeBoundaryAttack(boundary, '1, 10');
    expect(r.isCorrect).toBe(false);
    expect(r.missing).toEqual(['0', '11']);
  });
});

describe('grade · root_cause_chain', () => {
  it('đúng thứ tự', () => {
    expect(gradeRootCauseChain(chain, ['e1', 'e2', 'e3'])).toBe(true);
  });
  it('sai thứ tự', () => {
    expect(gradeRootCauseChain(chain, ['e2', 'e1', 'e3'])).toBe(false);
  });
});

describe('grade · risk_radar (partial ≥70%)', () => {
  it('đúng hết → ratio 1, đúng', () => {
    expect(gradeRiskRadar(radar, ['i1', 'i2', 'i3', 'i4', 'i5'])).toEqual({ isCorrect: true, ratio: 1 });
  });
  it('4/5 vị trí đúng (80% ≥ 70%) → đúng', () => {
    const r = gradeRiskRadar(radar, ['i1', 'i2', 'i3', 'i4', 'iX']);
    expect(r.ratio).toBe(0.8);
    expect(r.isCorrect).toBe(true);
  });
  it('3/5 vị trí đúng (60% < 70%) → sai', () => {
    const r = gradeRiskRadar(radar, ['i1', 'i2', 'i3', 'iX', 'iY']);
    expect(r.ratio).toBeCloseTo(0.6);
    expect(r.isCorrect).toBe(false);
  });
  it('sai số lượng → ratio 0', () => {
    expect(gradeRiskRadar(radar, ['i1', 'i2'])).toEqual({ isCorrect: false, ratio: 0 });
  });
});

describe('grade · complete_test_case (keyword)', () => {
  it('mỗi field chứa ≥1 keyword (case-insensitive) → đúng', () => {
    expect(gradeCompleteTestCase(testCase, {
      precondition: 'User đã ĐĂNG NHẬP vào hệ thống',
      expected: 'Hiển thị thông báo Thành Công',
    })).toBe(true);
  });
  it('thiếu keyword 1 field → sai', () => {
    expect(gradeCompleteTestCase(testCase, {
      precondition: 'User đã đăng nhập',
      expected: 'màn hình trống',
    })).toBe(false);
  });
  it('field trống → sai', () => {
    expect(gradeCompleteTestCase(testCase, { precondition: '', expected: 'thành công' })).toBe(false);
  });
});
