import { supabase } from '../../supabase-client'

// Partial CSRF mitigation: if the browser sent an Origin header, it must match
// the Host header, otherwise the request came from another site and is rejected.
// Requests without an Origin header are allowed through. This is NOT full CSRF
// protection. Full protection needs SameSite cookies plus per-request CSRF tokens.
function isSameOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

export default function AuthHandler(req, res) {
  if (!isSameOrigin(req)) {
    return res.status(403).json({ error: 'Cross-origin request rejected' })
  }

  const { event, session } = req.body || {}

  if (typeof event !== 'string' || event === '') {
    return res.status(400).json({ error: 'Missing auth event' })
  }

  // Signing out sends no session; supabase uses this event to clear the cookie
  if (event !== 'SIGNED_OUT') {
    const accessToken = session?.access_token
    if (typeof accessToken !== 'string' || accessToken.trim() === '') {
      return res.status(400).json({ error: 'Missing or invalid access token' })
    }
  }

  supabase.auth.api.setAuthCookie(req, res)
}
