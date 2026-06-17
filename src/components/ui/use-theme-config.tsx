import type { Theme } from '@react-navigation/native';
import { DefaultTheme } from '@react-navigation/native';

import colors from '@/components/ui/colors';

// MVP: dark mode KHÔNG hỗ trợ (project-context). Luôn trả LightTheme.
const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.qcPrimary,
    background: colors.white,
  },
};

export function useThemeConfig() {
  return LightTheme;
}
