import { Redirect, Stack } from 'expo-router';
import { useSessionStore } from '@/stores/session-store';

export default function AppLayout() {
  const onboardingComplete = useSessionStore((s) => s.onboardingComplete);

  if (!onboardingComplete) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="core-mission" />
    </Stack>
  );
}
