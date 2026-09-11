import { useState } from 'react'
import { api } from '../api/client.js'
import CashflowChart from '../components/CashflowChart.jsx'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import {
  CreditCard,
  Home,
  TrendingUp,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const SCENARIOS = [
  {
    value: 'new_emi',
    label: 'Take on a New EMI',
    icon: CreditCard,
    desc: 'Add a new monthly loan, gadget, or car EMI payment',
    placeholder: '12000',
    amountLabel: 'New Monthly EMI Amount (₹)',
  },
  {
    value: 'rent_change',
    label: 'Rent Adjustment',
    icon: Home,
    desc: 'Model relocation or rent increase/decrease',
    placeholder: '18000',
    amountLabel: 'New Monthly Rent Amount (₹)',
  },
  {
    value: 'income_change',
    label: 'Income Revision',
    icon: TrendingUp,
    desc: 'Salary increment, promotion, or new secondary revenue',
    placeholder: '95000',
    amountLabel: 'New Monthly Income Amount (₹)',
  },
]

/** Goals affordability table from simulation response */
function GoalsAffordabilityTable({ beforeGoals, afterGoals }) {
  if (!afterGoals?.length) return null

  return (
    <Card hover={false} className="border-slate-200/80 bg-white shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <CardTitle>Goal Feasibility & Timeline Impact</CardTitle>
        </div>
      </CardHeader>
      <div className="divide-y divide-slate-100">
        {/* Header */}
        <div className="grid grid-cols-5 gap-3 px-6 py-3 bg-slate-50 text-[11px] font-mono uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-100">
          <div className="col-span-2">Target Goal</div>
          <div className="text-right">Required / Mo</div>
          <div className="text-right">Remaining</div>
          <div className="text-right">Feasibility</div>
        </div>

        {afterGoals.map((g, i) => {
          const beforeGoal  = beforeGoals?.[i]
          const monthsDelta = beforeGoal ? (g.months_remaining ?? 0) - (beforeGoal.months_remaining ?? 0) : 0
          const affordable  = g.affordable_from_surplus

          return (
            <div key={g.name} className="grid grid-cols-5 gap-3 px-6 py-4 hover:bg-slate-50/70 transition-colors items-center">
              <div className="col-span-2">
                <p className="font-display font-semibold text-slate-900 text-sm">{g.name}</p>
                <p className="text-xs text-slate-500 mt-0.5">Target: {inr(g.target_amount || 0)}</p>
              </div>
              <div className="text-right font-mono text-sm font-semibold tabular text-slate-900">
                {inr(g.monthly_contribution_required || 0)}
              </div>
              <div className="text-right">
                <div className="inline-flex items-center gap-1.5 justify-end">
                  <span className="font-mono text-sm tabular text-slate-700 font-medium">
                    {g.months_remaining ?? '?'} mo
                  </span>
                  {monthsDelta !== 0 && (
                    <Badge
                      variant={monthsDelta > 0 ? 'rose' : 'emerald'}
                      size="sm"
                    >
                      {monthsDelta > 0 ? `+${monthsDelta} mo delay` : `${Math.abs(monthsDelta)} mo sooner`}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-right">
                {affordable === true ? (
                  <Badge variant="emerald" size="sm" pulse>
                    ✓ Affordable
                  </Badge>
                ) : affordable === false ? (
                  <Badge variant="rose" size="sm" pulse>
                    ✕ Deficit Risk
                  </Badge>
                ) : (
                  <Badge variant="neutral" size="sm">—</Badge>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default function SimulationPage() {
  const [scenario, setScenario] = useState('new_emi')
  const [amount,   setAmount]   = useState('')
  const [result,   setResult]   = useState(null)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')

  const selectedScenario = SCENARIOS.find((s) => s.value === scenario)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!amount) return
    setLoading(true)
    setError('')
    try {
      const res = await api.simulate({ scenario, amount: Number(amount) })
      setResult(res)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const before = result?.before
  const after  = result?.after

  const beforeBalance = before?.projected_balance ?? before?.cashflow?.month_end_balance ?? 0
  const afterBalance  = after?.projected_balance  ?? after?.cashflow?.month_end_balance  ?? 0
  const balanceDelta  = before && after ? afterBalance - beforeBalance : null

  const beforeSurplus = before?.cashflow
    ? (before.cashflow.recurring_inflow || 0) - (before.cashflow.recurring_outflow || 0)
    : null
  const afterSurplus  = after?.cashflow
    ? (after.cashflow.recurring_inflow || 0) - (after.cashflow.recurring_outflow || 0)
    : null

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-600" />
          Deterministic What-If Engine
        </div>
        <h1 className="page-title">Scenario Simulation</h1>
        <p className="page-subtitle">
          Test major life financial moves before committing. Recalculate daily liquid cash flow, month-end cushion, and real-time goal feasibility with 100% mathematical precision.
        </p>
      </header>

      {/* Form Card */}
      <Card hover={false} className="border-slate-200/80 bg-white shadow-card relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl pointer-events-none" />

        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-subtle">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <CardTitle>Configure Simulation Parameters</CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">Select a variable and set the simulated monthly delta</p>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-6">
            {/* Scenario selector */}
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-3 block">
                Select Variable to Stress-Test
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {SCENARIOS.map((s) => {
                  const Icon = s.icon
                  const active = scenario === s.value
                  return (
                    <button
                      key={s.value}
                      type="button"
                      onClick={() => { setScenario(s.value); setAmount('') }}
                      className={`text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer relative ${
                        active
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-950 shadow-sm ring-2 ring-indigo-500/20'
                          : 'border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 bg-white text-slate-600 shadow-subtle'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-xl ${active ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        {active && (
                          <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                        )}
                      </div>
                      <p className={`font-display text-sm font-semibold ${active ? 'text-indigo-950' : 'text-slate-900'}`}>
                        {s.label}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Amount input */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 shadow-subtle">
              <Input
                label={selectedScenario?.amountLabel || 'Monthly Amount (₹)'}
                required
                type="number"
                min="1"
                leftIcon="₹"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={selectedScenario?.placeholder || '12000'}
                helperText={amount ? `Annual equivalent committed: ${inr(Number(amount) * 12)}` : 'Enter the anticipated monthly change in Indian Rupees'}
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-500 hidden sm:inline">Calculates forward-looking 90-day cashflow</span>
            <Button type="submit" variant="primary" isLoading={loading} size="lg" icon={ArrowRight}>
              {loading ? 'Recomputing Dynamic Model...' : 'Run Scenario Simulation'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ── Results ── */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Balance comparison grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card hover={false} className="p-5 text-center border-slate-200/80 bg-white shadow-card">
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-1">
                Baseline Projected Cushion
              </p>
              <p className="font-mono text-2xl font-bold text-slate-800 tabular">
                {inr(beforeBalance)}
              </p>
              {beforeSurplus !== null && (
                <p className="font-mono text-xs text-slate-500 mt-1.5">
                  Monthly Surplus: <span className="text-slate-800 font-semibold">{inr(beforeSurplus)}</span>
                </p>
              )}
            </Card>

            <Card hover={false} className="p-5 text-center border-indigo-200 bg-indigo-50/50 shadow-card">
              <p className="font-mono text-[11px] uppercase tracking-wider text-indigo-700 font-bold mb-1">
                Simulated Month-End
              </p>
              <p className="font-mono text-2xl font-bold text-indigo-950 tabular">
                {inr(afterBalance)}
              </p>
              {afterSurplus !== null && (
                <p className="font-mono text-xs text-slate-600 mt-1.5">
                  Revised Surplus: <span className="text-indigo-700 font-bold">{inr(afterSurplus)}</span>
                </p>
              )}
            </Card>

            <Card
              hover={false}
              className={`p-5 text-center border-l-4 shadow-card ${
                balanceDelta >= 0
                  ? 'border-l-emerald-500 border-slate-200/80 bg-emerald-50/30'
                  : 'border-l-rose-500 border-slate-200/80 bg-rose-50/30'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                {balanceDelta >= 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-rose-600" />
                )}
                <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                  Net Monthly Delta
                </p>
              </div>
              <p className={`font-mono text-2xl font-bold tabular ${
                balanceDelta >= 0 ? 'text-emerald-700' : 'text-rose-700'
              }`}>
                {balanceDelta !== null
                  ? `${balanceDelta >= 0 ? '+' : ''}${inr(balanceDelta)}`
                  : '—'}
              </p>
              <p className="text-xs text-slate-500 mt-1.5 font-sans">
                {balanceDelta < 0 ? 'Monthly buffer compression' : 'Additional cash headroom'}
              </p>
            </Card>
          </div>

          {/* Before vs After Cashflow Chart */}
          <Card hover={false} className="border-slate-200/80 bg-white shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Cash Flow Trajectory (Baseline vs Scenario)</CardTitle>
                  <p className="text-xs text-slate-500 mt-0.5">Green solid indicates original plan, dotted indicates simulated impact</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-slate-600 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Baseline
                  </span>
                  <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" /> Simulated
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CashflowChart data={before?.cashflow} compareData={after?.cashflow} />
            </CardContent>
          </Card>

          {/* Goals affordability table */}
          <GoalsAffordabilityTable
            beforeGoals={before?.goals}
            afterGoals={after?.goals}
          />

          {/* AI narrative */}
          {result.narrative && (
            <Card hover={false} className="bg-indigo-50/70 border-indigo-100 shadow-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 flex-shrink-0 mt-0.5 shadow-subtle">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                    <p className="font-mono text-xs uppercase tracking-wider text-indigo-800 font-bold">
                      Deterministic Impact Assessment
                    </p>
                  </div>
                  <p className="font-sans text-sm text-slate-700 leading-relaxed">
                    {result.narrative}
                  </p>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

