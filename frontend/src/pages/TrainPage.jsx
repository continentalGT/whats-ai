import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'

const FILTER_OPTIONS = [16, 32, 64, 128]
const NEURON_OPTIONS = [32, 64, 128, 256]

const inputClass = 'w-full bg-gray-800/60 border border-gray-700 rounded-lg px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm'
const labelClass = 'block text-xs text-gray-400 uppercase tracking-wider mb-1.5'

// ── Step indicator ────────────────────────────────────────────
function Steps({ current }) {
  const steps = ['Upload Images', 'Architecture', 'Train', 'Test']
  return (
    <div className="flex items-center gap-2 mb-10">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i < current ? 'bg-indigo-600 border-indigo-600 text-white' : i === current ? 'border-indigo-500 text-indigo-400' : 'border-gray-700 text-gray-600'}`}>
            {i < current ? '✓' : i + 1}
          </div>
          <span className={`text-sm font-medium ${i === current ? 'text-white' : i < current ? 'text-indigo-400' : 'text-gray-600'}`}>{s}</span>
          {i < steps.length - 1 && <div className={`w-8 h-px ${i < current ? 'bg-indigo-600' : 'bg-gray-700'}`} />}
        </div>
      ))}
    </div>
  )
}

// ── Image uploader per class ──────────────────────────────────
function ClassUploader({ index, name, onNameChange, onFilesChange, files }) {
  const ref = useRef()
  const colors = ['border-violet-600 bg-violet-900/10', 'border-cyan-600 bg-cyan-900/10', 'border-orange-600 bg-orange-900/10']
  const accents = ['text-violet-400', 'text-cyan-400', 'text-orange-400']

  function handleDrop(e) {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    onFilesChange(index, [...files, ...dropped].slice(0, 10))
  }

  function handlePick(e) {
    const picked = Array.from(e.target.files).filter(f => f.type.startsWith('image/'))
    onFilesChange(index, [...files, ...picked].slice(0, 10))
  }

  function removeFile(i) {
    onFilesChange(index, files.filter((_, idx) => idx !== i))
  }

  return (
    <div className={`rounded-xl border-2 ${colors[index]} p-5`}>
      <div className="flex items-center gap-3 mb-4">
        <span className={`text-xs font-bold uppercase tracking-wider ${accents[index]}`}>Class {index + 1}</span>
        <input
          type="text"
          value={name}
          onChange={e => onNameChange(index, e.target.value)}
          placeholder={`Class name (e.g. Cat)`}
          className="flex-1 bg-gray-800/60 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500"
        />
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
        onClick={() => ref.current.click()}
        className="border border-dashed border-gray-600 hover:border-gray-500 rounded-lg p-4 text-center cursor-pointer transition-colors mb-3"
      >
        <p className="text-gray-400 text-sm">Drop images or click to upload</p>
        <p className="text-gray-600 text-xs mt-1">{files.length}/10 images · PNG, JPG, WEBP</p>
        <input ref={ref} type="file" accept="image/*" multiple onChange={handlePick} className="hidden" />
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-5 gap-2">
          {files.map((f, i) => (
            <div key={i} className="relative group">
              <img src={URL.createObjectURL(f)} alt="" className="w-full h-14 object-cover rounded border border-gray-700" />
              <button
                onClick={e => { e.stopPropagation(); removeFile(i) }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 rounded-full text-white text-xs hidden group-hover:flex items-center justify-center"
              >×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function TrainPage({ backLink, backLabel }) {
  const [step, setStep] = useState(0)

  // Step 0 — classes
  const [numClasses, setNumClasses] = useState(2)
  const [classNames, setClassNames] = useState(['', '', ''])
  const [classFiles, setClassFiles] = useState([[], [], []])

  // Step 1 — architecture
  const [cnnLayers, setCnnLayers] = useState(2)
  const [filters, setFilters] = useState([32, 64, 32, 32])
  const [annLayers, setAnnLayers] = useState(1)
  const [annNeurons, setAnnNeurons] = useState([128, 64, 64])
  const [epochs, setEpochs] = useState(20)

  // Step 2 — training results
  const [training, setTraining] = useState(false)
  const [trainResult, setTrainResult] = useState(null)
  const [trainError, setTrainError] = useState('')

  // Step 3 — test
  const [testFile, setTestFile] = useState(null)
  const [testPreview, setTestPreview] = useState(null)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [testError, setTestError] = useState('')

  // ── handlers ─────────────────────────────────────────────
  function handleNameChange(i, val) {
    setClassNames(prev => prev.map((n, idx) => idx === i ? val : n))
  }
  function handleFilesChange(i, files) {
    setClassFiles(prev => prev.map((f, idx) => idx === i ? files : f))
  }
  function setFilter(layer, val) {
    setFilters(prev => prev.map((f, i) => i === layer ? val : f))
  }
  function setAnnNeuron(layer, val) {
    setAnnNeurons(prev => prev.map((n, i) => i === layer ? val : n))
  }

  function canProceedStep0() {
    const active = classNames.slice(0, numClasses)
    return active.every(n => n.trim()) && classFiles.slice(0, numClasses).every(f => f.length >= 2)
  }

  async function handleTrain() {
    setTraining(true)
    setTrainError('')
    try {
      const form = new FormData()
      const activeNames = classNames.slice(0, numClasses)
      const activeFilters = filters.slice(0, cnnLayers)
      const activeNeurons = annNeurons.slice(0, annLayers)

      form.append('class_names', JSON.stringify(activeNames))
      form.append('cnn_filters', JSON.stringify(activeFilters))
      form.append('ann_neurons', JSON.stringify(activeNeurons))
      form.append('epochs', epochs)
      form.append('lr', 0.001)

      const allLabels = []
      classFiles.slice(0, numClasses).forEach((files, classIdx) => {
        files.forEach(f => {
          form.append('files', f)
          allLabels.push(classIdx)
        })
      })
      form.append('file_labels', JSON.stringify(allLabels))

      const res = await axios.post('/api/train/train', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      })
      setTrainResult(res.data)
      setStep(2)
    } catch (err) {
      setTrainError(err.response?.data?.detail || 'Training failed. Try again.')
    } finally {
      setTraining(false)
    }
  }

  async function handleTest() {
    if (!testFile || !trainResult) return
    setTesting(true)
    setTestError('')
    setTestResult(null)
    try {
      const form = new FormData()
      form.append('session_id', trainResult.session_id)
      form.append('file', testFile)
      const res = await axios.post('/api/train/predict', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setTestResult(res.data.predictions)
    } catch (err) {
      setTestError(err.response?.data?.detail || 'Prediction failed.')
    } finally {
      setTesting(false)
    }
  }

  const selectClass = 'bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-indigo-500'

  // ── render ────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      {backLink && (
        <Link to={backLink} className="text-sm text-gray-500 hover:text-indigo-400 transition-colors mb-8 inline-flex items-center gap-1">
          ← {backLabel}
        </Link>
      )}
      <div className="mb-8 mt-4">
        <h1 className="text-4xl font-extrabold text-white mb-2">Custom CNN Trainer</h1>
        <p className="text-gray-400">Upload images, design your network architecture, train from scratch, and test it live.</p>
      </div>

      <Steps current={step} />

      {/* ── Step 0: Upload Images ── */}
      {step === 0 && (
        <div className="space-y-6">
          <div className="flex items-center gap-4 mb-2">
            <span className={labelClass}>Number of classes</span>
            {[2, 3].map(n => (
              <button key={n} onClick={() => setNumClasses(n)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium border transition-colors ${numClasses === n ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 text-gray-400 hover:border-indigo-500'}`}>
                {n} classes
              </button>
            ))}
          </div>

          {Array.from({ length: numClasses }).map((_, i) => (
            <ClassUploader
              key={i} index={i}
              name={classNames[i]}
              files={classFiles[i]}
              onNameChange={handleNameChange}
              onFilesChange={handleFilesChange}
            />
          ))}

          <div className="bg-gray-900/40 border border-gray-700/50 rounded-xl p-4 text-xs text-gray-500 space-y-1">
            <p>• Upload 5–10 images per class for best results</p>
            <p>• More variety in images = better generalization</p>
            <p>• Images are processed in-memory — nothing is saved to disk</p>
          </div>

          <button onClick={() => setStep(1)} disabled={!canProceedStep0()}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed">
            Next: Design Architecture →
          </button>
        </div>
      )}

      {/* ── Step 1: Architecture ── */}
      {step === 1 && (
        <div className="space-y-8">
          {/* CNN layers */}
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">CNN Layers</h2>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(n => (
                  <button key={n} onClick={() => setCnnLayers(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors ${cnnLayers === n ? 'bg-cyan-700 border-cyan-500 text-white' : 'border-gray-700 text-gray-400 hover:border-cyan-600'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: cnnLayers }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-500">Conv {i + 1}</span>
                    <span className="text-cyan-400 text-xs">→ ReLU → MaxPool</span>
                  </div>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">Filters</span>
                    <select value={filters[i]} onChange={e => setFilter(i, Number(e.target.value))} className={selectClass}>
                      {FILTER_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ANN layers */}
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold">Fully Connected Layers</h2>
              <div className="flex gap-2">
                {[1, 2, 3].map(n => (
                  <button key={n} onClick={() => setAnnLayers(n)}
                    className={`w-9 h-9 rounded-lg text-sm font-bold border transition-colors ${annLayers === n ? 'bg-violet-700 border-violet-500 text-white' : 'border-gray-700 text-gray-400 hover:border-violet-600'}`}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: annLayers }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4">
                  <span className="text-xs text-gray-500 shrink-0">FC {i + 1} → ReLU → Dropout(0.4)</span>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-xs text-gray-500">Neurons</span>
                    <select value={annNeurons[i]} onChange={e => setAnnNeuron(i, Number(e.target.value))} className={selectClass}>
                      {NEURON_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 bg-gray-800/30 rounded-lg p-4 opacity-60">
                <span className="text-xs text-gray-500">Output Layer → {classNames.slice(0, numClasses).join(' / ')} ({numClasses} neurons) · Softmax</span>
              </div>
            </div>
          </div>

          {/* Epochs */}
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-white font-semibold">Training Epochs</h2>
              <span className="text-indigo-400 font-bold text-lg">{epochs}</span>
            </div>
            <input type="range" min={5} max={50} step={5} value={epochs}
              onChange={e => setEpochs(Number(e.target.value))}
              className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-gray-600 mt-1"><span>5</span><span>50</span></div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(0)} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors">
              ← Back
            </button>
            <button onClick={handleTrain} disabled={training}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
              {training ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Training... (may take 30–60s)
                </span>
              ) : 'Train Model ▶'}
            </button>
          </div>
          {trainError && <p className="text-red-400 text-sm text-center">{trainError}</p>}
        </div>
      )}

      {/* ── Step 2: Results ── */}
      {step === 2 && trainResult && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Total Parameters', value: trainResult.total_params.toLocaleString() },
              { label: 'Final Accuracy', value: `${trainResult.history.at(-1).accuracy}%` },
              { label: 'Final Loss', value: trainResult.history.at(-1).loss },
            ].map(s => (
              <div key={s.label} className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-indigo-400">{s.value}</div>
                <div className="text-xs text-gray-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Training history */}
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Training History</h3>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {trainResult.history.map(h => (
                <div key={h.epoch} className="flex items-center gap-4">
                  <span className="text-xs text-gray-500 w-16 shrink-0">Epoch {h.epoch}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">Accuracy</span>
                      <span className={`font-mono font-bold ${h.accuracy >= 80 ? 'text-green-400' : h.accuracy >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>{h.accuracy}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${h.accuracy >= 80 ? 'bg-green-500' : h.accuracy >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${h.accuracy}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-mono text-gray-500 w-16 text-right shrink-0">loss {h.loss}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setStep(3)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-opacity">
            Test the Model →
          </button>
        </div>
      )}

      {/* ── Step 3: Test ── */}
      {step === 3 && trainResult && (
        <div className="space-y-6">
          <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Upload a Test Image</h3>
            <p className="text-xs text-gray-500 mb-4">Upload an image that belongs to one of your classes: <span className="text-white">{trainResult.class_names.join(', ')}</span></p>

            <label className="block cursor-pointer mb-4">
              {testPreview ? (
                <div className="relative rounded-lg overflow-hidden border-2 border-green-600 max-w-sm mx-auto">
                  <img src={testPreview} alt="test" className="w-full object-contain max-h-60" />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-xs text-green-400 px-3 py-1.5">
                    {testFile?.name} — click to change
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-gray-600 hover:border-green-600 rounded-lg transition-colors text-gray-500">
                  <p className="text-2xl mb-2">🖼️</p>
                  <p className="text-sm">Click to upload test image</p>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files[0]
                if (f) { setTestFile(f); setTestPreview(URL.createObjectURL(f)); setTestResult(null) }
              }} />
            </label>

            <button onClick={handleTest} disabled={!testFile || testing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-40">
              {testing ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Predicting...
                </span>
              ) : 'Predict ▶'}
            </button>

            {testError && <p className="text-red-400 text-sm mt-3">{testError}</p>}
          </div>

          {testResult && (
            <div className="bg-gray-900/60 border border-gray-700/50 rounded-xl p-6 space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Prediction</h3>
              {testResult.map((r, i) => {
                const pct = (r.confidence * 100).toFixed(1)
                const isTop = i === 0
                return (
                  <div key={r.class_name} className={`rounded-xl p-4 border ${isTop ? 'bg-green-900/20 border-green-700/50' : 'bg-gray-800/50 border-gray-700/50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {isTop && <span className="text-xs font-bold bg-green-600 text-white px-1.5 py-0.5 rounded">TOP</span>}
                        <span className={`font-medium ${isTop ? 'text-white' : 'text-gray-300'}`}>{r.class_name}</span>
                      </div>
                      <span className={`font-mono font-bold text-sm ${isTop ? 'text-green-400' : 'text-gray-400'}`}>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div className={`h-2 rounded-full transition-all duration-500 ${isTop ? 'bg-green-500' : 'bg-gray-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="flex gap-4">
            <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
              ← Results
            </button>
            <button onClick={() => { setStep(0); setTrainResult(null); setTestResult(null); setTestFile(null); setTestPreview(null) }}
              className="flex-1 py-3 rounded-xl border border-indigo-700 text-indigo-400 hover:bg-indigo-900/30 transition-colors">
              Train a New Model ↺
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
