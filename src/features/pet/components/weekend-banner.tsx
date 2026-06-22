import { StyleSheet, Text, View } from 'react-native';
import { clock } from '@/shared/lib/clock';
import { isWeekend } from '../need-bar-weekend';

/**
 * Weekend Mode banner (Story 4-3). Hiện khi hôm nay là T7/CN (UTC+7) — bars không decay cuối tuần.
 * Server là nguồn sự thật; banner chỉ là chỉ báo (client tính isWeekend từ clock server-offset).
 */
export function WeekendBanner() {
  if (!isWeekend(clock.now()))
    return null;

  return (
    <View style={styles.banner} pointerEvents="none">
      <Text style={styles.text}>🌴 Weekend Mode — Bugsy đang nghỉ ngơi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 56,
    left: 16,
    right: 16,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#2e7d32',
    zIndex: 30,
  },
  text: { fontSize: 13, fontWeight: '800', color: '#fff' },
});
