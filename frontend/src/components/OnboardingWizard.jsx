import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Badge } from './ui/Badge'

export default function OnboardingWizard({ onComplete }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [income, setIncome] = useState('85000')
  const [goalName, setGoalName] = useState('Emergency Reserve Fund')
  const [goalTarget, setGoalTarget] = useState('300000')
  const [goalDate, setGoalDate] = useState('2027-05-01')
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleNextStep1 = (e) => {
    e.preventDefault()
    setStep(2)
  }

  const handleNextStep2 = async (e) => {
    e.preventDefault()
    try {
      if (goalName && goalTarget && goalDate) {
        await api.createGoal({
          name: goalName,
          target_amount: parseFloat(goalTarget),
          current_amount: 65000,
          target_date: goalDate,
        }).catch(() => {})
      }
    } catch (err) {
      // ignore fallback error
    }
    setStep(3)
  }

  const handleFileUpload = async (e) => {
    e.preventDefault()
    setUploading(true)
    setError('')
    try {
      if (file) {
        await api.uploadCsv(file)
      }
      if (onComplete) onComplete()
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Error processing CSV file.')
      setUploading(false)
    }
  }

  const handleSkipDemo = () => {
    if (onComplete) onComplete()
    navigate('/dashboard')
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <img
          src="/lpf_logo.jpg"
          alt="LPF Logo"
          className="w-16 h-16 mx-auto mb-3 rounded-xl shadow-md object-contain bg-white border border-slate-200"
        />
        <h1 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to Ledger Personal Finance (LPF)
        </h1>
        <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold mt-1">
          Intelligent, Numbers-Backed Financial Health Assistant
        </p>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mt-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold transition-all ${
                  step === s
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-600/30 ring-4 ring-primary-500/20'
                    : step > s
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Income Setup */}
      {step === 1 && (
        <Card className="animate-fade-in" hover={false}>
          <CardHeader>
            <Badge variant="indigo" className="w-fit mb-1">Step 01 of 03</Badge>
            <CardTitle>Set Your Monthly Income Target</CardTitle>
            <CardDescription>
              LPF uses your monthly income to measure essential budget ratios and calculate cashflow health.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleNextStep1}>
            <CardContent className="space-y-4">
              <Input
                label="Expected Monthly Income (₹)"
                type="number"
                required
                leftIcon="₹"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                placeholder="85000"
                helperText="Enter your net take-home monthly income"
              />
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

      {/* Step 2: Goal Setup */}
      {step === 2 && (
        <Card className="animate-fade-in" hover={false}>
          <CardHeader>
            <Badge variant="amber" className="w-fit mb-1">Step 02 of 03</Badge>
            <CardTitle>Define Primary Savings Goal</CardTitle>
            <CardDescription>
              Our deterministic engines calculate exact required monthly contributions and timeline projections.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleNextStep2}>
            <CardContent className="space-y-4">
              <Input
                label="Goal Name"
                type="text"
                required
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Emergency Reserve Fund"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Target Amount (₹)"
                  type="number"
                  required
                  leftIcon="₹"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="300000"
                />

                <Input
                  label="Target Date"
                  type="date"
                  required
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                />
              </div>
            </CardContent>

            <CardFooter>
              <Button type="button" variant="secondary" onClick={() => setStep(1)} size="sm">
                ← Back
              </Button>
              <Button type="submit" variant="primary">
                Next: Statement Import →
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}

      {/* Step 3: Statement Upload */}
      {step === 3 && (
        <Card className="animate-fade-in" hover={false}>
          <CardHeader>
            <Badge variant="emerald" className="w-fit mb-1">Step 03 of 03</Badge>
            <CardTitle>Import Bank Statement or CSV</CardTitle>
            <CardDescription>
              Supports standard CSV statements and multi-column bank formats (SBI, HDFC, ICICI, etc.).
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleFileUpload}>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 hover:border-primary-500 bg-slate-50/50 rounded-2xl p-8 text-center transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  id="csv-file-input"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label htmlFor="csv-file-input" className="cursor-pointer space-y-3 block">
                  <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 border border-primary-200 mx-auto flex items-center justify-center text-2xl font-bold">
                    ↑
                  </div>
                  <p className="font-mono text-sm text-slate-900 font-bold">
                    {file ? file.name : 'Click to select CSV bank statement'}
                  </p>
                  <p className="font-mono text-xs text-slate-500">
                    Auto-categorizes transactions and flags recurring subscriptions
                  </p>
                </label>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs text-rose-700">
                  ⚠️ {error}
                </div>
              )}
            </CardContent>

            <CardFooter>
              <Button type="button" variant="secondary" onClick={handleSkipDemo} size="sm">
                Use Demo Dataset Instead
              </Button>
              <Button type="submit" variant="emerald" isLoading={uploading}>
                {uploading ? 'Processing Statement...' : 'Complete & Open Dashboard →'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
