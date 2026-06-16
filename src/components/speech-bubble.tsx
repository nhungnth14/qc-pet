import type { ReactNode } from 'react';
import * as React from 'react';
import { View } from 'react-native';

import { TACTILE_SHADOW } from '@/components/tactile-card';
import { Text } from '@/components/ui/text';

type Props = {
  text?: string;
  children?: ReactNode;
  className?: string;
  textClassName?: string;
};

/**
 * SpeechBubble — bong bóng thoại Bugsy: card bo tròn + đuôi tam giác, blocky shadow.
 */
export function SpeechBubble({ text, children, className = '', textClassName = '' }: Props) {
  return (
    <View className={className}>
      <View
        className="rounded-2xl border-[3px] border-card-border bg-white px-4 py-3"
        style={TACTILE_SHADOW}
      >
        {children ?? (
          <Text className={`font-sans text-base font-semibold text-on-surface ${textClassName}`}>
            {text}
          </Text>
        )}
      </View>
      {/* đuôi bong bóng (góc dưới-trái) */}
      <View className="absolute -bottom-2 left-6 size-4 rotate-45 border-r-[3px] border-b-[3px] border-card-border bg-white" />
    </View>
  );
}
