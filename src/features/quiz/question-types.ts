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
    | 'rewrite_the_fail'
    | 'priority_severity_duel'
    | 'boundary_attack'
    | 'root_cause_chain'
    | 'risk_radar'
    | 'complete_test_case';

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

// ─── Priority×Severity Duel (tap quadrant — Story 5.5) ────────────────────────
export type DuelAxis = 'low' | 'high';
export type PrioritySeverityDuelQuestion = BaseQuestion & {
  format: 'priority_severity_duel';
  bugDescription: string;
  correctPriority: DuelAxis;
  correctSeverity: DuelAxis;
};

// ─── Boundary Attack (text input) ─────────────────────────────────────────────
export type BoundaryAttackQuestion = BaseQuestion & {
  format: 'boundary_attack';
  scenario: string;
  expectedValues: string[];
};

// ─── Root Cause Chain (tap order) ─────────────────────────────────────────────
export type EventCard = { id: string; text: string };
export type RootCauseChainQuestion = BaseQuestion & {
  format: 'root_cause_chain';
  events: EventCard[];
  correctOrder: string[]; // event ids đúng thứ tự nhân–quả
};

// ─── Risk Radar (tap rank, partial credit ≥70%) ───────────────────────────────
export type RiskItem = { id: string; text: string };
export type RiskRadarQuestion = BaseQuestion & {
  format: 'risk_radar';
  items: RiskItem[];
  correctRanking: string[]; // item ids, top = risk cao nhất
};

// ─── Complete the Test Case (text fields + keyword match) ─────────────────────
export type TestCaseField = { key: string; label: string; keywords: string[] };
export type CompleteTestCaseQuestion = BaseQuestion & {
  format: 'complete_test_case';
  fields: TestCaseField[];
};
export type TestCaseFilled = Record<string, string>; // field key → text user nhập

export type Question
  = | McqQuestion
    | SeveritySwipeQuestion
    | SpotTheDefectQuestion
    | BugReportSurgeryQuestion
    | RewriteTheFailQuestion
    | PrioritySeverityDuelQuestion
    | BoundaryAttackQuestion
    | RootCauseChainQuestion
    | RiskRadarQuestion
    | CompleteTestCaseQuestion;

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

// ─── Grade Part 2 (Story 5.5) ─────────────────────────────────────────────────

export const norm = (s: string) => s.trim().toLowerCase();

/** Kiểm tra một field có keyword hợp lệ không — dùng chung giữa grade function và UI highlight. */
export function gradeField(f: TestCaseField, filled: TestCaseFilled): boolean {
  const input = norm(filled[f.key] ?? '');
  return input.length > 0 && f.keywords.some(k => input.includes(norm(k)));
}

/** Đúng khi đặt bug card vào đúng quadrant (Priority + Severity). */
export function gradePrioritySeverityDuel(
  q: PrioritySeverityDuelQuestion,
  chosenPriority: DuelAxis,
  chosenSeverity: DuelAxis,
): boolean {
  return chosenPriority === q.correctPriority && chosenSeverity === q.correctSeverity;
}

/** Tập value nhập (normalize) phải CHỨA HẾT expected. Trả thêm `missing` cho feedback. */
export function gradeBoundaryAttack(
  q: BoundaryAttackQuestion,
  rawInput: string,
): { isCorrect: boolean; missing: string[] } {
  const entered = new Set(rawInput.split(/[\s,;]+/).map(norm).filter(Boolean));
  const missing = q.expectedValues.filter(v => !entered.has(norm(v)));
  return { isCorrect: missing.length === 0, missing };
}

/** Đúng khi thứ tự event === correctOrder. */
export function gradeRootCauseChain(q: RootCauseChainQuestion, orderedIds: string[]): boolean {
  return (
    orderedIds.length === q.correctOrder.length
    && orderedIds.every((id, i) => id === q.correctOrder[i])
  );
}

/** Partial credit: tỉ lệ vị trí đúng ≥ 0.7 → isCorrect. Trả `ratio` cho hiển thị. */
export function gradeRiskRadar(
  q: RiskRadarQuestion,
  rankedIds: string[],
): { isCorrect: boolean; ratio: number } {
  if (q.items.length !== q.correctRanking.length)
    throw new Error(`[gradeRiskRadar] items/correctRanking mismatch (${q.items.length} vs ${q.correctRanking.length})`);
  if (rankedIds.length !== q.correctRanking.length || q.correctRanking.length === 0)
    return { isCorrect: false, ratio: 0 };
  const correct = rankedIds.filter((id, i) => id === q.correctRanking[i]).length;
  const ratio = correct / q.correctRanking.length;
  return { isCorrect: ratio >= 0.7, ratio };
}

/** Mỗi field input phải chứa ≥1 keyword (case-insensitive, MVP — LLM Phase 2). */
export function gradeCompleteTestCase(q: CompleteTestCaseQuestion, filled: TestCaseFilled): boolean {
  return q.fields.every(f => gradeField(f, filled));
}
