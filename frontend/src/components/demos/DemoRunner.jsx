import InputPanel from './InputPanel'
import OutputPanel from './OutputPanel'
import DemoHistory from './DemoHistory'
import { useDemo } from '../../hooks/useDemo'

export default function DemoRunner({ demoSlug }) {
  const { result, loading, error, history, runDemo } = useDemo(demoSlug)

  const isFullWidthImageDemo = [
    'object-detection', 'ocr', 'image-classification', 'cnn',
    'image-as-array', 'image-cropping', 'image-sharpening', 'edge-detection', 'image-blurring',
    'speech-to-text',
  ].includes(demoSlug)

  if (isFullWidthImageDemo) {
    return (
      <div className="space-y-6">
        <InputPanel demoSlug={demoSlug} onRun={runDemo} loading={loading} hasResult={!!result} />
        <OutputPanel result={result} loading={loading} error={error} demoSlug={demoSlug} />
        <DemoHistory history={history} demoSlug={demoSlug} />
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <InputPanel demoSlug={demoSlug} onRun={runDemo} loading={loading} hasResult={!!result} />
        <OutputPanel result={result} loading={loading} error={error} demoSlug={demoSlug} />
      </div>
      <DemoHistory history={history} demoSlug={demoSlug} />
    </div>
  )
}
