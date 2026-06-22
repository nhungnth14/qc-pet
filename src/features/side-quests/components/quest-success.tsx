import { StyleSheet, Text, View } from 'react-native';
import { Confetti } from '@/components/confetti';
import { TactileButton } from '@/components/tactile-button';
import { BC_REWARD, HAPPINESS_REWARD } from '../side-quest-types';

type Props = {
  questName: string;
  onDone: () => void;
};

/**
 * Màn success sau khi hoàn thành side quest (Story 5.6). Confetti CHỈ lúc thành công
 * (UX-DR19). Reward summary +40% Happiness · +5 BC. Chip BC tick-up sẽ chạy khi về Work
 * Room (deferred animation 6-2 — CurrencyHeader consumePending).
 */
export function QuestSuccess({ questName, onDone }: Props) {
  return (
    <View style={styles.wrap}>
      <Confetti />
      <Text style={styles.emoji}>🎉</Text>
      <Text style={styles.title}>Hoàn thành!</Text>
      <Text style={styles.sub}>{`Bạn vừa xong "${questName}". Bugsy vui lắm!`}</Text>

      <View style={styles.rewardCard}>
        <Text style={styles.rewardLine}>{`😊 +${HAPPINESS_REWARD}% Happiness`}</Text>
        <Text style={styles.rewardLine}>{`🐞 +${BC_REWARD} BC`}</Text>
      </View>

      <TactileButton
        label="Về Work Room →"
        onPress={onDone}
        accessibilityRole="button"
        accessibilityLabel="Về Work Room"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 },
  emoji: { fontSize: 72 },
  title: { fontSize: 24, fontWeight: '900', color: '#001a41' },
  sub: { fontSize: 15, fontWeight: '600', color: '#3a4a66', textAlign: 'center' },
  rewardCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#001a41',
    paddingHorizontal: 28,
    paddingVertical: 16,
    gap: 8,
    marginVertical: 8,
  },
  rewardLine: { fontSize: 18, fontWeight: '800', color: '#001a41', textAlign: 'center' },
});
