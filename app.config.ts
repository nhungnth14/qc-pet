import type { ConfigContext, ExpoConfig } from '@expo/config';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import 'tsx/cjs';

// adding lint exception as we need to import tsx/cjs before env.ts is imported
// eslint-disable-next-line perfectionist/sort-imports
import Env from './env';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: false,
  badges: [
    {
      text: Env.EXPO_PUBLIC_APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.EXPO_PUBLIC_VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'qc-pet',
  version: Env.EXPO_PUBLIC_VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
    url: 'https://u.expo.dev/d499b89c-b794-4675-a60f-fc6afbe49c53',
  },
  runtimeVersion: {
    policy: 'appVersion',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#2E3C4B',
    },
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#2E3C4B',
        image: './assets/splash-icon.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        // QC Pet (Story 0-6): Nunito Sans (UI, weight ≥600) + JetBrains Mono (code/terminal)
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/nunito-sans/600SemiBold/NunitoSans_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/nunito-sans/700Bold/NunitoSans_700Bold.ttf',
            'node_modules/@expo-google-fonts/nunito-sans/800ExtraBold/NunitoSans_800ExtraBold.ttf',
            'node_modules/@expo-google-fonts/nunito-sans/900Black/NunitoSans_900Black.ttf',
            'node_modules/@expo-google-fonts/jetbrains-mono/500Medium/JetBrainsMono_500Medium.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'Nunito Sans',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/nunito-sans/600SemiBold/NunitoSans_600SemiBold.ttf',
                  weight: 600,
                },
                {
                  path: 'node_modules/@expo-google-fonts/nunito-sans/700Bold/NunitoSans_700Bold.ttf',
                  weight: 700,
                },
                {
                  path: 'node_modules/@expo-google-fonts/nunito-sans/800ExtraBold/NunitoSans_800ExtraBold.ttf',
                  weight: 800,
                },
                {
                  path: 'node_modules/@expo-google-fonts/nunito-sans/900Black/NunitoSans_900Black.ttf',
                  weight: 900,
                },
              ],
            },
            {
              fontFamily: 'JetBrains Mono',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/jetbrains-mono/500Medium/JetBrainsMono_500Medium.ttf',
                  weight: 500,
                },
              ],
            },
          ],
        },
      },
    ],
    'expo-localization',
    'expo-router',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
  ],
  extra: {
    eas: {
      projectId: 'd499b89c-b794-4675-a60f-fc6afbe49c53',
    },
  },
});
