import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        await login(email, password)
      } else {
        await register(email, username, password)
      }
      navigate('/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2 rounded-lg bg-parchment-50 dark:bg-ink-800 text-ink-900 dark:text-parchment-50 placeholder-ink-700/40 dark:placeholder-parchment-200/40 border border-parchment-200 dark:border-ink-700 outline-none focus:ring-2 focus:ring-violet-500'

  return (
    <div className="min-h-screen bg-parchment-50 dark:bg-ink-950 text-ink-900 dark:text-parchment-50 flex items-center justify-center px-4 transition-colors">
      <div className="w-full max-w-sm bg-parchment-100 dark:bg-ink-900 rounded-2xl p-8 shadow-xl">
        <h1 className="font-display text-3xl font-bold text-center mb-2">
          <span className="text-gold-500 dark:text-gold-400">Level</span>
          <span className="text-violet-500 dark:text-violet-400">Up</span> 🎮
        </h1>
        <p className="text-ink-700/70 dark:text-parchment-200/70 text-center mb-6">
          {mode === 'login' ? 'Welcome back, adventurer' : 'Begin your quest'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
          />

          {mode === 'register' && (
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={inputClass}
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={inputClass}
          />

          {error && <p className="text-crimson-500 dark:text-crimson-400 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-violet-500 hover:bg-violet-600 text-white disabled:opacity-50 font-semibold transition active:scale-95"
          >
            {loading ? 'Please wait...' : mode === 'login' ? 'Log In' : 'Register'}
          </button>
        </form>

        <p className="text-center text-ink-700/70 dark:text-parchment-200/70 text-sm mt-4">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-violet-500 dark:text-violet-400 hover:underline"
          >
            {mode === 'login' ? 'Register' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  )
}