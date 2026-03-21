import { useState } from 'react'
import Button from '../common/Button'

export default function InputPanel({ demoSlug, onRun, loading, hasResult }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)

  function handleTextSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    onRun({ text })
  }

  function handleFileChange(e) {
    const selected = e.target.files[0]
    if (selected) {
      setFile(selected)
      setPreview(URL.createObjectURL(selected))
    }
  }

  function handleImageSubmit(e) {
    e.preventDefault()
    if (!file) return
    onRun({ file })
  }

  if (demoSlug === 'object-detection') {
    // Compact bar shown after a result exists
    if (hasResult) {
      return (
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4">
          <form onSubmit={handleImageSubmit} className="flex items-center gap-3">
            {preview && (
              <img src={preview} alt="thumb" className="h-10 w-10 object-cover rounded border border-gray-600 shrink-0" />
            )}
            <label className="flex items-center gap-2 cursor-pointer flex-1 min-w-0">
              <span className="text-sm text-gray-400 truncate">
                {file ? file.name : 'Choose a different image'}
              </span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <Button type="submit" disabled={loading || !file} variant="secondary">
              {loading ? 'Detecting...' : 'Re-run ▶'}
            </Button>
          </form>
        </div>
      )
    }

    // Initial upload state
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleImageSubmit} className="space-y-4">
          <label className="block cursor-pointer">
            {preview ? (
              <div className="relative rounded-lg overflow-hidden border-2 border-cyan-600">
                <img src={preview} alt="Selected" className="w-full object-contain max-h-72" />
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-cyan-400 px-3 py-1.5 truncate">
                  {file.name} — click to change
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 hover:border-cyan-600 rounded-lg transition-colors text-gray-500">
                <p className="text-3xl mb-2">🖼️</p>
                <p className="text-sm">Click to upload an image</p>
                <p className="text-xs mt-1">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <Button type="submit" disabled={loading || !file} className="w-full justify-center">
            {loading ? 'Detecting...' : 'Detect Objects ▶'}
          </Button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
      <form onSubmit={handleTextSubmit} className="space-y-4">
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
