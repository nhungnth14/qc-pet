import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { APIProvider } from '@/lib/api';
import { useSessionStore } from '@/stores/session-store';
import '../global.css';

export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: '(app)' };

// Sentry chỉ init khi có DSN (staging/production). DSN trống (dev/local) → KHÔNG init
// → hoàn toàn inert, không ảnh hưởng boot. `enabled: !__DEV__` chặn gửi event khi dev.
const SENTRY_DSN = process.env.EXPO_PUBLIC_SENTRY_DSN;
if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: process.env.EXPO_PUBLIC_APP_ENV,
    enabled: !__DEV__,
    tracesSampleRate: 0.2,
  });
}

// Giữ splash cho tới khi session bootstrap xong (thay vì ẩn ngay lập tức).
SplashScreen.preventAutoHideAsync().catch(() => {});

function RootLayout() {
  const initSession = useSessionStore(s => s.initSession);
  const hasInit = React.useRef(false);

  React.useEffect(() => {
    if (hasInit.current)
      return;
    hasInit.current = true;
    // Offline-first: app vẫn boot kể cả khi init lỗi (mất mạng). Ẩn splash khi
    // init settle (thành công hoặc lỗi), KHÔNG chặn render cây component.
    initSession()
      .catch((err) => {
        console.warn('[session] init failed:', err);
      })
      .finally(() => {
        SplashScreen.hideAsync().catch(() => {});
      });
  }, [initSession]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <APIProvider>
        <Stack>
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        </Stack>
      </APIProvider>
    </GestureHandlerRootView>
  );
}

// Sentry.wrap bọc root (error boundary + performance). Chỉ wrap khi có DSN (đã init)
// → tránh gọi Sentry.wrap lúc SDK chưa init.
export default SENTRY_DSN ? Sentry.wrap(RootLayout) : RootLayout;
