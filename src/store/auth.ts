import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Owner, UserTier } from "@/types";
import { GUEST_OWNER } from "@/types";
import { useProgress } from "@/store/progress";
import { useSession } from "@/store/session";

type AuthState = {
  user: User | null;
  /**
   * Whose learner state is active (DR-036): the user id, or GUEST_OWNER.
   * Null until the initial session is known, so nothing reads guest data
   * while a signed-in session is still being restored.
   */
  owner: Owner | null;
  loading: boolean;
  isRecovery: boolean;

  initialize: () => void;
  signIn: (email: string, password: string) => Promise<string | null>;
  signUp: (email: string, password: string) => Promise<string | null>;
  signInWithGoogle: () => Promise<string | null>;
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

export const useAuth = create<AuthState>((set, get) => {
  /**
   * The one place identity changes land -- initial session, sign-in, sign-out,
   * expiry, and auth changes Supabase relays from another tab. A different
   * owner clears the in-memory learner state first, so nothing renders the old
   * learner's state as the new one's. A token refresh keeps the same owner and
   * resets nothing.
   */
  function applyUser(user: User | null, extra: Partial<AuthState> = {}) {
    const owner = user?.id ?? GUEST_OWNER;
    if (owner !== get().owner) {
      useProgress.getState().resetFor(owner);
      useSession.getState().reset();
    }
    set({ ...extra, user, owner, loading: false });
  }

  return {
    user: null,
    owner: null,
    loading: true,
    isRecovery: false,

    initialize() {
      void supabase.auth.getSession().then(({ data }) => applyUser(data.session?.user ?? null));

      supabase.auth.onAuthStateChange((event, session) => {
        applyUser(session?.user ?? null, { isRecovery: event === "PASSWORD_RECOVERY" });
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

    async signInWithGoogle() {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: window.location.origin },
      });
      return error?.message ?? null;
    },

    async signOut() {
      set({ loading: true });
      await supabase.auth.signOut();
      applyUser(null);
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
  };
});
