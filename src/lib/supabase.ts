import '@/lib/polyfills';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Fail-fast với thông báo rõ ràng thay vì tạo client hỏng âm thầm (lỗi network
// khó hiểu lúc runtime) khi thiếu env.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Thiếu biến môi trường Supabase. Hãy đặt EXPO_PUBLIC_SUPABASE_URL và ' +
      'EXPO_PUBLIC_SUPABASE_ANON_KEY trong file .env trước khi chạy app.'
  );
}

// expo-secure-store giới hạn ~2KB mỗi value (iOS Keychain). Session token của
// Supabase (access + refresh + user) thường vượt mức này → tự chia value thành
// nhiều chunk và ghép lại khi đọc. CHUNK_SIZE đặt < 2048 để dư phòng cho ký tự
// nhiều byte (UTF-8).
const CHUNK_SIZE = 1800;
const CHUNK_FLAG = '__supabase_chunked__:';

async function getChunked(key: string): Promise<string | null> {
  const head = await SecureStore.getItemAsync(key);
  if (head === null) return null;
  if (!head.startsWith(CHUNK_FLAG)) return head;

  const count = Number.parseInt(head.slice(CHUNK_FLAG.length), 10);
  if (!Number.isFinite(count) || count <= 0) return null;

  let result = '';
  for (let i = 0; i < count; i++) {
    const part = await SecureStore.getItemAsync(`${key}.${i}`);
    if (part === null) return null; // thiếu chunk → coi như không có dữ liệu
    result += part;
  }
  return result;
}

async function removeChunked(key: string): Promise<void> {
  const head = await SecureStore.getItemAsync(key);
  await SecureStore.deleteItemAsync(key);
  if (head !== null && head.startsWith(CHUNK_FLAG)) {
    const count = Number.parseInt(head.slice(CHUNK_FLAG.length), 10);
    if (Number.isFinite(count)) {
      for (let i = 0; i < count; i++) {
        await SecureStore.deleteItemAsync(`${key}.${i}`);
      }
    }
  }
}

async function setChunked(key: string, value: string): Promise<void> {
  // Dọn chunk cũ trước khi ghi để tránh sót dữ liệu thừa khi value đổi kích cỡ.
  await removeChunked(key);

  if (value.length <= CHUNK_SIZE) {
    await SecureStore.setItemAsync(key, value);
    return;
  }

  const count = Math.ceil(value.length / CHUNK_SIZE);
  await SecureStore.setItemAsync(key, `${CHUNK_FLAG}${count}`);
  for (let i = 0; i < count; i++) {
    await SecureStore.setItemAsync(
      `${key}.${i}`,
      value.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    );
  }
}

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => getChunked(key),
  setItem: (key: string, value: string) => setChunked(key, value),
  removeItem: (key: string) => removeChunked(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.OS !== 'web' ? ExpoSecureStoreAdapter : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
