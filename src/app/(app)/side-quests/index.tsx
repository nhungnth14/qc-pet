import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SideQuestCard } from '@/features/side-quests/components/side-quest-card';
import { getQuestDef, LISTED_QUEST_TYPES } from '@/features/side-quests/sample-quests';

/**
 * Side Quests list (Story 5.6 AC1) — 3 quest type (Bug Hunt / Peer Review / Repro Steps).
 * Simulated Bug Hunt chỉ vào qua Zero-Bug flow ở Work Room (AC5).
 */
export default function SideQuestsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backBtn}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Quay lại"
        >
          <Text style={styles.backText}>← Quay lại</Text>
        </Pressable>
        <Text style={styles.title}>🧩 Side Quests</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.intro}>
          Hoạt động phụ giúp bạn luyện kỹ năng QC thực tế. Mỗi quest xong được +40% Happiness cho
          Bugsy và +5 BC nhé!
        </Text>

        {LISTED_QUEST_TYPES.map((type) => {
          const def = getQuestDef(type);
          if (!def)
            return null;
          return (
            <SideQuestCard
              key={type}
              def={def}
              onPress={() => router.push(`/(app)/side-quests/${type}`)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5D9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  backBtn: { minHeight: 44, justifyContent: 'center', paddingRight: 8 },
  backText: { fontSize: 14, fontWeight: '800', color: '#001a41' },
  title: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  scroll: { padding: 20, gap: 16, paddingBottom: 40 },
  intro: { fontSize: 14, fontWeight: '600', color: '#3a4a66', lineHeight: 21 },
});
