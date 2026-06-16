import type { AnswerResult, RewriteTheFailQuestion } from '../../question-types';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { gradeRewriteTheFail } from '../../question-types';

type Props = {
  question: RewriteTheFailQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Rewrite the Fail (AC5) — tap mẩu theo thứ tự để ghép thành test case "tốt".
 * Tap mẩu đã xếp để gỡ. "Xong" khi xếp đủ → chấm theo đúng thứ tự.
 */
export function RewriteTheFailView({ question, disabled, onAnswered }: Props) {
  const [order, setOrder] = useState<string[]>([]);
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const pool = question.blocks.filter(b => !order.includes(b.id));
  const allPlaced = order.length === question.blocks.length;

  const addBlock = (id: string) => {
    if (disabled || committed)
      return;
    setOrder(o => [...o, id]);
  };
  const removeBlock = (id: string) => {
    if (disabled || committed)
      return;
    setOrder(o => o.filter(x => x !== id));
  };

  const handleDone = () => {
    if (committedRef.current || disabled || !allPlaced)
      return;
    committedRef.current = true;
    setCommitted(true);
    onAnswered({ isCorrect: gradeRewriteTheFail(question, order), answer: order.join('>') });
  };

  const blockText = (id: string) => question.blocks.find(b => b.id === id)?.text ?? '';

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.badCard}>
        <Text style={styles.badLabel}>❌ Test case hiện tại</Text>
        <Text style={styles.badText}>{question.badText}</Text>
      </View>

      {/* Ordered slots */}
      <View style={styles.answerArea}>
        <Text style={styles.areaTitle}>✍️ Câu trả lời của bạn (chạm để gỡ):</Text>
        {order.length === 0 && <Text style={styles.empty}>Chạm các mẩu bên dưới theo thứ tự…</Text>}
        {order.map((id, i) => {
          const posCorrect = committed && question.correctOrder[i] === id;
          const posWrong = committed && question.correctOrder[i] !== id;
          return (
            <Pressable
              key={id}
              style={[styles.placed, posCorrect && styles.placedCorrect, posWrong && styles.placedWrong]}
              disabled={disabled || committed}
              onPress={() => removeBlock(id)}
              accessibilityRole="button"
              accessibilityLabel={`Mẩu thứ ${i + 1}: ${blockText(id)}`}
            >
              <Text style={styles.placedNum}>{i + 1}</Text>
              <Text style={styles.placedText}>{blockText(id)}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Pool */}
      {pool.length > 0 && !committed && (
        <View style={styles.pool}>
          {pool.map(b => (
            <Pressable
              key={b.id}
              style={styles.block}
              disabled={disabled}
              onPress={() => addBlock(b.id)}
              accessibilityRole="button"
            >
              <Text style={styles.blockText}>{b.text}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {!committed && (
        <Pressable
          style={[styles.doneBtn, !allPlaced && styles.doneBtnDisabled]}
          disabled={disabled || !allPlaced}
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
  badCard: { backgroundColor: '#4a1414', borderRadius: 12, borderWidth: 2, borderColor: '#ba1a1a', padding: 14, gap: 4 },
  badLabel: { fontSize: 12, fontWeight: '700', color: '#ff9999' },
  badText: { fontSize: 14, fontWeight: '600', color: '#ffd5d5', fontStyle: 'italic' },
  answerArea: { gap: 8, minHeight: 60 },
  areaTitle: { fontSize: 13, fontWeight: '800', color: '#22b5ff' },
  empty: { fontSize: 13, color: '#6a8bc0', fontStyle: 'italic' },
  placed: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#002e69',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#22b5ff',
    padding: 12,
  },
  placedCorrect: { borderColor: '#BFFFA1', backgroundColor: '#1e4620' },
  placedWrong: { borderColor: '#ff9999', backgroundColor: '#4a1414' },
  placedNum: { fontSize: 14, fontWeight: '900', color: '#22b5ff' },
  placedText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#fff' },
  pool: { gap: 8, backgroundColor: '#001230', borderRadius: 12, padding: 12 },
  block: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#002e69',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#445',
    padding: 12,
  },
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
