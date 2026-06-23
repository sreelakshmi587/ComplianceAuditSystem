import { useState } from 'react'
import '../styles/auth.css'
import googleIcon from '../assets/google.png'
import { register, login, forgotPassword } from '../services/authService'

export default function Auth({ onAuthSuccess }) {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup' | 'forgot'
  const [form, setForm] = useState({ email: '', password: '', username: '', confirmPassword: '' })
  const [statusMessage, setStatusMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((s) => ({ ...s, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatusMessage('')

     if (mode === 'forgot') {

    if (!form.email?.trim()) {
      setStatusMessage('Please enter your email address.');
      return;
    }

    if (!form.password || !form.confirmPassword) {
      setStatusMessage('Please enter and confirm your new password.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setStatusMessage('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);

      const response = await forgotPassword({
        email: form.email,
        newPassword: form.password,
        confirmPassword: form.confirmPassword
      });

      setStatusMessage(
        response.data || 'Password updated successfully. Please sign in.'
      );

      setMode('signin');

      setForm((s) => ({
        ...s,
        password: '',
        confirmPassword: ''
      }));

    } catch (error) {

      console.error('Password reset failed', error);

      setStatusMessage(
        error.response?.data ||
        'Unable to reset password right now. Please try again later.'
      );

    } finally {
      setSubmitting(false);
    }

    return;
  }

    if (mode === 'signin') {
      try {
        setSubmitting(true)
        const loginResponse = await login({
          email: form.email,
          password: form.password
        })

        localStorage.setItem('token', loginResponse.data.token)
        localStorage.setItem('username', loginResponse.data.username)

        if (typeof onAuthSuccess === 'function') {
          onAuthSuccess({
            provider: 'local',
            email: form.email,
            username: loginResponse.data.username || form.username
          })
        }
      } catch (error) {
        console.error('Login failed', error)
        alert(error.response?.data || 'Login failed')
      } finally {
        setSubmitting(false)
      }

      return
    }

    if (mode === 'signup') {
      try {
        setSubmitting(true)
        await register({
          username: form.username,
          email: form.email,
          password: form.password
        })

        alert('User registered successfully')

        if (typeof onAuthSuccess === 'function') {
          onAuthSuccess({
            provider: 'local',
            email: form.email,
            username: form.username
          })
        }
      } catch (error) {
        console.error('Registration failed', error)
        alert(error.response?.data || 'Registration failed')
      } finally {
        setSubmitting(false)
      }
    }
  }

  function handleForgotMode() {
    setMode('forgot')
    setStatusMessage('')
  }

  function handleBackToSignIn() {
    setMode('signin')
    setStatusMessage('')
    setForm((s) => ({ ...s, password: '', confirmPassword: '' }))
  }

  function handleGoogleAuth() {
    if (mode === 'signin') {
      console.log('Google sign in initiated')
      alert('Google Sign In (demo)')
      if (typeof onAuthSuccess === 'function') onAuthSuccess({ provider: 'google', email: form.email, username: form.username })
    } else {
      console.log('Google sign up initiated')
      alert('Google Sign Up (demo)')
      if (typeof onAuthSuccess === 'function') onAuthSuccess({ provider: 'google', email: form.email, username: form.username })
    }
  }

  const title =
    mode === 'signin'
      ? 'Sign in to your account'
      : mode === 'signup'
      ? 'Create your account'
      : 'Reset your password'

  const subtitle =
    mode === 'forgot'
      ? 'Enter your email and set a new password to continue.'
      : 'Enter your credentials or use Google to continue'

  return (
    <div className="auth-root">
      <aside className="auth-left">
        <div className="welcome">
          <h1>Welcome!</h1>
          <p>
            Sign in to access your dashboard and manage your audits with ease.
            Your secure workspace awaits.
          </p>
        </div>
      </aside>

      <main className="auth-right">
        <div className="auth-card">
          <div className="auth-header">
            <h2>{title}</h2>
            <p className="muted">{subtitle}</p>
          </div>

          {mode !== 'forgot' && (
            <>
              <button type="button" className="google-btn" onClick={handleGoogleAuth}>
                <img src={googleIcon} alt="Google" className="google-icon" />
                Continue with Google
              </button>

              <div className="divider">Or continue with email</div>
            </>
          )}

          <div className="tabs">
            <button className={mode === 'signin' ? 'active' : ''} onClick={() => setMode('signin')}>
              Sign in
            </button>
            <button className={mode === 'signup' ? 'active' : ''} onClick={() => setMode('signup')}>
              Sign up
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <label className="field">
                <span>Username</span>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="yourname"
                  required
                />
              </label>
            )}

            <label className="field">
              <span>Email address</span>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
              />
            </label>

            <label className="field">
              <span>{mode === 'forgot' ? 'New password' : 'Password'}</span>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
              />
            </label>

            {mode === 'forgot' && (
              <label className="field">
                <span>Confirm new password</span>
                <input
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </label>
            )}

            {mode === 'signin' && (
              <div className="forgot-row" style={{ marginBottom: 12, textAlign: 'left' }}>
                <button type="button" className="link" onClick={handleForgotMode}>
                  Forgot password?
                </button>
              </div>
            )}

            <div className="form-actions">
              <button type="submit" className="primary" disabled={submitting}>
                {mode === 'signin'
                  ? 'Sign in'
                  : mode === 'signup'
                  ? 'Create account'
                  : 'Reset password'}
              </button>
            </div>
          </form>

          {statusMessage && (
            <p className="small muted" style={{ marginTop: 12 }}>
              {statusMessage}
            </p>
          )}

          {mode !== 'forgot' ? (
            <p className="small muted">
              {mode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button className="link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>
                {mode === 'signin' ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          ) : (
            <p className="small muted">
              Remembered your password?{' '}
              <button className="link" onClick={handleBackToSignIn}>
                Back to sign in
              </button>
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
