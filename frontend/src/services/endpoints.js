const BASE_URL = '/api'

export const ENDPOINTS = {
  workloads: `${BASE_URL}/workloads`,
  nlpSentiment: `${BASE_URL}/nlp/sentiment`,
  nlpNer: `${BASE_URL}/nlp/ner`,
  nlpSummarize: `${BASE_URL}/nlp/summarize`,
  visionClassify: `${BASE_URL}/vision/classify`,
  visionDetect: `${BASE_URL}/vision/detect`,
  speechTranscribe: `${BASE_URL}/speech/transcribe`,
  mlPredict: `${BASE_URL}/ml/predict`,
  documentOcr: `${BASE_URL}/document/ocr`,
}
