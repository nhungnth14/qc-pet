import type { PetVersion } from './evolution';

// Pure souvenir config (Story 3-5). Mỗi evolution STEP (version đạt được) → 1 souvenir artifact
// theme "dream destination". Souvenir thật unlock sau khi evolve (Epic 7); đây là metadata hiển thị.

export type Souvenir = {
  type: string;
  emoji: string;
  label: string;
};

/** Souvenir cho mỗi version ĐẠT được (không có cho v0.1 — điểm xuất phát). */
export const SOUVENIRS: Partial<Record<PetVersion, Souvenir>> = {
  'v0.5': { type: 'local_landmark', emoji: '🗼', label: 'Bưu thiếp quê nhà' },
  'v1.0': { type: 'sea_island', emoji: '🏝️', label: 'Vỏ sò Đông Nam Á' },
  'v2.0': { type: 'world_map', emoji: '🗺️', label: 'Bản đồ thế giới' },
  'v3.0': { type: 'dream_flight', emoji: '✈️', label: 'Vé máy bay ước mơ' },
};
