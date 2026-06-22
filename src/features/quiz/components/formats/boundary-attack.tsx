import type { AnswerResult, BoundaryAttackQuestion } from '../../question-types';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { gradeBoundaryAttack } from '../../question-types';

type Props = {
  question: BoundaryAttackQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Boundary Attack (AC2) — nhập các test value (boundary). "Xong" → chấm; thiếu → hiện
 * "Bạn bỏ sót: …". Phân tách value bằng dấu phẩy/space/chấm phẩy.
 */
export function BoundaryAttackView({ question, disabled, onAnswered }: Props) {
  const [input, setInput] = useState('');
  const [committed, setCommitted] = useState(false);
  const [missing, setMissing] = useState<string[]>([]);
  const committedRef = useRef(false);

  const handleDone = () => {
    if (committedRef.current || disabled || input.trim().length === 0)
      return;
    committedRef.current = true;
    const result = gradeBoundaryAttack(question, input);
    setMissing(result.missing);
    setCommitted(true);
    onAnswered({ isCorrect: result.isCorrect, answer: input.trim() });
  };

  const isCorrect = committed && missing.length === 0;

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.scenarioCard}>
        <Text style={styles.scenarioText}>{question.scenario}</Text>
      </View>

      <TextInput
        style={[styles.input, committed && (isCorrect ? styles.inputCorrect : styles.inputWrong)]}
        placeholder="Nhập các giá trị, cách nhau bằng dấu phẩy…"
        placeholderTextColor="#6a8bc0"
        value={input}
        onChangeText={setInput}
        editable={!disabled && !committed}
        multiline
        accessibilityLabel="Ô nhập boundary values"
      />

      {committed && (
        <Text style={[styles.feedback, isCorrect ? styles.feedbackOk : styles.feedbackMiss]}>
          {isCorrect ? '✅ Đủ rồi! Bạn bắt hết boundary.' : `⚠️ Bạn bỏ sót: ${missing.join(', ')}`}
        </Text>
      )}

      {!committed && (
        <Pressable
          style={[styles.doneBtn, input.trim().length === 0 && styles.doneBtnDisabled]}
          disabled={disabled || input.trim().length === 0}
          onPress={handleDone}
          accessibilityRole="button"
        >
          <Text style={styles.doneText}>Xong ✓</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 14 },
  prompt: { fontSize: 16, fontWeight: '800', color: '#fff' },
  scenarioCard: { backgroundColor: '#002e69', borderRadius: 12, borderWidth: 2, borderColor: '#22b5ff', padding: 14 },
  scenarioText: { fontSize: 14, fontWeight: '600', color: '#cfe0ff', lineHeight: 21 },
  input: {
    minHeight: 60,
    backgroundColor: '#0d1f3d',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a5a8c',
    padding: 12,
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    textAlignVertical: 'top',
  },
  inputCorrect: { borderColor: '#BFFFA1' },
  inputWrong: { borderColor: '#ff9999' },
  feedback: { fontSize: 14, fontWeight: '700', lineHeight: 20 },
  feedbackOk: { color: '#BFFFA1' },
  feedbackMiss: { color: '#ff9999' },
  doneBtn: {
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#22b5ff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#001a41',
    padding: 14,
  },
  doneBtnDisabled: { backgroundColor: '#445', borderColor: '#334' },
  doneText: { fontSize: 15, fontWeight: '800', color: '#001a41' },
});
