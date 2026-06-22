import type { PetVersion } from './evolution';
import { supabase } from '@/lib/supabase';
import { getPet, updatePetVersion } from '@/lib/supabase-api';
import { SOUVENIRS } from './souvenir';

export type TransferGateSubmission = {
  id: string;
  evolutionStep: string;
  evidenceType: string;
  content: string;
  submittedAt: string;
};

type SubmissionRow = {
  id: string;
  evolution_step: string;
  evidence_type: string;
  content: string;
  submitted_at: string;
};

/** Lưu evidence (honor system — không validate). Permanent (RLS no delete). */
export async function submitEvidence(userId: string, step: PetVersion, content: string): Promise<void> {
  const { error } = await supabase.from('transfer_gate_submissions').insert({
    user_id: userId,
    evolution_step: step,
    evidence_type: 'text',
    content,
  });
  if (error)
    throw new Error(`submitEvidence failed: ${error.message}`);
}

export async function getSubmissions(userId: string): Promise<TransferGateSubmission[]> {
  const { data, error } = await supabase
    .from('transfer_gate_submissions')
    .select('id, evolution_step, evidence_type, content, submitted_at')
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false });

  if (error)
    throw new Error(`getSubmissions failed: ${error.message}`);

  return ((data ?? []) as SubmissionRow[]).map(r => ({
    id: r.id,
    evolutionStep: r.evolution_step,
    evidenceType: r.evidence_type,
    content: r.content,
    submittedAt: r.submitted_at,
  }));
}

/**
 * Commit evolution (Story 7.1): bump pets.version + insert souvenir row. Server-authoritative qua
 * PostgREST. Caller chỉ gọi khi canEvolve (đủ QP + evidence). Throw nếu chưa có pet.
 */
export async function evolvePet(userId: string, nextVersion: PetVersion): Promise<void> {
  const petRes = await getPet(userId);
  const petId = petRes.data?.id;
  if (!petId)
    throw new Error('evolvePet: pet not found');

  await updatePetVersion(petId, nextVersion);

  const souvenir = SOUVENIRS[nextVersion];
  if (souvenir) {
    const { error: souvErr } = await supabase.from('souvenirs').upsert(
      { user_id: userId, evolution_step: nextVersion, souvenir_type: souvenir.type },
      { onConflict: 'user_id,evolution_step' },
    );
    if (souvErr)
      throw new Error(`evolvePet souvenir failed: ${souvErr.message}`);
  }
}
