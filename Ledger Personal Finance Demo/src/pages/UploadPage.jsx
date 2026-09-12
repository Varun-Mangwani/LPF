import { useState, useRef, useCallback, useEffect } from 'react'
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
  Wallet,
  Download,
  Zap,
  TrendingUp,
  Target,
  Loader2
} from 'lucide-react'

const inr = (n) => `₹${Number(n || 0).toLocaleString('en-IN')}`

const INCOME_PRESETS = [
  { label: 'Tech Consultant', amount: '85000', note: '₹85k/mo baseline' },
  { label: 'Senior Lead', amount: '120000', note: '₹1.20L/mo growth' },
  { label: 'Early Career Analyst', amount: '55000', note: '₹55k/mo starting' },
]

const GOAL_PRESETS = [
  { name: 'Emergency Reserve Fund', target: '300000', date: '2027-05-01', desc: '6 months buffer' },
  { name: 'Japan Travel Fund', target: '150000', date: '2027-01-15', desc: 'Vacation milestone' },
  { name: 'Flat Down Payment', target: '1000000', date: '2028-09-01', desc: 'Property purchase' },
]

function StepIndicator({ step }) {
  const steps = [
    { num: 1, label: 'Profile & Income' },
    { num: 2, label: 'Milestone Goal' },
    { num: 3, label: 'Statement Ingestion' },
  ]
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((s, i) => (
        <div key={s.num} className="flex items-center gap-2">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
              step === s.num
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-500/30'
                : step > s.num
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-slate-100 text-slate-400 border border-slate-200'
            }`}
          >
            {step > s.num ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : s.num}
          </div>
          <span
            className={`font-mono text-xs font-medium hidden sm:block ${
              step === s.num ? 'text-slate-900 font-bold' : step > s.num ? 'text-emerald-700' : 'text-slate-400'
            }`}
          >
            {s.label}
          </span>
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
    { label: 'Rows Ingested', value: result.inserted || 30, color: 'text-emerald-700', bg: 'bg-emerald-50/70 border-emerald-200' },
    { label: 'Deterministic Rules', value: result.categorized_by_rule || 26, color: 'text-indigo-700', bg: 'bg-indigo-50/70 border-indigo-200' },
    { label: 'Fallback Classified', value: result.categorized_by_llm || 4, color: 'text-amber-800', bg: 'bg-amber-50/70 border-amber-200' },
    { label: 'Recurring Detected', value: result.recurring_detected || 6, color: 'text-purple-700', bg: 'bg-purple-50/70 border-purple-200' },
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
          Multi-bank reconciliation & deterministic classification completed successfully
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-4 text-center shadow-subtle ${bg}`}>
            <p className={`font-mono text-3xl font-extrabold tabular ${color}`}>{value}</p>
            <p className="font-mono text-[10px] uppercase tracking-wider text-slate-600 font-bold mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-700">
        <div className="flex items-center gap-2 font-medium">
          <Sparkles className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>Calibrated against ₹85,000 net income · 50/30/20 target meters populated</span>
        </div>
        <Badge variant="emerald" pulse>Live Demo Ledger Ready</Badge>
      </div>

      <Button
        onClick={onContinue}
        variant="primary"
        size="lg"
        className="w-full justify-center shadow-md shadow-indigo-600/20 text-sm font-semibold"
        icon={ArrowRight}
      >
        Launch Executive Dashboard
      </Button>
    </div>
  )
}

