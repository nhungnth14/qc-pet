import { Redirect, Stack } from 'expo-router';
import { useEffect } from 'react';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';

export default function AppLayout() {
  const onboardingComplete = useSessionStore(s => s.onboardingComplete);
  const userId = useSessionStore(s => s.userId);

  // Story 6.1: currency (BC/QP) server-authoritative — fetch từ pets khi vào (app).
  // Offline-tolerant (NFR-7): fail thì giữ last-known local, không crash/block render.
  useEffect(() => {
    if (onboardingComplete && userId) {
      usePetStore.getState().syncFromSupabase(userId).catch(() => {});
    }
  }, [onboardingComplete, userId]);

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* Story 5.4: tắt swipe-to-dismiss trong quiz flow — tránh accidental exit (AC6) */}
      <Stack.Screen name="core-mission" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
