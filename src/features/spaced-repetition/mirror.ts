// Pure Mirror Moment logic (Story 8.3).

export type MirrorTier = 'sparkle' | 'neutral' | 'tired';

/** Discipline +10% sau Mirror Moment (Bathroom Flash Quiz contribution). */
export const MIRROR_DISCIPLINE_REWARD = 10;

/** Visual tier theo Discipline bar: ≥70 sparkle, 30–69 neutral, <30 tired. */
export function getMirrorTier(discipline: number): MirrorTier {
  if (discipline >= 70)
    return 'sparkle';
  if (discipline < 30)
    return 'tired';
  return 'neutral';
}
