import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { APIProvider } from '@/lib/api';
import { useSessionStore } from '@/stores/session-store';
import '../global.css';

export { ErrorBoundary } from 'expo-router';
export const unstable_settings = { initialRouteName: '(app)' };

// Giữ splash cho tới khi session bootstrap xong (thay vì ẩn ngay lập tức).
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const initSession = useSessionStore((s) => s.initSession);
  const hasInit = React.useRef(false);

  React.useEffect(() => {
    if (hasInit.current) return;
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
