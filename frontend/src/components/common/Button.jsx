export default function Button({ children, onClick, variant = 'primary', disabled = false, className = '' }) {
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    secondary: 'bg-gray-700 hover:bg-gray-600 text-white',
    ghost: 'bg-transparent hover:bg-gray-800 text-gray-300',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
