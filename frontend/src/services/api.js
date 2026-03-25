import axios from 'axios'

const client = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
})

export async function postSentiment(text) {
  const res = await client.post('/api/nlp/sentiment', { text })
  return res.data
}

export async function postSentenceSimilarity(sentences, query) {
  const res = await client.post('/api/nlp/similarity', { sentences, query })
  return res.data
}

export async function postObjectDetection(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/api/vision/detect', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postImageCaptioning(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/api/vision/caption', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

// ── Search ───────────────────────────────────────────────────
export async function postSemanticSearch(sentences, query, k) {
  const res = await client.post('/api/search/semantic', { sentences, query, k })
  return res.data
}

export async function postKeywordSearch(documents, keyword, case_sensitive) {
  const res = await client.post('/api/search/keyword', { documents, keyword, case_sensitive })
  return res.data
}

export async function postLinearSearch(items, target) {
  const res = await client.post('/api/search/linear', { items, target })
  return res.data
}

export async function postBinarySearch(items, target) {
  const res = await client.post('/api/search/binary', { items, target })
  return res.data
}

export async function postHeuristicSearch(start, goal) {
  const res = await client.post('/api/search/heuristic', { start, goal })
  return res.data
}

export async function postFuzzySearch(items, query, threshold) {
  const res = await client.post('/api/search/fuzzy', { items, query, threshold })
  return res.data
}

export async function postFullTextSearch(documents, query) {
  const res = await client.post('/api/search/fulltext', { documents, query })
  return res.data
}

export async function postFacetedSearch(items, filters) {
  const res = await client.post('/api/search/faceted', { items, filters })
  return res.data
}

export default client
