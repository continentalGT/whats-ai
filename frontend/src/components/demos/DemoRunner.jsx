import InputPanel from './InputPanel'
import OutputPanel from './OutputPanel'
import DemoHistory from './DemoHistory'
import GuestSignupModal from '../common/GuestSignupModal'
import { useDemo } from '../../hooks/useDemo'
import { useGuestLimit } from '../../hooks/useGuestLimit'

export default function DemoRunner({ demoSlug }) {
  const { result, loading, error, history, runDemo } = useDemo(demoSlug)
  const { showModal, attemptsLeft, requestRun, onSignupSuccess } = useGuestLimit()

  function handleRun(input) {
    requestRun(input, runDemo)
  }

  const left = attemptsLeft()
  const showBadge = left !== Infinity && left > 0

  const isFullWidthImageDemo = [
    'object-detection', 'ocr', 'image-classification', 'cnn',
    'image-as-array', 'image-cropping', 'image-sharpening', 'edge-detection', 'image-blurring',
    'speech-to-text',
  ].includes(demoSlug)

  return (
    <>
      {showModal && (
        <GuestSignupModal onSuccess={() => onSignupSuccess(runDemo)} />
      )}

      {showBadge && (
        <p className="text-xs text-gray-500 mb-4">
          {left} free {left === 1 ? 'run' : 'runs'} remaining — sign up after to keep going
        </p>
      )}

      {isFullWidthImageDemo ? (
        <div className="space-y-6">
          <InputPanel demoSlug={demoSlug} onRun={handleRun} loading={loading} hasResult={!!result} />
          <OutputPanel result={result} loading={loading} error={error} demoSlug={demoSlug} />
          <DemoHistory history={history} demoSlug={demoSlug} />
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <InputPanel demoSlug={demoSlug} onRun={handleRun} loading={loading} hasResult={!!result} />
            <OutputPanel result={result} loading={loading} error={error} demoSlug={demoSlug} />
          </div>
          <DemoHistory history={history} demoSlug={demoSlug} />
        </div>
      )}
    </>
  )
}
