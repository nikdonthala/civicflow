import { useState } from 'react'
import { Shield, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { demoLoginCredentials } from '../data/users'

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    if (email === demoLoginCredentials.email && password === demoLoginCredentials.password) {
      onLogin()
    } else {
      setError('Invalid credentials. Use the demo credentials below.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-civic-50/30 to-saffron-50/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-civic-500 to-civic-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">CivicFlow</h1>
          <p className="text-slate-500 mt-2">Your Public Services, Simplified</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-elevated border border-slate-100 p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Sign in to your account</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="priya.sharma@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pr-12"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-saffron-50 border border-saffron-200 text-saffron-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full btn-primary py-3 text-base"
            >
              Sign in
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 bg-civic-50 rounded-xl border border-civic-100">
            <p className="text-xs font-medium text-civic-700 mb-2">Demo Credentials:</p>
            <p className="text-sm text-civic-800 font-mono">
              Email: {demoLoginCredentials.email}
            </p>
            <p className="text-sm text-civic-800 font-mono">
              Password: {demoLoginCredentials.password}
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Independent hackathon prototype · Not an official government service
        </p>
      </div>
    </div>
  )
}
