import type { JourneyEntry } from './journey';
import type { PetVersion } from '@/features/pet/evolution';
import { SOUVENIRS } from '@/features/pet/souvenir';
import { supabase } from '@/lib/supabase';
import { mergeJourney } from './journey';

// Story 7.2: gộp 4 nguồn server thành timeline. Permanent (RLS select). Throw nếu nguồn lỗi.

type TgRow = { id: string; evolution_step: string; content: string; submitted_at: string };
type BugRow = { id: string; description: string | null; severity: string | null; outcome: string; created_at: string };
type RetroRow = { id: string; sprint_number: number; applied: string | null; still_hard: string | null; next_toggle: string | null; created_at: string };
type SouvRow = { id: string; evolution_step: string; unlocked_at: string };

export async function getJourney(userId: string): Promise<JourneyEntry[]> {
  const [tg, bug, retro, souv] = await Promise.all([
    supabase.from('transfer_gate_submissions').select('id, evolution_step, content, submitted_at').eq('user_id', userId),
    supabase.from('weekly_bug_logs').select('id, description, severity, outcome, created_at').eq('user_id', userId),
    supabase.from('retrospective_entries').select('id, sprint_number, applied, still_hard, next_toggle, created_at').eq('user_id', userId),
    supabase.from('souvenirs').select('id, evolution_step, unlocked_at').eq('user_id', userId),
  ]);

  const firstError = tg.error ?? bug.error ?? retro.error ?? souv.error;
  if (firstError)
    throw new Error(`getJourney failed: ${firstError.message}`);

  const evidence: JourneyEntry[] = ((tg.data ?? []) as TgRow[]).map(r => ({
    id: `tg-${r.id}`,
    kind: 'evidence',
    dateMs: Date.parse(r.submitted_at),
    title: `Bằng chứng → ${r.evolution_step}`,
    detail: r.content,
  }));

  const bugs: JourneyEntry[] = ((bug.data ?? []) as BugRow[]).map(r => ({
    id: `bug-${r.id}`,
    kind: 'bug-log',
    dateMs: Date.parse(r.created_at),
    title: r.outcome === 'no_bugs_this_week' ? 'Tuần này không có bug' : `Bug · ${r.severity ?? '—'} · ${r.outcome}`,
    detail: r.description ?? '',
  }));

  const retros: JourneyEntry[] = ((retro.data ?? []) as RetroRow[]).map(r => ({
    id: `retro-${r.id}`,
    kind: 'retrospective',
    dateMs: Date.parse(r.created_at),
    title: `Retrospective · Sprint #${r.sprint_number}`,
    detail: [r.applied, r.still_hard, r.next_toggle].filter(Boolean).join(' · '),
  }));

  const evolutions: JourneyEntry[] = ((souv.data ?? []) as SouvRow[]).map(r => ({
    id: `souv-${r.id}`,
    kind: 'evolution',
    dateMs: Date.parse(r.unlocked_at),
    title: `Tiến hóa ${r.evolution_step}`,
    detail: SOUVENIRS[r.evolution_step as PetVersion]?.label ?? 'Souvenir mới',
  }));

  return mergeJourney(evidence, bugs, retros, evolutions);
}
