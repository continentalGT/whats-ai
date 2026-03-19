export default function Card({ children, className = '' }) {
  return (
    <div className={`bg-gray-900/60 border border-gray-700/50 rounded-xl backdrop-blur-sm ${className}`}>
      {children}
    </div>
  )
}
