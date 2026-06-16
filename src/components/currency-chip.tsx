import * as React from 'react';
import { View } from 'react-native';

import { Text } from '@/components/ui/text';

type Props = {
  type: 'bc' | 'qp'; // bc = Bug Coins (amber), qp = Quality Points (teal)
  amount: number;
  className?: string;
};

/**
 * CurrencyChip — chip tiền tệ. KHÔNG mix màu: bc=amber, qp=teal.
 */
export function CurrencyChip({ type, amount, className = '' }: Props) {
  const isBc = type === 'bc';
  return (
    <View
      className={`flex-row items-center gap-1 rounded-full border-2 border-card-border px-3 py-1 ${
        isBc ? 'bg-bc-amber' : 'bg-qp-teal'
      } ${className}`}
    >
      <Text className="font-sans text-sm font-bold text-on-surface">{isBc ? '🪙' : '✦'}</Text>
      <Text className="font-sans text-sm font-bold text-on-surface">{amount}</Text>
    </View>
  );
}
