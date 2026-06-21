import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { CurrencyHeader, NeedBarComponent, SlideUpPanel } from '@/components';
import { useMissionBoardStore } from '@/features/mission-board/mission-board-store';
import { getNeverDieMessage } from '@/features/pet/bugsy-mood';
import { BugsyCharacter } from '@/features/pet/components/bugsy-character';
import { EvolutionPending } from '@/features/pet/components/evolution-pending';
import { SuggestionBubble } from '@/features/rooms/components/suggestion-bubble';
import { useRoomSuggestion } from '@/features/rooms/use-room-suggestion';
import { useSideQuestStore } from '@/features/side-quests/side-quest-store';
import { MyJourneyPanel } from '@/features/sprint/components/my-journey-panel';
import { RetrospectivePanel } from '@/features/sprint/components/retrospective-panel';
import { SprintHoldButton } from '@/features/sprint/components/sprint-hold-button';
import { WeeklyBugLogForm } from '@/features/sprint/components/weekly-bug-log-form';
import { logNoBugsThisWeek } from '@/features/sprint/weekly-bug-log-api';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { useConnectivity } from '@/stores/use-connectivity';

// eslint-disable-next-line max-lines-per-function -- screen hub: Bugsy + need bars + 3 CTA + Zero-Bug panel; tách nhỏ làm rối layout.
export function WorkRoomScreen() {
  const router = useRouter();
  const petName = usePetStore(s => s.name);
  const needBars = usePetStore(s => s.needBars);
  const loadFromLocal = usePetStore(s => s.loadFromLocal);
  const sqLoadFromLocal = useSideQuestStore(s => s.loadFromLocal);
  const submissions = useSideQuestStore(s => s.submissions);
  const logZeroBugWeek = useSideQuestStore(s => s.logZeroBugWeek);
  const cards = useMissionBoardStore(s => s.cards);
  const mbLoadFromLocal = useMissionBoardStore(s => s.loadFromLocal);
  const online = useConnectivity(s => s.online);
  const userId = useSessionStore(s => s.userId);
  const [zeroBugOpen, setZeroBugOpen] = useState(false);
  const [showBugForm, setShowBugForm] = useState(false);
  const [retroOpen, setRetroOpen] = useState(false);
  const [journeyOpen, setJourneyOpen] = useState(false);
  const { suggestion, suggest, dismiss } = useRoomSuggestion();

  // Story 4-3 never-die: bar = 0 → câu cảm xúc thay lời chào (KHÔNG game-over/modal).
  const neverDieMessage = getNeverDieMessage(needBars, petName);

  // Long-press Bugsy → gợi ý phòng cần nhất (Story 3-2 AC-4). runOnJS: callback setState ở JS thread.
  const bugsyLongPress = Gesture.LongPress()
    .minDuration(500)
    .runOnJS(true)
    .onStart(() => suggest());

  const doneCount = cards.filter(c => c.status === 'done').length;
  const wallCount = submissions.length + doneCount;
  const countByCol = (col: string) => cards.filter(c => c.status === col).length;

  const closeBugLog = () => {
    setZeroBugOpen(false);
    setShowBugForm(false);
  };

  const openSimulatedBugHunt = () => {
    closeBugLog();
    router.push('/(app)/side-quests/simulated_bug_hunt');
  };

  const skipBugWeek = () => {
    logZeroBugWeek(new Date().toISOString());
    if (userId)
      void logNoBugsThisWeek(userId).catch(() => {});
    closeBugLog();
  };

  useEffect(() => {
    loadFromLocal();
    sqLoadFromLocal();
    mbLoadFromLocal();
    // NOTE: effect chạy MỘT lần lúc mount (load state local). KHÔNG disable react-hooks/exhaustive-deps
    // — react-compiler (error) cấm component có rule bị disable. Warning missing-deps là advisory.
    // Bugsy idle animation giờ do BugsyCharacter (Story 3-3) tự xử lý.
  }, []);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.roomLabel}>🖥️ Work Room</Text>
        <CurrencyHeader />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Bugsy — long-press để hỏi gợi ý phòng (Story 3-2) */}
        <GestureDetector gesture={bugsyLongPress}>
          <View style={styles.bugsySection}>
            <BugsyCharacter room="WORK_ROOM" />
            <View style={styles.speechBubble}>
              <Text style={styles.speechText}>
                {neverDieMessage ?? `Chào ${petName}! Học gì hôm nay? 📚`}
              </Text>
            </View>
          </View>
        </GestureDetector>

        {/* Need Bars */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trạng thái Bugsy</Text>
          <NeedBarComponent label="🍗 Hunger" value={needBars.hunger} fillClassName="bg-need-hunger" />
          <NeedBarComponent label="😊 Happiness" value={needBars.happiness} fillClassName="bg-need-happiness" />
          <NeedBarComponent label="💪 Health" value={needBars.health} fillClassName="bg-need-health" />
          <NeedBarComponent label="📏 Discipline" value={needBars.discipline} fillClassName="bg-need-discipline" />
        </View>

        {/* Evolution Pending indicator (Story 3-5) */}
        <EvolutionPending />

        {/* Core Mission CTA — Story 4-3: disable khi offline */}
        <Pressable
          style={[styles.missionBtn, !online && styles.btnDisabled]}
          onPress={() => online && router.push('/(app)/core-mission')}
          disabled={!online}
          accessibilityRole="button"
          accessibilityState={{ disabled: !online }}
          accessibilityLabel="Core Mission hôm nay"
        >
          <Text style={styles.missionBtnEmoji}>🎯</Text>
          <View style={styles.missionBtnText}>
            <Text style={styles.missionBtnTitle}>Core Mission hôm nay</Text>
            <Text style={styles.missionBtnSub}>
              {online ? 'Bug Detective · Lesson 1 · +10 BC · +6 QP' : 'Cần kết nối để chăm Bugsy'}
            </Text>
          </View>
          <Text style={styles.missionBtnArrow}>→</Text>
        </Pressable>

        {/* Side Quests CTA (Story 5.6) */}
        <Pressable
          style={styles.sideQuestBtn}
          onPress={() => router.push('/(app)/side-quests')}
          accessibilityRole="button"
          accessibilityLabel="Mở Side Quests"
        >
          <Text style={styles.missionBtnEmoji}>🧩</Text>
          <View style={styles.missionBtnText}>
            <Text style={styles.sideQuestTitle}>Side Quests</Text>
            <Text style={styles.sideQuestSub}>Bug Hunt · Peer Review · Repro · +40% 😊 +5 BC</Text>
          </View>
          <Text style={styles.sideQuestArrow}>→</Text>
        </Pressable>

        {/* Weekly Bug Log — Zero-Bug entry (Story 5.6 AC5 / FR-34) */}
        <Pressable
          style={styles.bugLogBtn}
          onPress={() => setZeroBugOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Weekly Bug Log"
        >
          <Text style={styles.bugLogText}>📋 Weekly Bug Log — báo cáo bug tuần này</Text>
        </Pressable>

        {/* Sprint Hold token (Story 7.4) */}
        <SprintHoldButton />

        {/* Retrospective (Story 7.5) */}
        <Pressable
          style={styles.bugLogBtn}
          onPress={() => setRetroOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Mở Retrospective sprint"
        >
          <Text style={styles.bugLogText}>📝 Retrospective sprint</Text>
        </Pressable>

        {/* My Journey (Story 7.2) */}
        <Pressable
          style={styles.bugLogBtn}
          onPress={() => setJourneyOpen(true)}
          accessibilityRole="button"
          accessibilityLabel="Mở Hành trình của bạn"
        >
          <Text style={styles.bugLogText}>🗺️ Hành trình của bạn</Text>
        </Pressable>

        {/* Mission Board + Bug Report Wall (Story 5.7) — preview thật, tap để mở */}
        <Pressable
          style={styles.section}
          onPress={() => router.push('/(app)/mission-board')}
          accessibilityRole="button"
          accessibilityLabel="Mở Mission Board"
        >
          <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>Mission Board</Text>
            <Text style={styles.sectionArrow}>→</Text>
          </View>
          <View style={styles.kanbanRow}>
            {(['TODO', 'IN PROGRESS', 'DONE'] as const).map((col) => {
              const key = col === 'TODO' ? 'todo' : col === 'IN PROGRESS' ? 'in_progress' : 'done';
              return (
                <View key={col} style={styles.kanbanCol}>
                  <Text style={styles.kanbanHeader}>{col}</Text>
                  <View style={styles.kanbanCard}>
                    <Text style={styles.kanbanCardText}>{`${countByCol(key)} thẻ`}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <Text style={styles.wallText}>
            {`Bug Report Wall 📌 — ${wallCount} sticky note`}
          </Text>
        </Pressable>
      </ScrollView>

      {/* Weekly Bug Log + Zero-Bug Response panel (Story 7.3 / 5.6 AC5 / FR-34) */}
      <SlideUpPanel isOpen={zeroBugOpen} onClose={closeBugLog} snapPoints={['60%']}>
        {showBugForm
          ? <WeeklyBugLogForm onDone={closeBugLog} />
          : (
              <View style={styles.zeroBug}>
                <Text style={styles.zeroBugTitle}>Tuần này bạn có gặp bug nào không?</Text>

                <Pressable
                  style={styles.zeroBugPrimary}
                  onPress={() => setShowBugForm(true)}
                  accessibilityRole="button"
                  accessibilityLabel="Có, ghi lại bug"
                >
                  <Text style={styles.zeroBugPrimaryText}>🐞 Có, ghi lại bug</Text>
                </Pressable>

                <Text style={styles.zeroBugSub}>Chưa gặp bug thật cũng không sao:</Text>

                <Pressable
                  style={styles.zeroBugOption}
                  onPress={openSimulatedBugHunt}
                  accessibilityRole="button"
                  accessibilityLabel="Mở Simulated Bug Hunt"
                >
                  <Text style={styles.zeroBugOptionText}>🧪 Mở Simulated Bug Hunt</Text>
                </Pressable>

                <Pressable
                  style={styles.zeroBugOption}
                  onPress={skipBugWeek}
                  accessibilityRole="button"
                  accessibilityLabel="Bỏ qua tuần này"
                >
                  <Text style={styles.zeroBugOptionText}>⏭ Bỏ qua tuần này</Text>
                </Pressable>
              </View>
            )}
      </SlideUpPanel>

      <RetrospectivePanel isOpen={retroOpen} onClose={() => setRetroOpen(false)} />
      <MyJourneyPanel isOpen={journeyOpen} onClose={() => setJourneyOpen(false)} />

      <SuggestionBubble suggestion={suggestion} onDismiss={dismiss} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFE5D9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 12,
  },
  roomLabel: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  scroll: { padding: 20, gap: 20, paddingBottom: 40 },
  bugsySection: { alignItems: 'center', gap: 12 },
  speechBubble: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  speechText: { fontSize: 15, fontWeight: '700', color: '#001a41', textAlign: 'center' },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#001a41' },
  missionBtn: {
    backgroundColor: '#006491',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  btnDisabled: { opacity: 0.5 },
  missionBtnEmoji: { fontSize: 32 },
  missionBtnText: { flex: 1, gap: 2 },
  missionBtnTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  missionBtnSub: { fontSize: 12, fontWeight: '600', color: '#22b5ff' },
  missionBtnArrow: { fontSize: 24, color: '#fff', fontWeight: '800' },
  kanbanRow: { flexDirection: 'row', gap: 8 },
  kanbanCol: { flex: 1, gap: 8 },
  kanbanHeader: { fontSize: 10, fontWeight: '800', color: '#888', textAlign: 'center' },
  kanbanCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 10,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
  },
  kanbanCardText: { fontSize: 11, fontWeight: '700', color: '#001a41', textAlign: 'center' },
  sectionTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionArrow: { fontSize: 22, color: '#001a41', fontWeight: '800' },
  wallText: { fontSize: 13, fontWeight: '600', color: '#555' },
  sideQuestBtn: {
    backgroundColor: '#5b4b8a',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#001a41',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
  sideQuestTitle: { fontSize: 16, fontWeight: '800', color: '#fff' },
  sideQuestSub: { fontSize: 11, fontWeight: '600', color: '#d6ccff' },
  sideQuestArrow: { fontSize: 24, color: '#fff', fontWeight: '800' },
  bugLogBtn: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bugLogText: { fontSize: 13, fontWeight: '700', color: '#001a41' },
  zeroBug: { gap: 12, paddingTop: 8 },
  zeroBugTitle: { fontSize: 18, fontWeight: '900', color: '#001a41' },
  zeroBugSub: { fontSize: 14, fontWeight: '600', color: '#3a4a66', lineHeight: 20 },
  zeroBugPrimary: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006491',
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#001a41',
    padding: 14,
    marginTop: 4,
  },
  zeroBugPrimaryText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  zeroBugSecondary: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
  },
  zeroBugSecondaryText: { fontSize: 14, fontWeight: '700', color: '#3a4a66' },
  // Story 7.3: 2 zero-bug option bình đẳng visual weight (cùng style)
  zeroBugOption: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 12,
  },
  zeroBugOptionText: { fontSize: 14, fontWeight: '700', color: '#001a41' },
});
