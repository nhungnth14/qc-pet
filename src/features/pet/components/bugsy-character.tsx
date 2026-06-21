import type { RoomType } from '@/features/rooms/stores/use-room-navigation';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Image } from '@/components/ui/image';
import { BUGSY_IMAGE } from '../bugsy-asset';
import { BUGSY_STATE_CONFIG, ROOM_BUGSY_SIZE } from '../bugsy-state';
import { useBugsyState } from '../use-bugsy-state';

type BugsyCharacterProps = {
  room: RoomType;
};

/**
 * Bugsy character (Story 3-3). Render asset `bugsy-transparent.png` (RGBA) theo per-room size,
 * animation idle theo state (đọc need bars + excited), cross-fade 0.3s khi đổi state, mood chip.
 */
export function BugsyCharacter({ room }: BugsyCharacterProps) {
  const state = useBugsyState();
  const cfg = BUGSY_STATE_CONFIG[state];
  const size = ROOM_BUGSY_SIZE[room];

  const t = useSharedValue(0); // idle loop driver 0..1
  const fade = useSharedValue(1); // cross-fade khi đổi state

  useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.ease) }), -1, true);
    return () => cancelAnimation(t);
  }, [t]);

  useEffect(() => {
    fade.value = 0;
    fade.value = withTiming(1, { duration: 300 });
  }, [state, fade]);

  const animStyle = useAnimatedStyle(() => {
    const p = t.value;
    switch (cfg.anim) {
      case 'bounce':
        return { transform: [{ translateY: -10 * p }] };
      case 'rumble':
        return { transform: [{ translateX: (p - 0.5) * 8 }] };
      case 'sway':
        return { transform: [{ rotate: `${(p - 0.5) * 6}deg` }] };
      case 'breathe':
        return { transform: [{ scale: 1 + p * 0.04 }] };
      case 'ruffle':
        return { transform: [{ rotate: `${(p - 0.5) * 4}deg` }, { translateY: p * 3 }] };
      case 'celebrate':
        return { transform: [{ scale: 1 + p * 0.12 }, { rotate: `${(p - 0.5) * 10}deg` }] };
      default:
        return {};
    }
  });

  const fadeStyle = useAnimatedStyle(() => ({ opacity: fade.value }));

  return (
    <View style={styles.wrap} accessibilityLabel={`Bugsy đang ${cfg.label}`}>
      <Animated.View style={[animStyle, fadeStyle]}>
        <Image
          source={BUGSY_IMAGE}
          style={{ width: size, height: size }}
          contentFit="contain"
          accessibilityIgnoresInvertColors
        />
      </Animated.View>
      <View style={styles.moodChip}>
        <Text style={styles.moodText}>{cfg.mood}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', justifyContent: 'center' },
  moodChip: {
    marginTop: -8,
    minWidth: 40,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#001a41',
  },
  moodText: { fontSize: 20 },
});
