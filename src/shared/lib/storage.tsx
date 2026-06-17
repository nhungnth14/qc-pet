import { createMMKV } from 'react-native-mmkv';

const mmkv = createMMKV({ id: 'qc-pet-storage' });

export const storage = {
  getString(key: string): string | null {
    return mmkv.getString(key) ?? null;
  },
  getBoolean(key: string): boolean {
    return mmkv.getBoolean(key) ?? false;
  },
  set(key: string, value: string | boolean | number): void {
    mmkv.set(key, value);
  },
  remove(key: string): void {
    mmkv.remove(key);
  },
  getItem<T>(key: string): T | null {
    const value = mmkv.getString(key);
    if (value === undefined || value === '')
      return null;
    try {
      return JSON.parse(value) as T;
    }
    catch {
      return null;
    }
  },
  setItem<T>(key: string, value: T): void {
    mmkv.set(key, JSON.stringify(value));
  },
  getAllKeys(): string[] {
    return mmkv.getAllKeys();
  },
};

// Backward-compat standalone exports (used by auth/utils.tsx etc.)
export function getItem<T>(key: string): T | null {
  return storage.getItem<T>(key);
}

export function setItem<T>(key: string, value: T): void {
  storage.setItem(key, value);
}

export function removeItem(key: string): void {
  storage.remove(key);
}
