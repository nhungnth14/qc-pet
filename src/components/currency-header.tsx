import * as React from 'react';
import { View } from 'react-native';

import { CurrencyChip } from '@/components/currency-chip';
import { usePetStore } from '@/stores/pet-store';

type Props = { className?: string };

/**
 * CurrencyHeader — hàng 2 chip BC + QP, đọc server-synced value từ pet-store
 * (Story 6.1). Dùng chung cho header các room. Không mix màu (bc-amber/qp-teal).
 * KHÔNG có animation earn — reward pipeline là Story 6.2/6.3.
 */
export function CurrencyHeader({ className = '' }: Props) {
  const bcBalance = usePetStore(s => s.bcBalance);
  const qpTotal = usePetStore(s => s.qpTotal);

  return (
    <View className={`flex-row gap-2 ${className}`}>
      <CurrencyChip type="bc" amount={bcBalance} />
      <CurrencyChip type="qp" amount={qpTotal} />
    </View>
  );
}
