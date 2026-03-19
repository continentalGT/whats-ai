import { useParams, Link } from 'react-router-dom'
import { WORKLOAD_CATEGORIES } from '../utils/constants'
import SubWorkloadItem from '../components/workloads/SubWorkloadItem'
import NotFoundPage from './NotFoundPage'

export default function CategoryPage() {
  const { id } = useParams()
  const category = WORKLOAD_CATEGORIES.find(c => c.slug === id)
  if (!category) return <NotFoundPage />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to="/" className="text-sm text-gray-500 hover:text-indigo-400 transition-colors mb-8 inline-flex items-center gap-1">
        ← Back to Home
      </Link>
      <div className="flex items-center gap-4 mb-8 mt-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} text-4xl`}>
          {category.icon}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{category.name}</h1>
          <p className="text-gray-400 mt-1">{category.description}</p>
        </div>
      </div>
      <div className="space-y-3">
        {category.demos.map(demo => (
          <SubWorkloadItem key={demo.slug} demo={demo} categorySlug={category.slug} />
        ))}
      </div>
    </div>
  )
}
