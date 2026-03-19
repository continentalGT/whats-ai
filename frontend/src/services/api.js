import axios from 'axios'

const client = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
})

export async function postSentiment(text) {
  const res = await client.post('/api/nlp/sentiment', { text })
  return res.data
}

export default client
