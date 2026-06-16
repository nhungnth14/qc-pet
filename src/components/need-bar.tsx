import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type Props = {
  label: string;
  value: number; // 0–100
  /** Class màu fill, vd `bg-need-hunger`. Mặc định qp-teal. */
  fillClassName?: string;
  className?: string;
};

/**
 * NeedBarComponent — thanh Need Bar dùng chung (consolidate hàm NeedBar inline cũ
 * ở work-room-screen). value clamp 0–100; màu fill qua token (`bg-need-*`).
 */
export function NeedBarComponent({ label, value, fillClassName = 'bg-qp-teal', className = '' }: Props) {
  const pct = Number.isFinite(value) ? Math.max(0, Math.min(100, value)) : 0;
  const isCritical = pct <= 29;
  return (
    <View className={`mb-3 ${className}`}>
      <View className="mb-1 flex-row justify-between">
        <Text className="font-sans text-sm font-semibold text-on-surface">{label}</Text>
        <Text className={`font-sans text-sm font-bold ${isCritical ? 'text-error' : 'text-on-surface'}`}>
          {`${Math.round(pct)}%${isCritical ? ' ⚠️' : ''}`}
        </Text>
      </View>
      <View className="h-3 overflow-hidden rounded-full border-2 border-card-border bg-surface-container">
        <View className={`h-full rounded-full ${fillClassName}`} style={{ width: `${pct}%` }} />
      </View>
    </View>
  );
}
