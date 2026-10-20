import { createClient } from '@supabase/supabase-js';

// Server-side helpers for Supabase v2.
// v2 no longer has auth.api.getUserByCookie or auth.setAuth, so each request
// builds its own client that sends the user's token. Row level security then
// applies to that user, exactly as it did before.

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// A client that acts as the given user (or as anonymous if no token is given).
export function serverClientFor(token) {
  return createClient(url, anonKey, {
    global: {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

// Returns { user, token } for the request's "sb:token" cookie, or { user: null, token: null }.
export async function getRequestUser(req) {
  const token = req.cookies?.['sb:token'];
  if (!token) {
    return { user: null, token: null };
  }
  const { data, error } = await serverClientFor(token).auth.getUser(token);
  if (error || !data?.user) {
    return { user: null, token: null };
  }
  return { user: data.user, token };
}
