import { useParams, Link } from 'react-router-dom'
import { WORKLOAD_CATEGORIES } from '../utils/constants'
import SubWorkloadItem from '../components/workloads/SubWorkloadItem'
import NotFoundPage from './NotFoundPage'

export default function SubCategoryPage() {
  const { categoryId, groupSlug } = useParams()
  const category = WORKLOAD_CATEGORIES.find(c => c.slug === categoryId)
  const group = category?.demos.find(d => d.slug === groupSlug && d.isGroup)

  if (!category || !group) return <NotFoundPage />

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to={`/category/${categoryId}`} className="text-sm text-gray-500 hover:text-indigo-400 transition-colors mb-8 inline-flex items-center gap-1">
        ← {category.name}
      </Link>
      <div className="flex items-center gap-4 mb-8 mt-4">
        <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br ${category.color} text-4xl`}>
          🖼️
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{group.name}</h1>
          <p className="text-gray-400 mt-1">Foundational image operations — understand how pixels, arrays, and filters work.</p>
        </div>
      </div>
      <div className="space-y-3">
        {group.subDemos.map(demo => (
          <SubWorkloadItem key={demo.slug} demo={demo} categorySlug={categoryId} />
        ))}
      </div>
    </div>
  )
}
