import { useState } from 'react'
import Button from './Button'
import client from '../../services/api'

export default function GuestSignupModal({ onSuccess }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return
    setLoading(true)
    setError(null)
    try {
      await client.post('/api/misc/guest-signup', { name: name.trim(), email: email.trim() })
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <p className="text-4xl mb-3">🚀</p>
          <h2 className="text-2xl font-bold text-white">You've used your 3 free demos</h2>
          <p className="text-gray-400 mt-2 text-sm leading-relaxed">
            Enter your name and email to keep exploring — completely free, no password needed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              required
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button
            disabled={loading}
            className="w-full justify-center py-3 text-base"
          >
            {loading ? 'Signing up…' : 'Continue for free →'}
          </Button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-5">
          No spam. Your email is only used to prevent abuse of AI services.
        </p>
      </div>
    </div>
  )
}
