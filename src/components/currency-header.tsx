import type { RewardPayload } from '@/lib/reward-event-bus';
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { CurrencyChip } from '@/components/currency-chip';
import { Text } from '@/components/ui/text';
import { useChipEarnAnimation } from '@/features/currency/use-chip-earn-animation';
import { rewardEventBus } from '@/lib/reward-event-bus';
import { usePetStore } from '@/stores/pet-store';

type Props = { className?: string };
type ChipAnim = ReturnType<typeof useChipEarnAnimation>;

/** 1 chip có animation bounce + "+N" float (màu theo currency). */
function AnimatedChip({ anim, type, floatClass }: { anim: ChipAnim; type: 'bc' | 'qp'; floatClass: string }) {
  return (
    <View>
      <Animated.View style={anim.bounceStyle}>
        <CurrencyChip type={type} amount={anim.shown} />
      </Animated.View>
      {anim.floatText != null && (
        <Animated.View
          pointerEvents="none"
          style={[anim.floatStyle, { position: 'absolute', top: -4, left: 0, right: 0, alignItems: 'center' }]}
        >
          <Text className={`font-sans text-sm font-extrabold ${floatClass}`}>{anim.floatText}</Text>
        </Animated.View>
      )}
    </View>
  );
}

/**
 * CurrencyHeader — hàng 2 chip BC + QP (server-synced từ pet-store, Story 6.1).
 *
 * Story 6.2/6.3 — reward animation pipeline: khi mount, consume pending reward
 * (server_committed ở core-mission) → animate cả chip BC (top-level) lẫn QP (nested)
 * có delta: bounce + "+N" float (bc-amber / qp-teal) + counter tick-up `from→to` 800ms.
 * Deferred (reward commit lúc quiz immersive → animate khi về Work Room). Không mix màu.
 * Không SFX (defer). Pending consume đúng 1 lần.
 */
export function CurrencyHeader({ className = '' }: Props) {
  const bcBalance = usePetStore(s => s.bcBalance);
  const qpTotal = usePetStore(s => s.qpTotal);
  const bc = useChipEarnAnimation(bcBalance);
  const qp = useChipEarnAnimation(qpTotal);

  // Latest-ref pattern: bc/qp are new objects each render (tween state changes during
  // animation). Storing in refs lets the mount-only effect always call the current trigger
  // without listing unstable objects as deps (which would re-run consumePending every frame).
  const bcRef = useRef(bc);
  const qpRef = useRef(qp);
  bcRef.current = bc;
  qpRef.current = qp;

  const pendingRef = useRef<RewardPayload | null>(null);
  const animStartedRef = useRef(false);

  useEffect(() => {
    const pending = rewardEventBus.consumePending();
    if (!pending)
      return;
    pendingRef.current = pending;
    animStartedRef.current = false;
    // rAF: ngoài effect body (react-compiler) + sau khi navigator settle.
    const rafId = requestAnimationFrame(() => {
      animStartedRef.current = true;
      if (
        typeof pending.from === 'number'
        && typeof pending.to === 'number'
        && pending.to !== pending.from
      ) {
        bcRef.current.trigger(pending.from, pending.to, pending.amount ?? pending.to - pending.from);
      }
      if (pending.qp != null && pending.qp.to !== pending.qp.from) {
        qpRef.current.trigger(pending.qp.from, pending.qp.to, pending.qp.amount);
      }
    });
    return () => {
      cancelAnimationFrame(rafId);
      // StrictMode: effect runs twice on mount. If cleanup fires before rAF executes,
      // restore pending so the remount effect can re-consume it.
      if (!animStartedRef.current && pendingRef.current != null)
        rewardEventBus.emit('server_committed', pendingRef.current);
    };
  }, []);

  return (
    <View className={`flex-row gap-2 ${className}`}>
      <AnimatedChip anim={bc} type="bc" floatClass="text-bc-amber" />
      <AnimatedChip anim={qp} type="qp" floatClass="text-qp-teal" />
    </View>
  );
}
