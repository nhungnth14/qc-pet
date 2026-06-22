// Side Quests (Story 5.6) — domain model + pure helpers (tách UI, unit-test thuần).
// Honor system: KHÔNG chấm nội dung; chỉ chặn submit rỗng (OQ#4). Reward = +40% Happiness,
// +5 BC (BC only — side quest KHÔNG earn QP, xem core-mission/6-3).

export type SideQuestType
  = | 'bug_hunt'
    | 'peer_review'
    | 'repro_steps'
    | 'simulated_bug_hunt';

export type BugSeverity = 'low' | 'medium' | 'high' | 'critical';

/** Form variant cho từng quest: bug report (Bug Hunt/Simulated) vs freeform (Peer/Repro). */
export type QuestFormKind = 'bug_report' | 'freeform';

/** Reward cố định mọi side quest (AC1–5). */
export const HAPPINESS_REWARD = 40;
export const BC_REWARD = 5;
export const HAPPINESS_MAX = 100;

/**
 * Định nghĩa 1 side quest (hiển thị + nội dung context). `contextText` = nội dung curated
 * (junior QA test case / bug description / simulated scenario) — null với Bug Hunt thật.
 */
export type SideQuestDef = {
  type: SideQuestType;
  name: string;
  emoji: string;
  estMinutes: number;
  bugsyIntro: string;
  formKind: QuestFormKind;
  /** Label cho ô freeform (Peer Review / Repro Steps). */
  freeformLabel?: string;
  freeformPlaceholder?: string;
  /** Nội dung curated user đọc trước khi làm (Peer/Repro/Simulated). */
  contextTitle?: string;
  contextText?: string;
};

export type BugReportDraft = {
  title: string;
  steps: string;
  expected: string;
  actual: string;
  severity: BugSeverity;
};

export type FreeformDraft = {
  text: string;
};

export type SideQuestPayload = BugReportDraft | FreeformDraft;

/** 1 lần hoàn thành quest — nguồn local cho Bug Report Wall (Story 5.7). */
export type SideQuestSubmission = {
  id: string;
  type: SideQuestType;
  payload: SideQuestPayload;
  createdAt: string;
};

export function emptyBugReport(): BugReportDraft {
  return { title: '', steps: '', expected: '', actual: '', severity: 'medium' };
}

// ─── Pure helpers ───────────────────────────────────────────────────────────

/** Cộng +40% Happiness, clamp trần 100 (need bar không vượt 100%). */
export function applyHappinessReward(current: number): number {
  return Math.min(HAPPINESS_MAX, current + HAPPINESS_REWARD);
}

/** Honor system: chỉ cần mọi field non-empty (sau trim). KHÔNG chấm chất lượng. */
export function isBugReportComplete(draft: BugReportDraft): boolean {
  return (
    draft.title.trim().length > 0
    && draft.steps.trim().length > 0
    && draft.expected.trim().length > 0
    && draft.actual.trim().length > 0
  );
}

export function isFreeformComplete(draft: FreeformDraft): boolean {
  return draft.text.trim().length > 0;
}
