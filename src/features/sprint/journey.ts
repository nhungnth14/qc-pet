// Pure My Journey aggregation (Story 7.2). Gộp nhiều nguồn entry → timeline newest-first.

export type JourneyKind = 'evidence' | 'bug-log' | 'retrospective' | 'evolution';

export type JourneyEntry = {
  id: string;
  kind: JourneyKind;
  dateMs: number;
  title: string;
  detail: string;
};

/** Flatten nhiều list + sort giảm dần theo thời gian (mới nhất trước). */
export function mergeJourney(...lists: JourneyEntry[][]): JourneyEntry[] {
  return lists.flat().sort((a, b) => b.dateMs - a.dateMs);
}

export const JOURNEY_KIND_ICON: Record<JourneyKind, string> = {
  'evidence': '📎',
  'bug-log': '🐞',
  'retrospective': '📝',
  'evolution': '✨',
};
