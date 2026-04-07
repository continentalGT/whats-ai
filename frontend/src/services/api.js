import axios from 'axios'

const client = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
})

// Inject access token on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
let _refreshing = null
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        if (!_refreshing) {
          _refreshing = (async () => {
            const { authApi } = await import('./auth')
            const refreshToken = localStorage.getItem('refresh_token')
            if (!refreshToken) throw new Error('No refresh token')
            const data = await authApi.refresh(refreshToken)
            localStorage.setItem('access_token', data.access_token)
            localStorage.setItem('refresh_token', data.refresh_token)
            return data.access_token
          })().finally(() => { _refreshing = null })
        }
        const newToken = await _refreshing
        original.headers.Authorization = `Bearer ${newToken}`
        return client(original)
      } catch {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

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

export async function postImageClassification(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/api/vision/classify', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postOcr(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/api/document/ocr', form, {
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

// ── Speech ───────────────────────────────────────────────────
export async function postSpeechToText(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/api/speech/transcribe', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postTextToSpeech(text, voice) {
  const res = await client.post('/api/speech/tts', { text, voice })
  return res.data
}

// ── Translation ──────────────────────────────────────────────
export async function postTranslation(text, targetLang) {
  const res = await client.post('/api/nlp/translate', { text, target_lang: targetLang })
  return res.data
}

// ── Basics of Computer Vision ────────────────────────────────
export async function postImageAsArray(file) {
  const form = new FormData()
  form.append('file', file)
  const res = await client.post('/api/basics-cv/image-as-array', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postImageCropping(file, left, top, right, bottom) {
  const form = new FormData()
  form.append('file', file)
  form.append('left', left)
  form.append('top', top)
  form.append('right', right)
  form.append('bottom', bottom)
  const res = await client.post('/api/basics-cv/crop', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postImageSharpening(file, strength, method) {
  const form = new FormData()
  form.append('file', file)
  form.append('strength', strength)
  form.append('method', method)
  const res = await client.post('/api/basics-cv/sharpen', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postEdgeDetection(file, algorithm) {
  const form = new FormData()
  form.append('file', file)
  form.append('algorithm', algorithm)
  const res = await client.post('/api/basics-cv/edge-detection', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export async function postImageBlurring(file, blurType, radius) {
  const form = new FormData()
  form.append('file', file)
  form.append('blur_type', blurType)
  form.append('radius', radius)
  const res = await client.post('/api/basics-cv/blur', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data
}

export default client
