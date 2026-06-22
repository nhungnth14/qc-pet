import { supabase } from '@/lib/supabase';
import { computeNextReview, initialReviewAtMs } from './spaced-repetition';

// Story 8.1: SR queue server ops.

export type SrItem = {
  lessonId: string;
  questionId: string;
  nextReviewAtMs: number;
  reviewCount: number;
};

type SrRow = {
  lesson_id: string;
  question_id: string;
  next_review_at: string;
  review_count: number;
};

/** Enqueue toàn bộ câu hỏi của 1 lesson sau khi complete Core Mission (next = now + 3 ngày). */
export async function enqueueLessonReview(userId: string, lessonId: string, questionIds: string[]): Promise<void> {
  if (questionIds.length === 0)
    return;
  const nextAt = new Date(initialReviewAtMs(Date.now())).toISOString();
  const rows = questionIds.map(qid => ({
    user_id: userId,
    lesson_id: lessonId,
    question_id: qid,
    next_review_at: nextAt,
    review_count: 0,
  }));
  const { error } = await supabase
    .from('spaced_repetition_queue')
    .upsert(rows, { onConflict: 'user_id,lesson_id,question_id', ignoreDuplicates: true });
  if (error)
    throw new Error(`enqueueLessonReview failed: ${error.message}`);
}

/** Câu đến hạn review (next_review_at ≤ now), sớm nhất trước. */
export async function getDueReviews(userId: string, limit: number): Promise<SrItem[]> {
  const { data, error } = await supabase
    .from('spaced_repetition_queue')
    .select('lesson_id, question_id, next_review_at, review_count')
    .eq('user_id', userId)
    .lte('next_review_at', new Date().toISOString())
    .order('next_review_at', { ascending: true })
    .limit(limit);
  if (error)
    throw new Error(`getDueReviews failed: ${error.message}`);
  return ((data ?? []) as SrRow[]).map(r => ({
    lessonId: r.lesson_id,
    questionId: r.question_id,
    nextReviewAtMs: Date.parse(r.next_review_at),
    reviewCount: r.review_count,
  }));
}

/** Ghi kết quả review → cập nhật interval (correct/wrong). `item` = SR row identity + reviewCount. */
export async function recordReview(
  userId: string,
  item: { lessonId: string; questionId: string; reviewCount: number },
  correct: boolean,
): Promise<void> {
  const next = computeNextReview(item.reviewCount, correct, Date.now());
  const { error } = await supabase
    .from('spaced_repetition_queue')
    .update({
      review_count: next.reviewCount,
      next_review_at: new Date(next.nextReviewAtMs).toISOString(),
      last_answered_correctly: correct,
    })
    .eq('user_id', userId)
    .eq('lesson_id', item.lessonId)
    .eq('question_id', item.questionId);
  if (error)
    throw new Error(`recordReview failed: ${error.message}`);
}
