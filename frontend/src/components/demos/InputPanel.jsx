import { useState } from 'react'
import Button from '../common/Button'

export default function InputPanel({ demoSlug, onRun, loading }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onRun({ text })
  }

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter text to analyze..."
          rows={5}
          className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
        />
        <Button type="submit" disabled={loading || !text.trim()} className="w-full justify-center">
          {loading ? 'Running...' : 'Run Demo ▶'}
        </Button>
      </form>
    </div>
  )
}
