import { createClient } from '@/lib/supabase/client';
import { ROUTES } from './constants';

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  window.location.href = ROUTES.PUBLIC.HOME;
}

export async function resetPassword(email: string) {
  const supabase = createClient();
  const origin = window.location.origin;
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/reset-password`,
  });
  if (error) throw error;
  return data;
}

export async function getUser() {
  const supabase = createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error) throw error;
  return user;
}

export async function updateProfile(name: string) {
  const supabase = createClient();
  
  const { error } = await supabase.auth.updateUser({
    data: {
      name: name,
    },
  });
  
  if (error) throw error;
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const supabase = createClient();
  
  // Önce mevcut şifreyi doğrula
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user?.email) {
    throw new Error('User not found');
  }
  
  // Mevcut şifreyi kontrol et (yeniden giriş yaparak)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: currentPassword,
  });
  
  if (signInError) {
    throw new Error('Current password is incorrect');
  }
  
  // Yeni şifreyi güncelle
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });
  
  if (error) throw error;
}

export async function deleteUserAccount(): Promise<void> {
  // API route'u çağır
  const response = await fetch('/api/user/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete account');
  }

  // Başarılı silme sonrası ana sayfaya yönlendir
  window.location.href = ROUTES.PUBLIC.HOME;
}