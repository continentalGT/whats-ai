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

export default client
