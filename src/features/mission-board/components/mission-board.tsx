import type { ColumnId } from '../mission-board-types';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { Confetti } from '@/components/confetti';
import { useMissionBoardStore } from '../mission-board-store';
import { COLUMN_LABELS, COLUMN_ORDER, nextColumn } from '../mission-board-types';
import { MissionCardView } from './mission-card';

/**
 * Mission Board (Story 5.7 AC1–3) — 3 column horizontal scroll, tap-to-move (Decision #1).
 * Card đổi cột trượt mượt (Reanimated `LinearTransition`). Card vào Done → confetti burst.
 */
export function MissionBoard() {
  const cards = useMissionBoardStore(s => s.cards);
  const moveCardForward = useMissionBoardStore(s => s.moveCardForward);
  const loadFromLocal = useMissionBoardStore(s => s.loadFromLocal);
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    loadFromLocal();
  }, [loadFromLocal]);

  const onCardPress = (id: string, status: ColumnId) => {
    if (nextColumn(status) === 'done')
      setConfetti(true);
    moveCardForward(id);
  };

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {COLUMN_ORDER.map((col) => {
          const colCards = cards.filter(c => c.status === col);
          return (
            <View key={col} style={styles.column}>
              <Text style={styles.header}>{COLUMN_LABELS[col]}</Text>
              {colCards.length === 0 && <Text style={styles.empty}>—</Text>}
              {colCards.map(card => (
                <Animated.View key={card.id} layout={LinearTransition.duration(300)}>
                  <MissionCardView card={card} onPress={() => onCardPress(card.id, card.status)} />
                </Animated.View>
              ))}
            </View>
          );
        })}
      </ScrollView>

      {confetti && <Confetti onDone={() => setConfetti(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { gap: 12, paddingVertical: 4, paddingRight: 20 },
  column: { width: 184, gap: 10 },
  header: { fontSize: 16, fontWeight: '800', color: '#001a41', letterSpacing: 0.5 },
  empty: { fontSize: 16, color: '#b6c2d4', textAlign: 'center', paddingVertical: 16 },
});
