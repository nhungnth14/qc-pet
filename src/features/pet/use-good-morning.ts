import type { GoodMorningGreeting } from './good-morning';
import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';
import { clock } from '@/shared/lib/clock';
import { usePetStore } from '@/stores/pet-store';
import { dateKeyUTC7, getGoodMorningGreeting } from './good-morning';

const GOOD_MORNING_KEY = 'good_morning:last_date';
const AUTO_DISMISS_MS = 2500;

/**
 * Good Morning Moment (Story 4-4). Lần mở app đầu tiên trong ngày (UTC+7) → trả greeting theo
 * evolution version; auto-dismiss sau 2.5s; chỉ 1 lần/ngày (so MMKV date).
 * Lazy init (read-only) quyết định có greet; effect mark MMKV + timer (react-compiler-safe).
 */
export function useGoodMorning(): GoodMorningGreeting | null {
  const version = usePetStore(s => s.version);
  const name = usePetStore(s => s.name);

  const [greeting] = useState<GoodMorningGreeting | null>(() => {
    const today = dateKeyUTC7(clock.now());
    if (storage.getItem<string>(GOOD_MORNING_KEY) === today)
      return null;
    return getGoodMorningGreeting(version, name);
  });
  const [visible, setVisible] = useState(greeting !== null);

  useEffect(() => {
    if (greeting === null)
      return;
    storage.setItem(GOOD_MORNING_KEY, dateKeyUTC7(clock.now()));
    const timer = setTimeout(() => setVisible(false), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [greeting]);

  return visible ? greeting : null;
}
