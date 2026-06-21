import type { RoomType } from '../room-types';

import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

import { ROOM_DEFINITIONS } from '../room-types';

type RoomVisualState = 'normal' | 'attention' | 'locked';

type RoomEnvironmentProps = {
  roomType: RoomType;
  state?: RoomVisualState;
  children?: React.ReactNode;
};

const ATTENTION_BORDER = '#FFB000';
const LOCKED_OVERLAY_OPACITY = 0.6;

export function RoomEnvironment({ roomType, state = 'normal', children }: RoomEnvironmentProps) {
  const def = ROOM_DEFINITIONS[roomType];
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state !== 'attention') {
      glowAnim.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, { toValue: 1, duration: 1000, useNativeDriver: false }),
        Animated.timing(glowAnim, { toValue: 0, duration: 1000, useNativeDriver: false }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [state, glowAnim]);

  const borderColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', ATTENTION_BORDER],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: def.bgColor },
        state === 'attention' && { borderColor, borderWidth: 3 },
      ]}
      accessibilityLabel={`${def.label} — ${state}`}
    >
      {children}

      {state === 'locked' && (
        <View style={styles.lockedOverlay}>
          <View style={styles.questionChip}>
            <Text style={styles.questionText}>?</Text>
          </View>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: `rgba(0,0,0,${LOCKED_OVERLAY_OPACITY})`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#001a41',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  questionText: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
  },
});
