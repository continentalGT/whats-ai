import { useState } from 'react'
import Button from '../common/Button'

const ROMANIA_CITIES = [
  'Arad','Bucharest','Craiova','Drobeta','Eforie','Fagaras',
  'Giurgiu','Hirsova','Iasi','Lugoj','Mehadia','Neamt',
  'Oradea','Pitesti','Rimnicu','Sibiu','Timisoara','Urziceni','Vaslui','Zerind',
]

const FACETED_DATASET = [
  { name: 'MacBook Pro', category: 'Electronics', brand: 'Apple', price_range: 'High', rating: '5' },
  { name: 'Dell XPS 15', category: 'Electronics', brand: 'Dell', price_range: 'High', rating: '4' },
  { name: 'iPhone 15', category: 'Electronics', brand: 'Apple', price_range: 'High', rating: '5' },
  { name: 'Samsung Galaxy S24', category: 'Electronics', brand: 'Samsung', price_range: 'High', rating: '4' },
  { name: 'Sony WH-1000XM5', category: 'Electronics', brand: 'Sony', price_range: 'Medium', rating: '5' },
  { name: 'Nike Air Max', category: 'Footwear', brand: 'Nike', price_range: 'Medium', rating: '4' },
  { name: 'Adidas Ultraboost', category: 'Footwear', brand: 'Adidas', price_range: 'Medium', rating: '4' },
  { name: 'Levi\'s 501 Jeans', category: 'Clothing', brand: 'Levi\'s', price_range: 'Low', rating: '4' },
  { name: 'Zara Hoodie', category: 'Clothing', brand: 'Zara', price_range: 'Low', rating: '3' },
  { name: 'The Alchemist', category: 'Books', brand: 'HarperCollins', price_range: 'Low', rating: '5' },
  { name: 'Atomic Habits', category: 'Books', brand: 'Penguin', price_range: 'Low', rating: '5' },
  { name: 'Kindle Paperwhite', category: 'Electronics', brand: 'Amazon', price_range: 'Medium', rating: '4' },
]