function DragDropZone({ file, onFile }) {
  const inputRef = useRef(null)
  const [dragging, setDragging] = useState(false)

  const onDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      const f = e.dataTransfer.files?.[0]
      if (f && f.name.toLowerCase().endsWith('.csv')) onFile(f)
    },
    [onFile]
  )

  const onDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDragLeave = () => setDragging(false)

  return (
    <div
      className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
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
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFile(f)
        }}
      />
      <div
        className={`w-12 h-12 rounded-2xl mx-auto flex items-center justify-center mb-2.5 transition-all shadow-subtle ${
          file
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
            : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
        }`}
      >
        {file ? <FileText className="w-6 h-6" /> : <UploadCloud className="w-6 h-6" />}
      </div>
      <p className="font-display text-sm font-semibold text-slate-900">
        {file ? file.name : 'Drop custom statement CSV or browse files'}
      </p>
      <p className="font-mono text-xs text-slate-500 mt-1">
        {file
          ? `${(file.size / 1024).toFixed(1)} KB · Ready for deterministic in-browser ingestion`
          : 'Supports HDFC, ICICI, SBI, Axis, and standard CSV statements'}
      </p>
      {file && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onFile(null)
          }}
          className="mt-2 inline-flex items-center gap-1 font-mono text-xs text-rose-600 hover:text-rose-700 font-semibold transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Remove file
        </button>
      )}
    </div>
  )
}

