import { Redirect, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getStep, setStep, stepToRoute } from '@/features/onboarding/onboarding-progress';

export default function EggHatchingScreen() {
  const router = useRouter();

  // Kill-app recovery (Story 2.6): nếu user đã đi quá màn trứng, resume tới đúng
  // màn — KHÔNG replay egg animation. Tính 1 lần lúc mount (đồng bộ từ MMKV).
  const resumeRoute = useRef(stepToRoute(getStep())).current;

  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const bugsyScale = useRef(new Animated.Value(0)).current;
  const tappedRef = useRef(false);

  useEffect(() => {
    // Resume được xử lý bằng <Redirect> bên dưới (chờ Root Layout mounted, tránh
    // lỗi "navigate before mounting"). Effect chỉ lo egg loop cho user mới.
    if (resumeRoute)
      return;
    // User mới hoàn toàn → checkpoint màn trứng, chạy shake loop như cũ.
    setStep('hatching');
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shakeAnim, { toValue: 8, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -8, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 4, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: -4, duration: 100, useNativeDriver: true }),
        Animated.timing(shakeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.delay(1000),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [resumeRoute, shakeAnim]);

  // Đang resume → Redirect khai báo: Expo Router chờ navigator sẵn sàng rồi mới
  // điều hướng (tránh lỗi navigate-before-mount khi chồng với Redirect của (app)).
  if (resumeRoute) {
    return <Redirect href={resumeRoute} />;
  }

  const handleTap = () => {
    if (tappedRef.current)
      return;
    tappedRef.current = true;
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 80, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 10, duration: 60, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(opacityAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1.5, duration: 300, useNativeDriver: true }),
      ]),
    ]).start(() => {
      Animated.spring(bugsyScale, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => router.push('/onboarding/naming'), 800);
      });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.taglinePill}>
        <Text style={styles.taglineText}>Học QC mỗi ngày. Cùng Bugsy. 🐣</Text>
      </View>

      <Animated.View
        style={[
          styles.eggWrapper,
          { transform: [{ translateX: shakeAnim }, { scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <Pressable onPress={handleTap} style={styles.egg}>
          <Text style={styles.eggEmoji}>🥚</Text>
          <Text style={styles.tapHint}>Tap để nở!</Text>
        </Pressable>
      </Animated.View>

      <Animated.View
        style={[styles.bugsyWrapper, { transform: [{ scale: bugsyScale }], opacity: bugsyScale }]}
      >
        <Text style={styles.bugsy}>🐣</Text>
        <Text style={styles.bugsyGreet}>Chào bạn!</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5D9', alignItems: 'center', justifyContent: 'center', gap: 32 },
  taglinePill: { backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 999, paddingHorizontal: 20, paddingVertical: 8, position: 'absolute', top: 80 },
  taglineText: { fontSize: 14, fontWeight: '700', color: '#001a41' },
  eggWrapper: { alignItems: 'center' },
  egg: { alignItems: 'center', gap: 8 },
  eggEmoji: { fontSize: 120 },
  tapHint: { fontSize: 16, fontWeight: '600', color: '#888' },
  bugsyWrapper: { position: 'absolute', alignItems: 'center', gap: 8 },
  bugsy: { fontSize: 120 },
  bugsyGreet: { fontSize: 24, fontWeight: '800', color: '#001a41' },
});
