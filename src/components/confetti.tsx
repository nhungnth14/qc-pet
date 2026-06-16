import { useEffect, useState } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/** 4 màu confetti CỐ ĐỊNH (project-context / UX-DR19) — không thêm màu khác. */
const COLORS = ['#22b5ff', '#fd9d89', '#b59cff', '#8ce68c'] as const;
const COUNT = 50;

type PieceSpec = {
  startX: number;
  driftX: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  rotateTo: number;
};

function ConfettiPiece({ spec, height }: { spec: PieceSpec; height: number }) {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: spec.duration,
      easing: Easing.linear,
    });
  }, [progress, spec.duration]);

  const style = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: spec.driftX * p },
        { translateY: -20 + (height + 60) * p },
        { rotate: `${spec.rotateTo * p}deg` },
      ],
      opacity: p < 0.85 ? 1 : (1 - p) / 0.15,
    };
  });

  return (
    <Animated.View
      style={[
        styles.piece,
        { left: spec.startX, width: spec.size, height: spec.size * 1.4, backgroundColor: spec.color },
        style,
      ]}
    />
  );
}

/**
 * Confetti — chỉ trigger khi ĐÚNG (parent quyết định mount/unmount). 50 pieces,
 * 4 màu cố định, tự rơi 1–3s rồi `onDone`. Dùng chung cho quiz + Epic 6 reward.
 * `pointerEvents="none"` — không chặn tương tác bên dưới.
 */
export function Confetti({ onDone }: { onDone?: () => void }) {
  const { width, height } = useWindowDimensions();

  // Random sinh 1 lần qua lazy initializer (mỗi lần mount Confetti = 1 bộ mới).
  const [pieces] = useState<PieceSpec[]>(() =>
    Array.from({ length: COUNT }, (_, i) => ({
      startX: Math.random() * width,
      driftX: (Math.random() - 0.5) * 120,
      delay: Math.random() * 300,
      duration: 1000 + Math.random() * 2000,
      size: 6 + Math.random() * 6,
      color: COLORS[i % COLORS.length],
      rotateTo: (Math.random() - 0.5) * 1440,
    })),
  );

  useEffect(() => {
    const t = setTimeout(() => onDone?.(), 3200);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {pieces.map((spec, i) => (
        <ConfettiPiece key={i} spec={spec} height={height} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: { position: 'absolute', top: 0, borderRadius: 2 },
});
