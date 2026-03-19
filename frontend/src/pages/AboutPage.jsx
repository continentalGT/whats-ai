export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-4xl font-bold text-white mb-6">About This Project</h1>
      <div className="space-y-6 text-gray-400 leading-relaxed">
        <p>
          AI Workloads Demo is an educational visualization platform showcasing various AI and machine learning workloads across 8 major categories.
        </p>
        <p>
          The project is built with <strong className="text-white">FastAPI</strong> on the backend and <strong className="text-white">React + Vite</strong> on the frontend, following a clean monorepo architecture.
        </p>
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Tech Stack</h2>
          <ul className="space-y-2 text-sm">
            {['FastAPI — REST API backend', 'React + Vite — Frontend', 'Tailwind CSS — Styling', 'React Router v6 — Routing', 'Axios — HTTP client'].map(item => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-indigo-400">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
