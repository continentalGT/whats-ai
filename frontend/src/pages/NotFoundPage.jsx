import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <p className="text-8xl mb-6">404</p>
      <h1 className="text-3xl font-bold text-white mb-3">Page Not Found</h1>
      <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>
      <Link to="/" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
        Go Home
      </Link>
    </div>
  )
}
