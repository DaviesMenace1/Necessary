'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [showPwd, setShowPwd] = useState(false)
  const [form, setForm] = useState({ email: '', password: '', fullName: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // In production: call Supabase auth
      // const supabase = createClient()
      // if (mode === 'signin') await supabase.auth.signInWithPassword(...)
      // else await supabase.auth.signUp(...)
      await new Promise(r => setTimeout(r, 1200)) // simulate
      window.location.href = '/client'
    } catch {
      setError('Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-obsidian-950 flex">
      {/* Left panel: branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80')` }}
        />
        <div className="absolute inset-0 bg-obsidian-950/70" />
        <div className="relative z-10 flex flex-col justify-between p-16 w-full">
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-serif text-3xl font-light tracking-[0.25em] text-ivory">INTERIO</span>
            <span className="text-[9px] tracking-[0.35em] text-champagne-400 uppercase font-light mt-1">Design · Source · Install</span>
          </Link>
          <div>
            <blockquote className="font-serif text-2xl font-light text-ivory leading-relaxed mb-6">
              &ldquo;Every great space begins with a single conversation.&rdquo;
            </blockquote>
            <div className="divider-luxury" />
            <p className="text-obsidian-400 text-sm font-light leading-relaxed mt-4 max-w-sm">
              Access your private client portal to track projects, review sourced materials, and manage your procurement timeline.
            </p>
          </div>
        </div>
      </div>

      {/* Right panel: form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex flex-col items-center leading-none">
              <span className="font-serif text-3xl font-light tracking-[0.25em] text-ivory">INTERIO</span>
              <span className="text-[9px] tracking-[0.35em] text-champagne-400 uppercase font-light mt-1">Design · Source · Install</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-light text-ivory mb-2">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-obsidian-500 text-sm font-light">
              {mode === 'signin'
                ? 'Sign in to your client portal'
                : 'Join to track your design projects'}
            </p>
          </div>

          {/* Mode toggle */}
          <div className="flex mb-8 border-b border-obsidian-800">
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 pb-3 text-[11px] tracking-[0.15em] uppercase transition-colors ${
                  mode === m
                    ? 'text-champagne-400 border-b-2 border-champagne-500 -mb-px'
                    : 'text-obsidian-500 hover:text-obsidian-300'
                }`}
              >
                {m === 'signin' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div>
                <label className="text-[9px] tracking-[0.2em] uppercase text-obsidian-500 block mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={e => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Your full name"
                  className="input-luxury text-ivory"
                />
              </div>
            )}

            <div>
              <label className="text-[9px] tracking-[0.2em] uppercase text-obsidian-500 block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="your@email.com"
                className="input-luxury text-ivory"
              />
            </div>

            <div>
              <label className="text-[9px] tracking-[0.2em] uppercase text-obsidian-500 block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="input-luxury text-ivory pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-0 top-0.5 text-obsidian-600 hover:text-obsidian-400 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-400/10 border border-red-400/20 px-4 py-3 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-champagne-500 text-obsidian-950 text-[11px] font-medium tracking-[0.15em] uppercase hover:bg-champagne-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-block w-4 h-4 border-2 border-obsidian-950/30 border-t-obsidian-950 rounded-full animate-spin" />
              ) : (
                <>
                  {mode === 'signin' ? 'Sign In' : 'Create Account'}
                  <ArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-obsidian-600 text-xs">
            Are you staff?{' '}
            <Link href="/admin" className="text-champagne-500 hover:text-champagne-400 transition-colors">
              Staff Portal →
            </Link>
          </p>

          <div className="mt-8 pt-6 border-t border-obsidian-900">
            <Link href="/" className="text-[10px] tracking-[0.15em] uppercase text-obsidian-600 hover:text-obsidian-400 transition-colors">
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
