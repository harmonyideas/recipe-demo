import { supabase } from '../../supabase-client'

export default function AuthHandler(req, res) {
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
