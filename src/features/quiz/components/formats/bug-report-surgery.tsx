import type {
  AnswerResult,
  BugReportField,
  BugReportPlacement,
  BugReportSurgeryQuestion,
} from '../../question-types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { gradeBugReportSurgery } from '../../question-types';

type Props = {
  question: BugReportSurgeryQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Bug Report Surgery (AC2) — tap-to-place: tap mẩu (block) → tap ô (field) để đặt.
 * Tap mẩu đã đặt để gỡ về kho. "Xong" khi đủ field → chấm.
 */
export function BugReportSurgeryView({ question, disabled, onAnswered }: Props) {
  const [placement, setPlacement] = useState<BugReportPlacement>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [committed, setCommitted] = useState(false);

  const placedIds = Object.values(placement).filter(Boolean) as string[];
  const pool = question.blocks.filter(b => !placedIds.includes(b.id));
  const allFilled = question.fields.every(f => placement[f.key]);

  const pickBlock = (id: string) => {
    if (disabled || committed)
      return;
    setSelected(cur => (cur === id ? null : id));
  };

  const placeInField = (field: BugReportField) => {
    if (disabled || committed)
      return;
    if (placement[field]) {
      // gỡ block đang ở field về kho
      setPlacement(p => ({ ...p, [field]: null }));
      return;
    }
    if (!selected)
      return;
    setPlacement(p => ({ ...p, [field]: selected }));
    setSelected(null);
  };

  const handleDone = () => {
    if (disabled || committed || !allFilled)
      return;
    setCommitted(true);
    const answer = question.fields.map(f => `${f.key}:${placement[f.key]}`).join('|');
    onAnswered({ isCorrect: gradeBugReportSurgery(question, placement), answer });
  };

  const blockText = (id: string | null | undefined) =>
    question.blocks.find(b => b.id === id)?.text ?? '';

  const fieldCorrect = (field: BugReportField) => {
    const id = placement[field];
    return !!id && question.blocks.find(b => b.id === id)?.correctField === field;
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      {/* Fields / slots */}
      <View style={styles.fields}>
        {question.fields.map((f) => {
          const filledId = placement[f.key];
          const slotStyle = [
            styles.slot,
            !!filledId && styles.slotFilled,
            committed && fieldCorrect(f.key) && styles.slotCorrect,
            committed && !!filledId && !fieldCorrect(f.key) && styles.slotWrong,
          ];
          return (
            <View key={f.key} style={styles.fieldRow}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <Pressable
                style={slotStyle}
                disabled={disabled || committed}
                onPress={() => placeInField(f.key)}
                accessibilityRole="button"
                accessibilityLabel={`Ô ${f.label}${filledId ? `, đang chứa ${blockText(filledId)}` : ', trống'}`}
              >
                <Text style={styles.slotText}>
                  {filledId ? blockText(filledId) : 'Chạm để đặt mẩu đã chọn'}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Pool of blocks */}
      {pool.length > 0 && !committed && (
        <View style={styles.pool}>
          <Text style={styles.poolTitle}>Các mẩu (chọn rồi đặt vào ô):</Text>
          {pool.map(b => (
            <Pressable
              key={b.id}
              style={[styles.block, selected === b.id && styles.blockSelected]}
              disabled={disabled}
              onPress={() => pickBlock(b.id)}
              accessibilityRole="button"
              accessibilityState={{ selected: selected === b.id }}
            >
              <Text style={styles.blockText}>{b.text}</Text>
            </Pressable>
          ))}
        </View>
      )}

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
  fields: { gap: 10 },
  fieldRow: { gap: 4 },
  fieldLabel: { fontSize: 13, fontWeight: '800', color: '#22b5ff' },
  slot: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#0d1f3d',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#3a5a8c',
    borderStyle: 'dashed',
    padding: 12,
  },
  slotFilled: { backgroundColor: '#002e69', borderStyle: 'solid', borderColor: '#22b5ff' },
  slotCorrect: { borderColor: '#BFFFA1', backgroundColor: '#1e4620' },
  slotWrong: { borderColor: '#ff9999', backgroundColor: '#4a1414' },
  slotText: { fontSize: 13, fontWeight: '600', color: '#cfe0ff' },
  pool: { gap: 8, backgroundColor: '#001230', borderRadius: 12, padding: 12 },
  poolTitle: { fontSize: 12, fontWeight: '700', color: '#8aa6d8' },
  block: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#002e69',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#445',
    padding: 12,
  },
  blockSelected: { borderColor: '#FFB000', backgroundColor: '#1a3a5c' },
  blockText: { fontSize: 13, fontWeight: '700', color: '#fff' },
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
