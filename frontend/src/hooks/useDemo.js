import { useState } from 'react'
import { postSentiment, postObjectDetection, postImageCaptioning } from '../services/api'

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
