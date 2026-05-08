import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Film, Mail, Lock, AlertCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const mapAuthError = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    'Invalid login credentials': 'Email or password is incorrect.',
    'User not found': 'Email or password is incorrect.',
    'Email not confirmed': 'Please confirm your email before signing in.',
    'User already registered': 'This email is already registered.',
    'Invalid email': 'Please enter a valid email address.',
    'Password should be at least 8 characters': 'Password must be at least 8 characters.',
  }

  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  return 'Failed to log in. Please try again.'
}

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const validate = (): string => {
    if (!/\S+@\S+\.\S+/.test(email)) {
      return 'Please enter a valid email address.'
    }

    if (password.length < 8) {
      return 'Password must be at least 8 characters.'
    }

    return ''
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setError('')
      setLoading(true)
      await signIn(email, password)
      navigate('/')
    } catch (err: unknown) {
      const error = err as { message?: string }
      const sanitizedError = mapAuthError(error.message || '')
      setError(sanitizedError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 py-12 overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(239,68,68,0.15),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(168,85,247,0.12),_transparent_35%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 shadow-2xl rounded-3xl bg-gradient-to-br from-red-600 via-red-500 to-pink-600 shadow-red-500/25">
            <Film className="w-10 h-10 text-white" />
          </div>

          <h1 className="mb-3 text-4xl font-bold text-transparent bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
            Movie Review Hub
          </h1>
          <p className="text-base text-slate-400">
            Welcome back! Sign in to continue your cinematic journey.
          </p>
        </div>

        {/* Login Card */}
        <div className="p-8 border shadow-2xl rounded-3xl border-slate-800/80 bg-slate-900/90 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-start gap-3 px-4 py-4 border rounded-2xl border-red-500/30 bg-red-500/10">
                <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-400" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-red-400 transition-colors hover:text-red-300"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-red-500 hover:to-pink-500 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Signing In...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm bg-slate-900 text-slate-500">New to Movie Review Hub?</span>
              </div>
            </div>

            {/* Sign Up */}
            <Link
              to="/signup"
              className="block w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3.5 text-center font-medium text-slate-200 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white"
            >
              Create an Account
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-sm text-center text-slate-500">
          By signing in, you agree to our{' '}
          <a href="#" className="text-red-400 hover:text-red-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-red-400 hover:text-red-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}