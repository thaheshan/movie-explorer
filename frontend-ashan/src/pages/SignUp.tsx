import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Film, User, Mail, Lock, AlertCircle, ArrowRight, Check, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const mapAuthError = (errorMessage: string): string => {
  const errorMap: Record<string, string> = {
    'User already registered': 'This email is already registered. Please try logging in.',
    'Invalid email': 'Please enter a valid email address.',
    'Password should be at least 8 characters': 'Password must be at least 8 characters.',
    'Email already exists': 'This email is already registered. Please try logging in.',
    'duplicate key': 'This email is already registered. Please try logging in.',
  }

  for (const [key, value] of Object.entries(errorMap)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  return 'Failed to create account. Please try again.'
}

interface PasswordStrength {
  score: number
  feedback: string[]
  isStrong: boolean
}

const validatePasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = []
  let score = 0

  if (password.length >= 8) score += 1
  else feedback.push('At least 8 characters')

  if (password.length >= 12) score += 1
  else if (password.length >= 8) feedback.push('Longer passwords are more secure')

  if (/[a-z]/.test(password)) score += 1
  else feedback.push('Add lowercase letters')

  if (/[A-Z]/.test(password)) score += 1
  else feedback.push('Add uppercase letters')

  if (/[0-9]/.test(password)) score += 1
  else feedback.push('Add numbers')

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1
  else feedback.push('Add special characters')

  return {
    score: Math.min(score, 5),
    feedback,
    isStrong: score >= 4,
  }
}

export default function SignUp() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = validatePasswordStrength(password)

  const validate = (): string => {
    if (username.trim().length < 3) return 'Username must be at least 3 characters.'
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address.'
    if (password.length < 8) return 'Password must be at least 8 characters.'
    if (!passwordStrength.isStrong) return 'Password is not strong enough. ' + passwordStrength.feedback.join(', ') + '.'
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
      await signUp(email, password, username)
      navigate('/')
    } catch (err: unknown) {
      const error = err as { message?: string }
      const sanitizedError = mapAuthError(error.message || '')
      setError(sanitizedError)
    } finally {
      setLoading(false)
    }
  }

  const getStrengthColor = (): string => {
    if (password.length === 0) return 'bg-slate-600'
    if (passwordStrength.score <= 1) return 'bg-red-500'
    if (passwordStrength.score <= 2) return 'bg-orange-500'
    if (passwordStrength.score <= 3) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  const getStrengthLabel = (): string => {
    if (password.length === 0) return ''
    if (passwordStrength.score <= 1) return 'Weak'
    if (passwordStrength.score <= 2) return 'Fair'
    if (passwordStrength.score <= 3) return 'Good'
    return 'Strong'
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-block p-3 mb-4 shadow-lg bg-gradient-to-r from-red-600 to-pink-600 rounded-xl shadow-red-500/25">
            <Film className="w-8 h-8 text-white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-white">Join Movie Explorer</h1>
          <p className="text-sm text-slate-400">Create an account and start reviewing movies</p>
        </div>

        {/* Form Card */}
        <div className="p-8 border shadow-2xl bg-slate-800/50 backdrop-blur-xl rounded-2xl border-slate-700/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 px-4 py-3 border bg-red-500/10 border-red-500/30 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-slate-300">
                Username
              </label>
              <div className="relative">
                <User className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-500" />
                <input
                  id="username"
                  type="text"
                  placeholder="Choose your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-slate-500">Minimum 3 characters</p>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-500" />
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2 text-slate-500" />
                <input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full rounded-2xl border border-slate-700 bg-slate-800/80 py-3.5 pl-12 pr-4 text-white placeholder-slate-500 transition-all duration-300 focus:border-red-500 focus:outline-none focus:ring-4 focus:ring-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Password Strength Indicator */}
              {password.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 overflow-hidden rounded-full bg-slate-700">
                      <div
                        className={`h-full ${getStrengthColor()} transition-all duration-300`}
                        style={{
                          width: `${(passwordStrength.score / 5) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-400">{getStrengthLabel()}</span>
                  </div>

                  {/* Password Requirements */}
                  {passwordStrength.feedback.length > 0 && (
                    <div className="bg-slate-900/50 rounded-lg p-3 space-y-1.5">
                      {passwordStrength.feedback.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                          <X className="w-3 h-3 text-red-400" />
                          {item}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Password Strength Met */}
                  {passwordStrength.isStrong && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10">
                      <Check className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-green-300">Password is strong</span>
                    </div>
                  )}
                </div>
              )}

              <p className="text-xs text-slate-500">
                Minimum 8 characters with uppercase, lowercase, numbers, and symbols
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !passwordStrength.isStrong}
              className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-pink-600 px-4 py-3.5 font-semibold text-white shadow-lg shadow-red-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-red-500 hover:to-pink-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
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
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <span>Create Account</span>
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
                <span className="px-4 text-sm bg-slate-800/50 text-slate-500">Already a member?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="block w-full rounded-2xl border border-slate-700 bg-slate-800/60 px-4 py-3.5 text-center font-medium text-slate-200 transition-all duration-300 hover:border-slate-600 hover:bg-slate-800 hover:text-white hover:shadow-lg"
            >
              Sign In Instead
            </Link>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-xs text-center text-slate-500">
          By signing up, you agree to our{' '}
          <a href="#" className="text-red-500 transition-colors hover:text-red-400">
            Terms
          </a>{' '}
          and{' '}
          <a href="#" className="text-red-500 transition-colors hover:text-red-400">
            Privacy
          </a>
        </p>
      </div>
    </div>
  )
}