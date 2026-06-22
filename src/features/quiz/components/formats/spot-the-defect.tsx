import type { AnswerResult, SpotTheDefectQuestion } from '../../question-types';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { gradeSpotTheDefect } from '../../question-types';

type Props = {
  question: SpotTheDefectQuestion;
  disabled: boolean;
  onAnswered: (result: AnswerResult) => void;
};

type ZoneProps = {
  zone: SpotTheDefectQuestion['zones'][number];
  isTapped: boolean;
  committed: boolean;
  disabled: boolean;
  onToggle: (id: string) => void;
};

function ZoneItem({ zone: z, isTapped, committed, disabled, onToggle }: ZoneProps) {
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  useEffect(() => {
    if (committed && isTapped && !z.isDefect) {
      // eslint-disable-next-line react-hooks/immutability
      shakeX.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-6, { duration: 50 }),
        withTiming(6, { duration: 50 }),
        withTiming(0, { duration: 50 }),
      );
    }
  }, [committed, isTapped, z.isDefect, shakeX]);

  return (
    <Animated.View
      style={[
        styles.zoneWrapper,
        { left: `${z.x}%` as const, top: `${z.y}%` as const, width: `${z.w}%` as const, height: `${z.h}%` as const },
        shakeStyle,
      ]}
    >
      <Pressable
        style={[
          styles.zone,
          isTapped && !committed && styles.zoneTapped,
          committed && z.isDefect && styles.zoneDefect,
          committed && isTapped && !z.isDefect && styles.zoneWrong,
          { flex: 1 },
        ]}
        disabled={disabled || committed}
        onPress={() => onToggle(z.id)}
        accessibilityRole="button"
        accessibilityLabel={z.label}
        accessibilityState={{ selected: isTapped }}
      >
        <Text style={styles.zoneLabel} numberOfLines={2}>{z.label}</Text>
      </Pressable>
    </Animated.View>
  );
}

/**
 * Spot the Defect (AC4) — tap vùng có lỗi trên mockup (Pressable zones theo %),
 * hỗ trợ multi-defect, commit bằng "Xong". KHÔNG dùng Skia (Resolved Decision #2).
 * Sai → shake + màu đỏ (AC4 + AC6).
 */
export function SpotTheDefectView({ question, disabled, onAnswered }: Props) {
  const [tapped, setTapped] = useState<string[]>([]);
  const [committed, setCommitted] = useState(false);
  const committedRef = useRef(false);

  const toggleZone = (id: string) => {
    if (disabled || committed)
      return;
    setTapped(prev => (prev.includes(id) ? prev.filter(z => z !== id) : [...prev, id]));
  };

  const handleDone = () => {
    if (committedRef.current || disabled || tapped.length === 0)
      return;
    committedRef.current = true;
    setCommitted(true);
    onAnswered({ isCorrect: gradeSpotTheDefect(question, tapped), answer: tapped.join(',') });
  };

  return (
    <View style={styles.wrap}>
      <Text style={styles.prompt}>{question.prompt}</Text>

      <View style={styles.scene}>
        <Text style={styles.sceneCaption}>
          🖼️
          {question.sceneLabel}
        </Text>
        {question.zones.map(z => (
          <ZoneItem
            key={z.id}
            zone={z}
            isTapped={tapped.includes(z.id)}
            committed={committed}
            disabled={disabled}
            onToggle={toggleZone}
          />
        ))}
      </View>

      {!committed && (
        <Pressable
          style={[styles.doneBtn, tapped.length === 0 && styles.doneBtnDisabled]}
          disabled={disabled || tapped.length === 0}
          onPress={handleDone}
          accessibilityRole="button"
        >
          <Text style={styles.doneText}>
            Xong ✓ (
            {tapped.length}
            {' '}
            đã chọn)
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  prompt: { fontSize: 16, fontWeight: '800', color: '#fff' },
  scene: {
    height: 320,
    backgroundColor: '#0d1f3d',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#22b5ff',
    overflow: 'hidden',
  },
  sceneCaption: { position: 'absolute', top: 8, left: 10, right: 10, fontSize: 11, color: '#6a8bc0', fontWeight: '600' },
  zoneWrapper: { position: 'absolute' },
  zone: {
    borderWidth: 2,
    borderColor: '#3a5a8c',
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: 'rgba(34,181,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  zoneTapped: { borderColor: '#22b5ff', borderStyle: 'solid', backgroundColor: 'rgba(34,181,255,0.3)' },
  zoneDefect: { borderColor: '#BFFFA1', borderStyle: 'solid', backgroundColor: 'rgba(45,122,45,0.5)' },
  zoneWrong: { borderColor: '#ff9999', borderStyle: 'solid', backgroundColor: 'rgba(186,26,26,0.5)' },
  zoneLabel: { fontSize: 12, fontWeight: '700', color: '#cfe0ff', textAlign: 'center' },
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