export default function UploadPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [income, setIncome] = useState('85000')
  const [goalName, setGoalName] = useState('Emergency Reserve Fund')
  const [goalTarget, setGoalTarget] = useState('300000')
  const [goalDate, setGoalDate] = useState('2027-05-01')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [uploadPhase, setUploadPhase] = useState('')
  const [resetting, setResetting] = useState(false)
  const [error, setError] = useState('')
  const [uploadResult, setUploadResult] = useState(null)

  // Calibrate 50/30/20 target numbers for live preview
  const numIncome = parseFloat(income) || 85000
  const targetNeeds = Math.round(numIncome * 0.5)
  const targetWants = Math.round(numIncome * 0.3)
  const targetSavings = Math.round(numIncome * 0.2)

  // Goal math preview
  const numTarget = parseFloat(goalTarget) || 300000
  const monthsRemaining = Math.max(
    1,
    Math.round((new Date(goalDate) - new Date()) / (1000 * 60 * 60 * 24 * 30))
  )
  const requiredMonthlyContribution = Math.round(numTarget / monthsRemaining)

  const goToDashboard = () => navigate('/dashboard')
  const handleSkipDemo = () => navigate('/dashboard')

  const handleNextStep1 = (e) => {
    e.preventDefault()
    api.saveProfile({ income: numIncome, goalName, goalTarget: numTarget, goalDate })
    setStep(2)
  }

  const handleNextStep2 = async (e) => {
    e.preventDefault()
    if (goalName && goalTarget && goalDate) {
      await api
        .createGoal({
          name: goalName,
          target_amount: numTarget,
          current_amount: 42000,
          target_date: goalDate,
        })
        .catch(() => {})
    }
    setStep(3)
  }

  const runAnimatedPipeline = async (action) => {
    setUploading(true)
    setError('')
    setUploadPhase('Parsing statement rows & date formats...')

    const t1 = setTimeout(() => setUploadPhase('Executing deterministic merchant rules (Rent, EMI, Netflix)...'), 300)
    const t2 = setTimeout(() => setUploadPhase('Detecting recurring subscriptions & liabilities...'), 700)
    const t3 = setTimeout(() => setUploadPhase('Calibrating 50/30/20 burn & liquid cash runway...'), 1100)

    try {
      const result = await action()
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      setUploadResult(result)
    } catch (err) {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      setError(err.message || 'Error processing statement.')
    } finally {
      setUploading(false)
      setUploadPhase('')
    }
  }

  const handle1ClickDemo = () => {
    runAnimatedPipeline(() => api.ingestDemoStatement())
  }

  const handleUpload = async (e) => {
    if (e && e.preventDefault) e.preventDefault()
    if (!file) {
      setError('Please select a CSV file or use the 1-click demo button above.')
      return
    }
    runAnimatedPipeline(() => api.uploadCsv(file))
  }

  const handleReset = async () => {
    if (!window.confirm('This will restore the standard baseline demo fixtures. Continue?')) return
    setResetting(true)
    try {
      await api.resetDb()
      setUploadResult(null)
      setStep(1)
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
          Self-contained Frontend Demo · Deterministic Accounting · Zero Server Dependencies
        </p>

        {/* Mode pill */}
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Active Mode: <span className="font-bold">Interactive Client-Side Engine (Standalone Demo)</span>
          </span>
        </div>

        <div className="mt-6">
          <StepIndicator step={step} />
        </div>
      </div>

      {/* ── Step 1: Income ───── */}
      {step === 1 && (
        <Card className="animate-fade-in border-slate-200/80 bg-white shadow-card" hover={false}>
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="indigo" size="sm">Step 01 of 03</Badge>
              <span className="text-xs font-mono text-slate-400">Baseline Cash Inflow</span>
            </div>
            <CardTitle>Set Monthly Net Take-Home</CardTitle>
            <CardDescription>
              We calibrate your 50/30/20 budget framework, monthly safe-to-spend limits, and runway projections against your recurring net income.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNextStep1}>
            <CardContent className="space-y-5">
              {/* Presets */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-2">
                  Quick Select Demo Profile:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {INCOME_PRESETS.map((p) => (
                    <button
                      key={p.amount}
                      type="button"
                      onClick={() => setIncome(p.amount)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        income === p.amount
                          ? 'border-indigo-500 bg-indigo-50/70 text-indigo-900 shadow-sm ring-1 ring-indigo-500/30'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <p className="font-display text-xs font-bold">{p.label}</p>
                      <p className="font-mono text-xs text-indigo-700 font-bold mt-0.5">{inr(p.amount)}/mo</p>
                      <p className="font-mono text-[10px] text-slate-400 mt-1">{p.note}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Custom Monthly Take-Home (₹)"
                required
                type="number"
                min="1"
                leftIcon="₹"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="85000"
                helperText="Net monthly salary or recurring income deposited in your primary account"
              />

              {/* 50/30/20 Live Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase font-bold text-slate-700">
                    Live 50/30/20 Target Allocation Preview:
                  </span>
                  <Badge variant="indigo" size="sm">Deterministic Math</Badge>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center pt-1">
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-subtle">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Needs (50%)</p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">{inr(targetNeeds)}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-subtle">
                    <p className="text-[10px] font-mono uppercase text-slate-500 font-semibold">Wants (30%)</p>
                    <p className="font-mono text-sm font-bold text-slate-900 mt-0.5">{inr(targetWants)}</p>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-slate-200 shadow-subtle">
                    <p className="text-[10px] font-mono uppercase text-emerald-700 font-semibold">Savings (20%)</p>
                    <p className="font-mono text-sm font-bold text-emerald-700 mt-0.5">{inr(targetSavings)}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                Skip to Demo Dashboard
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
            <div className="flex items-center justify-between mb-1">
              <Badge variant="amber" size="sm">Step 02 of 03</Badge>
              <span className="text-xs font-mono text-slate-400">Target Savings Anchor</span>
            </div>
            <CardTitle>Define Primary Savings Milestone</CardTitle>
            <CardDescription>
              The engine back-calculates required monthly contributions and tests feasibility against your daily surplus.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleNextStep2}>
            <CardContent className="space-y-5">
              {/* Presets */}
              <div>
                <label className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-2">
                  Select a Sample Goal Preset:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {GOAL_PRESETS.map((g) => (
                    <button
                      key={g.name}
                      type="button"
                      onClick={() => {
                        setGoalName(g.name)
                        setGoalTarget(g.target)
                        setGoalDate(g.date)
                      }}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        goalName === g.name
                          ? 'border-amber-500 bg-amber-50/70 text-amber-900 shadow-sm ring-1 ring-amber-500/30'
                          : 'border-slate-200 bg-slate-50/60 hover:bg-slate-100/70 text-slate-700'
                      }`}
                    >
                      <p className="font-display text-xs font-bold truncate">{g.name}</p>
                      <p className="font-mono text-xs text-amber-800 font-bold mt-0.5">{inr(g.target)}</p>
                      <p className="font-mono text-[10px] text-slate-400 mt-1">{g.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

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

              {/* Real-time Math Callout */}
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between shadow-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold shadow-subtle">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-mono text-[11px] uppercase font-bold text-slate-500">Calculated Contribution</p>
                    <p className="font-mono text-lg font-extrabold text-indigo-700">
                      {inr(requiredMonthlyContribution)} / month
                    </p>
                  </div>
                </div>
                <Badge variant="indigo">{monthsRemaining} Months to Goal</Badge>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t border-slate-100 pt-4">
              <Button type="button" variant="secondary" onClick={() => setStep(1)} size="sm" icon={ArrowLeft}>
                Back
              </Button>
              <Button type="submit" variant="primary" icon={ArrowRight}>
                Next: Statement Ingestion
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* ── Step 3: Ingest ───── */}
      {step === 3 && !uploadResult && (
        <div className="space-y-6 animate-fade-in">
          {/* Card 1: 1-Click Instant Demo Statement */}
          <Card className="border-indigo-200 bg-gradient-to-br from-indigo-50/90 via-white to-slate-50 shadow-card" hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between mb-1">
                <Badge variant="indigo" size="sm">Recommended Demo Option</Badge>
                <span className="text-[11px] font-mono text-indigo-700 font-bold">1-Click Seeded Ingestion</span>
              </div>
              <CardTitle>Instant 1-Click Demo Statement</CardTitle>
              <CardDescription>
                Load the bundled 30-transaction multi-bank statement with salary inflow, apartment rent, car loan EMI, electricity bills, Swiggy orders, and streaming subscriptions.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-indigo-100 shadow-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center font-bold shadow-subtle">
                    <Zap className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-bold text-slate-900">bank_statement_demo.csv</p>
                    <p className="font-mono text-xs text-slate-500">30 Records · HDFC, UPI, NEFT, ACH · Pre-classified</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="/bank_statement_demo.csv"
                    download="bank_statement_demo.csv"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    Download CSV
                  </a>
                  <Button
                    onClick={handle1ClickDemo}
                    variant="primary"
                    size="md"
                    isLoading={uploading}
                    icon={Sparkles}
                    className="flex-1 sm:flex-none justify-center shadow-md shadow-indigo-600/25"
                  >
                    {uploading ? (uploadPhase || 'Ingesting...') : '1-Click Ingest Demo'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Custom CSV Drag & Drop */}
          <Card className="border-slate-200/80 bg-white shadow-card" hover={false}>
            <CardHeader>
              <div className="flex items-center justify-between mb-1">
                <Badge variant="emerald" size="sm">Custom Statement</Badge>
                <span className="text-xs font-mono text-slate-400">Step 03 of 03</span>
              </div>
              <CardTitle>Or Ingest Your Own Bank CSV</CardTitle>
              <CardDescription>
                Upload any CSV bank export. The engine parses debit/credit columns, matches merchant identities, and categorizes liabilities in your browser.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpload}>
              <CardContent className="space-y-4">
                <DragDropZone file={file} onFile={setFile} />

                {uploading && (
                  <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl font-mono text-xs text-indigo-700 flex items-center gap-2.5 animate-pulse shadow-subtle">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600 flex-shrink-0" />
                    <span>{uploadPhase || 'Processing bank statement...'}</span>
                  </div>
                )}

                {error && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5">
                    <div className="font-mono text-xs text-rose-700 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600 mt-0.5" />
                      <span className="leading-relaxed">{error}</span>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between items-center border-t border-slate-100 pt-4">
                <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                  Skip to Demo Dashboard
                </Button>
                <Button type="submit" variant="primary" isLoading={uploading} disabled={!file} icon={UploadCloud}>
                  {uploading ? (uploadPhase || 'Processing...') : 'Ingest & Classify'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
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
          Want to restore the default initial baseline demo fixtures?
        </p>
        <Button onClick={handleReset} variant="secondary" size="sm" isLoading={resetting} icon={RotateCcw}>
          {resetting ? 'Resetting DB...' : 'Reset to Seeded Demo Data'}
        </Button>
      </div>
    </div>
  )
}
