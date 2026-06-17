import type { PressableProps } from 'react-native';
import * as React from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { twMerge } from 'tailwind-merge';

const SHADOW_COLOR = 'rgba(0, 26, 65, 1)';

type Props = {
  label?: string;
  className?: string;
  textClassName?: string;
  children?: React.ReactNode;
} & Omit<PressableProps, 'children'>;

/**
 * TactileButton — nhấn: translateY(4px) + shadow 6px→0px; thả: spring-back nẩy.
 * Touch target ≥ 44×44px. Native fidelity verify khi có device build.
 */
export function TactileButton({
  label,
  className = '',
  textClassName = '',
  disabled = false,
  children,
  ...props
}: Props) {
  const pressed = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    const offset = (1 - pressed.value) * 6;
    return {
      transform: [{ translateY: pressed.value * 4 }],
      boxShadow: `0px ${offset}px 0px 0px ${SHADOW_COLOR}`,
    };
  });

  return (
    <Pressable
      disabled={disabled}
      onPressIn={() => {
        pressed.value = withSpring(1, { damping: 18, stiffness: 400 });
      }}
      onPressOut={() => {
        // spring-back nẩy (xấp xỉ cubic-bezier(0.34, 1.56, 0.64, 1))
        pressed.value = withSpring(0, { damping: 8, stiffness: 180 });
      }}
      {...props}
    >
      <Animated.View
        style={animatedStyle}
        className={twMerge(
          'min-h-11 min-w-11 items-center justify-center rounded-xl border-[3px] border-card-border bg-primary-container px-5 py-3',
          disabled && 'opacity-50',
          className,
        )}
      >
        {children ?? (
          <Text className={twMerge('font-sans text-base font-bold text-on-surface', textClassName)}>
            {label}
          </Text>
        )}
      </Animated.View>
    </Pressable>
  );
}
