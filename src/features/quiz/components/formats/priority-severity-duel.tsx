import type { AnswerResult, DuelAxis, PrioritySeverityDuelQuestion } from '../../question-types';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { gradePrioritySeverityDuel } from '../../question-types';

type Props = {
  question: PrioritySeverityDuelQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

type Cell = { priority: DuelAxis; severity: DuelAxis; label: string };

// 2×2: hàng trên = Severity High, hàng dưới = Severity Low; cột trái = Priority Low, phải = High.
const ROWS: Cell[][] = [
  [
    { severity: 'high', priority: 'low', label: 'Sev High · Pri Low' },
    { severity: 'high', priority: 'high', label: 'Sev High · Pri High' },
  ],
  [
    { severity: 'low', priority: 'low', label: 'Sev Low · Pri Low' },
    { severity: 'low', priority: 'high', label: 'Sev Low · Pri High' },
  ],
];

/**
 * Priority×Severity Duel (AC1) — tap đúng quadrant (Resolved Decision: tap-to-place, không
 * 2-axis drag). Bug card trên cùng; ma trận 2×2; "Xong" → chấm; highlight quadrant đúng/sai.
 */
export function PrioritySeverityDuelView({ question, disabled, onAnswered }: Props) {
  const [chosen, setChosen] = useState<Cell | null>(null);
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const pick = (c: Cell) => {
    if (disabled || committed)
      return;
    setChosen(c);
  };

  const handleDone = () => {
    if (committedRef.current || disabled || !chosen)
      return;
    committedRef.current = true;
    setCommitted(true);
    onAnswered({
      isCorrect: gradePrioritySeverityDuel(question, chosen.priority, chosen.severity),
      answer: `${chosen.priority}/${chosen.severity}`,
    });
  };

  const isCorrectCell = (c: Cell) =>
    c.priority === question.correctPriority && c.severity === question.correctSeverity;

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.bugCard}>
        <Text style={styles.bugLabel}>🐞 Bug</Text>
        <Text style={styles.bugText}>{question.bugDescription}</Text>
      </View>

      <Text style={styles.axisHint}>↑ Severity cao · → Priority cao</Text>
      <View style={styles.matrix}>
        {ROWS.map((row, ri) => (
          <View key={ri} style={styles.row}>
            {row.map((c) => {
              const sel = chosen?.priority === c.priority && chosen?.severity === c.severity;
              const cellStyle = [
                styles.cell,
                sel && !committed && styles.cellSel,
                committed && isCorrectCell(c) && styles.cellCorrect,
                committed && sel && !isCorrectCell(c) && styles.cellWrong,
              ];
              return (
                <Pressable
                  key={c.label}
                  style={cellStyle}
                  disabled={disabled || committed}
                  onPress={() => pick(c)}
                  accessibilityRole="button"
                  accessibilityLabel={c.label}
                  accessibilityState={{ selected: sel }}
                >
                  <Text style={styles.cellText}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      {!committed && (
        <Pressable
          style={[styles.doneBtn, !chosen && styles.doneBtnDisabled]}
          disabled={disabled || !chosen}
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
  bugCard: { backgroundColor: '#fff', borderRadius: 14, borderWidth: 3, borderColor: '#22b5ff', padding: 16, gap: 6 },
  bugLabel: { fontSize: 13, fontWeight: '700', color: '#888' },
  bugText: { fontSize: 15, fontWeight: '700', color: '#001a41', lineHeight: 22 },
  axisHint: { fontSize: 12, fontWeight: '600', color: '#22b5ff', textAlign: 'center' },
  matrix: { gap: 10 },
  row: { flexDirection: 'row', gap: 10 },
  cell: {
    flex: 1,
    minHeight: 70,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002e69',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#445',
    padding: 10,
  },
  cellSel: { borderColor: '#FFB000', backgroundColor: '#1a3a5c' },
  cellCorrect: { borderColor: '#BFFFA1', backgroundColor: '#1e4620' },
  cellWrong: { borderColor: '#ff9999', backgroundColor: '#4a1414' },
  cellText: { fontSize: 13, fontWeight: '800', color: '#fff', textAlign: 'center' },
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
