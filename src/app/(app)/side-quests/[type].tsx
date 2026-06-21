import type { BugReportDraft, FreeformDraft, SideQuestPayload, SideQuestType } from '@/features/side-quests/side-quest-types';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SpeechBubble } from '@/components/speech-bubble';
import { BugReportForm } from '@/features/side-quests/components/bug-report-form';
import { FreeformAnnotation } from '@/features/side-quests/components/freeform-annotation';
import { QuestSuccess } from '@/features/side-quests/components/quest-success';
import { getQuestDef } from '@/features/side-quests/sample-quests';
import { completeSideQuest } from '@/features/side-quests/side-quest-api';
import { useSideQuestStore } from '@/features/side-quests/side-quest-store';
import { applyHappinessReward, BC_REWARD } from '@/features/side-quests/side-quest-types';
import { rewardEventBus } from '@/lib/reward-event-bus';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';

/**
 * Side quest runner (Story 5.6 AC2–6) — dynamic route theo `type`. Render Bugsy intro +
 * context curated + form đúng loại → submit → reward server-authoritative (pipeline 6-2) →
 * màn success. `committedRef` chống double-submit (reward đúng 1 lần — AC6).
 */

export default function SideQuestRunnerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type: string }>();
  const userId = useSessionStore(s => s.userId);
  const addSubmission = useSideQuestStore(s => s.addSubmission);

  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const committedRef = useRef(false);

  const type = params.type as SideQuestType;
  const def = getQuestDef(type);

  if (!def)
    return <Redirect href="/(app)/side-quests" />;

  // Reward local-only (offline / không server) — mirror core-mission else-branch.
  // setNeedBars TRƯỚC addBC: addBC persist cả needBars xuống MMKV → happiness mới được lưu,
  // không bị loadFromLocal (Work Room remount) ghi đè bằng giá trị cũ.
  const applyLocalReward = () => {
    const cur = usePetStore.getState().needBars.happiness;
    usePetStore.getState().setNeedBars({ happiness: applyHappinessReward(cur) });
    usePetStore.getState().addBC(BC_REWARD);
  };

  const handleSubmit = async (payload: SideQuestPayload) => {
    if (committedRef.current)
      return;
    committedRef.current = true;
    setSubmitting(true);

    try {
      // Persist submission local (nguồn Bug Report Wall — Story 5.7).
      addSubmission(type, payload);
      if (userId) {
        const result = await completeSideQuest(userId, type);
        // setNeedBars TRƯỚC addBC (addBC persist needBars → happiness mới được lưu MMKV).
        usePetStore.getState().setNeedBars({ happiness: result.happinessAfter });
        usePetStore.getState().addBC(result.bcEarned);
        // NFR-1: emit CHỈ sau server success → CurrencyHeader animate chip khi về Work Room.
        if (result.serverCommitted) {
          const bc = usePetStore.getState().bcBalance;
          rewardEventBus.emit('server_committed', {
            type: 'bc',
            amount: result.bcEarned,
            from: bc - result.bcEarned,
            to: bc,
          });
        }
      }
      else {
        applyLocalReward();
      }
    }
    catch {
      // Network fail — vẫn thưởng local để không chặn UX (honor system, offline-tolerant).
      applyLocalReward();
    }

    setDone(true);
  };

  if (done)
    return <QuestSuccess questName={def.name} onDone={() => router.replace('/(app)')} />;

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
        <Text style={styles.title}>{`${def.emoji} ${def.name}`}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <SpeechBubble text={def.bugsyIntro} />

        {def.contextText && (
          <View style={styles.contextCard}>
            {def.contextTitle && <Text style={styles.contextTitle}>{def.contextTitle}</Text>}
            <Text style={styles.contextText}>{def.contextText}</Text>
          </View>
        )}

        {def.formKind === 'bug_report'
          ? <BugReportForm disabled={submitting} onSubmit={d => handleSubmit(d as BugReportDraft)} />
          : (
              <FreeformAnnotation
                label={def.freeformLabel ?? 'Bài làm của bạn'}
                placeholder={def.freeformPlaceholder}
                disabled={submitting}
                onSubmit={d => handleSubmit(d as FreeformDraft)}
              />
            )}
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
  scroll: { padding: 20, gap: 18, paddingBottom: 60 },
  contextCard: {
    backgroundColor: '#fff7f3',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 14,
    gap: 6,
  },
  contextTitle: { fontSize: 13, fontWeight: '800', color: '#006491' },
  contextText: { fontSize: 14, fontWeight: '600', color: '#001a41', lineHeight: 21 },
});
