import { getSentimentColor } from '../../utils/formatters'

export default function DemoHistory({ history, demoSlug }) {
  if (!history.length) return null
  return (
    <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6 mt-6">
      <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">History</h3>
      <div className="space-y-3">
        {history.map((item, i) => (
          <div key={i} className="flex items-center justify-between bg-gray-800/40 rounded-lg px-4 py-3">
            {demoSlug === 'sentiment' && (
              <>
                <p className="text-sm text-gray-400 truncate max-w-xs">{item.input.text}</p>
                <span className={`text-sm font-semibold ml-4 shrink-0 ${getSentimentColor(item.result?.label)}`}>
                  {item.result?.label}
                </span>
              </>
            )}
            {demoSlug === 'object-detection' && (
              <>
                <p className="text-sm text-gray-400 truncate max-w-xs">{item.input.file?.name ?? 'image'}</p>
                <span className="text-sm font-semibold ml-4 shrink-0 text-cyan-400">
                  {item.result?.count} object{item.result?.count !== 1 ? 's' : ''}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
