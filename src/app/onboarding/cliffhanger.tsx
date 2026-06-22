import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { setStep } from '@/features/onboarding/onboarding-progress';
import { usePetStore } from '@/stores/pet-store';

/**
 * Cliffhanger (FR-28 / Story 2.4) — xuất hiện SAU Reward, TRƯỚC Notification + Sign-up.
 * Là 1 checkpoint resume độc lập (Story 2.6 AC3): mount → setStep('cliffhanger').
 */
export default function CliffhangerScreen() {
  const router = useRouter();
  const petName = usePetStore(s => s.name);
  const panelAnim = useRef(new Animated.Value(400)).current;

  useEffect(() => {
    setStep('cliffhanger');
    Animated.spring(panelAnim, {
      toValue: 0,
      tension: 50,
      friction: 8,
      useNativeDriver: true,
    }).start();
  }, [panelAnim]);

  const handleContinue = () => {
    router.push('/onboarding/notification');
  };

  return (
    <View style={styles.container} accessibilityLanguage="vi">
      <View style={styles.bugsyArea}>
        <Text style={styles.bugsy}>🐣</Text>
      </View>

      <Animated.View style={[styles.panel, { transform: [{ translateY: panelAnim }] }]}>
        <View style={styles.handle} />
        <Text style={styles.title}>Còn một chuyện nữa…</Text>
        <Text style={styles.body}>
          {`${petName} đang muốn kể bạn nghe một ca bug thật ly kỳ ở sprint sắp tới — nhưng mình cần `}
          <Text style={styles.bold}>{`lưu ${petName} lại trước`}</Text>
          {' đã, để không bị mất tiến trình nha.'}
        </Text>

        <Pressable
          style={styles.btn}
          onPress={handleContinue}
          accessibilityRole="button"
          accessibilityLabel={`Lưu ${petName} lại`}
        >
          <Text style={styles.btnText}>{`Lưu ${petName} lại nào →`}</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5D9', justifyContent: 'flex-end' },
  bugsyArea: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  bugsy: { fontSize: 110 },
  panel: {
    backgroundColor: '#002e69',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderTopWidth: 3,
    borderColor: '#22b5ff',
    padding: 28,
    gap: 16,
    paddingBottom: 48,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#22b5ff',
    borderRadius: 2,
    alignSelf: 'center',
  },
  title: { fontSize: 22, fontWeight: '800', color: '#fff' },
  body: { fontSize: 15, fontWeight: '600', color: '#cde3ff', lineHeight: 23 },
  bold: { color: '#fff', fontWeight: '800' },
  btn: {
    backgroundColor: '#22b5ff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001a41',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
    minHeight: 44,
  },
  btnText: { fontSize: 16, fontWeight: '800', color: '#001a41' },
});
