import { Redirect, Stack } from 'expo-router';
import { useSessionStore } from '@/stores/session-store';

export default function AppLayout() {
  const onboardingComplete = useSessionStore(s => s.onboardingComplete);

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
