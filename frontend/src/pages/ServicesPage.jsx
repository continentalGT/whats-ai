import { Link } from 'react-router-dom'

const SERVICES = [
  {
    icon: '🌐',
    title: 'Website Development',
    description: 'Modern, responsive websites built with the latest technologies. From landing pages to full-stack web applications tailored to your brand and business goals.',
    features: ['Custom design & branding', 'Responsive across all devices', 'SEO-optimised structure', 'Fast load times & performance'],
    color: 'from-indigo-600 to-violet-600',
    borderColor: 'border-indigo-500/40',
    badgeColor: 'bg-indigo-900/40 text-indigo-300 border-indigo-700',
  },
  {
    icon: '🤖',
    title: 'Custom AI Solutions',
    description: 'End-to-end AI systems built around your specific use case — from data pipelines and model training to deployment and monitoring in production.',
    features: ['NLP, Vision, Speech & more', 'HuggingFace & Azure AI integration', 'Custom model fine-tuning', 'API-first architecture'],
    color: 'from-violet-600 to-fuchsia-600',
    borderColor: 'border-violet-500/40',
    badgeColor: 'bg-violet-900/40 text-violet-300 border-violet-700',
  },
  {
    icon: '💬',
    title: 'AI Chatbots',
    description: 'Intelligent conversational agents powered by large language models. Deploy on your website, product, or internal tools to automate support and engagement.',
    features: ['Powered by GPT-4 / Claude / Gemini', 'RAG with your own documents', 'Multi-turn memory', 'Custom personality & tone'],
    color: 'from-cyan-600 to-blue-600',
    borderColor: 'border-cyan-500/40',
    badgeColor: 'bg-cyan-900/40 text-cyan-300 border-cyan-700',
  },
  {
    icon: '⚙️',
    title: 'AI Automation',
    description: 'Automate repetitive workflows using AI — document processing, data extraction, classification pipelines, and intelligent routing systems.',
    features: ['OCR & document intelligence', 'Email & form automation', 'Data extraction pipelines', 'Scheduled & event-driven flows'],
    color: 'from-emerald-600 to-teal-600',
    borderColor: 'border-emerald-500/40',
    badgeColor: 'bg-emerald-900/40 text-emerald-300 border-emerald-700',
  },
  {
    icon: '📊',
    title: 'Data & Analytics Dashboards',
    description: 'Turn raw data into actionable insights with custom dashboards and visualisations. Connect any data source and surface the metrics that matter.',
    features: ['Interactive charts & reports', 'Real-time data updates', 'Custom KPI tracking', 'Export & sharing tools'],
    color: 'from-orange-600 to-amber-600',
    borderColor: 'border-orange-500/40',
    badgeColor: 'bg-orange-900/40 text-orange-300 border-orange-700',
  },
  {
    icon: '🔗',
    title: 'API & Integration Services',
    description: 'Connect your systems, tools, and platforms. We build robust APIs and integrations so your stack works seamlessly together.',
    features: ['REST & WebSocket APIs', 'Third-party API integrations', 'Authentication & security', 'Documentation & testing'],
    color: 'from-rose-600 to-pink-600',
    borderColor: 'border-rose-500/40',
    badgeColor: 'bg-rose-900/40 text-rose-300 border-rose-700',
  },
]

export default function ServicesPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {/* Header */}
      <div className="mb-14 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4">What We Build</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          From intelligent AI systems to polished web experiences — we deliver solutions that are fast, scalable, and built to last.
        </p>
      </div>

      {/* Service cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {SERVICES.map(service => (
          <div
            key={service.title}
            className={`bg-gray-900/60 border ${service.borderColor} rounded-xl p-6 flex flex-col gap-4 hover:bg-gray-900/80 transition-colors`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{service.icon}</span>
              <h2 className="text-white font-bold text-base">{service.title}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
            <ul className="space-y-1.5 mt-auto">
              {service.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="text-green-400 text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center bg-gray-900/60 border border-gray-700/50 rounded-2xl px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-3">Have a project in mind?</h2>
        <p className="text-gray-400 mb-6">Tell us what you need and we'll figure out the best approach together.</p>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Get in touch
        </Link>
      </div>
    </div>
  )
}
