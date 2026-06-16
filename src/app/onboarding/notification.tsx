import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { setStep } from '@/features/onboarding/onboarding-progress';
import { storage } from '@/lib/storage';
import { usePetStore } from '@/stores/pet-store';

const NOTIF_OPT_IN_KEY = 'onboarding_notif_opt_in';

/**
 * Notification Preference (FR-28 / Story 2.5) — SAU Cliffhanger, TRƯỚC Sign-up Gate.
 * Checkpoint resume độc lập (Story 2.6 AC4): mount → setStep('notification').
 *
 * NOTE (scope): lựa chọn opt-in được lưu vào MMKV. Việc gọi native push-permission
 * (Expo Push) + đăng ký token thuộc Epic 9 (Notifications & Smart Timing) — KHÔNG
 * thêm dependency `expo-notifications` ở story này. Khi Epic 9 làm, đọc cờ này để
 * quyết định có request OS permission hay không.
 */
export default function NotificationPreferenceScreen() {
  const router = useRouter();
  const petName = usePetStore(s => s.name);

  useEffect(() => {
    setStep('notification');
  }, []);

  const choose = (optIn: boolean) => {
    storage.set(NOTIF_OPT_IN_KEY, optIn);
    router.push('/onboarding/sign-up');
  };

  return (
    <View style={styles.container} accessibilityLanguage="vi">
      <View style={styles.top}>
        <Text style={styles.bugsy}>🐣</Text>
        <View style={styles.speechBubble}>
          <Text style={styles.speechText}>
            {`${petName} ơi, cho mình nhắn tin nhắc mình học mỗi ngày nhé?`}
          </Text>
        </View>
      </View>

      <View style={styles.panel}>
        <Pressable
          style={[styles.btn, styles.btnPrimary]}
          onPress={() => choose(true)}
          accessibilityRole="button"
          accessibilityLabel="Đồng ý cho gửi thông báo nhắc nhở"
        >
          <Text style={styles.btnPrimaryText}>Được, nhắc mình nha! 🔔</Text>
        </Pressable>

        <Pressable
          style={styles.btnGhost}
          onPress={() => choose(false)}
          accessibilityRole="button"
          accessibilityLabel="Không cần thông báo, mình tự nhớ"
        >
          <Text style={styles.btnGhostText}>Thôi, mình tự nhớ</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5D9', justifyContent: 'flex-end' },
  top: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, paddingHorizontal: 24 },
  bugsy: { fontSize: 100 },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  speechText: { fontSize: 16, fontWeight: '700', color: '#001a41', textAlign: 'center', lineHeight: 22 },
  panel: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 48,
    borderTopRightRadius: 48,
    borderWidth: 4,
    borderColor: '#001a41',
    padding: 28,
    gap: 14,
    paddingBottom: 48,
  },
  btn: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#001a41',
    minHeight: 44,
  },
  btnPrimary: {
    backgroundColor: '#22b5ff',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  btnGhost: { alignItems: 'center', padding: 12, minHeight: 44, justifyContent: 'center' },
  btnGhostText: { fontSize: 15, fontWeight: '700', color: '#666', textDecorationLine: 'underline' },
});
