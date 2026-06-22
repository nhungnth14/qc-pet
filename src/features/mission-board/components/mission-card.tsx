import type { MissionCard } from '../mission-board-types';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TACTILE_SHADOW } from '@/components/tactile-card';
import { cardRotation } from '../mission-board-types';

type Props = {
  card: MissionCard;
  onPress: () => void;
};

/**
 * 1 card kanban (Story 5.7) — TactileCard w-40, drag-handle "≡" (visual cue, KHÔNG drag thật —
 * Decision #1). Tap → chuyển sang cột kế. Card Done xoay ±3° (deterministic theo id — AC2).
 */
export function MissionCardView({ card, onPress }: Props) {
  const isDone = card.status === 'done';
  const rotate = isDone ? `${cardRotation(card.id)}deg` : '0deg';

  return (
    <Pressable
      onPress={onPress}
      disabled={isDone}
      accessibilityRole="button"
      accessibilityLabel={isDone ? `${card.lessonName} đã xong` : `Chuyển ${card.lessonName} sang cột tiếp`}
    >
      <View style={[styles.card, { transform: [{ rotate }] }, TACTILE_SHADOW]}>
        <View style={styles.headerRow}>
          <Text style={styles.handle}>≡</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{card.category}</Text>
          </View>
        </View>
        <Text style={styles.name}>{card.lessonName}</Text>
        {isDone && <Text style={styles.doneTag}>✅ Done</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 12,
    gap: 8,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  handle: { fontSize: 18, fontWeight: '900', color: '#9aa7bd' },
  badge: {
    backgroundColor: '#006491',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: '#fff' },
  name: { fontSize: 14, fontWeight: '800', color: '#001a41' },
  doneTag: { fontSize: 12, fontWeight: '700', color: '#2e7d32' },
});
