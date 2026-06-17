import { create } from 'zustand';

type ClockOffsetState = {
  clockOffset: number;
  setClockOffset: (offset: number) => void;
  now: () => number;
};

export const useClockOffset = create<ClockOffsetState>()((set, get) => ({
  clockOffset: 0,
  setClockOffset: offset => set({ clockOffset: offset }),
  now: () => Date.now() + get().clockOffset,
}));
