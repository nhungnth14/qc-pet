import type { LessonQuestion } from '@/features/content/lesson-types';
import { contentRepository } from '@/features/content/content-repository';
import { getDueReviews } from './sr-api';

// Story 8.1: resolve SR-due items → LessonQuestion (qua content-repo). question_id = index trong lesson.

export type ReviewQuestion = {
  lessonId: string;
  questionId: string;
  /** -1 = fallback (chưa có SR row → consumer KHÔNG recordReview). */
  reviewCount: number;
  question: LessonQuestion;
};

function resolve(lessonId: string, questionId: string): LessonQuestion | null {
  const lesson = contentRepository.getLesson(lessonId);
  return lesson?.questions[Number(questionId)] ?? null;
}

/** Câu để ôn (Bedroom/Bathroom). SR-due trước; rỗng → fallback lesson published đầu (demo ngay). */
export async function getReviewQuestions(userId: string, limit: number): Promise<ReviewQuestion[]> {
  const due = await getDueReviews(userId, limit);
  const resolved: ReviewQuestion[] = [];
  for (const item of due) {
    const question = resolve(item.lessonId, item.questionId);
    if (question)
      resolved.push({ lessonId: item.lessonId, questionId: item.questionId, reviewCount: item.reviewCount, question });
  }
  if (resolved.length > 0)
    return resolved;
  return fallback(limit);
}

function fallback(limit: number): ReviewQuestion[] {
  const entry = contentRepository.getAllPublishedLessons()[0];
  const lesson = entry ? contentRepository.getLesson(entry.id) : null;
  if (!lesson)
    return [];
  return lesson.questions.slice(0, limit).map((question, idx) => ({
    lessonId: lesson.id,
    questionId: String(idx),
    reviewCount: -1,
    question,
  }));
}
