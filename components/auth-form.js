export default function AuthForm({
  email,
  onEmailChange,
  password,
  onPasswordChange,
  onSubmit
}) {
  return (
    <form onSubmit={onSubmit} className="card card-body shadow-sm mx-auto auth-card">
      <div className="mb-3">
        <label htmlFor="email" className="form-label">Email</label>
        <input
          id="email"
          name='email'
          type='email'
          className="form-control"
          value={email}
          placeholder='Email'
          onChange={onEmailChange}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          id="password"
          name='password'
          type='password'
          className="form-control"
          value={password}
          placeholder='Password'
          onChange={onPasswordChange}
        />
      </div>

      <button type='submit' className="btn btn-primary w-100">Submit</button>
    </form>
  )
}
