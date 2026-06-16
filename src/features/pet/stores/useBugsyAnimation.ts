import { create } from 'zustand';

export type BugsyAnimationState =
  | 'HAPPY'
  | 'HUNGRY'
  | 'TIRED'
  | 'SAD'
  | 'DISCIPLINE_LOW'
  | 'EXCITED'
  | 'EVOLUTION_CINEMATIC'
  | 'DAY7_OUTDOOR';

type BugsyAnimationStore = {
  currentState: BugsyAnimationState;
  isAnimating: boolean;
  setState: (state: BugsyAnimationState) => void;
  setAnimating: (isAnimating: boolean) => void;
};

export const useBugsyAnimation = create<BugsyAnimationStore>()((set) => ({
  currentState: 'HAPPY',
  isAnimating: false,
  setState: (state) => set({ currentState: state }),
  setAnimating: (isAnimating) => set({ isAnimating }),
}));
