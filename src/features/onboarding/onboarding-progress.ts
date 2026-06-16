import { storage } from '@/lib/storage';

/**
 * Onboarding bền vững — kill-app recovery (Story 2.6).
 *
 * Mỗi màn onboarding gọi `setStep(...)` khi mount → tạo "checkpoint" để recovery
 * routine biết user đã đi tới đâu. Toàn bộ ghi vào MMKV đồng bộ (không async) nên
 * sống sót qua force-quit. Thứ tự step bám đúng FR-28 (không skip/reorder).
 */

export const ONBOARDING_STEPS = [
  'hatching',
  'naming',
  'aha_moment',
  'reward',
  'cliffhanger',
  'notification',
  'sign_up',
  'done',
] as const;

export type OnboardingStep = (typeof ONBOARDING_STEPS)[number];

export type OnboardingRoute
  = | '/onboarding/naming'
    | '/onboarding/aha-moment'
    | '/onboarding/reward'
    | '/onboarding/cliffhanger'
    | '/onboarding/notification'
    | '/onboarding/sign-up';

const STEP_KEY = 'onboarding_step';
const REWARD_COMMITTED_KEY = 'onboarding_reward_committed';
const NAME_DRAFT_KEY = 'onboarding_pet_name_draft';

function isStep(v: string | null): v is OnboardingStep {
  return v !== null && (ONBOARDING_STEPS as readonly string[]).includes(v);
}

// ─── Step state machine ───────────────────────────────────────────────────────

/** Step hiện tại; mặc định 'hatching' khi chưa có gì (user mới hoàn toàn). */
export function getStep(): OnboardingStep {
  const v = storage.getString(STEP_KEY);
  return isStep(v) ? v : 'hatching';
}

export function setStep(step: OnboardingStep): void {
  storage.set(STEP_KEY, step);
}

/** Xoá toàn bộ progress khi onboarding hoàn tất (vào (app) thật sự). */
export function clearProgress(): void {
  storage.remove(STEP_KEY);
  storage.remove(REWARD_COMMITTED_KEY);
  storage.remove(NAME_DRAFT_KEY);
}

// ─── Reward idempotency (client-side guard — Resolved Decision #2) ─────────────

/** True nếu reward onboarding đã commit (server hoặc offline) — chặn cộng đôi. */
export function isRewardCommitted(): boolean {
  return storage.getBoolean(REWARD_COMMITTED_KEY);
}

export function markRewardCommitted(): void {
  storage.set(REWARD_COMMITTED_KEY, true);
}

/**
 * Có nên cộng currency reward lên server hay không (chốt chặn chống cộng đôi — AC2/AC5).
 * False khi: đã commit local (resume) HOẶC server đã đánh dấu onboarding completed
 * (đã cộng trước đó) HOẶC chưa có pet_id để cộng vào.
 */
export function shouldCreditReward(args: {
  committedLocally: boolean;
  serverCompleted: boolean;
  hasPetId: boolean;
}): boolean {
  if (args.committedLocally)
    return false;
  if (args.serverCompleted)
    return false;
  return args.hasPetId;
}

// ─── Pet name draft (resume case AC1) ─────────────────────────────────────────

export function saveNameDraft(name: string): void {
  storage.set(NAME_DRAFT_KEY, name);
}

export function getNameDraft(): string {
  return storage.getString(NAME_DRAFT_KEY) ?? '';
}

export function clearNameDraft(): void {
  storage.remove(NAME_DRAFT_KEY);
}

// ─── Resume routing (Task 2) ──────────────────────────────────────────────────

/**
 * Map step → route đích lúc resume. `null` = ở lại màn entry (egg hatching).
 * Dùng `router.replace` (không push) để không tạo back-stack về egg.
 */
export function stepToRoute(step: OnboardingStep): OnboardingRoute | null {
  switch (step) {
    case 'naming':
      return '/onboarding/naming';
    case 'aha_moment':
      return '/onboarding/aha-moment';
    case 'reward':
      return '/onboarding/reward';
    case 'cliffhanger':
      return '/onboarding/cliffhanger';
    case 'notification':
      return '/onboarding/notification';
    case 'sign_up':
      return '/onboarding/sign-up';
    case 'hatching':
    case 'done':
    default:
      return null;
  }
}
