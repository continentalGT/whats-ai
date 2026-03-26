import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const location = useLocation()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl"></span>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              AI Workloads
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              Home
            </Link>
            <Link to="/services" className={`text-sm font-medium transition-colors ${location.pathname === '/services' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              Services
            </Link>
            <Link to="/about" className={`text-sm font-medium transition-colors ${location.pathname === '/about' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              About
            </Link>
            <Link to="/contact" className={`text-sm font-medium transition-colors ${location.pathname === '/contact' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              Contact
            </Link>
            <Link to="/shop" className={`text-sm font-medium transition-colors ${location.pathname === '/shop' ? 'text-indigo-400' : 'text-gray-400 hover:text-white'}`}>
              Shop
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
