import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import './login.css'


export default function Login() {
  const navigate = useNavigate();

  // Form state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [touched, setTouched] = useState({ email: false, password: false })
  const formRef = useRef(null)

  // Validation helpers
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const passwordValid = password.length >= 6
  const formValid = emailValid && passwordValid

  useEffect(() => {
    if (submitting) {
      const timer = setTimeout(() => {
        // Fake auth outcome
        if (email === 'admin@example.com' && password === 'password123') {
          setError(null)
          navigate('/login/admin')
        } else if (email === 'user@example.com' && password === 'password123') {
          setError(null)
          navigate('/login/customer')
        } else {
          setError('Invalid credentials. Try admin@example.com or user@example.com with password123')
          // Shake animation trigger
          if (formRef.current) {
            formRef.current.classList.remove('shake')
            // force reflow
            // eslint-disable-next-line no-unused-expressions
            formRef.current.offsetWidth
            formRef.current.classList.add('shake')
          }
        }
        setSubmitting(false)
      }, 1200)
      return () => clearTimeout(timer)
    }
  }, [submitting, email, password, navigate])

  const handleSubmit = (e) => {
    e.preventDefault()
    setTouched({ email: true, password: true })
    if (!formValid) return
    setSubmitting(true)
  }

  const showEmailError = touched.email && !emailValid
  const showPasswordError = touched.password && !passwordValid

  return (
    <div style={{ paddingTop: '55px' }}>
      <div className='sign-split-screen'>
        <div className='sign-left'>
          <h3>for admin</h3>
          <p>
            Access your personalized dashboard, track academic progress, submit assignments, and stay updated with the latest announcements. Empower your learning journey with a seamless and secure student experience.
          </p>
          <button onClick={() => navigate('/login/admin')}>Login</button>
        </div>
        <div className='sign-right'>
          <h3>for users</h3>
          <p>
            Manage your classes, upload materials, evaluate student performance, and communicate efficiently. Streamline your teaching workflow with all the tools you need in one place.
          </p>
          {/* Interactive Login Panel */}
          <form ref={formRef} className='login-panel' onSubmit={handleSubmit} noValidate>
            <div className='form-field'>
              <label htmlFor='email'>Email</label>
              <input
                id='email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(t => ({ ...t, email: true }))}
                placeholder='you@example.com'
                aria-invalid={showEmailError}
                aria-describedby={showEmailError ? 'email-error' : undefined}
                disabled={submitting}
              />
              {showEmailError && (
                <div id='email-error' className='field-error'>Enter a valid email address</div>
              )}
            </div>

            <div className='form-field'>
              <label htmlFor='password'>Password</label>
              <div className='password-wrapper'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched(t => ({ ...t, password: true }))}
                  placeholder='••••••'
                  aria-invalid={showPasswordError}
                  aria-describedby={showPasswordError ? 'password-error' : undefined}
                  disabled={submitting}
                />
                <button
                  type='button'
                  className='toggle-password'
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {showPasswordError && (
                <div id='password-error' className='field-error'>Minimum 6 characters</div>
              )}
            </div>

            <div className='form-row'>
              <label className='remember'>
                <input
                  type='checkbox'
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  disabled={submitting}
                /> Remember me
              </label>
              <button
                type='submit'
                className='primary-btn'
                disabled={!formValid || submitting}
              >
                {submitting ? 'Signing in…' : 'Sign In'}
              </button>
            </div>

            {error && <div className='form-error global'>{error}</div>}
            {!error && submitting && <div className='loading-hint'>Authenticating…</div>}

            <div className='divider'><span>or</span></div>
            <div className='alt-actions'>
              <button type='button' className='secondary-btn' disabled={submitting}>Continue with Google</button>
              <button type='button' className='secondary-btn' disabled={submitting}>Continue with Microsoft</button>
            </div>
            <h6>
              Don't have an account? <Link to="/signup">Sign Up</Link>
            </h6>
          </form>
        </div>
      </div>
    </div>
  )
}
