import { createClient } from '@/lib/supabase/client';
import { ROUTES } from './constants';

export async function signUp(email: string, password: string, name: string, turnstileToken?: string | null) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      name,
      turnstileToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Sign up failed');
  }

  // Refresh the Supabase client to pick up the new session
  const supabase = createClient();
  await supabase.auth.getSession();

  return data;
}

export async function signInWithGoogle(redirectTo?: string) {
  // Use our own OAuth flow instead of Supabase's
  // This way users only see rejectly.pro domain, not Supabase's
  const params = new URLSearchParams();
  if (redirectTo) {
    params.set('redirect', redirectTo);
  }

  const authUrl = `/api/auth/google${params.toString() ? `?${params.toString()}` : ''}`;

  // Redirect to our Google OAuth initiation endpoint
  window.location.href = authUrl;
}

export async function signIn(email: string, password: string, turnstileToken?: string | null) {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      turnstileToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Login failed');
  }

  // Refresh the Supabase client to pick up the new session
  const supabase = createClient();
  await supabase.auth.getSession();

  return data;
}

export async function signOut() {
  const supabase = createClient();
  
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  
  window.location.href = ROUTES.PUBLIC.HOME;
}

export async function resetPassword(email: string, turnstileToken?: string | null) {
  const response = await fetch('/api/auth/forgot-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      turnstileToken,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Password reset failed');
  }

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