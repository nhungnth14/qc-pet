import type { BugsyState } from './bugsy-state';
import { usePetStore } from '@/stores/pet-store';
import { getBugsyState } from './bugsy-state';
import { useBugsyAnimation } from './use-bugsy-animation';

/** Bugsy state hiện tại (Story 3-3): từ need bars (decay động) + cờ excited (reward). */
export function useBugsyState(): BugsyState {
  const needBars = usePetStore(s => s.needBars);
  const excited = useBugsyAnimation(s => s.excited);
  return getBugsyState(needBars, { excited });
}
