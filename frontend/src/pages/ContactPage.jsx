import { useState } from 'react'
import client from '../services/api'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', profession: '', message: '' })
  const [status, setStatus] = useState(null) // 'sending' | 'success' | 'error'
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    setError('')
    try {
      await client.post('/api/misc/contact', {
        name: form.name,
        email: form.email,
        profession: form.profession || undefined,
        message: form.message,
      })
      setStatus('success')
      setForm({ name: '', email: '', profession: '', message: '' })
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const inputClass = 'w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
  const labelClass = 'block text-xs text-gray-400 uppercase tracking-wider mb-1.5'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-white mb-3">Contact</h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Do you like our website? Got an idea how to make it better? Looking for business cooperation?{' '}
          <span className="text-white font-medium">Let us know!</span>
        </p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-900/30 border border-green-700/50 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-white mb-2">Message sent!</h2>
          <p className="text-gray-400 text-sm">Thanks for reaching out. We'll get back to you soon.</p>
          <button
            onClick={() => setStatus(null)}
            className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Name <span className="text-red-500">*</span></label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email <span className="text-red-500">*</span></label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className={labelClass}>Profession <span className="text-gray-600">(optional)</span></label>
            <input
              name="profession"
              type="text"
              value={form.profession}
              onChange={handleChange}
              placeholder="e.g. Data Scientist, Student, Engineer..."
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Message <span className="text-red-500">*</span></label>
            <textarea
              name="message"
              required
              rows={6}
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              className={inputClass + ' resize-none'}
            />
          </div>

          {status === 'error' && (
            <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Sending...
              </span>
            ) : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
