import { supabase } from '@/lib/supabase';
import { addCurrency, getPet } from '@/lib/supabase-api';

type QuizSessionRow = {
  id: string;
  current_question_index: number;
  answers: Record<string, number> | null;
};

export async function createQuizSession(
  userId: string,
  lessonId: string,
): Promise<{ sessionId: string }> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .insert({
      user_id: userId,
      lesson_id: lessonId,
      status: 'in_progress',
      current_question_index: 0,
      answers: {},
    })
    .select('id')
    .single();

  if (error)
    throw new Error(`createQuizSession failed: ${error.message}`);
  return { sessionId: (data as { id: string }).id };
}

export async function saveAnswer(
  sessionId: string,
  questionIndex: number,
  answerIndex: number,
): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from('quiz_sessions')
    .select('answers')
    .eq('id', sessionId)
    .single();

  if (fetchError)
    throw new Error(`saveAnswer fetch failed: ${fetchError.message}`);

  const existing = (data as { answers: Record<string, number> | null } | null)?.answers ?? {};
  const merged = { ...existing, [String(questionIndex)]: answerIndex };

  const { error } = await supabase
    .from('quiz_sessions')
    .update({ answers: merged, current_question_index: questionIndex + 1 })
    .eq('id', sessionId);

  if (error)
    throw new Error(`saveAnswer update failed: ${error.message}`);
}

// eslint-disable-next-line max-params -- 4 tham số đều bắt buộc; contract bị pin bởi Story 5-4 (KHÔNG refactor sang options-object).
export async function completeQuizSession(
  sessionId: string,
  userId: string,
  correctCount: number,
  total: number,
): Promise<{ bcEarned: number; qpEarned: number }> {
  const bcEarned = 10;
  const qpEarned = Math.max(6, Math.round((correctCount / total) * 20));

  // Try Edge Function first
  try {
    const { data, error } = await supabase.functions.invoke('process-quiz-reward', {
      body: { sessionId, userId, correctCount, total },
    });
    if (!error && data?.bcEarned !== undefined && data?.qpEarned !== undefined) {
      return { bcEarned: data.bcEarned, qpEarned: data.qpEarned };
    }
  }
  catch {
    // Edge function not deployed — fall through to local fallback
  }

  // Local fallback: guard against double-credit if Edge Function already committed
  const { data: sessionCheck } = await supabase
    .from('quiz_sessions')
    .select('status')
    .eq('id', sessionId)
    .single();
  if (sessionCheck?.status === 'completed') {
    return { bcEarned, qpEarned };
  }

  await supabase
    .from('quiz_sessions')
    .update({
      status: 'completed',
      bc_earned: bcEarned,
      qp_earned: qpEarned,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId);

  const petRes = await getPet(userId);
  if (petRes.data) {
    await addCurrency(petRes.data.id, bcEarned, qpEarned);
  }

  return { bcEarned, qpEarned };
}

export async function getIncompleteSession(
  userId: string,
  lessonId: string,
): Promise<{ sessionId: string; currentIndex: number; answers: Record<string, number> } | null> {
  const { data, error } = await supabase
    .from('quiz_sessions')
    .select('id, current_question_index, answers')
    .eq('user_id', userId)
    .eq('lesson_id', lessonId)
    .eq('status', 'in_progress')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error)
    throw new Error(`getIncompleteSession failed: ${error.message}`);
  if (!data)
    return null;

  const row = data as QuizSessionRow;
  return {
    sessionId: row.id,
    currentIndex: row.current_question_index,
    answers: row.answers ?? {},
  };
}
