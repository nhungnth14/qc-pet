import type { ReviewQuestion } from '../sr-questions';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSprintStore } from '@/features/sprint/stores/use-sprint-store';
import { updateNeedBars } from '@/lib/supabase-api';
import { usePetStore } from '@/stores/pet-store';
import { useSessionStore } from '@/stores/session-store';
import { getMirrorTier, MIRROR_DISCIPLINE_REWARD } from '../mirror';
import { recordReview } from '../sr-api';
import { getReviewQuestions } from '../sr-questions';
import { MirrorMoment } from './mirror-moment';
import { ReviewQuestionCard } from './review-question-card';

type Phase = 'idle' | 'quiz' | 'mirror';

/**
 * Bathroom Flash Quiz (Story 8.3). Stripped: streak + X/N + instant feedback. Sau câu cuối →
 * Mirror Moment (visual theo Discipline) → Discipline +10.
 */
export function FlashQuiz() {
  const userId = useSessionStore(s => s.userId);
  const streakDays = useSprintStore(s => s.streakDays);
  const discipline = usePetStore(s => s.needBars.discipline);
  const setNeedBars = usePetStore(s => s.setNeedBars);
  const [phase, setPhase] = useState<Phase>('idle');
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [idx, setIdx] = useState(0);

  const start = async () => {
    if (!userId)
      return;
    const qs = await getReviewQuestions(userId, 3);
    if (qs.length === 0)
      return;
    setQuestions(qs);
    setIdx(0);
    setPhase('quiz');
  };

  const onAnswer = (correct: boolean) => {
    const q = questions[idx];
    if (userId && q && q.reviewCount >= 0)
      void recordReview(userId, q, correct).catch(() => {});
    if (idx + 1 < questions.length)
      setIdx(idx + 1);
    else
      setPhase('mirror');
  };

  const onMirrorDone = useCallback(() => {
    if (userId) {
      const next = Math.min(100, discipline + MIRROR_DISCIPLINE_REWARD);
      void updateNeedBars(userId, { discipline: next }).catch(() => {});
      setNeedBars({ discipline: next });
    }
    setPhase('idle');
  }, [userId, discipline, setNeedBars]);

  if (phase === 'mirror') {
    return <MirrorMoment tier={getMirrorTier(discipline)} onDone={onMirrorDone} />;
  }

  if (phase === 'quiz') {
    return (
      <View style={styles.overlay}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{`🔥 ${streakDays}`}</Text>
          <Text style={styles.headerText}>{`${idx + 1}/${questions.length} câu`}</Text>
        </View>
        {questions[idx] && <ReviewQuestionCard question={questions[idx].question} onAnswer={onAnswer} />}
      </View>
    );
  }

  return (
    <Pressable
      style={styles.startBtn}
      onPress={() => void start()}
      accessibilityRole="button"
      accessibilityLabel="Bắt đầu Flash Quiz"
    >
      <Text style={styles.startText}>⚡ Flash Quiz</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  startBtn: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#00897b',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#001a41',
  },
  startText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0f3b38',
    paddingTop: 60,
    paddingHorizontal: 24,
    gap: 20,
    zIndex: 20,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerText: { fontSize: 14, fontWeight: '800', color: '#fff' },
});
