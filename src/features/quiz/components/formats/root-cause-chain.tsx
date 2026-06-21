import type { AnswerResult, RootCauseChainQuestion } from '../../question-types';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { gradeRootCauseChain } from '../../question-types';

type Props = {
  question: RootCauseChainQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Root Cause Chain (AC3) — tap event cards theo thứ tự nhân–quả (tap-to-order, không drag).
 * Tap card đã xếp để gỡ. "Xong" → chấm; vị trí sai → highlight đỏ.
 */
export function RootCauseChainView({ question, disabled, onAnswered }: Props) {
  const [order, setOrder] = useState<string[]>([]);
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const pool = question.events.filter(e => !order.includes(e.id));
  const allPlaced = order.length === question.events.length;

  const add = (id: string) => {
    if (disabled || committed)
      return;
    setOrder(o => [...o, id]);
  };
  const remove = (id: string) => {
    if (disabled || committed)
      return;
    setOrder(o => o.filter(x => x !== id));
  };

  const handleDone = () => {
    if (committedRef.current || disabled || !allPlaced)
      return;
    committedRef.current = true;
    setCommitted(true);
    onAnswered({ isCorrect: gradeRootCauseChain(question, order), answer: order.join('>') });
  };

  const text = (id: string) => question.events.find(e => e.id === id)?.text ?? '';

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.chain}>
        <Text style={styles.areaTitle}>🔗 Chuỗi nhân–quả (chạm để gỡ):</Text>
        {order.length === 0 && <Text style={styles.empty}>Chạm các sự kiện bên dưới theo thứ tự…</Text>}
        {order.map((id, i) => {
          const posOk = committed && question.correctOrder[i] === id;
          const posBad = committed && question.correctOrder[i] !== id;
          return (
            <Pressable
              key={id}
              style={[styles.placed, posOk && styles.placedOk, posBad && styles.placedBad]}
              disabled={disabled || committed}
              onPress={() => remove(id)}
              accessibilityRole="button"
              accessibilityLabel={`Bước ${i + 1}: ${text(id)}`}
            >
              <Text style={styles.placedNum}>{i + 1}</Text>
              <Text style={styles.placedText}>{text(id)}</Text>
            </Pressable>
          );
        })}
      </View>

      {pool.length > 0 && !committed && (
        <View style={styles.pool}>
          {pool.map(e => (
            <Pressable
              key={e.id}
              style={styles.card}
              disabled={disabled}
              onPress={() => add(e.id)}
              accessibilityRole="button"
            >
              <Text style={styles.cardText}>{e.text}</Text>
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
  chain: { gap: 8, minHeight: 60 },
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
  placedOk: { borderColor: '#BFFFA1', backgroundColor: '#1e4620' },
  placedBad: { borderColor: '#ff9999', backgroundColor: '#4a1414' },
  placedNum: { fontSize: 14, fontWeight: '900', color: '#22b5ff' },
  placedText: { flex: 1, fontSize: 13, fontWeight: '700', color: '#fff' },
  pool: { gap: 8, backgroundColor: '#001230', borderRadius: 12, padding: 12 },
  card: {
    minHeight: 44,
    justifyContent: 'center',
    backgroundColor: '#002e69',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#445',
    padding: 12,
  },
  cardText: { fontSize: 13, fontWeight: '700', color: '#fff' },
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
