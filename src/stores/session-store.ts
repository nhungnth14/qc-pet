import type { User } from '@supabase/supabase-js';
import { create } from 'zustand';
import { storage } from '@/lib/storage';
import { supabase } from '@/lib/supabase';

type SessionState = {
  userId: string | null;
  supabaseUser: User | null;
  isAnonymous: boolean;
  isLoading: boolean;
  onboardingComplete: boolean;
  initSession: () => Promise<void>;
  setOnboardingComplete: (v: boolean) => void;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
};

export const useSessionStore = create<SessionState>(() => ({
  userId: null,
  supabaseUser: null,
  isAnonymous: false,
  isLoading: true,
  onboardingComplete: storage.getBoolean('onboardingComplete') ?? false,

  initSession: async () => {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        useSessionStore.setState({
          supabaseUser: session.user,
          userId: session.user.id,
          isAnonymous: session.user.is_anonymous ?? false,
          isLoading: false,
        });
      }
      else {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error)
          throw error;
        useSessionStore.setState({
          supabaseUser: data.user,
          userId: data.user?.id ?? null,
          isAnonymous: true,
          isLoading: false,
        });
      }
    }
    catch (err) {
      useSessionStore.setState({ isLoading: false });
      throw err;
    }
  },

  setOnboardingComplete: (v) => {
    storage.set('onboardingComplete', v);
    useSessionStore.setState({ onboardingComplete: v });
  },

  signUpWithEmail: async (email, password) => {
    // Self-heal: updateUser (convert anon → permanent) yêu cầu session đang sống.
    // Nếu initSession lúc boot fail âm thầm (mạng chập chờn / anon hết hạn), session
    // có thể trống → updateUser ném "Auth session missing!". Đảm bảo có session trước.
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      const { error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError)
        throw anonError;
    }
    const { data, error } = await supabase.auth.updateUser({ email, password });
    if (error)
      throw error;
    useSessionStore.setState({
      supabaseUser: data.user,
      userId: data.user?.id ?? null,
      isAnonymous: false,
    });
  },

  signInWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error)
      throw error;
    useSessionStore.setState({
      supabaseUser: data.user,
      userId: data.user.id,
      isAnonymous: false,
    });
  },
}));
