export function formatLabel(str) {
  return str.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
}

export function getSentimentColor(label) {
  if (!label) return 'text-gray-400'
  const l = label.toLowerCase()
  if (l === 'positive') return 'text-green-400'
  if (l === 'negative') return 'text-red-400'
  return 'text-yellow-400'
}

export function getSentimentEmoji(label) {
  if (!label) return '❓'
  const l = label.toLowerCase()
  if (l === 'positive') return '😊'
  if (l === 'negative') return '😞'
  return '😐'
}
