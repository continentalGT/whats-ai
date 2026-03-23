import { useState } from 'react'
import { useWorkloads } from '../hooks/useWorkloads'
import CategoryCard from '../components/workloads/CategoryCard'
import SearchBar from '../components/workloads/SearchBar'

export default function HomePage() {
  const [query, setQuery] = useState('')
  const { categories } = useWorkloads(query)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
          AI Workloads Demo
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
          Explore and interact with live AI demos across 8 categories — from NLP to Agentic AI.
        </p>
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Categories', value: '8' },
          { label: 'Total Demos', value: '75+' },
          { label: 'Live Now', value: '4' },
          { label: 'Coming Soon', value: '71+' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-indigo-400">{stat.value}</div>
            <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-4xl mb-4">🔍</p>
          <p>No workloads found for "{query}"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      )}
    </div>
  )
}
