import type { AnswerResult, RiskRadarQuestion } from '../../question-types';
import { useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { gradeRiskRadar } from '../../question-types';

type Props = {
  question: RiskRadarQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

/**
 * Risk Radar (AC4) — tap feature cards theo thứ tự risk (đầu = cao nhất). Partial credit:
 * ≥70% vị trí đúng → đúng. "Xong" → chấm; hiện tỉ lệ.
 */
export function RiskRadarView({ question, disabled, onAnswered }: Props) {
  const [ranking, setRanking] = useState<string[]>([]);
  const [committed, setCommitted] = useState(false);
  const [ratio, setRatio] = useState(0);
  const committedRef = useRef(false);

  const pool = question.items.filter(it => !ranking.includes(it.id));
  const allRanked = ranking.length === question.items.length;

  const add = (id: string) => {
    if (disabled || committed)
      return;
    setRanking(r => [...r, id]);
  };
  const remove = (id: string) => {
    if (disabled || committed)
      return;
    setRanking(r => r.filter(x => x !== id));
  };

  const handleDone = () => {
    if (committedRef.current || disabled || !allRanked)
      return;
    committedRef.current = true;
    const result = gradeRiskRadar(question, ranking);
    setRatio(result.ratio);
    setCommitted(true);
    onAnswered({ isCorrect: result.isCorrect, answer: ranking.join('>') });
  };

  const text = (id: string) => question.items.find(it => it.id === id)?.text ?? '';

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.rankArea}>
        <Text style={styles.areaTitle}>📊 Xếp hạng risk (cao → thấp, chạm để gỡ):</Text>
        {ranking.length === 0 && <Text style={styles.empty}>Chạm feature bên dưới, cao nhất trước…</Text>}
        {ranking.map((id, i) => {
          const posOk = committed && question.correctRanking[i] === id;
          const posBad = committed && question.correctRanking[i] !== id;
          return (
            <Pressable
              key={id}
              style={[styles.placed, posOk && styles.placedOk, posBad && styles.placedBad]}
              disabled={disabled || committed}
              onPress={() => remove(id)}
              accessibilityRole="button"
              accessibilityLabel={`Hạng ${i + 1}: ${text(id)}`}
            >
              <Text style={styles.placedNum}>
                #
                {i + 1}
              </Text>
              <Text style={styles.placedText}>{text(id)}</Text>
            </Pressable>
          );
        })}
      </View>

      {committed && (
        <Text style={styles.ratio}>{`Đúng ${Math.round(ratio * 100)}% vị trí`}</Text>
      )}

      {pool.length > 0 && !committed && (
        <View style={styles.pool}>
          {pool.map(it => (
            <Pressable
              key={it.id}
              style={styles.card}
              disabled={disabled}
              onPress={() => add(it.id)}
              accessibilityRole="button"
            >
              <Text style={styles.cardText}>{it.text}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {!committed && (
        <Pressable
          style={[styles.doneBtn, !allRanked && styles.doneBtnDisabled]}
          disabled={disabled || !allRanked}
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
  rankArea: { gap: 8, minHeight: 60 },
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
  ratio: { fontSize: 14, fontWeight: '800', color: '#22b5ff', textAlign: 'center' },
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
