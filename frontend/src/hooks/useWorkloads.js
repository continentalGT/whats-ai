import { useState, useEffect } from 'react'
import { WORKLOAD_CATEGORIES } from '../utils/constants'

export function useWorkloads(searchQuery = '') {
  const [categories, setCategories] = useState(WORKLOAD_CATEGORIES)
  const [filtered, setFiltered] = useState(WORKLOAD_CATEGORIES)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFiltered(categories)
      return
    }
    const q = searchQuery.toLowerCase()
    const results = categories.filter(
      cat =>
        cat.name.toLowerCase().includes(q) ||
        cat.demos.some(d => d.name.toLowerCase().includes(q))
    )
    setFiltered(results)
  }, [searchQuery, categories])

  return { categories: filtered }
}
