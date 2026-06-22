import type { ReviewQuestion } from '../sr-questions';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSprintStore } from '@/features/sprint/stores/use-sprint-store';
import { useSessionStore } from '@/stores/session-store';
import { recordReview } from '../sr-api';
import { getReviewQuestions } from '../sr-questions';
import { DailyRecapBubble } from './daily-recap-bubble';
import { ReviewQuestionCard } from './review-question-card';

type Phase = 'idle' | 'session' | 'recap';

/**
 * Bedroom SR session (Story 8.2). "Tắt đèn" → dim lights-out + 1-2 SR câu stripped → Daily Recap.
 */
export function BedroomSession() {
  const userId = useSessionStore(s => s.userId);
  const streakDays = useSprintStore(s => s.streakDays);
  const [phase, setPhase] = useState<Phase>('idle');
  const [questions, setQuestions] = useState<ReviewQuestion[]>([]);
  const [idx, setIdx] = useState(0);

  const startLightsOut = async () => {
    if (!userId) {
      setPhase('recap');
      return;
    }
    const qs = await getReviewQuestions(userId, 2);
    setQuestions(qs);
    setIdx(0);
    setPhase(qs.length > 0 ? 'session' : 'recap');
  };

  const onAnswer = (correct: boolean) => {
    const q = questions[idx];
    if (userId && q && q.reviewCount >= 0)
      void recordReview(userId, q, correct).catch(() => {});
    if (idx + 1 < questions.length)
      setIdx(idx + 1);
    else
      setPhase('recap');
  };

  const onDismissRecap = useCallback(() => setPhase('idle'), []);

  const recapMessage = streakDays > 0
    ? `Ôn tập xong! 🌙 Streak: ${streakDays} ngày 🔥`
    : 'Hôm nay Bugsy chờ mình suốt... 💤 Ngày mai nha!';

  if (phase === 'idle') {
    return (
      <Pressable
        style={styles.lightsBtn}
        onPress={() => void startLightsOut()}
        accessibilityRole="button"
        accessibilityLabel="Tắt đèn đi ngủ"
      >
        <Text style={styles.lightsText}>🌙 Tắt đèn</Text>
      </Pressable>
    );
  }

  return (
    <View style={styles.overlay}>
      <Text style={styles.stars}>✨   ⭐   ✨   ⭐   ✨</Text>
      {phase === 'session' && questions[idx]
        ? <ReviewQuestionCard question={questions[idx].question} onAnswer={onAnswer} />
        : <DailyRecapBubble message={recapMessage} onDismiss={onDismissRecap} />}
    </View>
  );
}

const styles = StyleSheet.create({
  lightsBtn: {
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#5C6BC0',
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#001a41',
  },
  lightsText: { fontSize: 15, fontWeight: '800', color: '#fff' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2a2740',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 28,
    zIndex: 20,
  },
  stars: { fontSize: 20, letterSpacing: 2 },
});
