import { useEffect } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { Image } from '@/components/ui/image';
import { BUGSY_IMAGE } from '@/features/pet/bugsy-asset';
import { useGardenCinematic } from '../use-garden-cinematic';

const DURATION_MS = 5000;
const SCREEN_WIDTH = Dimensions.get('window').width;

/**
 * Sân Day-7 cinematic (Story 10.1). ~5s visual-only: Bugsy chạy ngang Sân lần đầu. KHÔNG UI/text/
 * music/popup. Tự kết thúc → markShown (1 lần duy nhất, MMKV flag).
 */
export function GardenCinematic() {
  const { shouldShow, markShown } = useGardenCinematic();
  const tx = useSharedValue(-SCREEN_WIDTH * 0.4);

  useEffect(() => {
    if (!shouldShow)
      return;
    tx.value = withTiming(SCREEN_WIDTH * 0.4, { duration: DURATION_MS, easing: Easing.inOut(Easing.ease) });
    const timer = setTimeout(markShown, DURATION_MS);
    return () => clearTimeout(timer);
  }, [shouldShow, markShown, tx]);

  const bugsyStyle = useAnimatedStyle(() => ({ transform: [{ translateX: tx.value }] }));

  if (!shouldShow)
    return null;

  return (
    <View style={styles.overlay} pointerEvents="none">
      <View style={styles.grass} />
      <Animated.View style={bugsyStyle}>
        <Image source={BUGSY_IMAGE} style={styles.bugsy} contentFit="contain" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#B3E5FC',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 80,
    zIndex: 30,
  },
  grass: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    backgroundColor: '#A5D6A7',
  },
  bugsy: { width: 140, height: 140 },
});
