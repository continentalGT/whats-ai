export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-xl mx-auto">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search workloads or demos..."
        className="w-full pl-11 pr-4 py-3 bg-gray-800/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
      />
    </div>
  )
}
