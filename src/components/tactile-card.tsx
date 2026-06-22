import type { ViewProps } from 'react-native';
import * as React from 'react';
import { View } from 'react-native';
import { twMerge } from 'tailwind-merge';

// Blocky flat shadow (KHÔNG Gaussian blur) — project-context Design System.
export const TACTILE_SHADOW = { boxShadow: '0px 6px 0px 0px rgba(0, 26, 65, 1)' } as const;

type Props = { className?: string } & ViewProps;

/**
 * TactileCard — card chuẩn QC Pet: border 3px #001a41, blocky shadow 6px,
 * rounded-xl. Override style qua `className`.
 */
export function TactileCard({ className = '', style, children, ...props }: Props) {
  return (
    <View
      className={twMerge('rounded-xl border-[3px] border-card-border bg-white p-4', className)}
      style={[TACTILE_SHADOW, style]}
      {...props}
    >
      {children}
    </View>
  );
}