export default function InputPanel({ demoSlug, onRun, loading, hasResult }) {
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [sentences, setSentences] = useState(['', '', ''])
  const [query, setQuery] = useState('')

  // ── Search shared state ──────────────────────────────────
  const [searchSentences, setSearchSentences] = useState(['', '', '', '', ''])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchK, setSearchK] = useState(3)
  const [kwDocuments, setKwDocuments] = useState('')
  const [kwKeyword, setKwKeyword] = useState('')
  const [kwCaseSensitive, setKwCaseSensitive] = useState(false)
  const [linearItems, setLinearItems] = useState('')
  const [linearTarget, setLinearTarget] = useState('')
  const [binaryItems, setBinaryItems] = useState('')
  const [binaryTarget, setBinaryTarget] = useState('')
  const [hStart, setHStart] = useState('Arad')
  const [hGoal, setHGoal] = useState('Bucharest')
  const [fuzzyItems, setFuzzyItems] = useState('')
  const [fuzzyQuery, setFuzzyQuery] = useState('')
  const [fuzzyThreshold, setFuzzyThreshold] = useState(0.4)
  const [ftDocuments, setFtDocuments] = useState('')
  const [ftQuery, setFtQuery] = useState('')
  const [facetFilters, setFacetFilters] = useState({})

  const inputBase = 'w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm'
  const labelBase = 'text-xs text-gray-500 mb-1.5 uppercase tracking-wider block'

  // ── Semantic Search ──────────────────────────────────────
  if (demoSlug === 'semantic-search') {
    function handleSentenceChange(i, val) {
      setSearchSentences(prev => prev.map((s, idx) => idx === i ? val : s))
    }
    function handleSubmit(e) {
      e.preventDefault()
      const filled = searchSentences.filter(s => s.trim())
      if (!filled.length || !searchQuery.trim()) return
      onRun({ sentences: searchSentences, query: searchQuery, k: searchK })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>5 Sentences (corpus)</p>
            {searchSentences.map((s, i) => (
              <input key={i} type="text" value={s}
                onChange={e => handleSentenceChange(i, e.target.value)}
                placeholder={`Sentence ${i + 1}`}
                className={`${inputBase} mb-2`} />
            ))}
          </div>
          <div>
            <p className={labelBase}>Top-K results: <span className="text-emerald-400 font-bold">{searchK}</span></p>
            <input type="range" min="1" max={searchSentences.filter(s=>s.trim()).length || 5} value={searchK}
              onChange={e => setSearchK(Number(e.target.value))}
              className="w-full accent-emerald-500" />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>1</span><span>5</span></div>
          </div>
          <div>
            <p className={labelBase}>Query</p>
            <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              placeholder="Enter your search query..."
              className={`${inputBase} border-emerald-700 focus:border-emerald-400 focus:ring-emerald-400`} />
          </div>
          <Button type="submit" disabled={loading || !searchSentences.some(s=>s.trim()) || !searchQuery.trim()} className="w-full justify-center">
            {loading ? 'Searching...' : `Search Top-${searchK} ▶`}
          </Button>
        </form>
      </div>
    )
  }

  // ── Keyword Search ───────────────────────────────────────
  if (demoSlug === 'keyword-search') {
    function handleSubmit(e) {
      e.preventDefault()
      const docs = kwDocuments.split('\n').filter(d => d.trim())
      if (!docs.length || !kwKeyword.trim()) return
      onRun({ documents: docs, keyword: kwKeyword, caseSensitive: kwCaseSensitive })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>Documents (one per line)</p>
            <textarea value={kwDocuments} onChange={e => setKwDocuments(e.target.value)}
              placeholder={"The quick brown fox jumps over the lazy dog\nA fox and a hound are friends\nThe dog barked at the fox"}
              rows={5} className={inputBase + ' resize-none'} />
          </div>
          <div>
            <p className={labelBase}>Keyword to find</p>
            <input type="text" value={kwKeyword} onChange={e => setKwKeyword(e.target.value)}
              placeholder="fox" className={`${inputBase} border-emerald-700`} />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={kwCaseSensitive} onChange={e => setKwCaseSensitive(e.target.checked)}
              className="accent-emerald-500" />
            <span className="text-sm text-gray-400">Case sensitive</span>
          </label>
          <Button type="submit" disabled={loading || !kwDocuments.trim() || !kwKeyword.trim()} className="w-full justify-center">
            {loading ? 'Searching...' : 'Find Keyword ▶'}
          </Button>
        </form>
      </div>
    )
  }

  // ── Linear Search ────────────────────────────────────────
  if (demoSlug === 'linear-search') {
    function handleSubmit(e) {
      e.preventDefault()
      const items = linearItems.split(',').map(s => s.trim()).filter(Boolean)
      if (!items.length || !linearTarget.trim()) return
      onRun({ items, target: linearTarget.trim() })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>Items (comma-separated)</p>
            <input type="text" value={linearItems} onChange={e => setLinearItems(e.target.value)}
              placeholder="apple, banana, cherry, mango, grape" className={inputBase} />
          </div>
          <div>
            <p className={labelBase}>Target to find</p>
            <input type="text" value={linearTarget} onChange={e => setLinearTarget(e.target.value)}
              placeholder="mango" className={`${inputBase} border-emerald-700`} />
          </div>
          <Button type="submit" disabled={loading || !linearItems.trim() || !linearTarget.trim()} className="w-full justify-center">
            {loading ? 'Searching...' : 'Run Linear Search ▶'}
          </Button>
        </form>
      </div>
    )
  }

  // ── Binary Search ────────────────────────────────────────
  if (demoSlug === 'binary-search') {
    function handleSubmit(e) {
      e.preventDefault()
      const items = binaryItems.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n))
      const target = Number(binaryTarget)
      if (items.length < 2 || isNaN(target)) return
      onRun({ items, target })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>Numbers (comma-separated — will be sorted)</p>
            <input type="text" value={binaryItems} onChange={e => setBinaryItems(e.target.value)}
              placeholder="3, 15, 7, 42, 21, 8, 55, 1" className={inputBase} />
          </div>
          <div>
            <p className={labelBase}>Target number</p>
            <input type="number" value={binaryTarget} onChange={e => setBinaryTarget(e.target.value)}
              placeholder="21" className={`${inputBase} border-emerald-700`} />
          </div>
          <Button type="submit" disabled={loading || !binaryItems.trim() || binaryTarget === ''} className="w-full justify-center">
            {loading ? 'Searching...' : 'Run Binary Search ▶'}
          </Button>
        </form>
      </div>
    )
  }

  // ── Heuristic Search ─────────────────────────────────────
  if (demoSlug === 'heuristic-search') {
    function handleSubmit(e) {
      e.preventDefault()
      if (!hStart || !hGoal || hStart === hGoal) return
      onRun({ start: hStart, goal: hGoal })
    }
    const selectBase = 'w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all text-sm'
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <p className="text-xs text-gray-500 mb-4">A* on the Romania map. Heuristic = straight-line distance to Bucharest.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>Start City</p>
            <select value={hStart} onChange={e => setHStart(e.target.value)} className={selectBase}>
              {ROMANIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <p className={labelBase}>Goal City</p>
            <select value={hGoal} onChange={e => setHGoal(e.target.value)} className={selectBase}>
              {ROMANIA_CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          {hStart === hGoal && <p className="text-xs text-red-400">Start and goal must be different</p>}
          <Button type="submit" disabled={loading || hStart === hGoal} className="w-full justify-center">
            {loading ? 'Finding Path...' : 'Find Optimal Path ▶'}
          </Button>
        </form>
      </div>
    )
  }

  // ── Fuzzy Search ─────────────────────────────────────────
  if (demoSlug === 'fuzzy-search') {
    function handleSubmit(e) {
      e.preventDefault()
      const items = fuzzyItems.split('\n').map(s => s.trim()).filter(Boolean)
      if (!items.length || !fuzzyQuery.trim()) return
      onRun({ items, query: fuzzyQuery, threshold: fuzzyThreshold })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>Items (one per line)</p>
            <textarea value={fuzzyItems} onChange={e => setFuzzyItems(e.target.value)}
              placeholder={"JavaScript\nTypeScript\nPython\nJava\nGolang\nRuby\nRust"}
              rows={5} className={inputBase + ' resize-none'} />
          </div>
          <div>
            <p className={labelBase}>Search query (typos are OK!)</p>
            <input type="text" value={fuzzyQuery} onChange={e => setFuzzyQuery(e.target.value)}
              placeholder="JavaScrpit" className={`${inputBase} border-emerald-700`} />
          </div>
          <div>
            <p className={labelBase}>Min similarity: <span className="text-emerald-400 font-bold">{fuzzyThreshold.toFixed(2)}</span></p>
            <input type="range" min="0" max="1" step="0.05" value={fuzzyThreshold}
              onChange={e => setFuzzyThreshold(Number(e.target.value))}
              className="w-full accent-emerald-500" />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>0.0</span><span>1.0</span></div>
          </div>
          <Button type="submit" disabled={loading || !fuzzyItems.trim() || !fuzzyQuery.trim()} className="w-full justify-center">
            {loading ? 'Searching...' : 'Fuzzy Search ▶'}
          </Button>
        </form>
      </div>
    )
  }

  // ── Full-Text Search ─────────────────────────────────────
  if (demoSlug === 'full-text-search') {
    function handleSubmit(e) {
      e.preventDefault()
      const docs = ftDocuments.split('---').map(d => d.trim()).filter(Boolean)
      if (!docs.length || !ftQuery.trim()) return
      onRun({ documents: docs, query: ftQuery })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Input</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <p className={labelBase}>Documents (separate with ---)</p>
            <textarea value={ftDocuments} onChange={e => setFtDocuments(e.target.value)}
              placeholder={"Machine learning is a subset of artificial intelligence\n---\nDeep learning uses neural networks with many layers\n---\nNatural language processing helps computers understand human text\n---\nComputer vision enables machines to interpret visual information"}
              rows={7} className={inputBase + ' resize-none'} />
          </div>
          <div>
            <p className={labelBase}>Search query</p>
            <input type="text" value={ftQuery} onChange={e => setFtQuery(e.target.value)}
              placeholder="neural networks learning" className={`${inputBase} border-emerald-700`} />
          </div>
          <Button type="submit" disabled={loading || !ftDocuments.trim() || !ftQuery.trim()} className="w-full justify-center">
            {loading ? 'Searching...' : 'Search Documents ▶'}
          </Button>
        </form>
      </div>
    )
  }

  // ── Faceted Search ───────────────────────────────────────
  if (demoSlug === 'faceted-search') {
    const facetKeys = ['category', 'brand', 'price_range', 'rating']
    const facetOptions = {
      category: ['Books', 'Clothing', 'Electronics', 'Footwear'],
      brand: ['Adidas', 'Amazon', 'Apple', 'Dell', "Levi's", 'Nike', 'Penguin', 'Samsung', 'Sony', 'Zara', 'HarperCollins'],
      price_range: ['Low', 'Medium', 'High'],
      rating: ['3', '4', '5'],
    }
    function toggleFilter(key, val) {
      setFacetFilters(prev => {
        const next = { ...prev }
        if (next[key] === val) delete next[key]
        else next[key] = val
        return next
      })
    }
    function handleSubmit(e) {
      e.preventDefault()
      onRun({ items: FACETED_DATASET, filters: facetFilters })
    }
    return (
      <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
        <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Filters</h3>
        <p className="text-xs text-gray-500 mb-4">Dataset: {FACETED_DATASET.length} products. Select filters to narrow results.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {facetKeys.map(key => (
            <div key={key}>
              <p className={labelBase}>{key.replace('_', ' ')}</p>
              <div className="flex flex-wrap gap-2">
                {facetOptions[key].map(val => {
                  const active = facetFilters[key] === val
                  return (
                    <button key={val} type="button" onClick={() => toggleFilter(key, val)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${active ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-emerald-600 hover:text-emerald-400'}`}>
                      {val}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
          {Object.keys(facetFilters).length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {Object.entries(facetFilters).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1 px-2 py-0.5 bg-emerald-900/40 border border-emerald-700/50 rounded text-xs text-emerald-300">
                  {k}: {v}
                  <button type="button" onClick={() => toggleFilter(k, v)} className="text-emerald-500 hover:text-white">×</button>
                </span>
              ))}
            </div>
          )}
          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? 'Filtering...' : 'Apply Filters ▶'}
          </Button>
        </form>
      </div>
    )
  }

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
