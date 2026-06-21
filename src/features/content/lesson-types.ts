/**
 * Lesson content types cho Epic 1 (Content Library & Quality Pipeline).
 *
 * `QuestionFormat` tái dùng từ quiz/question-types.ts để giữ nhất quán giữa
 * content JSON và quiz engine — không định nghĩa lại enum.
 *
 * `LessonQuestion` là content authoring schema (đơn giản, text-based).
 * Khác với engine `Question` type (runtime, có correctIndex/zones/etc.).
 * Story 5-x map LessonQuestion → engine Question khi load.
 */

import type { QuestionFormat } from '@/features/quiz/question-types';

export type { QuestionFormat };

// ─── Category & Bloom ──────────────────────────────────────────────────────────

export type Category = 'BD' | 'TA' | 'MP' | 'TM' | 'AT';

export type BloomLevel
  = | 'remember'
    | 'understand'
    | 'apply'
    | 'analyze'
    | 'evaluate'
    | 'create';

// ─── Lesson Content (bài học trước quiz) ──────────────────────────────────────

export type LessonContent = {
  headline: string;
  body_text: string;
  duration_seconds: number;
};

// ─── Lesson Question (content authoring schema) ────────────────────────────────

export type LessonQuestion = {
  format: QuestionFormat;
  question_text: string;
  /** Đáp án / options để chọn. Với MCQ: text strings. Với format khác: xem format_data. */
  options: string[];
  /** Phải là 1 giá trị trong options[]. */
  correct_answer: string;
  /** Giải thích tại sao options sai là sai — dùng cho Bugsy Story-Rule feedback. */
  distractor_rationale: string[];
  /** true = Q1 warm-up (không trừ streak nếu sai, border xanh nhạt). */
  is_warmup?: boolean;
  /** URL ảnh cho spot_the_defect hoặc EP/BVA diagram. */
  image_url?: string;
  /** Dữ liệu bổ sung theo format (template fields, scenario text, v.v.). */
  format_data?: Record<string, unknown>;
};

// ─── Lesson (full lesson object) ──────────────────────────────────────────────

export type Lesson = {
  id: string;
  category: Category;
  title: string;
  source_tag: string;
  bloom_level: BloomLevel;
  lesson_content: LessonContent;
  questions: LessonQuestion[];
  is_published: boolean;
  version: string;
  /** Thứ tự học trong category (1-based). */
  dependency_order?: number;
  /** Text teaser cuối session để tạo anticipation cho bài tiếp theo. */
  cliffhanger?: string;
};

// ─── Real Bug of the Week (Story 1-2, FR-17b) ────────────────────────────────

export type RbtwSeverity = 'low' | 'medium' | 'high' | 'critical';

export type RealBugOfTheWeek = {
  type: 'REAL_BUG_OF_THE_WEEK';
  id: string;
  /** Author slug — khớp với content/authors/<slug>.json. KHÔNG được là AI/GPT. */
  authored_by: string;
  context: string;
  bug_description: string;
  severity: RbtwSeverity;
  priority?: RbtwSeverity;
  root_cause: string;
  lesson_learned: string;
  version: string;
  platform?: string;
  date_occurred?: string;
  outcome?: string;
  istqb_ref?: string;
  is_published?: boolean;
};

// ─── Author Profile (Story 1-2) ───────────────────────────────────────────────

export type AuthorProfile = {
  /** Slug — khớp với filename trong content/authors/. */
  id: string;
  name: string;
  role: string;
  bio?: string;
  github_handle?: string;
  expertise?: string[];
};

// ─── Manifest ──────────────────────────────────────────────────────────────────

export type ManifestEntry = {
  id: string;
  version: string;
  category: Category;
  bloom_level: BloomLevel;
  title: string;
  last_updated: string;
  is_published: boolean;
};

export type RealBugManifestEntry = {
  id: string;
  version: string;
  authored_by: string;
  context: string;
  last_updated: string;
  is_published: boolean;
};

export type ContentManifest = {
  /** Semver — increment khi có thay đổi content (Story 1-3 dùng để check OTA). */
  content_version: string;
  last_updated: string;
  lessons: ManifestEntry[];
  real_bugs: RealBugManifestEntry[];
};
