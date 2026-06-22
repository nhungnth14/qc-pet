import copyJson from '../../../content/notifications/copy.json';

// Bugsy-voice notification copy (Story 9.1). Templates trong content/notifications/copy.json (OTA-updatable).
// Register "mình/bạn" (NFR-4). Interpolate {name}.

type CopyFile = { version: string; templates: Record<string, string> };
const COPY = copyJson as CopyFile;

export type NeedKey = 'hunger' | 'happiness' | 'health' | 'discipline';
export type NotificationKey
  = | 'hunger_low'
    | 'happiness_low'
    | 'health_low'
    | 'discipline_low'
    | 'general_miss'
    | 'weekend'
    | 'morning';

/** Need bar thấp → notification key tương ứng. */
export const NEED_NOTIFICATION_KEY: Record<NeedKey, NotificationKey> = {
  hunger: 'hunger_low',
  happiness: 'happiness_low',
  health: 'health_low',
  discipline: 'discipline_low',
};

/** Copy theo key, interpolate {name}. Fallback general_miss. */
export function getNotificationCopy(key: NotificationKey, name: string): string {
  const template = COPY.templates[key] ?? COPY.templates.general_miss;
  return template.replace(/\{name\}/g, name);
}

/** Copy gộp khi nhiều phòng cần attention (AC 9.2): ≥2 → gộp 1 notification. */
export function buildAttentionCopy(roomLabels: string[], name: string): string {
  if (roomLabels.length === 0)
    return getNotificationCopy('general_miss', name);
  if (roomLabels.length === 1)
    return `Bugsy cần ${roomLabels[0]} — ghé chơi với ${name} nha!`;
  return `Bugsy cần ${roomLabels[0]} và ${roomLabels[1]} — ghé chơi nha!`;
}
