import type {
  BugReportSurgeryQuestion,
  McqQuestion,
  RewriteTheFailQuestion,
  SeveritySwipeQuestion,
  SpotTheDefectQuestion,
} from './question-types';
import {
  gradeBugReportSurgery,
  gradeMcq,
  gradeRewriteTheFail,
  gradeSeveritySwipe,
  gradeSpotTheDefect,
} from './question-types';
import { SAMPLE_QUESTIONS } from './sample-questions';

const mcq = SAMPLE_QUESTIONS.find(q => q.format === 'mcq') as McqQuestion;
const swipe = SAMPLE_QUESTIONS.find(q => q.format === 'severity_swipe') as SeveritySwipeQuestion;
const spot = SAMPLE_QUESTIONS.find(q => q.format === 'spot_the_defect') as SpotTheDefectQuestion;
const bug = SAMPLE_QUESTIONS.find(
  q => q.format === 'bug_report_surgery',
) as BugReportSurgeryQuestion;
const rewrite = SAMPLE_QUESTIONS.find(
  q => q.format === 'rewrite_the_fail',
) as RewriteTheFailQuestion;

describe('grade · mcq', () => {
  it('đúng khi chọn đúng index', () => {
    expect(gradeMcq(mcq, mcq.correctIndex)).toBe(true);
  });
  it('sai khi chọn index khác', () => {
    expect(gradeMcq(mcq, 0)).toBe(false);
  });
});

describe('grade · severity swipe', () => {
  it('đúng khi vuốt đúng mức', () => {
    expect(gradeSeveritySwipe(swipe, swipe.correctSeverity)).toBe(true);
  });
  it('sai khi vuốt sai mức', () => {
    expect(gradeSeveritySwipe(swipe, 'critical')).toBe(false);
  });
});

describe('grade · spot the defect', () => {
  it('đúng khi tap đúng tập defect zone', () => {
    const defectIds = spot.zones.filter(z => z.isDefect).map(z => z.id);
    expect(gradeSpotTheDefect(spot, defectIds)).toBe(true);
  });
  it('khử trùng lặp tap (multi-tap cùng zone)', () => {
    const defectIds = spot.zones.filter(z => z.isDefect).map(z => z.id);
    expect(gradeSpotTheDefect(spot, [...defectIds, ...defectIds])).toBe(true);
  });
  it('sai khi tap thừa zone không lỗi', () => {
    const ids = spot.zones.map(z => z.id);
    expect(gradeSpotTheDefect(spot, ids)).toBe(false);
  });
  it('sai khi thiếu defect', () => {
    expect(gradeSpotTheDefect(spot, [])).toBe(false);
  });
});

describe('grade · bug report surgery', () => {
  it('đúng khi mọi block vào đúng field', () => {
    const placement = Object.fromEntries(bug.blocks.map(b => [b.correctField, b.id]));
    expect(gradeBugReportSurgery(bug, placement)).toBe(true);
  });
  it('sai khi 1 field trống', () => {
    const placement = Object.fromEntries(bug.blocks.slice(1).map(b => [b.correctField, b.id]));
    expect(gradeBugReportSurgery(bug, placement)).toBe(false);
  });
  it('sai khi block đặt nhầm field', () => {
    const [b0, b1] = bug.blocks;
    const placement = Object.fromEntries(bug.blocks.map(b => [b.correctField, b.id]));
    placement[b0.correctField] = b1.id; // đặt nhầm
    expect(gradeBugReportSurgery(bug, placement)).toBe(false);
  });
});

describe('grade · rewrite the fail', () => {
  it('đúng khi thứ tự khớp correctOrder', () => {
    expect(gradeRewriteTheFail(rewrite, rewrite.correctOrder)).toBe(true);
  });
  it('sai khi đảo thứ tự', () => {
    const reversed = [...rewrite.correctOrder].reverse();
    expect(gradeRewriteTheFail(rewrite, reversed)).toBe(false);
  });
  it('sai khi thiếu block', () => {
    expect(gradeRewriteTheFail(rewrite, rewrite.correctOrder.slice(1))).toBe(false);
  });
});
