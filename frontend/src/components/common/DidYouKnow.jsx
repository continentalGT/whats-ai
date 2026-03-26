import { useState } from 'react'
import { createPortal } from 'react-dom'
import client from '../../services/api'

const STORAGE_KEY = 'dyk_cache'

function getTodayKey() {
  return new Date().toISOString().slice(0, 10)
}

function loadCached() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const { date, fact } = JSON.parse(raw)
    if (date === getTodayKey()) return fact
  } catch {}
  return null
}

function saveCache(fact) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: getTodayKey(), fact }))
}

export default function DidYouKnow() {
  const [open, setOpen] = useState(false)
  const [fact, setFact] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleOpen() {
    if (open) { setOpen(false); return }
    setOpen(true)

    const cached = loadCached()
    if (cached) { setFact(cached); return }

    setLoading(true)
    setFact(null)
    setError(null)
    try {
      const res = await client.get('/api/misc/did-you-know')
      const f = res.data.fact
      saveCache(f)
      setFact(f)
    } catch {
      setError("Could not load today's fact.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shrink-0">
      {/* Label + button */}
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-violet-400 font-medium whitespace-nowrap leading-none">Did you know?</span>
        <button
          onClick={handleOpen}
          title="Did you know?"
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all border ${open ? 'bg-violet-700/40 border-violet-500 scale-110' : 'bg-gray-800/60 border-gray-700 hover:border-violet-500 hover:bg-violet-900/30'}`}
        >
          💡
        </button>
      </div>

      {/* Modal rendered at document.body via portal */}
      {open && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-gray-900 border border-violet-700/50 rounded-3xl shadow-2xl shadow-violet-900/40 p-10">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white transition-colors text-lg"
            >
              ×
            </button>

            <div className="flex items-center gap-3 mb-6">
              <span className="text-4xl">💡</span>
              <span className="text-xl font-bold text-violet-300 uppercase tracking-wider">Did You Know?</span>
            </div>

            <div className="min-h-[100px] flex items-center">
              {loading && (
                <div className="flex items-center gap-3 text-gray-400">
                  <span className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin shrink-0" />
                  <span>Loading today's fact...</span>
                </div>
              )}
              {error && <p className="text-red-400">{error}</p>}
              {fact && <p className="text-white text-lg leading-relaxed">{fact}</p>}
            </div>

            <p className="text-sm text-gray-600 mt-8 pt-4 border-t border-gray-800">
              One new fact every day
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
