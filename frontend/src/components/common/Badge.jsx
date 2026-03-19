export default function Badge({ children, variant = 'default' }) {
  const variants = {
    default: 'bg-indigo-900/50 text-indigo-300 border border-indigo-700',
    success: 'bg-green-900/50 text-green-300 border border-green-700',
    danger: 'bg-red-900/50 text-red-300 border border-red-700',
    warning: 'bg-yellow-900/50 text-yellow-300 border border-yellow-700',
    inactive: 'bg-gray-800 text-gray-500 border border-gray-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  )
}
