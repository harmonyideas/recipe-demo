import { useState } from 'react'
import { supabase } from '../supabase-client'
import AuthForm from '../components/auth-form'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const submitForm = async (evt) => {
    evt.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (!error) {
      router.push('/signin')
    }
  }

  return (
    <main className="container py-5">
      <h1 className="h3 text-center mb-4">Sign up</h1>
      <AuthForm
        email={email}
        onEmailChange={(evt) => setEmail(evt.target.value)}
        password={password}
        onPasswordChange={(evt) => setPassword(evt.target.value)}
        onSubmit={submitForm}
      />

      <p className="text-center mt-3 mb-0">
        <Link href='/signin'>
          <a>Already have an account? Sign in</a>
        </Link>
      </p>
    </main>
  )
}
