import type { RoomType } from '@/features/rooms/stores/use-room-navigation';

// Pure smart-timing decision + deep-link mapping (Story 9.2). Scheduling/send/listener → defer.
// MVP cố định: sáng 8h (always) + chiều 19h (chỉ nếu chưa mở app). Max 2/ngày. Learning = Phase 2.

export type NotificationSlot = 'morning' | 'evening';

export type SmartTimingContext = {
  slot: NotificationSlot;
  hasPushToken: boolean;
  openedToday: boolean;
  isWeekend: boolean;
  attentionRooms: RoomType[];
};

export type NotificationPlan
  = | { send: false }
    | { send: true; kind: 'weekend' | 'morning' | 'attention' | 'general' };

/**
 * Có gửi notification cho slot này không + loại copy.
 * - không push token → không gửi
 * - chiều mà đã mở app hôm nay → không gửi (daily cap)
 * - cuối tuần → copy weekend
 * - sáng → copy morning
 * - chiều (chưa mở, ngày thường) → attention (nếu có phòng) / general
 */
export function planNotification(ctx: SmartTimingContext): NotificationPlan {
  if (!ctx.hasPushToken)
    return { send: false };
  if (ctx.slot === 'evening' && ctx.openedToday)
    return { send: false };
  if (ctx.isWeekend)
    return { send: true, kind: 'weekend' };
  if (ctx.slot === 'morning')
    return { send: true, kind: 'morning' };
  return { send: true, kind: ctx.attentionRooms.length > 0 ? 'attention' : 'general' };
}

/** Deep link path mỗi phòng (Expo Router). */
export const ROOM_DEEP_LINK: Record<RoomType, string> = {
  WORK_ROOM: '/rooms/work-room',
  KITCHEN: '/rooms/kitchen',
  BEDROOM: '/rooms/bedroom',
  LIVING_ROOM: '/rooms/living-room',
  BATHROOM: '/rooms/bathroom',
  GARDEN: '/rooms/garden',
};

const SLUG_TO_ROOM: Record<string, RoomType> = {
  'work-room': 'WORK_ROOM',
  'kitchen': 'KITCHEN',
  'bedroom': 'BEDROOM',
  'living-room': 'LIVING_ROOM',
  'bathroom': 'BATHROOM',
  'garden': 'GARDEN',
};

/** Resolve `/rooms/<slug>` → RoomType (null nếu không khớp). */
export function roomFromPath(path: string): RoomType | null {
  const slug = path.replace(/^\/rooms\//, '').replace(/\/$/, '');
  return SLUG_TO_ROOM[slug] ?? null;
}
