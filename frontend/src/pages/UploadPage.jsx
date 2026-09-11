import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

// Accepted file formats
const ACCEPTED = ['.csv']

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Goal' },
    { num: 3, label: 'Statement' },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
            step === s.num
              ? 'bg-indigo-600 text-white shadow-md ring-4 ring-indigo-500/20'
              : step > s.num
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
              : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}>
            {step > s.num ? '✓' : s.num}
          </div>
          <span className={`font-mono text-[11px] font-semibold hidden sm:block ${
            step === s.num ? 'text-indigo-700' : step > s.num ? 'text-emerald-700' : 'text-slate-400'
          }`}>{s.label}</span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-1 rounded-full mx-1 ${step > s.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function UploadResult({ result, onContinue }) {
  const stats = [
    { label: 'Rows Inserted',        value: result.inserted,            color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
    { label: 'Categorized by Rules', value: result.categorized_by_rule, color: 'text-indigo-700',  bg: 'bg-indigo-50 border-indigo-200' },
    { label: 'Categorized by AI',    value: result.categorized_by_llm,  color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200' },
    { label: 'Recurring Detected',   value: result.recurring_detected,  color: 'text-slate-700',   bg: 'bg-slate-100 border-slate-200' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto mb-3 shadow-sm">
          ✅
        </div>
        <h2 className="font-display text-2xl font-extrabold text-slate-900 tracking-tight">
          Statement Imported Successfully
        </h2>
        <p className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">
          LPF has analysed and categorised your transactions
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 text-center ${bg}`}>
            <p className={`font-display text-3xl font-extrabold tabular ${color}`}>{value}</p>
            <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold mt-1">{label}</p>
          </div>
        ))}
      </div>

      <Button onClick={onContinue} variant="primary" size="lg" className="w-full justify-center">
        View Dashboard →
      </Button>
    </div>
  )
}

function DragDropZone({ file, onFile }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files?.[0]
    if (f && f.name.toLowerCase().endsWith('.csv')) onFile(f)
  }, [onFile])

  const onDragOver = (e) => { e.preventDefault(); setDragging(true) }
  const onDragLeave = () => setDragging(false)

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
        dragging
          ? 'border-indigo-500 bg-indigo-50/80 scale-[1.01]'
          : file
          ? 'border-emerald-400 bg-emerald-50/60'
          : 'border-slate-300 hover:border-indigo-400 bg-slate-50/50 hover:bg-indigo-50/20'
      }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f) }}
      />
      <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-2xl font-bold mb-3 transition-all ${
        file ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
      }`}>
        {file ? '📄' : '↑'}
      </div>
      <p className="font-mono text-sm font-bold text-slate-900">
        {file ? file.name : 'Drop CSV here or click to browse'}
      </p>
      <p className="font-mono text-xs text-slate-500 mt-1">
        {file
          ? `${(file.size / 1024).toFixed(1)} KB — ready to upload`
          : 'Supports SBI, HDFC, ICICI and any standard CSV bank statement'}
      </p>
      {file && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFile(null) }}
          className="mt-2 font-mono text-xs text-rose-500 hover:text-rose-700 transition-colors"
        >
          ✕ Remove file
        </button>
      )}
    </div>
  )
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [step,       setStep]       = useState(1)
  const [income,     setIncome]     = useState('85000')
  const [goalName,   setGoalName]   = useState('Emergency Reserve Fund')
  const [goalTarget, setGoalTarget] = useState('300000')
  const [goalDate,   setGoalDate]   = useState('2027-05-01')
  const [file,       setFile]       = useState(null)
  const [uploading,  setUploading]  = useState(false)
  const [resetting,  setResetting]  = useState(false)
  const [error,      setError]      = useState('')
  const [uploadResult, setUploadResult] = useState(null)

  /* ── helpers ──────────────────────────────────────────── */
  const goToDashboard = () => navigate('/dashboard')

  const handleSkipDemo = () => navigate('/dashboard')

  /* ── Step handlers ────────────────────────────────────── */
  const handleNextStep1 = (e) => { e.preventDefault(); setStep(2) }

  const handleNextStep2 = async (e) => {
    e.preventDefault()
    if (goalName && goalTarget && goalDate) {
      await api.createGoal({
        name: goalName,
        target_amount: parseFloat(goalTarget),
        current_amount: 0,
        target_date: goalDate,
      }).catch(() => {})
    }
    setStep(3)
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) { setError('Please select a CSV file.'); return }
    setUploading(true)
    setError('')
    try {
      const result = await api.uploadCsv(file)
      setUploadResult(result)
    } catch (err) {
      setError(err.message || 'Error processing CSV file.')
    } finally {
      setUploading(false)
    }
  }

  const handleReset = async () => {
    if (!window.confirm('This will wipe all data and re-seed the demo dataset. Continue?')) return
    setResetting(true)
    try {
      await api.resetDb()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setResetting(false)
    }
  }

  /* ── render ───────────────────────────────────────────── */
  return (
    <div className="max-w-3xl mx-auto py-4 px-4 animate-fade-in pb-12">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <img src="/lpf_logo.jpg" alt="LPF" className="w-14 h-14 mx-auto mb-3 rounded-xl shadow-md object-contain bg-white border border-slate-200" />
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Ledger Personal Finance
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">
          Import your bank statement · LPF categorises everything automatically
        </p>
        <StepIndicator step={step} />
      </div>

      {/* ── Step 1: Income ───── */}
      {step === 1 && (
        <Card className="animate-fade-in" hover={false}>
          <CardHeader>
            <Badge variant="indigo" className="w-fit mb-2">Step 01 of 03</Badge>
            <CardTitle>Monthly Income Target</CardTitle>
            <CardDescription>
              LPF uses your take-home income to validate the 50/30/20 budget rule and calculate cashflow health.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNextStep1}>
            <CardContent className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold block mb-2">
                  Expected Monthly Net Income (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    placeholder="85000"
                    className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl font-mono text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none bg-white"
                  />
                </div>
                <p className="font-mono text-[11px] text-slate-500 mt-1.5">Enter your net take-home monthly income</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                Skip to Demo Data
              </Button>
              <Button type="submit" variant="primary">
                Next: Define Goal →
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Step 2: Goal ───── */}
      {step === 2 && (
        <Card className="animate-fade-in" hover={false}>
          <CardHeader>
            <Badge variant="amber" className="w-fit mb-2">Step 02 of 03</Badge>
            <CardTitle>Primary Savings Goal</CardTitle>
            <CardDescription>
              LPF's deterministic engine back-calculates the exact monthly savings needed to hit your target by deadline.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNextStep2}>
            <CardContent className="space-y-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold block mb-2">Goal Name</label>
                <input
                  type="text"
                  required
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="e.g. Emergency Reserve Fund"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl font-body text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none bg-white"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold block mb-2">Target Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500 font-bold">₹</span>
                    <input
                      type="number"
                      required
                      min="1"
                      value={goalTarget}
                      onChange={(e) => setGoalTarget(e.target.value)}
                      placeholder="300000"
                      className="w-full pl-8 pr-4 py-3 border border-slate-300 rounded-xl font-mono text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold block mb-2">Target Date</label>
                  <input
                    type="date"
                    required
                    value={goalDate}
                    onChange={(e) => setGoalDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl font-mono text-sm focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none bg-white"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="button" variant="secondary" onClick={() => setStep(1)} size="sm">← Back</Button>
              <Button type="submit" variant="primary">Next: Import Statement →</Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Step 3: Upload ───── */}
      {step === 3 && !uploadResult && (
        <Card className="animate-fade-in" hover={false}>
          <CardHeader>
            <Badge variant="emerald" className="w-fit mb-2">Step 03 of 03</Badge>
            <CardTitle>Import Bank Statement</CardTitle>
            <CardDescription>
              Drop your CSV bank statement below. LPF auto-categorises transactions and detects recurring subscriptions.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpload}>
            <CardContent className="space-y-4">
              <DragDropZone file={file} onFile={setFile} />

              {/* Format hints */}
              <div className="grid grid-cols-3 gap-2">
                {['SBI NetBanking CSV', 'HDFC Bank CSV', 'Any standard CSV'].map((fmt) => (
                  <div key={fmt} className="text-center bg-slate-50 border border-slate-200 rounded-xl p-2">
                    <p className="font-mono text-[10px] text-slate-600 font-semibold">{fmt}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs text-rose-700">
                  ⚠️ {error}
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                Use Demo Dataset
              </Button>
              <Button type="submit" variant="primary" isLoading={uploading} disabled={!file}>
                {uploading ? 'Processing Statement...' : 'Upload & Analyse →'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Upload Result ───── */}
      {uploadResult && (
        <Card hover={false}>
          <CardContent>
            <UploadResult result={uploadResult} onContinue={goToDashboard} />
          </CardContent>
        </Card>
      )}

      {/* ── Admin reset (bottom) ───── */}
      <div className="mt-10 pt-6 border-t border-slate-200 text-center">
        <p className="font-mono text-xs text-slate-400 mb-3">
          Already have data? Reset the database to the seeded demo state.
        </p>
        <Button
          onClick={handleReset}
          variant="secondary"
          size="sm"
          isLoading={resetting}
        >
          {resetting ? 'Resetting...' : '↺ Reset to Demo Data'}
        </Button>
      </div>
    </div>
  )
}
