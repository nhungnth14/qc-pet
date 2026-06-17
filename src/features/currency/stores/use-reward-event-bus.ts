import { create } from 'zustand';

export type RewardEvent
  = | { type: 'server_committed'; txnId: string; rewardType: string; amount: number }
    | { type: 'animation_triggered'; txnIdRef: string; animationType: string }
    | { type: 'animation_complete'; txnIdRef: string };

type RewardEventBusState = {
  auditTrail: RewardEvent[];
  commitReward: (txnId: string, rewardType: string, amount: number) => void;
  triggerAnimation: (txnIdRef: string, animationType: string) => void;
  completeAnimation: (txnIdRef: string) => void;
  clearAuditTrail: () => void;
};

export const useRewardEventBus = create<RewardEventBusState>()(set => ({
  auditTrail: [],
  commitReward: (txnId, rewardType, amount) =>
    set(state => ({
      auditTrail: [
        ...state.auditTrail,
        { type: 'server_committed', txnId, rewardType, amount },
      ],
    })),
  triggerAnimation: (txnIdRef, animationType) =>
    set(state => ({
      auditTrail: [
        ...state.auditTrail,
        { type: 'animation_triggered', txnIdRef, animationType },
      ],
    })),
  completeAnimation: txnIdRef =>
    set(state => ({
      auditTrail: [
        ...state.auditTrail,
        { type: 'animation_complete', txnIdRef },
      ],
    })),
  clearAuditTrail: () => set({ auditTrail: [] }),
}));
