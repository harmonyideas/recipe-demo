import { getRequestUser } from '../utils/server-client'
import { useState } from 'react'
import { supabase } from '../supabase-client'
import AuthForm from '../components/auth-form'
import { syncAuthCookie } from '../utils/auth-cookie'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

export default function Signin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const submitForm = async (evt) => {
    evt.preventDefault()
    if (submitting) return
    setSubmitting(true)
    setErrorMessage('')
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        setErrorMessage(error.message || 'Sign in failed.')
        return
      }

      // The home page is server-rendered and reads the "sb:token" cookie, so
      // wait until the server has stored it before navigating there.
      const cookieSet = await syncAuthCookie('SIGNED_IN', data.session)
      if (!cookieSet) {
        setErrorMessage('Signed in, but the server could not save your session. Please try again.')
        return
      }
      router.replace('/')
    } catch (err) {
      setErrorMessage('Could not reach the server. Check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="container py-5">
      <h1 className="h3 text-center mb-4">Sign in</h1>
      {errorMessage && (
        <div className="alert alert-danger mx-auto auth-card" role="alert">{errorMessage}</div>
      )}
      <AuthForm
        email={email}
        onEmailChange={(evt) => setEmail(evt.target.value)}
        password={password}
        onPasswordChange={(evt) => setPassword(evt.target.value)}
        onSubmit={submitForm}
      />

      <p className="text-center mt-3 mb-0">
        <Link href='/signup'>
          <a>Don&apos;t have an account? Sign up</a>
        </Link>
      </p>
    </main>
  )
}

export const getServerSideProps = async (context) => {
  // get the user using the "sb:token" cookie
  const { user } = await getRequestUser(context.req)
  if (user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  return {
    props: {}
  }
}
