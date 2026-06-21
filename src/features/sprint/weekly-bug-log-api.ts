import type { WeeklyBugLogInput } from './weekly-bug-log';
import { supabase } from '@/lib/supabase';
import { NO_BUGS_OUTCOME } from './weekly-bug-log';

// Story 7.3: Weekly Bug Log server ops. Honor system (không validate).

export async function submitWeeklyBugLog(userId: string, input: WeeklyBugLogInput): Promise<void> {
  const { error } = await supabase.from('weekly_bug_logs').insert({
    user_id: userId,
    description: input.description,
    severity: input.severity,
    priority: input.priority,
    outcome: input.outcome,
  });
  if (error)
    throw new Error(`submitWeeklyBugLog failed: ${error.message}`);
}

export async function logNoBugsThisWeek(userId: string): Promise<void> {
  const { error } = await supabase
    .from('weekly_bug_logs')
    .insert({ user_id: userId, outcome: NO_BUGS_OUTCOME });
  if (error)
    throw new Error(`logNoBugsThisWeek failed: ${error.message}`);
}
