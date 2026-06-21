import type { SideQuestDef } from '../side-quest-types';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TactileCard } from '@/components/tactile-card';
import { BC_REWARD, HAPPINESS_REWARD } from '../side-quest-types';

type Props = {
  def: SideQuestDef;
  onPress: () => void;
};

/**
 * Card 1 side quest trong list (Story 5.6 AC1) — TactileCard + preview reward & thời gian.
 */
export function SideQuestCard({ def, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Side quest ${def.name}`}
    >
      <TactileCard>
        <View style={styles.row}>
          <Text style={styles.emoji}>{def.emoji}</Text>
          <View style={styles.body}>
            <Text style={styles.name}>{def.name}</Text>
            <Text style={styles.preview}>
              {`😊 +${HAPPINESS_REWARD}%  ·  🐞 +${BC_REWARD} BC  ·  ~${def.estMinutes} phút`}
            </Text>
          </View>
          <Text style={styles.arrow}>→</Text>
        </View>
      </TactileCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji: { fontSize: 36 },
  body: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  preview: { fontSize: 12, fontWeight: '600', color: '#3a4a66' },
  arrow: { fontSize: 22, fontWeight: '800', color: '#001a41' },
});
