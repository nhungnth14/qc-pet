import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePetStore } from '@/stores/pet-store';
import { getEvolutionStatus } from '../evolution';
import { TransferGatePanel } from './transfer-gate-panel';

/**
 * Evolution Pending indicator (Story 3-5 + 7-1). Hiện khi đủ QP cho step kế nhưng chưa evolve
 * (cần Transfer Gate evidence). Tap → mở Transfer Gate panel để gửi bằng chứng → evolve.
 */
export function EvolutionPending() {
  const version = usePetStore(s => s.version);
  const qpTotal = usePetStore(s => s.qpTotal);
  const [panelOpen, setPanelOpen] = useState(false);

  const status = getEvolutionStatus(version, qpTotal);
  if (!status.isPending || status.next === null)
    return null;

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.chip}
        onPress={() => setPanelOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Evolution Pending — gửi bằng chứng để tiến hóa"
      >
        <Text style={styles.chipText}>🥚 Evolution Pending — gửi bằng chứng</Text>
      </Pressable>
      <TransferGatePanel
        visible={panelOpen}
        onClose={() => setPanelOpen(false)}
        nextVersion={status.next}
        qpReached={status.qpReached}
      />
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
});
