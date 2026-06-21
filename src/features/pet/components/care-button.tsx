import type { CareAction } from '../pet-care';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { useConnectivity } from '@/stores/use-connectivity';
import { CARE_CONFIG } from '../pet-care';

type CareButtonProps = {
  action: CareAction;
};

/**
 * Quick care button (Story 4-2). In-flight guard chống double-tap double-fill; success → scale pop;
 * lỗi/offline (chưa có userId) → greyed + tooltip "Cần kết nối". Touch ≥ 44×44 + a11y label.
 */
export function CareButton({ action }: CareButtonProps) {
  const cfg = CARE_CONFIG[action];
  const userId = useSessionStore(s => s.userId);
  const online = useConnectivity(s => s.online);
  const setOnline = useConnectivity(s => s.setOnline);
  const care = usePetStore(s => s.careAction);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const scale = useSharedValue(1);

  const disabled = busy || !userId || !online;

  const onPress = async () => {
    if (busy || !userId || !online)
      return;
    setBusy(true);
    setFailed(false);
    const idempotencyKey = `care:${userId}:${action}:${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    try {
      await care(userId, action, idempotencyKey);
      setOnline(true);
      scale.value = withSequence(withTiming(1.18, { duration: 150 }), withTiming(1, { duration: 150 }));
    }
    catch {
      setOnline(false);
      setFailed(true);
    }
    finally {
      setBusy(false);
    }
  };

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.wrap}>
      <Animated.View style={animStyle}>
        <Pressable
          style={[styles.btn, disabled && styles.btnDisabled]}
          onPress={onPress}
          disabled={disabled}
          accessibilityRole="button"
          accessibilityState={{ disabled, busy }}
          accessibilityLabel={`${cfg.label} — cộng ${cfg.amount}% ${cfg.bar}`}
        >
          <Text style={styles.emoji}>{cfg.emoji}</Text>
          <View style={styles.textWrap}>
            <Text style={styles.label}>{cfg.label}</Text>
            <Text style={styles.sub}>{`+${cfg.amount}% ${cfg.bar}`}</Text>
          </View>
        </Pressable>
      </Animated.View>
      {(!userId || failed || !online) && (
        <Text style={styles.tooltip}>Cần kết nối để chăm Bugsy</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  btn: {
    minHeight: 56,
    minWidth: 200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#006491',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#001a41',
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.45 },
  emoji: { fontSize: 28 },
  textWrap: { gap: 2 },
  label: { fontSize: 16, fontWeight: '800', color: '#fff' },
  sub: { fontSize: 12, fontWeight: '600', color: '#cdeefb' },
  tooltip: { fontSize: 12, fontWeight: '700', color: '#ba1a1a', textAlign: 'center' },
});
