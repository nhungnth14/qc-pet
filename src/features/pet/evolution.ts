import { EVOLUTION_THRESHOLDS } from '@/shared/lib/constants';

// Pure evolution logic (Story 3-5). KHÔNG import React/store.
// Evolution 2 cổng: đủ QP + Transfer Gate evidence (Epic 7). Evidence chưa có → isPending khi đủ QP.

export type PetVersion = 'v0.1' | 'v0.5' | 'v1.0' | 'v2.0' | 'v3.0';

export const EVOLUTION_ORDER: PetVersion[] = ['v0.1', 'v0.5', 'v1.0', 'v2.0', 'v3.0'];

/** Bước evolution kế tiếp + QP cần (cộng dồn). null = đã max. */
export const NEXT_EVOLUTION: Record<PetVersion, { next: PetVersion; qpRequired: number } | null> = {
  'v0.1': { next: 'v0.5', qpRequired: EVOLUTION_THRESHOLDS.V01_TO_V05 },
  'v0.5': { next: 'v1.0', qpRequired: EVOLUTION_THRESHOLDS.V05_TO_V10 },
  'v1.0': { next: 'v2.0', qpRequired: EVOLUTION_THRESHOLDS.V10_TO_V20 },
  'v2.0': { next: 'v3.0', qpRequired: EVOLUTION_THRESHOLDS.V20_TO_V30 },
  'v3.0': null,
};

export const EVOLUTION_LABELS: Record<PetVersion, string> = {
  'v0.1': 'Bé Bug mới nở',
  'v0.5': 'Bug nhỏ',
  'v1.0': 'Bug teen',
  'v2.0': 'Bug trưởng thành',
  'v3.0': 'Bug chuyên gia',
};

export type EvolutionStatus = {
  current: PetVersion;
  next: PetVersion | null;
  qpRequired: number | null;
  qpRemaining: number;
  /** Đủ QP cho step kế. */
  qpReached: boolean;
  isMaxed: boolean;
  /** Pending = đủ QP nhưng chưa evolve được (cần Transfer Gate evidence — Epic 7). */
  isPending: boolean;
};

function normalizeVersion(version: string): PetVersion {
  return EVOLUTION_ORDER.includes(version as PetVersion) ? (version as PetVersion) : 'v0.1';
}

export function getEvolutionStatus(version: string, qpTotal: number): EvolutionStatus {
  const current = normalizeVersion(version);
  const nextInfo = NEXT_EVOLUTION[current];

  if (nextInfo === null) {
    return {
      current,
      next: null,
      qpRequired: null,
      qpRemaining: 0,
      qpReached: false,
      isMaxed: true,
      isPending: false,
    };
  }

  const qpReached = qpTotal >= nextInfo.qpRequired;
  return {
    current,
    next: nextInfo.next,
    qpRequired: nextInfo.qpRequired,
    qpRemaining: Math.max(0, nextInfo.qpRequired - qpTotal),
    qpReached,
    isMaxed: false,
    // Evidence gate (Epic 7) chưa tồn tại → đủ QP = pending (chưa transform).
    isPending: qpReached,
  };
}
