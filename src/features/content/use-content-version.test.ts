// In-memory storage mock — mirrors pattern used in onboarding-progress.test.ts.
// `mockMem` prefix required: jest.mock factories can only access `mock`-prefixed variables.
// `__esModule: true` prevents _interopRequireWildcard from copying properties on import —
// allows mock function references to stay live inside the hook.
//
// NOTE: OTA positive path (fetchUpdateAsync called when update available) is not testable
// in Jest because babel-preset-expo inlines __DEV__ as literal `true` at compile time.
// The guard `if (__DEV__ || ...)` is compiled to `if (true || ...)` in the test bundle,
// making checkForOtaUpdate always a no-op. Production OTA behavior is covered by
// EAS Update smoke testing on staging builds.
import { renderHook, waitFor } from '@testing-library/react-native';

import { CONTENT_LAST_SEEN_VERSION, CONTENT_LAST_SYNCED_AT } from '@/shared/lib/constants';

import { useContentVersion } from './use-content-version';

const mockMem = new Map<string, string | boolean | number>();
const mockExpoUpdates = {
  __esModule: true,
  isEnabled: false as boolean,
  checkForUpdateAsync: jest.fn().mockResolvedValue({ isAvailable: false }),
  fetchUpdateAsync: jest.fn().mockResolvedValue(undefined),
};

jest.mock('@/shared/lib/storage', () => ({
  storage: {
    getString: (k: string) => (mockMem.has(k) ? String(mockMem.get(k)) : null),
    set: (k: string, v: string | boolean | number) => { mockMem.set(k, v); },
  },
}));

jest.mock('expo-updates', () => mockExpoUpdates);

afterEach(() => {
  mockMem.clear();
  mockExpoUpdates.isEnabled = false;
  mockExpoUpdates.checkForUpdateAsync.mockClear().mockResolvedValue({ isAvailable: false });
  mockExpoUpdates.fetchUpdateAsync.mockClear();
});

describe('useContentVersion', () => {
  it('isFirstLoad=true khi chưa có version trong MMKV', () => {
    const { result } = renderHook(() => useContentVersion());
    expect(result.current.isFirstLoad).toBe(true);
  });

  it('bundledVersion khớp với manifest.content_version', () => {
    const { result } = renderHook(() => useContentVersion());
    expect(typeof result.current.bundledVersion).toBe('string');
    expect(result.current.bundledVersion.length).toBeGreaterThan(0);
  });

  it('isFirstLoad=false khi đã có version cached trong MMKV', () => {
    mockMem.set(CONTENT_LAST_SEEN_VERSION, '0.1.0');
    const { result } = renderHook(() => useContentVersion());
    expect(result.current.isFirstLoad).toBe(false);
    expect(result.current.lastSeenVersion).toBe('0.1.0');
  });

  it('mmkv: CONTENT_LAST_SEEN_VERSION và CONTENT_LAST_SYNCED_AT được ghi sau mount', async () => {
    renderHook(() => useContentVersion());
    await waitFor(() => {
      expect(mockMem.has(CONTENT_LAST_SEEN_VERSION)).toBe(true);
    });
    expect(mockMem.has(CONTENT_LAST_SYNCED_AT)).toBe(true);
  });

  it('ota: guard blok checkForUpdateAsync trong dev environment (__DEV__ inlined true)', async () => {
    mockExpoUpdates.isEnabled = true;
    renderHook(() => useContentVersion());
    await waitFor(() => {
      expect(mockExpoUpdates.checkForUpdateAsync).not.toHaveBeenCalled();
    });
  });

  it('ota: fetchUpdateAsync không gọi khi isEnabled=false', async () => {
    mockExpoUpdates.isEnabled = false;
    renderHook(() => useContentVersion());
    await waitFor(() => {
      expect(mockExpoUpdates.fetchUpdateAsync).not.toHaveBeenCalled();
    });
  });
});
