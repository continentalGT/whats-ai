import { useState } from 'react'
import Button from '../common/Button'

export default function InputPanel({ demoSlug, onRun, loading, hasResult }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [sentences, setSentences] = useState(['', '', ''])
  const [query, setQuery] = useState('')

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

  if (demoSlug === 'sentence-similarity') {
    function handleSentenceChange(i, value) {
      setSentences(prev => prev.map((s, idx) => idx === i ? value : s))
    }
    function handleSubmit(e) {
      e.preventDefault()
      const filled = sentences.filter(s => s.trim())
      if (filled.length === 0 || !query.trim()) return
      onRun({ sentences, query })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Sentences to compare</p>
            {sentences.map((s, i) => (
              <input
                key={i}
                type="text"
                value={s}
                onChange={e => handleSentenceChange(i, e.target.value)}
                placeholder={`Sentence ${i + 1}`}
                className="w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all mb-2 text-sm"
              />
            ))}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Query sentence</p>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Enter the sentence to compare against..."
              className="w-full bg-gray-800/60 border border-violet-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all text-sm"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || sentences.every(s => !s.trim()) || !query.trim()}
            className="w-full justify-center"
          >
            {loading ? 'Computing...' : 'Compare Sentences ▶'}
          </Button>
        </form>
      </div>
    )
  }

  if (demoSlug === 'object-detection' || demoSlug === 'image-captioning') {
    const isCaption = demoSlug === 'image-captioning'
    const accentBorder = isCaption ? 'border-violet-600' : 'border-cyan-600'
    const accentText = isCaption ? 'text-violet-400' : 'text-cyan-400'
    const runLabel = isCaption ? 'Caption Image ▶' : 'Detect Objects ▶'
    const loadingLabel = isCaption ? 'Captioning...' : 'Detecting...'

    // Compact bar shown after a result exists — only for object-detection
    // (image-captioning output is text only, so keep the full image preview visible)
    if (hasResult && !isCaption) {
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
              {loading ? loadingLabel : 'Re-run ▶'}
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
              <div className={`relative rounded-lg overflow-hidden border-2 ${accentBorder}`}>
                <img src={preview} alt="Selected" className="w-full object-contain max-h-72" />
                <div className={`absolute bottom-0 left-0 right-0 bg-black/60 text-xs ${accentText} px-3 py-1.5 truncate`}>
                  {file.name} — click to change
                </div>
              </div>
            ) : (
              <div className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-600 hover:${accentBorder} rounded-lg transition-colors text-gray-500`}>
                <p className="text-3xl mb-2">🖼️</p>
                <p className="text-sm">Click to upload an image</p>
                <p className="text-xs mt-1">PNG, JPG, WEBP supported</p>
              </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
          <div className="flex gap-2">
            <Button type="submit" disabled={loading || !file} className="flex-1 justify-center">
              {loading ? loadingLabel : runLabel}
            </Button>
            {hasResult && isCaption && (
              <label className="cursor-pointer flex items-center justify-center px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300 hover:border-violet-500 hover:text-violet-400 transition-colors shrink-0">
                Upload New
                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
            )}
          </div>
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
