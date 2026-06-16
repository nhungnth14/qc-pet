const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

// Run at Metro startup (not just postinstall) so the fix applies even when
// EAS restores node_modules from cache and skips the install step.
try { require('./scripts/fix-private-fields.cjs'); } catch (_) {}

const config = getDefaultConfig(__dirname);
const finalConfig = withUniwindConfig(config, { cssEntryFile: './src/global.css' });

// Force-transpile packages that use private class fields (#field syntax)
// Must set AFTER withUniwindConfig — it overwrites anything set before it
finalConfig.transformer = finalConfig.transformer || {};
finalConfig.transformer.transformIgnorePatterns = [
  'node_modules/(?!(?:\\.pnpm/[^/]+/node_modules/)?(?:' +
    [
      'react-native',
      '@react-native',
      'expo',
      '@expo',
      'react-native-svg',
      'react-native-reanimated',
      'react-native-gesture-handler',
      '@gorhom',
      'moti',
      'react-native-worklets',
      '@tanstack',
      'zustand',
      'uniwind',
      'react-native-safe-area-context',
      'react-native-screens',
      '@shopify',
      'react-native-edge-to-edge',
      'react-native-nitro-modules',
      'cross-fetch',
      'react-native-url-polyfill',
    ].join('|') +
    ')/)',
];

// Inject DOMException polyfill as a true top-level polyfill
// so it runs BEFORE any module factory — fixing RN 0.81.5 web API init order
finalConfig.serializer = finalConfig.serializer || {};
const existingGetPolyfills = finalConfig.serializer.getPolyfills;
finalConfig.serializer.getPolyfills = (ctx) => {
  const existing = existingGetPolyfills ? existingGetPolyfills(ctx) : [];
  return [
    ...existing,
    path.resolve(__dirname, 'polyfill-top-level.js'),
  ];
};

module.exports = finalConfig;
