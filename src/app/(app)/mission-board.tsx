import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BugReportWall } from '@/features/mission-board/components/bug-report-wall';
import { MissionBoard } from '@/features/mission-board/components/mission-board';
import { useMissionBoardStore } from '@/features/mission-board/mission-board-store';
import { buildWallNotes } from '@/features/mission-board/wall-notes';
import { useSideQuestStore } from '@/features/side-quests/side-quest-store';

/**
 * Mission Board view (Story 5.7) — kanban tiến độ + Bug Report Wall. Entry từ Work Room.
 * Wall notes = side-quest submissions (5.6) + mission card đã Done (buildWallNotes thuần).
 */
export default function MissionBoardScreen() {
  const router = useRouter();
  const submissions = useSideQuestStore(s => s.submissions);
  const sqLoad = useSideQuestStore(s => s.loadFromLocal);
  const cards = useMissionBoardStore(s => s.cards);
  const mbLoad = useMissionBoardStore(s => s.loadFromLocal);

  useEffect(() => {
    sqLoad();
    mbLoad();
  }, [sqLoad, mbLoad]);

  const doneCards = cards.filter(c => c.status === 'done');
  const notes = buildWallNotes(submissions, doneCards);

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
        <Text style={styles.title}>📋 Mission Board</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <MissionBoard />

        <View style={styles.wallSection}>
          <Text style={styles.sectionTitle}>Bug Report Wall 📌</Text>
          <BugReportWall notes={notes} />
        </View>
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
  scroll: { padding: 20, gap: 24, paddingBottom: 48 },
  wallSection: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#001a41' },
});
