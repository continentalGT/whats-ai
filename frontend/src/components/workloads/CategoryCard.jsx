import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

export default function CategoryCard({ category }) {
  const activeCount = category.demos.filter(d => d.active).length
  return (
    <Link to={`/category/${category.slug}`}>
      <div className={`group relative bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 hover:border-indigo-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 cursor-pointer`}>
        <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} text-3xl mb-4`}>
          {category.icon}
        </div>
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-indigo-300 transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">{category.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">{category.demos.length} demos</span>
          {activeCount > 0 ? (
            <Badge variant="success">{activeCount} live</Badge>
          ) : (
            <Badge variant="inactive">Coming soon</Badge>
          )}
        </div>
      </div>
    </Link>
  )
}
