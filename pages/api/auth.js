
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

  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : ''
  if (event === 'SIGNED_OUT') {
    res.setHeader('Set-Cookie', `sb:token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax${secure}`)
  } else {
    const maxAge = Number(session.expires_in) > 0 ? Number(session.expires_in) : 3600
    res.setHeader(
      'Set-Cookie',
      `sb:token=${encodeURIComponent(session.access_token)}; Path=/; Max-Age=${maxAge}; HttpOnly; SameSite=Lax${secure}`
    )
  }
  return res.status(200).json({ ok: true })
}
