import { getSentimentColor, getSentimentEmoji } from '../../utils/formatters'
import Loader from '../common/Loader'

export default function OutputPanel({ result, loading, error, demoSlug }) {
  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Output</h3>
      {loading && <Loader />}
      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}
      {!loading && !error && !result && (
        <div className="text-center text-gray-500 py-8">
          <p className="text-4xl mb-3">⚡</p>
          <p className="text-sm">Run the demo to see results here</p>
        </div>
      )}

      {/* Sentiment output */}
      {!loading && !error && result && demoSlug === 'sentiment' && (
        <div className="space-y-4">
          <div className="text-center py-4">
            <div className="text-6xl mb-3">{getSentimentEmoji(result.label)}</div>
            <div className={`text-2xl font-bold ${getSentimentColor(result.label)}`}>
              {result.label?.toUpperCase()}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Confidence</span>
              <span className="text-white font-medium">
                {result.score != null ? `${(result.score * 100).toFixed(1)}%` : 'N/A'}
              </span>
            </div>
            {result.score != null && (
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    result.label?.toLowerCase() === 'positive' ? 'bg-green-500' :
                    result.label?.toLowerCase() === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${(result.score * 100).toFixed(1)}%` }}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Object Detection output */}
      {!loading && !error && result && demoSlug === 'object-detection' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">
              {result.count} object{result.count !== 1 ? 's' : ''} detected
            </span>
            <span className="text-xs text-gray-600 truncate ml-4">{result.model}</span>
          </div>

          {result.annotated_image && (
            <img
              src={result.annotated_image}
              alt="Annotated detection result"
              className="w-full rounded-lg border border-gray-700 shadow-lg"
            />
          )}

          {result.detections.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Detections
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {result.detections.map((det, i) => (
                  <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white font-medium capitalize">{det.label}</span>
                      <span className="text-cyan-400 font-mono text-sm font-semibold">
                        {(det.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5 mb-2">
                      <div
                        className="h-1.5 rounded-full bg-cyan-600 transition-all duration-500"
                        style={{ width: `${(det.score * 100).toFixed(1)}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 font-mono">
                      ({det.box.xmin}, {det.box.ymin}) → ({det.box.xmax}, {det.box.ymax})
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sentence Similarity output */}
      {!loading && !error && result && demoSlug === 'sentence-similarity' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-sm">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Query  </span>
            <span className="text-violet-300 font-medium">"{result.query}"</span>
          </div>
          <div className="space-y-3">
            {result.results.map((item, i) => {
              const pct = (item.score * 100).toFixed(1)
              const barColor = item.score >= 0.7 ? 'bg-green-500' : item.score >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
              const scoreColor = item.score >= 0.7 ? 'text-green-400' : item.score >= 0.4 ? 'text-yellow-400' : 'text-red-400'
              return (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2 gap-3">
                    <p className="text-white text-sm leading-relaxed">"{item.sentence}"</p>
                    <span className={`font-mono font-bold text-sm shrink-0 ${scoreColor}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-600 text-right">{result.model}</p>
        </div>
      )}

      {/* Image Captioning output */}
      {!loading && !error && result && demoSlug === 'image-captioning' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Generated Caption</p>
            <p className="text-white text-lg leading-relaxed font-medium">
              "{result.caption}"
            </p>
          </div>
          <p className="text-xs text-gray-600 text-right truncate">{result.model}</p>
        </div>
      )}

      {/* ── Semantic Search output ── */}
      {!loading && !error && result && demoSlug === 'semantic-search' && (
        <div className="space-y-4">
          <div className="bg-gray-800/50 rounded-lg px-4 py-3 text-sm">
            <span className="text-gray-500 text-xs uppercase tracking-wider">Query  </span>
            <span className="text-emerald-300 font-medium">"{result.query}"</span>
            <span className="ml-3 text-xs text-gray-600">top-{result.k}</span>
          </div>
          <div className="space-y-3">
            {result.results.map((item, i) => {
              const pct = (item.score * 100).toFixed(1)
              const barColor = item.score >= 0.7 ? 'bg-green-500' : item.score >= 0.4 ? 'bg-yellow-500' : 'bg-red-500'
              const scoreColor = item.score >= 0.7 ? 'text-green-400' : item.score >= 0.4 ? 'text-yellow-400' : 'text-red-400'
              return (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-emerald-500 bg-emerald-900/40 border border-emerald-700/50 rounded-full w-5 h-5 flex items-center justify-center shrink-0">#{item.rank}</span>
                    <p className="text-white text-sm leading-relaxed flex-1">"{item.sentence}"</p>
                    <span className={`font-mono font-bold text-sm shrink-0 ${scoreColor}`}>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-gray-600 text-right">{result.model}</p>
        </div>
      )}

      {/* ── Keyword Search output ── */}
      {!loading && !error && result && demoSlug === 'keyword-search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400"><span className="text-emerald-400 font-bold">{result.total_matches}</span> match{result.total_matches !== 1 ? 'es' : ''} across <span className="text-white">{result.total_documents}</span> documents</span>
          </div>
          {result.total_matches === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No matches found for "{result.keyword}"</p>
          ) : (
            <div className="space-y-2">
              {result.matches.map((m, i) => {
                const before = m.document.substring(0, m.position)
                const kw = m.document.substring(m.position, m.position + result.keyword.length)
                const after = m.document.substring(m.position + result.keyword.length)
                return (
                  <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Doc #{m.index + 1} · pos {m.position}</p>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {before}<span className="bg-emerald-500/30 text-emerald-300 font-bold px-0.5 rounded">{kw}</span>{after}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Linear Search output ── */}
      {!loading && !error && result && demoSlug === 'linear-search' && (
        <div className="space-y-4">
          <div className={`text-center py-3 rounded-lg ${result.found ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
            <p className={`font-bold text-lg ${result.found ? 'text-green-400' : 'text-red-400'}`}>
              {result.found ? `Found at index ${result.found_at}` : 'Not Found'}
            </p>
            <p className="text-xs text-gray-500 mt-1">{result.comparisons} comparison{result.comparisons !== 1 ? 's' : ''}</p>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Step-by-step trace</p>
          <div className="flex flex-wrap gap-2">
            {result.steps.map((step, i) => (
              <div key={i} className={`px-3 py-2 rounded-lg border text-sm font-mono transition-all ${step.match ? 'bg-green-900/40 border-green-500 text-green-300' : 'bg-gray-800/60 border-gray-700 text-gray-400'}`}>
                <span className="text-xs text-gray-600 block">[{step.index}]</span>
                {step.item}
                {step.match && <span className="ml-1 text-green-400">✓</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Binary Search output ── */}
      {!loading && !error && result && demoSlug === 'binary-search' && (
        <div className="space-y-4">
          <div className={`text-center py-3 rounded-lg ${result.found ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
            <p className={`font-bold text-lg ${result.found ? 'text-green-400' : 'text-red-400'}`}>
              {result.found ? `Found ${result.target} at index ${result.found_at}` : `${result.target} not found`}
            </p>
            <p className="text-xs text-gray-500 mt-1">{result.comparisons} comparison{result.comparisons !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Sorted array</p>
            <div className="flex flex-wrap gap-1">
              {result.sorted_items.map((v, i) => (
                <span key={i} className={`px-2 py-1 rounded text-xs font-mono border ${result.found && i === result.found_at ? 'bg-green-900/40 border-green-500 text-green-300' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>{v}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-gray-500 uppercase tracking-wider">Steps</p>
          <div className="space-y-2">
            {result.steps.map((step, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">Step {i + 1}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${step.comparison === 'equal' ? 'bg-green-900/40 text-green-400' : step.comparison === 'go_left' ? 'bg-blue-900/40 text-blue-400' : 'bg-orange-900/40 text-orange-400'}`}>
                    {step.comparison === 'equal' ? '✓ Match' : step.comparison === 'go_left' ? '← Go Left' : '→ Go Right'}
                  </span>
                </div>
                <div className="flex gap-4 text-xs font-mono text-gray-400">
                  <span>low=<span className="text-white">{step.low}</span></span>
                  <span>mid=<span className="text-emerald-400 font-bold">{step.mid}</span> ({step.mid_value})</span>
                  <span>high=<span className="text-white">{step.high}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Heuristic Search (A*) output ── */}
      {!loading && !error && result && demoSlug === 'heuristic-search' && (
        <div className="space-y-4">
          <div className={`text-center py-3 rounded-lg ${result.found ? 'bg-green-900/30 border border-green-700/50' : 'bg-red-900/30 border border-red-700/50'}`}>
            <p className={`font-bold ${result.found ? 'text-green-400' : 'text-red-400'}`}>
              {result.found ? 'Path Found!' : 'No Path Found'}
            </p>
            {result.found && <p className="text-xs text-gray-400 mt-1">Total cost: <span className="text-white font-bold">{result.total_cost} km</span></p>}
          </div>
          {result.found && (
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Optimal path</p>
              <div className="flex flex-wrap items-center gap-1">
                {result.path.map((city, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${i === 0 ? 'bg-emerald-900/40 border-emerald-600 text-emerald-300' : i === result.path.length - 1 ? 'bg-green-900/40 border-green-600 text-green-300' : 'bg-gray-800 border-gray-700 text-gray-300'}`}>{city}</span>
                    {i < result.path.length - 1 && <span className="text-gray-600 text-xs">→</span>}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 uppercase tracking-wider">A* exploration steps ({result.steps.length})</p>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {result.steps.map((step, i) => (
              <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-emerald-400">{step.current}</span>
                  <div className="flex gap-2 text-xs font-mono">
                    <span className="text-gray-500">g=<span className="text-white">{step.g_score}</span></span>
                    <span className="text-gray-500">h=<span className="text-blue-400">{step.h_score}</span></span>
                    <span className="text-gray-500">f=<span className="text-yellow-400">{step.f_score}</span></span>
                  </div>
                </div>
                {step.closed_list.length > 0 && <p className="text-xs text-gray-600">Visited: {step.closed_list.join(', ')}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Fuzzy Search output ── */}
      {!loading && !error && result && demoSlug === 'fuzzy-search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400"><span className="text-emerald-400 font-bold">{result.results.length}</span> match{result.results.length !== 1 ? 'es' : ''} above {(result.threshold * 100).toFixed(0)}% similarity</span>
          </div>
          {result.results.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No matches above threshold for "{result.query}"</p>
          ) : (
            <div className="space-y-2">
              {result.results.map((item, i) => {
                const pct = (item.similarity * 100).toFixed(1)
                const barColor = item.similarity >= 0.8 ? 'bg-green-500' : item.similarity >= 0.6 ? 'bg-yellow-500' : 'bg-orange-500'
                const scoreColor = item.similarity >= 0.8 ? 'text-green-400' : item.similarity >= 0.6 ? 'text-yellow-400' : 'text-orange-400'
                return (
                  <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white text-sm font-medium">{item.item}</span>
                      <span className={`font-mono font-bold text-sm ${scoreColor}`}>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full ${barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Full-Text Search output ── */}
      {!loading && !error && result && demoSlug === 'full-text-search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400"><span className="text-emerald-400 font-bold">{result.results.length}</span> of {result.total_documents} documents matched</span>
          </div>
          {result.results.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No documents matched "{result.query}"</p>
          ) : (
            <div className="space-y-3">
              {result.results.map((item, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Doc #{item.index + 1}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">score: {item.score}</span>
                  </div>
                  <p className="text-white text-sm leading-relaxed mb-2">{item.document}</p>
                  <div className="flex flex-wrap gap-1">
                    {item.matched_terms.map(term => (
                      <span key={term} className="px-2 py-0.5 bg-emerald-900/40 border border-emerald-700/50 rounded text-xs text-emerald-300">{term}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── OCR output ── */}
      {!loading && !error && result && demoSlug === 'ocr' && (
        <div className="space-y-5">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400"><span className="text-orange-400 font-bold">{result.line_count}</span> line{result.line_count !== 1 ? 's' : ''}</span>
            <span className="text-gray-400"><span className="text-orange-400 font-bold">{result.word_count}</span> word{result.word_count !== 1 ? 's' : ''}</span>
            <span className="text-xs text-gray-600 ml-auto truncate">{result.model}</span>
          </div>

          {result.full_text ? (
            <>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Extracted Text</p>
                <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-4 max-h-48 overflow-y-auto">
                  <pre className="text-white text-sm leading-relaxed whitespace-pre-wrap font-sans">{result.full_text}</pre>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Lines with Confidence</p>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {result.blocks.flatMap((block, bi) =>
                    block.lines.map((line, li) => (
                      <div key={`${bi}-${li}`} className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2.5">
                        <div className="flex justify-between items-start gap-3 mb-1.5">
                          <p className="text-white text-sm leading-snug">{line.text}</p>
                          {line.confidence != null && (
                            <span className={`font-mono text-xs font-semibold shrink-0 ${line.confidence >= 0.9 ? 'text-green-400' : line.confidence >= 0.7 ? 'text-yellow-400' : 'text-orange-400'}`}>
                              {(line.confidence * 100).toFixed(1)}%
                            </span>
                          )}
                        </div>
                        {line.confidence != null && (
                          <div className="w-full bg-gray-700 rounded-full h-1">
                            <div
                              className={`h-1 rounded-full transition-all duration-500 ${line.confidence >= 0.9 ? 'bg-green-500' : line.confidence >= 0.7 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                              style={{ width: `${(line.confidence * 100).toFixed(1)}%` }}
                            />
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-6">
              <p className="text-2xl mb-2">🔍</p>
              <p className="text-sm">No text detected in this image</p>
            </div>
          )}
        </div>
      )}

      {/* ── Faceted Search output ── */}
      {!loading && !error && result && demoSlug === 'faceted-search' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400"><span className="text-emerald-400 font-bold">{result.matched_count}</span> of {result.total_items} items match</span>
          </div>
          {Object.keys(result.filters_applied).length > 0 && (
            <div className="flex flex-wrap gap-1">
              {Object.entries(result.filters_applied).map(([k, v]) => (
                <span key={k} className="px-2 py-0.5 bg-emerald-900/40 border border-emerald-700/50 rounded text-xs text-emerald-300">{k}: {v}</span>
              ))}
            </div>
          )}
          {result.matched_count === 0 ? (
            <p className="text-gray-500 text-sm text-center py-4">No items match the selected filters</p>
          ) : (
            <div className="space-y-2">
              {result.matched_items.map((item, i) => (
                <div key={i} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3">
                  <p className="text-white text-sm font-medium mb-1">{item.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(item).filter(([k]) => k !== 'name').map(([k, v]) => (
                      <span key={k} className="text-xs text-gray-400"><span className="text-gray-600">{k}:</span> {v}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
