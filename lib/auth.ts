import { createClient } from './supabase-server';
import { redirect } from 'next/navigation';
import { AuthenticationError } from './errors';

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

/**
 * Require authentication - throws AuthenticationError if not authenticated
 * Use this in API routes
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new AuthenticationError();
  }

  return user;
}

/**
 * Require authentication with redirect - redirects to login if not authenticated
 * Use this in server components
 */
export async function requireAuthWithRedirect() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/admin/login');
  }

  return user;
}

/**
 * Check if user is authenticated
 * Returns true/false without redirecting
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}

