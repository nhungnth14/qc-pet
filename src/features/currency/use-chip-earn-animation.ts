import { useEffect, useRef, useState } from 'react';
import {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const TICK_MS = 800;

/**
 * Hook earn-animation cho 1 currency chip (Story 6.3 — generalize từ 6.2 BC sang BC+QP).
 * Trả về: `shown` (số hiển thị, tween khi đang animate), `floatText` ("+N"), style bounce/float,
 * và `trigger(from,to,amount)` chạy bounce + "+N" float + counter tick-up `from→to` 800ms.
 *
 * react-compiler-safe: mọi setState/shared-value chạy trong rAF/setTimeout (event-driven),
 * caller gọi `trigger` qua requestAnimationFrame (ngoài effect body).
 */
export function useChipEarnAnimation(currentValue: number) {
  const [tween, setTween] = useState<number | null>(null);
  const [floatText, setFloatText] = useState<string | null>(null);
  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);
  const floatOpacity = useSharedValue(0);
  const rafRef = useRef<number | null>(null);
  const floatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function trigger(from: number, to: number, amount: number) {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (floatTimer.current != null) {
      clearTimeout(floatTimer.current);
      floatTimer.current = null;
    }
    scale.value = withSequence(
      withTiming(1.25, { duration: 150 }),
      withSpring(1, { damping: 6, stiffness: 180 }),
    );
    setFloatText(`+${amount}`);
    floatY.value = 0;
    floatOpacity.value = 1;
    floatY.value = withTiming(-44, { duration: TICK_MS });
    floatOpacity.value = withDelay(TICK_MS - 350, withTiming(0, { duration: 350 }));
    floatTimer.current = setTimeout(() => setFloatText(null), TICK_MS + 100);
    const start = Date.now();
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / TICK_MS);
      setTween(Math.round(from + (to - from) * t));
      if (t < 1)
        rafRef.current = requestAnimationFrame(step);
      else
        setTween(null);
    };
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => () => {
    if (rafRef.current != null)
      cancelAnimationFrame(rafRef.current);
    if (floatTimer.current != null)
      clearTimeout(floatTimer.current);
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const floatStyle = useAnimatedStyle(() => ({
    opacity: floatOpacity.value,
    transform: [{ translateY: floatY.value }],
  }));

  return { shown: tween ?? currentValue, floatText, bounceStyle, floatStyle, trigger };
}
