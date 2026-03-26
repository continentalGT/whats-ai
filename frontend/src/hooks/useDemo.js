import { useState } from 'react'
import {
  postSentiment, postObjectDetection, postImageCaptioning, postSentenceSimilarity,
  postSemanticSearch, postKeywordSearch, postLinearSearch, postBinarySearch,
  postHeuristicSearch, postFuzzySearch, postFullTextSearch, postFacetedSearch,
  postOcr,
  postImageClassification,
} from '../services/api'

export function useDemo(demoSlug) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [history, setHistory] = useState([])

  async function runDemo(input) {
    setLoading(true)
    setError(null)
    try {
      let data
      if (demoSlug === 'sentiment') {
        data = await postSentiment(input.text)
      } else if (demoSlug === 'object-detection') {
        data = await postObjectDetection(input.file)
      } else if (demoSlug === 'image-captioning') {
        data = await postImageCaptioning(input.file)
      } else if (demoSlug === 'sentence-similarity') {
        data = await postSentenceSimilarity(input.sentences, input.query)
      } else if (demoSlug === 'semantic-search') {
        data = await postSemanticSearch(input.sentences, input.query, input.k)
      } else if (demoSlug === 'keyword-search') {
        data = await postKeywordSearch(input.documents, input.keyword, input.caseSensitive)
      } else if (demoSlug === 'linear-search') {
        data = await postLinearSearch(input.items, input.target)
      } else if (demoSlug === 'binary-search') {
        data = await postBinarySearch(input.items, input.target)
      } else if (demoSlug === 'heuristic-search') {
        data = await postHeuristicSearch(input.start, input.goal)
      } else if (demoSlug === 'fuzzy-search') {
        data = await postFuzzySearch(input.items, input.query, input.threshold)
      } else if (demoSlug === 'full-text-search') {
        data = await postFullTextSearch(input.documents, input.query)
      } else if (demoSlug === 'faceted-search') {
        data = await postFacetedSearch(input.items, input.filters)
      } else if (demoSlug === 'ocr') {
        data = await postOcr(input.file)
      } else if (demoSlug === 'image-classification' || demoSlug === 'cnn') {
        data = await postImageClassification(input.file)
      } else {
        throw new Error('Demo not implemented yet')
      }
      setResult(data)
      setHistory(prev => [{ input, result: data, timestamp: new Date().toISOString() }, ...prev.slice(0, 9)])
    } catch (err) {
      setError(err.response?.data?.detail || err.message)
    } finally {
      setLoading(false)
    }
  }

  return { result, loading, error, history, runDemo }
}
