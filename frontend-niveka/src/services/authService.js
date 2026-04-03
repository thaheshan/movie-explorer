import { supabase } from "./supabaseClient";

export const signUp = (email, password) =>
  supabase.auth.signUp({ email, password });

export const login = (email, password) =>
  supabase.auth.signInWithPassword({ email, password });

export const resetPassword = (email) =>
  supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

export const updatePassword = (password) =>
  supabase.auth.updateUser({ password });
