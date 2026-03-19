import { Link } from 'react-router-dom'
import Badge from '../common/Badge'

export default function SubWorkloadItem({ demo, categorySlug }) {
  if (!demo.active) {
    return (
      <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800/30 opacity-60 cursor-not-allowed">
        <span className="text-sm text-gray-400">{demo.name}</span>
        <Badge variant="inactive">Soon</Badge>
      </div>
    )
  }
  return (
    <Link to={`/demo/${categorySlug}/${demo.slug}`}>
      <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-800/50 hover:bg-indigo-900/30 border border-transparent hover:border-indigo-700/50 transition-all cursor-pointer">
        <span className="text-sm text-white font-medium">{demo.name}</span>
        <Badge variant="success">Live</Badge>
      </div>
    </Link>
  )
}
