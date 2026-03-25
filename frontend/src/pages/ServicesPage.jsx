import { Link } from 'react-router-dom'

const LIVE_SERVICES = [
  {
    category: 'Natural Language Processing',
    categorySlug: 'nlp',
    icon: '🧠',
    color: 'from-violet-600 to-indigo-600',
    borderColor: 'border-violet-500',
    badgeColor: 'bg-violet-900/40 text-violet-300 border-violet-700',
    demos: [
      {
        slug: 'sentiment',
        name: 'Sentiment Analysis',
        description: 'Detect the emotional tone of any text — positive, negative, or neutral.',
        model: 'cardiffnlp/twitter-roberta-base-sentiment-latest',
        input: 'Text',
      },
      {
        slug: 'sentence-similarity',
        name: 'Sentence Similarity',
        description: 'Enter 3 sentences and a query — see how closely each sentence matches using semantic embeddings.',
        model: 'azure-foundry/text-embedding-3-small',
        input: 'Text',
      },
    ],
  },
  {
    category: 'Computer Vision',
    categorySlug: 'vision',
    icon: '👁️',
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-500',
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-700',
    demos: [
      {
        slug: 'object-detection',
        name: 'Object Detection',
        description: 'Identify and locate objects in images with bounding boxes and confidence scores.',
        model: 'facebook/detr-resnet-50',
        input: 'Image',
      },
      {
        slug: 'image-captioning',
        name: 'Image Captioning',
        description: 'Automatically generate a natural language description of any image.',
        model: 'Salesforce/blip-image-captioning-base',
        input: 'Image',
      },
    ],
  },
  {
    category: 'Search Algorithms',
    categorySlug: 'search',
    icon: '🔍',
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500',
    badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
    demos: [
      {
        slug: 'semantic-search',
        name: 'Semantic Search',
        description: 'Enter 5 sentences, choose k, and a query — returns top-k semantically closest results using embeddings.',
        model: 'azure-foundry/text-embedding-3-small',
        input: 'Text',
      },
      {
        slug: 'keyword-search',
        name: 'Keyword Search',
        description: 'Exact keyword matching across multiple documents with highlighted occurrences and positions.',
        model: 'Pure Python (stdlib)',
        input: 'Text',
      },
      {
        slug: 'linear-search',
        name: 'Linear Search',
        description: 'Step-by-step visualization of sequential search through an unsorted list.',
        model: 'Pure Python (stdlib)',
        input: 'Text',
      },
      {
        slug: 'binary-search',
        name: 'Binary Search',
        description: 'See how binary search halves the search space at every step on a sorted array.',
        model: 'Pure Python (stdlib)',
        input: 'Numbers',
      },
      {
        slug: 'heuristic-search',
        name: 'Heuristic Search (A*)',
        description: 'A* pathfinding on the Romania map using straight-line distance as the heuristic.',
        model: 'Pure Python A*',
        input: 'City selection',
      },
      {
        slug: 'fuzzy-search',
        name: 'Fuzzy Search',
        description: 'Finds approximate matches even with typos using Levenshtein-based similarity scoring.',
        model: 'Python difflib (stdlib)',
        input: 'Text',
      },
      {
        slug: 'full-text-search',
        name: 'Full-Text Search',
        description: 'TF-IDF ranking across multiple documents — see relevance scores and matched terms.',
        model: 'Pure Python TF-IDF',
        input: 'Text',
      },
      {
        slug: 'faceted-search',
        name: 'Faceted Search',
        description: 'Filter a product catalog by multiple attributes simultaneously using toggle chips.',
        model: 'Pure Python',
        input: 'Filter selection',
      },
    ],
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">Services</h1>
        <p className="text-gray-400 text-lg">
          Live AI demos you can run right now — no setup required.
        </p>
      </div>

      {/* Stats row */}
      <div className="flex gap-4 mb-12">
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">12</div>
          <div className="text-sm text-gray-400 mt-1">Live Now</div>
        </div>
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">3</div>
          <div className="text-sm text-gray-400 mt-1">Categories Active</div>
        </div>
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl px-6 py-4 text-center">
          <div className="text-3xl font-bold text-indigo-400">71+</div>
          <div className="text-sm text-gray-400 mt-1">Coming Soon</div>
        </div>
      </div>

      {/* Service groups */}
      <div className="space-y-10">
        {LIVE_SERVICES.map(group => (
          <div key={group.categorySlug}>
            {/* Category header */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{group.icon}</span>
              <h2 className="text-lg font-bold text-white">{group.category}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${group.badgeColor}`}>
                {group.demos.length} live
              </span>
            </div>

            {/* Demo cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {group.demos.map(demo => (
                <div
                  key={demo.slug}
                  className={`bg-gray-900/60 border ${group.borderColor} border-opacity-40 rounded-xl p-6 flex flex-col gap-4`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold text-base">{demo.name}</h3>
                      <span className="text-xs bg-green-900/40 text-green-400 border border-green-700 px-2 py-0.5 rounded-full">
                        Live
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">{demo.description}</p>
                  </div>

                  <div className="space-y-1 text-xs text-gray-500">
                    <div className="flex gap-2">
                      <span className="text-gray-600">Model</span>
                      <span className="font-mono text-gray-400 truncate">{demo.model}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-600">Input</span>
                      <span className="text-gray-400">{demo.input}</span>
                    </div>
                  </div>

                  <Link
                    to={`/demo/${group.categorySlug}/${demo.slug}`}
                    className={`mt-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r ${group.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
                  >
                    Try it now ▶
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
