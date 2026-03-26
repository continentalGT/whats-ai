const PRODUCTS = [
  {
    id: 1,
    name: 'AI Fundamentals Course',
    category: 'Course',
    price: '$49',
    badge: 'Bestseller',
    badgeColor: 'bg-yellow-900/40 text-yellow-300 border-yellow-700',
    icon: '🎓',
    color: 'from-violet-600 to-indigo-600',
    description: 'A complete beginner-to-intermediate course covering NLP, Computer Vision, and Search algorithms with hands-on demos.',
    includes: ['12 hours of video', '8 guided labs', 'Certificate of completion'],
  },
  {
    id: 2,
    name: 'Python for Data Science',
    category: 'Course',
    price: '$39',
    badge: 'New',
    badgeColor: 'bg-green-900/40 text-green-300 border-green-700',
    icon: '🐍',
    color: 'from-green-600 to-teal-600',
    description: 'Learn Python from scratch with a focus on data manipulation, visualization, and building ML pipelines.',
    includes: ['10 hours of video', 'Jupyter notebooks', 'Lifetime access'],
  },
  {
    id: 3,
    name: 'Azure AI Services Handbook',
    category: 'E-Book',
    price: '$19',
    badge: 'Popular',
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-700',
    icon: '📘',
    color: 'from-cyan-600 to-blue-600',
    description: 'A practical guide to provisioning and using Azure AI multi-service accounts — Vision, Language, Speech, and more.',
    includes: ['180 pages PDF', 'Code samples', 'Architecture diagrams'],
  },
  {
    id: 4,
    name: 'Search Algorithms Deep Dive',
    category: 'E-Book',
    price: '$15',
    badge: null,
    badgeColor: '',
    icon: '🔍',
    color: 'from-emerald-600 to-teal-600',
    description: 'Covers semantic, fuzzy, full-text, faceted, and classical search with worked examples and complexity analysis.',
    includes: ['120 pages PDF', 'Cheat sheet', 'Interactive visualizations'],
  },
  {
    id: 5,
    name: 'ML Engineer Starter Pack',
    category: 'Bundle',
    price: '$89',
    badge: 'Best Value',
    badgeColor: 'bg-orange-900/40 text-orange-300 border-orange-700',
    icon: '📦',
    color: 'from-orange-600 to-amber-600',
    description: 'Everything you need to get started: AI Fundamentals Course + Python for Data Science + Azure Handbook bundled together.',
    includes: ['All 3 products', 'Private Discord access', 'Monthly Q&A session'],
  },
  {
    id: 6,
    name: '1-on-1 Mentorship Session',
    category: 'Service',
    price: '$79',
    badge: 'Limited',
    badgeColor: 'bg-red-900/40 text-red-300 border-red-700',
    icon: '🧑‍💻',
    color: 'from-red-600 to-pink-600',
    description: '60-minute live session with an AI engineer — code review, architecture advice, or career guidance.',
    includes: ['60 min video call', 'Recording included', 'Follow-up notes'],
  },
]

export default function ShopPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">Shop</h1>
        <p className="text-gray-400 text-lg">
          Courses, e-books, and services to accelerate your AI journey.
        </p>
      </div>

      {/* Stats */}
      <div className="flex gap-4 mb-12">
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">6</div>
          <div className="text-sm text-gray-400 mt-1">Products</div>
        </div>
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">3</div>
          <div className="text-sm text-gray-400 mt-1">Categories</div>
        </div>
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">$15</div>
          <div className="text-sm text-gray-400 mt-1">Starting from</div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map(product => (
          <div
            key={product.id}
            className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6 flex flex-col gap-4 hover:border-gray-600 transition-colors"
          >
            {/* Top row */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{product.icon}</span>
                <div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">{product.category}</span>
                  <h3 className="text-white font-semibold text-base leading-snug">{product.name}</h3>
                </div>
              </div>
              {product.badge && (
                <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${product.badgeColor}`}>
                  {product.badge}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">{product.description}</p>

            {/* Includes */}
            <ul className="space-y-1">
              {product.includes.map(item => (
                <li key={item} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="text-green-500">✓</span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Price + CTA */}
            <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-800">
              <span className="text-2xl font-bold text-white">{product.price}</span>
              <button
                className={`px-4 py-2 rounded-lg bg-gradient-to-r ${product.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
              >
                Get Access
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
