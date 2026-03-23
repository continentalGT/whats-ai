const BASE_URL = '/api'

export const ENDPOINTS = {
  workloads: `${BASE_URL}/workloads`,
  nlpSentiment: `${BASE_URL}/nlp/sentiment`,
  nlpSimilarity: `${BASE_URL}/nlp/similarity`,
  nlpNer: `${BASE_URL}/nlp/ner`,
  nlpSummarize: `${BASE_URL}/nlp/summarize`,
  visionClassify: `${BASE_URL}/vision/classify`,
  visionDetect: `${BASE_URL}/vision/detect`,
  visionCaption: `${BASE_URL}/vision/caption`,
  speechTranscribe: `${BASE_URL}/speech/transcribe`,
  mlPredict: `${BASE_URL}/ml/predict`,
  documentOcr: `${BASE_URL}/document/ocr`,
}
