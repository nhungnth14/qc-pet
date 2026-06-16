// Mock supabase-api để khỏi import supabase client thật (Story 6.1 — server fetch).
import { getNeedBars, getPet } from '@/lib/supabase-api';
import { usePetStore } from './pet-store';

jest.mock('@/lib/supabase-api', () => ({
  getPet: jest.fn(),
  getNeedBars: jest.fn(),
}));

const mockGetPet = getPet as jest.Mock;
const mockGetNeedBars = getNeedBars as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
  // reset store về default
  usePetStore.setState({
    name: 'Bugsy',
    version: 'v0.1',
    bcBalance: 0,
    qpTotal: 0,
    needBars: { hunger: 80, happiness: 80, health: 80, discipline: 80 },
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
