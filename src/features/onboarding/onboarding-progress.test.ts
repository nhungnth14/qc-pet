// In-memory mock cho @/lib/storage (mock MMKV mặc định trong jest-setup là stateless).
import {
  clearNameDraft,
  clearProgress,
  getNameDraft,
  getStep,
  isRewardCommitted,
  markRewardCommitted,
  ONBOARDING_STEPS,
  saveNameDraft,
  setStep,
  shouldCreditReward,
  stepToRoute,
} from './onboarding-progress';

jest.mock('@/lib/storage', () => {
  const mem = new Map<string, string | boolean | number>();
  return {
    storage: {
      getString: (k: string) => (mem.has(k) ? String(mem.get(k)) : null),
      getBoolean: (k: string) => Boolean(mem.get(k)),
      set: (k: string, v: string | boolean | number) => {
        mem.set(k, v);
      },
      remove: (k: string) => {
        mem.delete(k);
      },
      getAllKeys: () => Array.from(mem.keys()),
    },
  };
});

afterEach(() => {
  clearProgress();
});

describe('onboarding-progress · step state machine', () => {
  it('mặc định trả "hatching" khi chưa có gì', () => {
    expect(getStep()).toBe('hatching');
  });

  it('setStep rồi getStep trả đúng step', () => {
    setStep('reward');
    expect(getStep()).toBe('reward');
    setStep('sign_up');
    expect(getStep()).toBe('sign_up');
  });

  it('clearProgress đưa step về mặc định "hatching"', () => {
    setStep('cliffhanger');
    clearProgress();
    expect(getStep()).toBe('hatching');
  });

  it('bỏ qua giá trị step không hợp lệ → fallback "hatching"', () => {
    setStep('reward');
    // @ts-expect-error cố tình set giá trị rác để test guard
    setStep('garbage_value');
    expect(getStep()).toBe('hatching');
  });
});

describe('onboarding-progress · reward idempotency guard', () => {
  it('mặc định chưa commit', () => {
    expect(isRewardCommitted()).toBe(false);
  });

  it('markRewardCommitted → isRewardCommitted true; clearProgress reset về false', () => {
    markRewardCommitted();
    expect(isRewardCommitted()).toBe(true);
    clearProgress();
    expect(isRewardCommitted()).toBe(false);
  });
});

describe('onboarding-progress · pet name draft', () => {
  afterEach(() => clearNameDraft());

  it('mặc định draft rỗng', () => {
    expect(getNameDraft()).toBe('');
  });

  it('saveNameDraft lưu, getNameDraft đọc lại đúng (resume tên đang gõ)', () => {
    saveNameDraft('Ki');
    expect(getNameDraft()).toBe('Ki');
  });

  it('clearNameDraft xoá draft', () => {
    saveNameDraft('Pip');
    clearNameDraft();
    expect(getNameDraft()).toBe('');
  });
});

describe('onboarding-progress · shouldCreditReward (idempotency rule)', () => {
  it('cộng currency khi chưa commit, server chưa completed, có pet_id', () => {
    expect(
      shouldCreditReward({ committedLocally: false, serverCompleted: false, hasPetId: true }),
    ).toBe(true);
  });

  it('không cộng khi đã commit local (resume sau kill)', () => {
    expect(
      shouldCreditReward({ committedLocally: true, serverCompleted: false, hasPetId: true }),
    ).toBe(false);
  });

  it('không cộng khi server đã đánh dấu onboarding completed (đã cộng trước đó)', () => {
    expect(
      shouldCreditReward({ committedLocally: false, serverCompleted: true, hasPetId: true }),
    ).toBe(false);
  });

  it('không cộng khi chưa có pet_id', () => {
    expect(
      shouldCreditReward({ committedLocally: false, serverCompleted: false, hasPetId: false }),
    ).toBe(false);
  });
});

describe('onboarding-progress · stepToRoute (resume routing)', () => {
  it('hatching & done → null (ở lại entry, không điều hướng)', () => {
    expect(stepToRoute('hatching')).toBeNull();
    expect(stepToRoute('done')).toBeNull();
  });

  it('các step giữa → đúng route', () => {
    expect(stepToRoute('naming')).toBe('/onboarding/naming');
    expect(stepToRoute('aha_moment')).toBe('/onboarding/aha-moment');
    expect(stepToRoute('reward')).toBe('/onboarding/reward');
    expect(stepToRoute('cliffhanger')).toBe('/onboarding/cliffhanger');
    expect(stepToRoute('notification')).toBe('/onboarding/notification');
    expect(stepToRoute('sign_up')).toBe('/onboarding/sign-up');
  });

  it('mọi step đều có ánh xạ xác định (không lọt case)', () => {
    for (const step of ONBOARDING_STEPS) {
      // không throw, trả null hoặc string hợp lệ
      const route = stepToRoute(step);
      expect(route === null || route.startsWith('/onboarding/')).toBe(true);
    }
  });
});
