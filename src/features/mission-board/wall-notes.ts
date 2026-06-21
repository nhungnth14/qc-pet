import type { MissionCard, WallNote, WallNoteKind } from './mission-board-types';
import type { SideQuestSubmission } from '@/features/side-quests/side-quest-types';

const QUEST_LABELS: Record<string, string> = {
  bug_hunt: 'Bug Hunt',
  peer_review: 'Peer Review',
  repro_steps: 'Repro Steps',
  simulated_bug_hunt: 'Simulated Bug Hunt',
};

function submissionLabel(sub: SideQuestSubmission): string {
  // Bug report (Bug Hunt/Simulated) có title; freeform (Peer/Repro) lấy tên quest.
  if ('title' in sub.payload && sub.payload.title.trim().length > 0)
    return sub.payload.title.trim();
  return QUEST_LABELS[sub.type] ?? 'Báo cáo';
}

function submissionKind(type: SideQuestSubmission['type']): WallNoteKind {
  return type === 'bug_hunt' || type === 'simulated_bug_hunt' ? 'bug_hunt' : 'side_quest';
}

/**
 * Build danh sách sticky note cho Bug Report Wall (Story 5.7) — THUẦN, không side-effect.
 * Nguồn: side-quest submissions (5.6) + mission card đã Done. Sort theo thời gian, gán màu
 * xoay vòng theo vị trí (ổn định). Server-sync deferred (Decision #3).
 */
export function buildWallNotes(
  submissions: SideQuestSubmission[],
  doneCards: MissionCard[],
): WallNote[] {
  const fromSubmissions = submissions.map(sub => ({
    id: sub.id,
    label: submissionLabel(sub),
    sublabel: QUEST_LABELS[sub.type] ?? sub.type,
    kind: submissionKind(sub.type),
    createdAt: sub.createdAt,
  }));

  const fromMissions = doneCards.map(card => ({
    id: `mission-${card.id}`,
    label: card.lessonName,
    sublabel: card.category,
    kind: 'core_mission' as WallNoteKind,
    createdAt: card.completedAt ?? new Date(0).toISOString(),
  }));

  return [...fromSubmissions, ...fromMissions]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .map((note, i): WallNote => ({ ...note, colorIndex: i }));
}
