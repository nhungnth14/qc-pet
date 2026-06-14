import { storage } from './storage';

const walKey = (namespace: string, key: string) => `wal_${namespace}_${key}`;

export const wal = {
  // Write to MMKV BEFORE calling the API
  write(namespace: string, key: string, value: unknown): void {
    storage.setItem(walKey(namespace, key), value);
  },

  // Delete after API success
  delete(namespace: string, key: string): void {
    storage.remove(walKey(namespace, key));
  },

  // Read all pending entries for crash recovery on app restart
  recover(namespace: string): Array<{ key: string; value: unknown }> {
    const prefix = `wal_${namespace}_`;
    return storage
      .getAllKeys()
      .filter((k) => k.startsWith(prefix))
      .map((k) => ({
        key: k.slice(prefix.length),
        value: storage.getItem<unknown>(k),
      }));
  },
};
