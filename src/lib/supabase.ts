import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { AuthTokenStorage } from '@/lib/auth-token-storage';

import '@/lib/polyfills';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Fail-fast với thông báo rõ ràng thay vì tạo client hỏng âm thầm (lỗi network
// khó hiểu lúc runtime) khi thiếu env.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Thiếu biến môi trường Supabase. Hãy đặt EXPO_PUBLIC_SUPABASE_URL và '
    + 'EXPO_PUBLIC_SUPABASE_ANON_KEY trong file .env trước khi chạy app.',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Native: lưu JWT bằng expo-secure-store (chunked). Web: localStorage mặc định.
    storage: Platform.OS !== 'web' ? AuthTokenStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
