import type { PetVersion } from './evolution';
import type { RoomType } from '@/features/rooms/stores/use-room-navigation';

// Pure Transfer Gate config (Story 7.1). Evidence requirement cho mỗi evolution step (honor system —
// app KHÔNG validate nội dung). Keyed theo TARGET version (bước evolve INTO).

export type EvidenceRequirement = {
  requirement: string;
  room: RoomType;
};

export const EVIDENCE_REQUIREMENTS: Partial<Record<PetVersion, EvidenceRequirement>> = {
  'v0.5': { requirement: 'Gửi bug report đã được đồng nghiệp xác nhận', room: 'KITCHEN' },
  'v1.0': { requirement: 'Gửi test case thật từ sprint hiện tại', room: 'WORK_ROOM' },
  'v2.0': { requirement: 'Chia sẻ Sprint Demo Card hoặc gửi peer review log', room: 'LIVING_ROOM' },
  'v3.0': { requirement: 'Ghi chép ET session + Retrospective tháng', room: 'GARDEN' },
};

/** Evolve được khi đủ QP VÀ đã có evidence (2 cổng — AC 3-5/7-1). */
export function canEvolve(qpReached: boolean, hasEvidence: boolean): boolean {
  return qpReached && hasEvidence;
}
