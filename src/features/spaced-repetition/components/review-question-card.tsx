import type { LessonQuestion } from '@/features/content/lesson-types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type ReviewQuestionCardProps = {
  question: LessonQuestion;
  onAnswer: (correct: boolean) => void;
};

const FEEDBACK_MS = 600;

/**
 * Stripped review question (Story 8.2/8.3 shared). Chỉ question_text + options + instant feedback
 * (lime đúng / error sai). KHÔNG scenario card, category badge, hint, story-rule.
 */
export function ReviewQuestionCard({ question, onAnswer }: ReviewQuestionCardProps) {
  const [selected, setSelected] = useState<string | null>(null);

  const onSelect = (option: string) => {
    if (selected !== null)
      return;
    setSelected(option);
    const correct = option === question.correct_answer;
    setTimeout(() => {
      setSelected(null);
      onAnswer(correct);
    }, FEEDBACK_MS);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.q}>{question.question_text}</Text>
      {question.options.map((o) => {
        const answered = selected !== null;
        const isCorrect = o === question.correct_answer;
        const showState = answered && (selected === o || isCorrect);
        return (
          <Pressable
            key={o}
            style={[styles.opt, showState && (isCorrect ? styles.optCorrect : styles.optWrong)]}
            onPress={() => onSelect(o)}
            disabled={answered}
            accessibilityRole="button"
            accessibilityLabel={o}
          >
            <Text style={[styles.optText, showState && styles.optTextActive]}>{o}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 10, alignSelf: 'stretch' },
  q: { fontSize: 16, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 4 },
  opt: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
  },
  optCorrect: { backgroundColor: '#aef0a0', borderColor: '#2e7d32' },
  optWrong: { backgroundColor: '#ffc9c9', borderColor: '#ba1a1a' },
  optText: { fontSize: 14, fontWeight: '700', color: '#001a41' },
  optTextActive: { color: '#001a41' },
});
