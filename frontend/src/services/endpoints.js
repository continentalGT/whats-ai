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
  searchSemantic: `${BASE_URL}/search/semantic`,
  searchKeyword: `${BASE_URL}/search/keyword`,
  searchLinear: `${BASE_URL}/search/linear`,
  searchBinary: `${BASE_URL}/search/binary`,
  searchHeuristic: `${BASE_URL}/search/heuristic`,
  searchFuzzy: `${BASE_URL}/search/fuzzy`,
  searchFullText: `${BASE_URL}/search/fulltext`,
  searchFaceted: `${BASE_URL}/search/faceted`,
}
