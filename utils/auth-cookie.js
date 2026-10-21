// Tells the server about an auth change so it can set or clear the "sb:token"
// cookie that getServerSideProps reads. Callers must await this before
// navigating to a server-rendered page, or the page is rendered without the
// cookie and redirects back to /signin.
export async function syncAuthCookie(event, session) {
  const res = await fetch('/api/auth', {
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify({ event, session }),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  return res.ok
}
