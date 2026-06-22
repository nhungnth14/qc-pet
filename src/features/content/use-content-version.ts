import * as Updates from 'expo-updates';
import { useEffect, useState } from 'react';

import { CONTENT_LAST_SEEN_VERSION, CONTENT_LAST_SYNCED_AT } from '@/shared/lib/constants';
import { storage } from '@/shared/lib/storage';

import { contentRepository } from './content-repository';

export type ContentVersionState = {
  bundledVersion: string;
  lastSeenVersion: string | null;
  isFirstLoad: boolean;
};

// Download available OTA update silently. Never reloads — next launch picks it up.
async function checkForOtaUpdate(): Promise<void> {
  if (__DEV__ || !Updates.isEnabled)
    return;
  try {
    const result = await Updates.checkForUpdateAsync();
    if (result.isAvailable)
      await Updates.fetchUpdateAsync();
  }
  catch {
    // Network or EAS error — silent, never blocks user
  }
}

export function useContentVersion(): ContentVersionState {
  const bundledVersion = contentRepository.getManifest().content_version;
  // Lazy initializer reads MMKV once on first render — avoids setState in effect.
  const [lastSeenVersion] = useState<string | null>(() =>
    storage.getString(CONTENT_LAST_SEEN_VERSION),
  );

  useEffect(() => {
    const current = contentRepository.getManifest().content_version;
    const cached = storage.getString(CONTENT_LAST_SEEN_VERSION);
    if (current !== cached) {
      storage.set(CONTENT_LAST_SEEN_VERSION, current);
      storage.set(CONTENT_LAST_SYNCED_AT, new Date().toISOString());
    }
    void checkForOtaUpdate();
  }, []);

  return {
    bundledVersion,
    lastSeenVersion,
    isFirstLoad: lastSeenVersion === null,
  };
}
