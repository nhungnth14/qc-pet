import type { AnswerResult, McqQuestion } from '../../question-types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { gradeMcq } from '../../question-types';

type Props = {
  question: McqQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/** MCQ — tap 1 option → highlight tức thì + emit kết quả (AC1). */
export function McqQuestionView({ question, disabled, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  const handlePick = (i: number) => {
    if (disabled || selected !== null)
      return;
    setSelected(i);
    onAnswered({ isCorrect: gradeMcq(question, i), answer: String(i) });
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.card}>
        <Text style={styles.prompt}>{question.prompt}</Text>
      </View>
      <View style={styles.options}>
        {question.options.map((opt, i) => {
          const answered = selected !== null;
          const isSel = selected === i;
          const isCorrect = question.correctIndex === i;
          const optStyle = [
            styles.opt,
            answered && isSel && isCorrect && styles.optCorrect,
            answered && isSel && !isCorrect && styles.optWrong,
            answered && !isSel && isCorrect && styles.optHint,
          ];
          return (
            <Pressable
              key={i}
              style={optStyle}
              disabled={disabled || answered}
              onPress={() => handlePick(i)}
              accessibilityRole="button"
              accessibilityState={{ disabled: disabled || answered, selected: isSel }}
            >
              <Text style={styles.optText}>{opt}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#22b5ff',
    padding: 20,
  },
  prompt: { fontSize: 17, fontWeight: '800', color: '#001a41', lineHeight: 24 },
  options: { gap: 12 },
  opt: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#002e69',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334',
    padding: 16,
  },
  optCorrect: { backgroundColor: '#2d7a2d', borderColor: '#BFFFA1' },
  optWrong: { backgroundColor: '#ba1a1a', borderColor: '#ff9999' },
  optHint: { borderColor: '#BFFFA1' },
  optText: { fontSize: 15, fontWeight: '700', color: '#fff' },
});
