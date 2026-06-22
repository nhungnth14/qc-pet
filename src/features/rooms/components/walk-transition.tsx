import { useEffect } from 'react';
import { Dimensions, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export const WALK_DURATION_MS = 800;
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Overlay walk transition 0.8s khi đổi phòng (Story 3-2 AC-5). Bugsy "đi bộ" ngang màn hình
 * trong khi `setCurrentRoom` swap nội dung phòng phía sau. Component chỉ mount khi
 * `isTransitioning === true` (apartment-container điều khiển) → animation chạy 1 lần on mount.
 */
export function WalkTransition() {
  const tx = useSharedValue(-SCREEN_WIDTH * 0.35);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: WALK_DURATION_MS * 0.25 });
    tx.value = withTiming(SCREEN_WIDTH * 0.35, { duration: WALK_DURATION_MS });
  }, [opacity, tx]);

  const overlayStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const bugsyStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  return (
    <Animated.View style={[styles.overlay, overlayStyle]} pointerEvents="none">
      <Animated.Text style={[styles.bugsy, bugsyStyle]}>🚶</Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#001a41',
    zIndex: 100,
  },
  bugsy: {
    fontSize: 72,
  },
});
