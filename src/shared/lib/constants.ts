export const DECAY_POLL_INTERVAL_MS = 60_000;

export const DECAY_RATES = {
  HUNGER_FULL_DECAY_MS: 48 * 60 * 60 * 1000,
  HAPPINESS_FULL_DECAY_MS: 72 * 60 * 60 * 1000,
  HEALTH_FULL_DECAY_MS: 72 * 60 * 60 * 1000,
  DISCIPLINE_FULL_DECAY_MS: 48 * 60 * 60 * 1000,
  COMPOSITE_FULL_DECAY_MS: 24 * 60 * 60 * 1000,
} as const;

export const EVOLUTION_THRESHOLDS = {
  V01_TO_V05: 150,
  V05_TO_V10: 400,
  V10_TO_V20: 900,
  V20_TO_V30: 1800,
} as const;

export const MAX_NEED_BAR = 100;
export const MIN_NEED_BAR = 0;
export const BC_MISS_PENALTY = 15;
export const BC_CORE_MISSION_EARN = 10;
export const MAX_NOTIFICATIONS_PER_DAY = 2;
export const CLOCK_OFFSET_STORAGE_KEY = 'clock_offset';
export const WAL_STORAGE_PREFIX = 'wal_';
