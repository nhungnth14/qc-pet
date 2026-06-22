// Mock supabase client + storage (MMKV native) để test pure store logic.
import { supabase } from '@/lib/supabase';
import { useSessionStore } from './session-store';

jest.mock('@/lib/storage', () => ({
  storage: { getBoolean: jest.fn(() => false), set: jest.fn() },
}));

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signInAnonymously: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}));

const mockGetSession = supabase.auth.getSession as jest.Mock;
const mockSignInAnon = supabase.auth.signInAnonymously as jest.Mock;
const mockUpdateUser = supabase.auth.updateUser as jest.Mock;

afterEach(() => {
  jest.clearAllMocks();
  useSessionStore.setState({ userId: null, supabaseUser: null, isAnonymous: false });
});

describe('session-store · signUpWithEmail (self-heal session)', () => {
  it('có session sẵn → KHÔNG gọi signInAnonymously, convert luôn', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'anon-1' } } } });
    mockUpdateUser.mockResolvedValue({ data: { user: { id: 'anon-1' } }, error: null });

    await useSessionStore.getState().signUpWithEmail('a@b.com', 'secret6');

    expect(mockSignInAnon).not.toHaveBeenCalled();
    expect(mockUpdateUser).toHaveBeenCalledWith({ email: 'a@b.com', password: 'secret6' });
    expect(useSessionStore.getState().isAnonymous).toBe(false);
    expect(useSessionStore.getState().userId).toBe('anon-1');
  });

  it('mất session → tạo anon session rồi mới convert (vá "Auth session missing!")', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignInAnon.mockResolvedValue({ data: { session: { user: { id: 'anon-2' } } }, error: null });
    mockUpdateUser.mockResolvedValue({ data: { user: { id: 'anon-2' } }, error: null });

    await useSessionStore.getState().signUpWithEmail('c@d.com', 'secret6');

    expect(mockSignInAnon).toHaveBeenCalledTimes(1);
    expect(mockUpdateUser).toHaveBeenCalledTimes(1);
    expect(useSessionStore.getState().userId).toBe('anon-2');
  });

  it('updateUser lỗi → throw (không nuốt lỗi)', async () => {
    mockGetSession.mockResolvedValue({ data: { session: { user: { id: 'anon-3' } } } });
    mockUpdateUser.mockResolvedValue({ data: { user: null }, error: new Error('User already registered') });

    await expect(
      useSessionStore.getState().signUpWithEmail('e@f.com', 'secret6'),
    ).rejects.toThrow('already registered');
  });

  it('signInAnonymously lỗi khi mất session → throw, không gọi updateUser', async () => {
    mockGetSession.mockResolvedValue({ data: { session: null } });
    mockSignInAnon.mockResolvedValue({ data: { session: null }, error: new Error('rate limit') });

    await expect(
      useSessionStore.getState().signUpWithEmail('g@h.com', 'secret6'),
    ).rejects.toThrow('rate limit');
    expect(mockUpdateUser).not.toHaveBeenCalled();
  });
});
