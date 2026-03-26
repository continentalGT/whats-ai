import { useParams, Link } from 'react-router-dom'
import { WORKLOAD_CATEGORIES } from '../utils/constants'
import DemoRunner from '../components/demos/DemoRunner'
import TrainPage from './TrainPage'
import NotFoundPage from './NotFoundPage'
import Badge from '../components/common/Badge'

export default function DemoPage() {
  const { categoryId, demoSlug } = useParams()
  const category = WORKLOAD_CATEGORIES.find(c => c.slug === categoryId)
  const demo = category?.demos.find(d => d.slug === demoSlug)

  if (!category || !demo) return <NotFoundPage />

  if (!demo.active) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <p className="text-6xl mb-4">🚧</p>
        <h2 className="text-2xl font-bold text-white mb-2">{demo.name}</h2>
        <p className="text-gray-400 mb-6">This demo is coming soon.</p>
        <Link to={`/category/${categoryId}`} className="text-indigo-400 hover:text-indigo-300 text-sm">
          ← Back to {category.name}
        </Link>
      </div>
    )
  }

  if (demoSlug === 'custom-cnn') {
    return <TrainPage backLink={`/category/${categoryId}`} backLabel={category.name} />
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <Link to={`/category/${categoryId}`} className="text-sm text-gray-500 hover:text-indigo-400 transition-colors mb-8 inline-flex items-center gap-1">
        ← {category.name}
      </Link>
      <div className="flex items-center gap-3 mb-8 mt-4">
        <h1 className="text-3xl font-bold text-white">{demo.name}</h1>
        <Badge variant="success">Live</Badge>
      </div>
      <DemoRunner demoSlug={demoSlug} />
    </div>
  )
}
