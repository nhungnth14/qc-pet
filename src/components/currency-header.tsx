import type { RewardPayload } from '@/lib/reward-event-bus';
import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { CurrencyChip } from '@/components/currency-chip';
import { Text } from '@/components/ui/text';
import { rewardEventBus } from '@/lib/reward-event-bus';
import { usePetStore } from '@/stores/pet-store';

type Props = { className?: string };

const TICK_MS = 800;

/**
 * CurrencyHeader — hàng 2 chip BC + QP (server-synced từ pet-store, Story 6.1).
 *
 * Story 6.2 — reward animation pipeline: khi mount, consume pending reward
 * (server_committed đã set ở core-mission) → chip BC bounce + "+N" float bay lên +
 * counter tick-up `from→to` 800ms. Deferred: reward commit lúc quiz immersive, chip
 * animate khi user về Work Room. Không mix màu (bc-amber/qp-teal). KHÔNG SFX (defer).
 */
export function CurrencyHeader({ className = '' }: Props) {
  const bcBalance = usePetStore(s => s.bcBalance);
  const qpTotal = usePetStore(s => s.qpTotal);

  // tweenBc != null khi đang tick-up; ngược lại hiển thị bcBalance (luôn current).
  const [tweenBc, setTweenBc] = useState<number | null>(null);
  const [floatText, setFloatText] = useState<string | null>(null);

  const scale = useSharedValue(1);
  const floatY = useSharedValue(0);
  const floatOpacity = useSharedValue(0);
  const rafRef = useRef<number | null>(null);
  const floatTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingConsumedRef = useRef<RewardPayload | null>(null);
  const animationStartedRef = useRef(false);

  // Khai báo TRƯỚC useEffect (react-compiler: không "access before declared"). Mọi
  // setState/shared-value chạy qua rAF (event-driven) → không vi phạm sync-setState-in-effect.
  function runBcAnimation(from: number, to: number, amount: number) {
    // Bounce chip
    scale.value = withSequence(
      withTiming(1.25, { duration: 150 }),
      withSpring(1, { damping: 6, stiffness: 180 }),
    );
    // "+N" float bay lên + mờ dần
    setFloatText(`+${amount}`);
    floatY.value = 0;
    floatOpacity.value = 1;
    floatY.value = withTiming(-44, { duration: TICK_MS });
    floatOpacity.value = withDelay(TICK_MS - 350, withTiming(0, { duration: 350 }));
    floatTimer.current = setTimeout(() => setFloatText(null), TICK_MS + 100);
    // TODO: SFX hook (sound design story)
    // Counter tick-up from→to qua rAF (số nguyên)
    const start = Date.now();
    const step = () => {
      const t = Math.min(1, (Date.now() - start) / TICK_MS);
      setTweenBc(Math.round(from + (to - from) * t));
      if (t < 1)
        rafRef.current = requestAnimationFrame(step);
      else
        setTweenBc(null); // về null → hiển thị bcBalance (= to)
    };
    rafRef.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const pending = rewardEventBus.consumePending();
    pendingConsumedRef.current = pending;
    animationStartedRef.current = false;
    if (
      pending?.type === 'bc'
      && typeof pending.from === 'number'
      && typeof pending.to === 'number'
      && pending.to !== pending.from
    ) {
      const { from, to } = pending;
      const amount = pending.amount ?? to - from;
      rafRef.current = requestAnimationFrame(() => {
        animationStartedRef.current = true;
        runBcAnimation(from, to, amount);
      });
    }
    return () => {
      if (rafRef.current != null)
        cancelAnimationFrame(rafRef.current);
      // StrictMode restore: nếu animation chưa start (double-invoke dev), đưa pending trở lại
      // để mount lần 2 còn consume được → animation không bị nuốt trong dev build.
      if (!animationStartedRef.current && pendingConsumedRef.current != null)
        rewardEventBus.emit('server_committed', pendingConsumedRef.current);
      if (floatTimer.current != null)
        clearTimeout(floatTimer.current);
    };
  }, []);

  const bounceStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const floatStyle = useAnimatedStyle(() => ({
    opacity: floatOpacity.value,
    transform: [{ translateY: floatY.value }],
  }));

  const shownBc = tweenBc ?? bcBalance;

  return (
    <View className={`flex-row gap-2 ${className}`}>
      <View>
        <Animated.View style={bounceStyle}>
          <CurrencyChip type="bc" amount={shownBc} />
        </Animated.View>
        {floatText != null && (
          <Animated.View
            pointerEvents="none"
            style={[floatStyle, { position: 'absolute', top: -4, left: 0, right: 0, alignItems: 'center' }]}
          >
            <Text className="font-sans text-sm font-extrabold text-bc-amber">{floatText}</Text>
          </Animated.View>
        )}
      </View>
      <CurrencyChip type="qp" amount={qpTotal} />
    </View>
  );
}
