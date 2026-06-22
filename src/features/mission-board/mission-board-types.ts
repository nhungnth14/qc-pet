// Mission Board + Bug Report Wall (Story 5.7) — domain model + pure helpers (tách UI,
// unit-test thuần). Tap-to-move MVP (KHÔNG drag — Decision #1); persist local MMKV (Decision #3).

export type ColumnId = 'todo' | 'in_progress' | 'done';

export const COLUMN_ORDER: ColumnId[] = ['todo', 'in_progress', 'done'];

export const COLUMN_LABELS: Record<ColumnId, string> = {
  todo: 'TODO',
  in_progress: 'IN PROGRESS',
  done: 'DONE',
};

export type MissionCard = {
  id: string;
  lessonName: string;
  category: string;
  status: ColumnId;
  /** ISO khi card vào Done (sort Wall). */
  completedAt?: string;
};

export type WallNoteKind = 'core_mission' | 'bug_hunt' | 'side_quest';

export type WallNote = {
  id: string;
  label: string;
  sublabel?: string;
  kind: WallNoteKind;
  createdAt: string;
  colorIndex: number;
};

/** 4 màu sticky note xoay vòng (vàng / xanh lá / xanh dương / hồng) — AC4. */
export const WALL_COLORS = ['#FFE08A', '#BFFFA1', '#A8D8FF', '#FFC7E0'] as const;

export const FULL_WALL_THRESHOLD = 30;

// ─── Pure helpers ─────────────────────────────────────────────────────────────

/** Tap-to-move 1 chiều: todo→in_progress→done; done giữ nguyên (không undo — AC3). */
export function nextColumn(status: ColumnId): ColumnId {
  const i = COLUMN_ORDER.indexOf(status);
  if (i < 0 || i >= COLUMN_ORDER.length - 1)
    return status;
  return COLUMN_ORDER[i + 1];
}

/** Màu sticky note theo vị trí (cycle 4 màu). */
export function wallColorFor(index: number): string {
  const n = WALL_COLORS.length;
  return WALL_COLORS[((index % n) + n) % n];
}

export function isFullWall(count: number): boolean {
  return count >= FULL_WALL_THRESHOLD;
}

/** Hash ổn định từ id (deterministic — không đổi mỗi render). */
function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++)
    h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Xoay sticky note ±5° (deterministic theo id — AC4). */
export function noteRotation(id: string): number {
  return (hashStr(id) % 11) - 5;
}

/** Xoay card Done ±3° (deterministic theo id — AC2). */
export function cardRotation(id: string): number {
  return (hashStr(id) % 7) - 3;
}
