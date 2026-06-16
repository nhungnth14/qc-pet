import type { AnswerResult, SeverityLevel, SeveritySwipeQuestion } from '../../question-types';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { gradeSeveritySwipe } from '../../question-types';

type Props = {
  question: SeveritySwipeQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

const THRESHOLD = 80;

const LEVELS: { sev: SeverityLevel; label: string; arrow: string }[] = [
  { sev: 'low', label: 'Low', arrow: '←' },
  { sev: 'medium', label: 'Medium', arrow: '↑' },
  { sev: 'high', label: 'High', arrow: '→' },
  { sev: 'critical', label: 'Critical', arrow: '↓' },
];

/** No-op tạm (Resolved Decision #2): chưa cài expo-haptics. Story sau nối haptic thật. */
function triggerHaptic() {}

/**
 * Severity Swipe (AC3) — vuốt: trái=Low, lên=Medium, phải=High, xuống=Critical.
 * Kèm 4 nút (a11y + verify trên web vì Pan gesture không chạy đầy đủ ở web).
 */
export function SeveritySwipeView({ question, disabled, onAnswered }: Props) {
  const [chosen, setChosen] = useState<SeverityLevel | null>(null);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);

  const commit = (sev: SeverityLevel) => {
    if (disabled || chosen)
      return;
    triggerHaptic();
    setChosen(sev);
    onAnswered({ isCorrect: gradeSeveritySwipe(question, sev), answer: sev });
  };

  const pan = Gesture.Pan()
    .enabled(!disabled && !chosen)
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      const ax = Math.abs(e.translationX);
      const ay = Math.abs(e.translationY);
      let sev: SeverityLevel | null = null;
      if (ax > ay && ax > THRESHOLD)
        sev = e.translationX < 0 ? 'low' : 'high';
      else if (ay >= ax && ay > THRESHOLD)
        sev = e.translationY < 0 ? 'medium' : 'critical';
      if (sev)
        runOnJS(commit)(sev);
      tx.value = withSpring(0);
      ty.value = withSpring(0);
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }],
  }));

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.card, cardStyle]}>
          <Text style={styles.cardLabel}>🐞 Bug</Text>
          <Text style={styles.cardText}>{question.bugDescription}</Text>
          <Text style={styles.hint}>Vuốt theo hướng mức độ — hoặc bấm nút bên dưới</Text>
        </Animated.View>
      </GestureDetector>

      <View style={styles.btnRow}>
        {LEVELS.map(({ sev, label, arrow }) => {
          const isChosen = chosen === sev;
          const isCorrect = question.correctSeverity === sev;
          const btnStyle = [
            styles.btn,
            chosen && isChosen && isCorrect && styles.btnCorrect,
            chosen && isChosen && !isCorrect && styles.btnWrong,
            chosen && !isChosen && isCorrect && styles.btnHint,
          ];
          return (
            <Pressable
              key={sev}
              style={btnStyle}
              disabled={disabled || !!chosen}
              onPress={() => commit(sev)}
              accessibilityRole="button"
              accessibilityLabel={`Phân loại mức độ ${label}`}
            >
              <Text style={styles.btnText}>
                {arrow}
                {' '}
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  prompt: { fontSize: 16, fontWeight: '800', color: '#fff', textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#22b5ff',
    padding: 20,
    gap: 10,
  },
  cardLabel: { fontSize: 13, fontWeight: '700', color: '#888' },
  cardText: { fontSize: 16, fontWeight: '700', color: '#001a41', lineHeight: 23 },
  hint: { fontSize: 12, fontWeight: '600', color: '#22b5ff', marginTop: 4 },
  btnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  btn: {
    minHeight: 44,
    minWidth: 110,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002e69',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#334',
    paddingHorizontal: 16,
  },
  btnCorrect: { backgroundColor: '#2d7a2d', borderColor: '#BFFFA1' },
  btnWrong: { backgroundColor: '#ba1a1a', borderColor: '#ff9999' },
  btnHint: { borderColor: '#BFFFA1' },
  btnText: { fontSize: 15, fontWeight: '800', color: '#fff' },
});
