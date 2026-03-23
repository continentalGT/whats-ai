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
    </div>
  )
}
