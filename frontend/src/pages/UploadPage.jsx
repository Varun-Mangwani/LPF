import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import {
  UploadCloud,
  CheckCircle2,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  X,
  Layers,
  Cpu,
  Database,
  Calendar,
  Wallet
} from 'lucide-react'

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: 'Profile' },
    { num: 2, label: 'Target Goal' },
    { num: 3, label: 'Bank Statement' },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
            step === s.num
              ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
              : step > s.num
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-slate-100 text-slate-400 border border-slate-200'
          }`}>
            {step > s.num ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : s.num}
          </div>
          <span className={`font-mono text-xs font-medium hidden sm:block ${
            step === s.num ? 'text-slate-900 font-bold' : step > s.num ? 'text-emerald-700' : 'text-slate-400'
          }`}>{s.label}</span>
          {i < steps.length - 1 && (
            <div className={`w-8 h-0.5 rounded-full mx-1 ${step > s.num ? 'bg-emerald-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function UploadResult({ result, onContinue }) {
  const stats = [
    { label: 'Rows Inserted',        value: result.inserted,            color: 'text-emerald-700', bg: 'bg-emerald-50/70 border-emerald-200' },
    { label: 'Categorized by Rules', value: result.categorized_by_rule, color: 'text-indigo-700',  bg: 'bg-indigo-50/70 border-indigo-200' },
    { label: 'Categorized by LLM',   value: result.categorized_by_llm,  color: 'text-amber-800',   bg: 'bg-amber-50/70 border-amber-200' },
    { label: 'Recurring Detected',   value: result.recurring_detected,  color: 'text-purple-700',  bg: 'bg-purple-50/70 border-purple-200' },
  ]

  return (
    <div className="space-y-6 animate-fade-in p-2">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-subtle">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 tracking-tight">
          Statement Ingested & Classified
        </h2>
        <p className="font-mono text-xs text-slate-500 mt-1 uppercase tracking-wider">
          High-precision rule engine & deterministic categorization complete
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 text-center shadow-subtle ${bg}`}>
            <p className={`font-mono text-3xl font-extrabold tabular ${color}`}>{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold mt-1">{label}</p>
          </div>
        ))}
      </div>

      <Button onClick={onContinue} variant="primary" size="lg" className="w-full justify-center" icon={ArrowRight}>
        Launch Executive Dashboard
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
          ? 'border-indigo-500 bg-indigo-50 scale-[1.01] shadow-sm'
          : file
          ? 'border-emerald-400 bg-emerald-50/40 shadow-subtle'
          : 'border-slate-300 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30'
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
      <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center mb-3 transition-all shadow-subtle ${
        file
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
          : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
      }`}>
        {file ? <FileText className="w-7 h-7" /> : <UploadCloud className="w-7 h-7" />}
      </div>
      <p className="font-display text-sm font-semibold text-slate-900">
        {file ? file.name : 'Drop bank statement CSV here or browse files'}
      </p>
      <p className="font-mono text-xs text-slate-500 mt-1">
        {file
          ? `${(file.size / 1024).toFixed(1)} KB • Ready for deterministic ingestion`
          : 'Supports HDFC, ICICI, SBI, Axis and standard CSV exports'}
      </p>
      {file && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onFile(null) }}
          className="mt-3 inline-flex items-center gap-1 font-mono text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Remove file
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

  const goToDashboard = () => navigate('/dashboard')
  const handleSkipDemo = () => navigate('/dashboard')

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

  return (
    <div className="max-w-3xl mx-auto py-6 px-4 animate-fade-in pb-16">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-subtle">
          <Wallet className="w-7 h-7 text-indigo-600" />
        </div>
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Ledger Onboarding & Ingestion
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">
          Self-hosted • Deterministic calculations • Zero cloud telemetry
        </p>
        <StepIndicator step={step} />
      </div>

      {/* ── Step 1: Income ───── */}
      {step === 1 && (
        <Card className="animate-fade-in border-slate-200/80 bg-white shadow-card" hover={false}>
          <CardHeader>
            <Badge variant="indigo" size="sm" className="w-fit mb-2">Step 01 of 03</Badge>
            <CardTitle>Baseline Monthly Net Inflow</CardTitle>
            <CardDescription>
              We calibrate the 50/30/20 budget framework, emergency cushion days, and daily safe-to-spend limits against your regular post-tax take-home.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNextStep1}>
            <CardContent className="space-y-4">
              <Input
                label="Monthly Post-Tax Income (₹)"
                required
                type="number"
                min="1"
                leftIcon="₹"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="85000"
                helperText="Enter your estimated average monthly salary or recurring consulting income"
              />
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                Skip to Demo Data
              </Button>
              <Button type="submit" variant="primary" icon={ArrowRight}>
                Next: Set Primary Goal
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Step 2: Goal ───── */}
      {step === 2 && (
        <Card className="animate-fade-in border-slate-200/80 bg-white shadow-card" hover={false}>
          <CardHeader>
            <Badge variant="amber" size="sm" className="w-fit mb-2">Step 02 of 03</Badge>
            <CardTitle>Anchor Savings Milestone</CardTitle>
            <CardDescription>
              The engine back-calculates required monthly contributions and tests feasibility against your daily surplus.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNextStep2}>
            <CardContent className="space-y-4">
              <Input
                label="Milestone Target Name"
                required
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Emergency Reserve Fund"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Amount (₹)"
                  required
                  type="number"
                  min="1"
                  leftIcon="₹"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="300000"
                />
                <Input
                  label="Target Completion Date"
                  required
                  type="date"
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} size="sm" icon={ArrowLeft}>
                Back
              </Button>
              <Button type="submit" variant="primary" icon={ArrowRight}>
                Next: Ingest Statement
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Step 3: Upload ───── */}
      {step === 3 && !uploadResult && (
        <Card className="animate-fade-in border-slate-200/80 bg-white shadow-card" hover={false}>
          <CardHeader>
            <Badge variant="emerald" size="sm" className="w-fit mb-2">Step 03 of 03</Badge>
            <CardTitle>Ingest Bank Statement CSV</CardTitle>
            <CardDescription>
              Import raw bank exports. Transactions are matched against merchant rules, recurring liabilities are flagged, and missing categories are predicted with LLM fallback.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleUpload}>
            <CardContent className="space-y-4">
              <DragDropZone file={file} onFile={setFile} />

              {/* Format hints */}
              <div className="grid grid-cols-3 gap-2">
                {['HDFC NetBanking CSV', 'ICICI / SBI CSV', 'Standard Generic CSV'].map((fmt) => (
                  <div key={fmt} className="text-center bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 shadow-subtle">
                    <p className="font-mono text-[10px] text-slate-500 font-medium">{fmt}</p>
                  </div>
                ))}
              </div>

              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                Use Demo Dataset
              </Button>
              <Button type="submit" variant="primary" isLoading={uploading} disabled={!file} icon={UploadCloud}>
                {uploading ? 'Processing Statement...' : 'Ingest & Classify'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Upload Result ───── */}
      {uploadResult && (
        <Card hover={false} className="border-slate-200/80 bg-white shadow-card">
          <CardContent className="p-4">
            <UploadResult result={uploadResult} onContinue={goToDashboard} />
          </CardContent>
        </Card>
      )}

      {/* ── Reset demo state ───── */}
      <div className="mt-12 pt-6 border-t border-slate-200 text-center">
        <p className="font-mono text-xs text-slate-500 mb-3">
          Want to restore the standard baseline demo fixtures?
        </p>
        <Button
          onClick={handleReset}
          variant="secondary"
          size="sm"
          isLoading={resetting}
          icon={RotateCcw}
        >
          {resetting ? 'Resetting DB...' : 'Reset to Seeded Demo Data'}
        </Button>
      </div>
    </div>
  )
}

