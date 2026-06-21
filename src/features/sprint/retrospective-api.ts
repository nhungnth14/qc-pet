import { supabase } from '@/lib/supabase';

export type RetrospectiveInput = {
  applied: string;
  stillHard: string;
  nextToggle: string;
};

// Story 7.5: lưu retrospective (partial OK — chỉ lưu field có nội dung; null nếu rỗng).

export async function submitRetrospective(
  userId: string,
  sprintNumber: number,
  input: RetrospectiveInput,
): Promise<void> {
  const trimOrNull = (s: string) => (s.trim().length > 0 ? s.trim() : null);
  const { error } = await supabase.from('retrospective_entries').insert({
    user_id: userId,
    sprint_number: sprintNumber,
    applied: trimOrNull(input.applied),
    still_hard: trimOrNull(input.stillHard),
    next_toggle: trimOrNull(input.nextToggle),
  });
  if (error)
    throw new Error(`submitRetrospective failed: ${error.message}`);
}
