import type {
  AnswerResult,
  CompleteTestCaseQuestion,
  TestCaseField,
  TestCaseFilled,
} from '../../question-types';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { gradeCompleteTestCase, gradeField } from '../../question-types';

type Props = {
  question: CompleteTestCaseQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Complete the Test Case (AC5) — điền field trống (Precondition, Expected Result). Chấm bằng
 * keyword match (case-insensitive, MVP — LLM Phase 2). "Xong" → chấm; highlight field đúng/sai.
 */
export function CompleteTestCaseView({ question, disabled, onAnswered }: Props) {
  const [filled, setFilled] = useState<TestCaseFilled>({});
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const allFilled = question.fields.every(f => (filled[f.key] ?? '').trim().length > 0);

  const setField = (key: string, value: string) => {
    if (disabled || committed)
      return;
    setFilled(prev => ({ ...prev, [key]: value }));
  };

  const handleDone = () => {
    if (committedRef.current || disabled || !allFilled)
      return;
    committedRef.current = true;
    setCommitted(true);
    const answer = question.fields.map(f => `${f.key}:${(filled[f.key] ?? '').trim()}`).join('|');
    onAnswered({ isCorrect: gradeCompleteTestCase(question, filled), answer });
  };

  const fieldOk = (f: TestCaseField) => gradeField(f, filled);

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      {question.fields.map((f) => {
        const ok = committed && fieldOk(f);
        const bad = committed && !fieldOk(f);
        return (
          <View key={f.key} style={styles.fieldRow}>
            <Text style={styles.fieldLabel}>{f.label}</Text>
            <TextInput
              style={[styles.input, ok && styles.inputOk, bad && styles.inputBad]}
              placeholder="Điền vào đây…"
              placeholderTextColor="#6a8bc0"
              value={filled[f.key] ?? ''}
              onChangeText={t => setField(f.key, t)}
              editable={!disabled && !committed}
              multiline
              accessibilityLabel={`Ô ${f.label}`}
            />
          </View>
        );
      })}

      {!committed && (
        <Pressable
          style={[styles.doneBtn, !allFilled && styles.doneBtnDisabled]}
          disabled={disabled || !allFilled}
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
  fieldRow: { gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '800', color: '#22b5ff' },
  input: {
    minHeight: 48,
    backgroundColor: '#0d1f3d',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a5a8c',
    padding: 12,
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlignVertical: 'top',
  },
  inputOk: { borderColor: '#BFFFA1' },
  inputBad: { borderColor: '#ff9999' },
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
