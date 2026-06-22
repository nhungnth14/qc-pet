import { useCallback, useState } from 'react';
import { storage } from '@/lib/storage';

// Garden cinematic one-time flag (Story 10.1). Client MMKV (server flag → defer). Lazy-init read.

const CINEMATIC_KEY = 'garden:cinematic_shown';

export function useGardenCinematic() {
  const [shouldShow, setShouldShow] = useState(() => storage.getItem<boolean>(CINEMATIC_KEY) !== true);

  const markShown = useCallback(() => {
    storage.setItem(CINEMATIC_KEY, true);
    setShouldShow(false);
  }, []);

  return { shouldShow, markShown };
}
