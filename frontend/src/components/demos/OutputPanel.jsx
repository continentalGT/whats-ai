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
    </div>
  )
}
