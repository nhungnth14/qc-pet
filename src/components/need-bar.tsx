import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { Text } from '@/components/ui/text';

type Props = {
  label: string;
  value: number; // 0–100
  /** Class màu fill, vd `bg-need-hunger`. Mặc định qp-teal. */
  fillClassName?: string;
  className?: string;
};

const SHIMMER_WIDTH = 48;

/**
 * NeedBarComponent — thanh Need Bar dùng chung. value clamp 0–100; màu fill qua token (`bg-need-*`).
 * Story 4-1: shimmer sweep trên fill + pulse error color khi value ≤ 29% (critical).
 */
export function NeedBarComponent({ label, value, fillClassName = 'bg-qp-teal', className = '' }: Props) {
  const pct = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const isCritical = pct <= 29;
  const [trackWidth, setTrackWidth] = useState(0);
  const shimmerX = useSharedValue(-SHIMMER_WIDTH);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (trackWidth <= 0)
      return;
    shimmerX.value = withRepeat(
      withTiming(trackWidth, { duration: 1600, easing: Easing.linear }),
      -1,
      false,
    );
    return () => cancelAnimation(shimmerX);
  }, [trackWidth, shimmerX]);

  useEffect(() => {
    if (isCritical) {
      pulse.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
    }
    else {
      cancelAnimation(pulse);
      pulse.value = 0;
    }
    return () => cancelAnimation(pulse);
  }, [isCritical, pulse]);

  const shimmerStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shimmerX.value }] }));
  const pulseStyle = useAnimatedStyle(() => ({ opacity: 0.4 + pulse.value * 0.6 }));

  return (
    <View className={`mb-3 ${className}`}>
      <View className="mb-1 flex-row justify-between">
        <Text className="font-sans text-sm font-semibold text-on-surface">{label}</Text>
        <Text className={`font-sans text-sm font-bold ${isCritical ? 'text-error' : 'text-on-surface'}`}>
          {`${Math.round(pct)}%${isCritical ? ' ⚠️' : ''}`}
        </Text>
      </View>
      <View
        className="h-3 overflow-hidden rounded-full border-2 border-card-border bg-surface-container"
        onLayout={e => setTrackWidth(e.nativeEvent.layout.width)}
      >
        <Animated.View
          className={`h-full rounded-full ${isCritical ? 'bg-error' : fillClassName}`}
          style={[{ width: `${pct}%` }, isCritical ? pulseStyle : undefined]}
        />
        {!isCritical && trackWidth > 0 && (
          <Animated.View pointerEvents="none" style={[styles.shimmer, shimmerStyle]} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: SHIMMER_WIDTH,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },
});
