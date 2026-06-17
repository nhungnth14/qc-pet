/**
 * Question Format Engine — data model + grade thuần (Story 5.4).
 *
 * Mọi format render UI riêng nhưng trả về CHUẨN HOÁ `AnswerResult` cho quiz player.
 * Hàm `grade*` là thuần (không UI) để unit-test dễ và tách logic chấm khỏi gesture.
 *
 * Content `format` field thuộc Story 1.1 (Epic 1) — chưa build. Story này tự định
 * nghĩa model + sample data (xem sample-questions.ts), sẵn sàng map khi có content pipeline.
 */

export type QuestionFormat
  = | 'mcq'
    | 'bug_report_surgery'
    | 'severity_swipe'
    | 'spot_the_defect'
    | 'rewrite_the_fail';

/** Kết quả chuẩn hoá mọi format trả về cho quiz player. `answer` = serialize lựa chọn. */
export type AnswerResult = { isCorrect: boolean; answer: string };

type BaseQuestion = {
  id: string;
  prompt: string;
  isWarmup?: boolean;
};

// ─── MCQ ──────────────────────────────────────────────────────────────────────
export type McqQuestion = BaseQuestion & {
  format: 'mcq';
  options: string[];
  correctIndex: number;
};

// ─── Severity Swipe (Tinder-style 4 hướng) ────────────────────────────────────
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical';
/** trái=low, lên=medium, phải=high, xuống=critical */
export type SeveritySwipeQuestion = BaseQuestion & {
  format: 'severity_swipe';
  bugDescription: string;
  correctSeverity: SeverityLevel;
};

// ─── Spot the Defect (tap zones, hỗ trợ multi-defect) ─────────────────────────
/** Toạ độ theo % (0–100) của khung ảnh. */
export type DefectZone = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  isDefect: boolean;
  label: string;
};
export type SpotTheDefectQuestion = BaseQuestion & {
  format: 'spot_the_defect';
  /** Mô tả khung mockup (chưa có asset thật — render placeholder). */
  sceneLabel: string;
  zones: DefectZone[];
};

// ─── Bug Report Surgery (block → field, 1 block/field) ────────────────────────
export type BugReportField = 'title' | 'steps' | 'expected_actual' | 'severity';
export type BugBlock = { id: string; text: string; correctField: BugReportField };
export type BugReportSurgeryQuestion = BaseQuestion & {
  format: 'bug_report_surgery';
  fields: { key: BugReportField; label: string }[];
  blocks: BugBlock[];
};
/** field key → block id đang đặt (null = trống). */
export type BugReportPlacement = Partial<Record<BugReportField, string | null>>;

// ─── Rewrite the Fail (sắp xếp blocks → đúng thứ tự) ──────────────────────────
export type RewriteBlock = { id: string; text: string };
export type RewriteTheFailQuestion = BaseQuestion & {
  format: 'rewrite_the_fail';
  badText: string;
  blocks: RewriteBlock[];
  correctOrder: string[]; // block ids theo thứ tự đúng
};

export type Question
  = | McqQuestion
    | SeveritySwipeQuestion
    | SpotTheDefectQuestion
    | BugReportSurgeryQuestion
    | RewriteTheFailQuestion;

// ─── Grade (thuần) ────────────────────────────────────────────────────────────

export function gradeMcq(q: McqQuestion, selectedIndex: number): boolean {
  return selectedIndex === q.correctIndex;
}

export function gradeSeveritySwipe(q: SeveritySwipeQuestion, chosen: SeverityLevel): boolean {
  return chosen === q.correctSeverity;
}

/** Đúng khi tập zone đã tap === đúng tập defect zones (không thừa, không thiếu). */
export function gradeSpotTheDefect(q: SpotTheDefectQuestion, tappedZoneIds: string[]): boolean {
  const defects = q.zones.filter(z => z.isDefect).map(z => z.id).sort();
  const tapped = Array.from(new Set(tappedZoneIds)).sort();
  return defects.length === tapped.length && defects.every((d, i) => d === tapped[i]);
}

/** Đúng khi MỌI field được đặt đúng block (block.correctField === field). */
export function gradeBugReportSurgery(
  q: BugReportSurgeryQuestion,
  placement: BugReportPlacement,
): boolean {
  return q.fields.every((field) => {
    const blockId = placement[field.key];
    if (!blockId)
      return false;
    const block = q.blocks.find(b => b.id === blockId);
    return !!block && block.correctField === field.key;
  });
}

export function gradeRewriteTheFail(q: RewriteTheFailQuestion, orderedBlockIds: string[]): boolean {
  return (
    orderedBlockIds.length === q.correctOrder.length
    && orderedBlockIds.every((id, i) => id === q.correctOrder[i])
  );
}
