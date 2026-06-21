import type { Souvenir } from '../souvenir';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SOUVENIRS } from '../souvenir';
import { useSouvenirStore } from '../stores/use-souvenir-store';

/**
 * Souvenir shelf (Story 3-5) — Phòng Khách. Render souvenir đã unlock theo evolution step.
 * Evolution thật (populate) tới ở Epic 7 → hiện thường trống (placeholder).
 */
export function SouvenirShelf() {
  const unlockedSteps = useSouvenirStore(s => s.unlockedSteps);
  const loadFromLocal = useSouvenirStore(s => s.loadFromLocal);

  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  const items = unlockedSteps
    .map(step => SOUVENIRS[step])
    .filter((s): s is Souvenir => s !== undefined);

  return (
    <View style={styles.shelf}>
      <Text style={styles.title}>🗄️ Kệ kỷ niệm</Text>
      {items.length === 0
        ? <Text style={styles.empty}>Chưa có kỷ niệm — tiến hóa Bugsy để sưu tầm!</Text>
        : (
            <View style={styles.row}>
              {items.map(s => (
                <View key={s.type} style={styles.item}>
                  <Text style={styles.emoji}>{s.emoji}</Text>
                  <Text style={styles.label}>{s.label}</Text>
                </View>
              ))}
            </View>
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  shelf: {
    alignSelf: 'stretch',
    gap: 8,
    padding: 14,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  title: { fontSize: 14, fontWeight: '800', color: '#001a41' },
  empty: { fontSize: 12, fontWeight: '600', color: '#3a4a66' },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  item: { alignItems: 'center', width: 72, gap: 2 },
  emoji: { fontSize: 32 },
  label: { fontSize: 10, fontWeight: '700', color: '#001a41', textAlign: 'center' },
});
