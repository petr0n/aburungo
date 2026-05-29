import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { UserTier } from "@/types";

type AuthState = {
  user: User | null;
  loading: boolean;
  isRecovery: boolean;

  initialize: () => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  updatePassword: (newPassword: string) => Promise<string | null>;
};

/**
 * Derive the user's access tier from auth state.
 *
 * guest — no session
 * free  — signed-in free account (default for all authenticated users until
 *         payment is wired; check user_metadata.tier === "paid" when ready)
 * paid  — subscriber
 */
export function useUserTier(): UserTier {
  return useAuth((s) => {
    if (s.user === null) return "guest";
    // Paid tier: stubbed as false until payment integration is built.
    // When ready: check s.user.user_metadata?.tier === "paid"
    return "free";
  });
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  isRecovery: false,

  initialize() {
    void supabase.auth.getSession().then(({ data }) => {
      set({ user: data.session?.user ?? null, loading: false });
    });

    supabase.auth.onAuthStateChange((event, session) => {
      set({
        isRecovery: event === "PASSWORD_RECOVERY",
        user: session?.user ?? null,
        loading: false,
      });
    });
  },

  async signIn(email, password) {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return error?.message ?? null;
  },

  async signUp(email, password) {
    set({ loading: true });
    const { error } = await supabase.auth.signUp({ email, password });
    set({ loading: false });
    return error?.message ?? null;
  },

  async signOut() {
    set({ loading: true });
    await supabase.auth.signOut();
    set({ user: null, loading: false });
  },

  async requestPasswordReset(email) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin,
    });
    return error?.message ?? null;
  },

  async updatePassword(newPassword) {
    set({ loading: true });
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (!error) {
      set({ isRecovery: false, loading: false });
    } else {
      set({ loading: false });
    }
    return error?.message ?? null;
  },
}));
