import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePetStore } from '@/stores/pet-store';
import { EVOLUTION_LABELS, getEvolutionStatus } from '../evolution';

/**
 * Evolution Pending indicator (Story 3-5). Hiện khi đủ QP cho step kế nhưng chưa evolve được
 * (cần Transfer Gate evidence — Epic 7). KHÔNG animation, Bugsy giữ version hiện tại. Tap → tooltip.
 */
export function EvolutionPending() {
  const version = usePetStore(s => s.version);
  const qpTotal = usePetStore(s => s.qpTotal);
  const [showTip, setShowTip] = useState(false);

  const status = getEvolutionStatus(version, qpTotal);
  if (!status.isPending || status.next === null)
    return null;

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.chip}
        onPress={() => setShowTip(v => !v)}
        accessibilityRole="button"
        accessibilityLabel="Evolution Pending — chạm để xem chi tiết"
      >
        <Text style={styles.chipText}>🥚 Evolution Pending</Text>
      </Pressable>
      {showTip && (
        <Text style={styles.tip}>
          {`Cần bằng chứng từ công việc thực để Bugsy tiến hóa lên ${EVOLUTION_LABELS[status.next]} (${status.next})`}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 8 },
  chip: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#FFE082',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  chipText: { fontSize: 13, fontWeight: '800', color: '#001a41' },
  tip: { fontSize: 12, fontWeight: '600', color: '#3a4a66', lineHeight: 18 },
});
