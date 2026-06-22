// Mock supabase-api + need-bar-api để khỏi import supabase client thật.
// clock mock để điều khiển thời gian cho decay (Story 4-1).
import { syncNeedBars as apiSyncNeedBars } from '@/features/pet/need-bar-api';
import { careAction as apiCareAction } from '@/features/pet/pet-care-api';
import { getNeedBars, getPet } from '@/lib/supabase-api';
import { clock } from '@/shared/lib/clock';
import { usePetStore } from './pet-store';

jest.mock('@/lib/supabase-api', () => ({
  getPet: jest.fn(),
  getNeedBars: jest.fn(),
}));

jest.mock('@/features/pet/need-bar-api', () => ({
  syncNeedBars: jest.fn(),
}));

jest.mock('@/features/pet/pet-care-api', () => ({
  careAction: jest.fn(),
}));

jest.mock('@/shared/lib/clock', () => ({
  clock: { now: jest.fn(() => 0), updateOffset: jest.fn() },
}));

const mockGetPet = getPet as jest.Mock;
const mockGetNeedBars = getNeedBars as jest.Mock;
const mockApiSync = apiSyncNeedBars as jest.Mock;
const mockApiCare = apiCareAction as jest.Mock;
const mockNow = clock.now as jest.Mock;

const HOUR_MS = 60 * 60 * 1000;
const FULL = { hunger: 80, happiness: 80, health: 80, discipline: 80 };

afterEach(() => {
  jest.clearAllMocks();
  mockNow.mockReturnValue(0);
  usePetStore.setState({
    name: 'Bugsy',
    version: 'v0.1',
    bcBalance: 0,
    qpTotal: 0,
    needBars: { ...FULL },
    needBarsBaseline: { ...FULL },
    needBarsSyncedAtMs: 0,
    isLoading: false,
  });
});

describe('pet-store · syncFromSupabase (server-authoritative — AC2)', () => {
  it('cập nhật bc/qp/name/version từ server', async () => {
    mockGetPet.mockResolvedValue({
      data: { id: 'p', userId: 'u', name: 'Kiwi', version: 'v0.5', bcBalance: 42, qpTotal: 150 },
    });
    mockGetNeedBars.mockResolvedValue({
      data: { hunger: 60, happiness: 70, health: 80, discipline: 90 },
    });

    await usePetStore.getState().syncFromSupabase('u');

    const s = usePetStore.getState();
    expect(s.bcBalance).toBe(42);
    expect(s.qpTotal).toBe(150);
    expect(s.name).toBe('Kiwi');
    expect(s.needBars.discipline).toBe(90);
    expect(s.isLoading).toBe(false);
  });

  it('pet null (chưa có) → vẫn set need bars, không crash', async () => {
    mockGetPet.mockResolvedValue({ data: null });
    mockGetNeedBars.mockResolvedValue({
      data: { hunger: 80, happiness: 80, health: 80, discipline: 80 },
    });

    await usePetStore.getState().syncFromSupabase('u');
    const s = usePetStore.getState();
    expect(s.isLoading).toBe(false);
    expect(s.bcBalance).toBe(0);
    expect(s.qpTotal).toBe(0);
  });

  it('lỗi server → throw + reset isLoading (caller tự nuốt để offline-tolerant)', async () => {
    mockGetPet.mockRejectedValue(new Error('network'));
    mockGetNeedBars.mockResolvedValue({ data: { hunger: 80, happiness: 80, health: 80, discipline: 80 } });

    await expect(usePetStore.getState().syncFromSupabase('u')).rejects.toThrow('network');
    expect(usePetStore.getState().isLoading).toBe(false);
  });
});

describe('pet-store · decay (Story 4-1)', () => {
  it('setNeedBars re-anchor baseline + syncedAt', () => {
    mockNow.mockReturnValue(5000);
    usePetStore.getState().setNeedBars({ hunger: 100 });
    const s = usePetStore.getState();
    expect(s.needBars.hunger).toBe(100);
    expect(s.needBarsBaseline.hunger).toBe(100);
    expect(s.needBarsSyncedAtMs).toBe(5000);
  });

  it('recomputeDecay giảm bars theo elapsed từ baseline', () => {
    mockNow.mockReturnValue(0);
    usePetStore.getState().setNeedBars({ hunger: 100, happiness: 100, health: 100, discipline: 100 });
    mockNow.mockReturnValue(24 * HOUR_MS); // +24h
    usePetStore.getState().recomputeDecay();
    const s = usePetStore.getState();
    expect(s.needBars.hunger).toBe(50); // 48h full → 24h = 50
    expect(s.needBars.happiness).toBe(66); // 72h full → 24h
  });

  it('syncNeedBars cập nhật bars + baseline + syncedAt từ server', async () => {
    mockApiSync.mockResolvedValue({
      bars: { hunger: 40, happiness: 50, health: 60, discipline: 70 },
      serverTimeMs: 123456,
    });
    await usePetStore.getState().syncNeedBars('u');
    const s = usePetStore.getState();
    expect(s.needBars.hunger).toBe(40);
    expect(s.needBarsBaseline.discipline).toBe(70);
    expect(s.needBarsSyncedAtMs).toBe(123456);
    expect(clock.updateOffset).toHaveBeenCalledWith(123456);
  });

  it('syncNeedBars lỗi → giữ last-known, không crash', async () => {
    usePetStore.setState({ needBars: { ...FULL, hunger: 33 } });
    mockApiSync.mockRejectedValue(new Error('offline'));
    await usePetStore.getState().syncNeedBars('u');
    expect(usePetStore.getState().needBars.hunger).toBe(33);
  });

  it('careAction cập nhật bars + re-anchor baseline (Story 4-2)', async () => {
    mockNow.mockReturnValue(999);
    mockApiCare.mockResolvedValue({
      bars: { hunger: 100, happiness: 80, health: 80, discipline: 80 },
      serverCommitted: true,
    });
    await usePetStore.getState().careAction('u', 'feed', 'care:u:feed:test-key');
    const s = usePetStore.getState();
    expect(s.needBars.hunger).toBe(100);
    expect(s.needBarsBaseline.hunger).toBe(100);
    expect(s.needBarsSyncedAtMs).toBe(999);
    expect(mockApiCare).toHaveBeenCalledWith('u', 'feed', expect.stringContaining('care:u:feed:'));
  });
});
