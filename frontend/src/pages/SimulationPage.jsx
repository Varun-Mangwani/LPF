import { useState } from 'react'
import { api } from '../api/client.js'
import CashflowChart from '../components/CashflowChart.jsx'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const SCENARIOS = [
  {
    value: 'new_emi',
    label: 'Take on a New EMI',
    icon: '💳',
    desc: 'Add a new monthly loan/EMI payment',
    placeholder: '12000',
    amountLabel: 'New Monthly EMI Amount (₹)',
  },
  {
    value: 'rent_change',
    label: 'Rent Adjustment',
    icon: '🏠',
    desc: 'Model increase or decrease in monthly rent',
    placeholder: '18000',
    amountLabel: 'New Monthly Rent Amount (₹)',
  },
  {
    value: 'income_change',
    label: 'Income Revision',
    icon: '📈',
    desc: 'Salary increment or additional income source',
    placeholder: '95000',
    amountLabel: 'New Monthly Income Amount (₹)',
  },
]

/** Goals affordability table from simulation response */
function GoalsAffordabilityTable({ beforeGoals, afterGoals }) {
  if (!afterGoals?.length) return null

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Goal Feasibility After Scenario</CardTitle>
      </CardHeader>
      <div className="divide-y divide-slate-100">
        {/* Header */}
        <div className="grid grid-cols-5 gap-2 px-6 py-2 bg-slate-50 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
          <div className="col-span-2">Goal</div>
          <div className="text-right">Required/mo</div>
          <div className="text-right">Months Left</div>
          <div className="text-right">Affordable?</div>
        </div>

        {afterGoals.map((g, i) => {
          const beforeGoal  = beforeGoals?.[i]
          const monthsDelta = beforeGoal ? (g.months_remaining ?? 0) - (beforeGoal.months_remaining ?? 0) : 0
          const affordable  = g.affordable_from_surplus

          return (
            <div key={g.name} className="grid grid-cols-5 gap-2 px-6 py-3.5 hover:bg-slate-50/70 items-center">
              <div className="col-span-2">
                <p className="font-body text-sm font-bold text-slate-900">{g.name}</p>
              </div>
              <div className="text-right font-mono text-sm tabular text-slate-700 font-bold">
                {inr(g.monthly_contribution_required || 0)}
              </div>
              <div className="text-right">
                <span className="font-mono text-sm tabular text-slate-900 font-bold">
                  {g.months_remaining ?? '?'} mo
                </span>
                {monthsDelta !== 0 && (
                  <Badge
                    variant={monthsDelta > 0 ? 'rose' : 'emerald'}
                    size="sm"
                    className="ml-1.5"
                  >
                    {monthsDelta > 0 ? `+${monthsDelta} delay` : `${monthsDelta} faster`}
                  </Badge>
                )}
              </div>
              <div className="text-right">
                {affordable === true ? (
                  <Badge variant="emerald" size="sm">✓ Yes</Badge>
                ) : affordable === false ? (
                  <Badge variant="rose" size="sm">✕ Tight</Badge>
                ) : (
                  <Badge variant="slate" size="sm">—</Badge>
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
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          What-If Simulator
        </div>
        <h1 className="page-title">Scenario Simulation</h1>
        <p className="page-subtitle">
          Model life changes before committing. The deterministic engine recalculates daily cash flow,
          month-end balance, and <strong>goal feasibility</strong> with the scenario applied.
        </p>
      </header>

      {/* Form Card */}
      <Card hover={false}>
        <CardHeader>
          <CardTitle>Configure What-If Scenario</CardTitle>
        </CardHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <CardContent className="space-y-6">
            {/* Scenario selector */}
            <div>
              <label className="font-mono text-xs uppercase tracking-wider text-slate-700 font-bold mb-3 block">
                Select Scenario Type
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => { setScenario(s.value); setAmount('') }}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      scenario === s.value
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl block mb-2" aria-hidden="true">{s.icon}</span>
                    <p className="font-display text-sm font-bold">{s.label}</p>
                    <p className="text-xs text-slate-500 mt-1">{s.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount input */}
            <Input
              label={selectedScenario?.amountLabel || 'Monthly Amount (₹)'}
              required
              type="number"
              min="1"
              leftIcon="₹"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={selectedScenario?.placeholder || '12000'}
              helperText={amount ? `Annual equivalent: ${inr(Number(amount) * 12)}` : ''}
            />

            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-mono text-xs text-rose-700 font-bold">
                ⚠️ {error}
              </div>
            )}
          </CardContent>

          <CardFooter className="pt-4 border-t border-slate-100">
            <Button type="submit" variant="primary" isLoading={loading} size="lg">
              {loading ? 'Recomputing Cashflow...' : 'Run Scenario Simulation →'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      {/* ── Results ── */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Balance comparison grid */}
          <div className="grid grid-cols-3 gap-4">
            <Card hover={false} className="p-4 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                Baseline Balance
              </p>
              <p className="font-display text-2xl font-extrabold text-slate-700 tabular">
                {inr(beforeBalance)}
              </p>
              {beforeSurplus !== null && (
                <p className="font-mono text-[10px] text-slate-400 mt-1">
                  Surplus: {inr(beforeSurplus)}
                </p>
              )}
            </Card>

            <Card hover={false} className="p-4 text-center">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                After Scenario
              </p>
              <p className="font-display text-2xl font-extrabold text-slate-900 tabular">
                {inr(afterBalance)}
              </p>
              {afterSurplus !== null && (
                <p className="font-mono text-[10px] text-slate-400 mt-1">
                  Surplus: {inr(afterSurplus)}
                </p>
              )}
            </Card>

            <Card
              hover={false}
              className={`p-4 text-center ${
                balanceDelta >= 0 ? 'border-l-4 border-l-emerald-600' : 'border-l-4 border-l-rose-600'
              }`}
            >
              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">
                Net Impact
              </p>
              <p className={`font-display text-2xl font-extrabold tabular ${
                balanceDelta >= 0 ? 'text-emerald-700' : 'text-rose-600'
              }`}>
                {balanceDelta !== null
                  ? `${balanceDelta >= 0 ? '+' : ''}${inr(balanceDelta)}`
                  : '—'}
              </p>
              <p className="font-mono text-[10px] text-slate-500 mt-1">
                {balanceDelta < 0 ? 'Monthly buffer reduction' : 'Monthly buffer gain'}
              </p>
            </Card>
          </div>

          {/* Before vs After Cashflow Chart */}
          <Card hover={false}>
            <CardHeader>
              <CardTitle>Cash Flow Comparison (Before vs After)</CardTitle>
            </CardHeader>
            <CashflowChart data={before?.cashflow} compareData={after?.cashflow} />
          </Card>

          {/* Goals affordability table — uses affordable_from_surplus from backend */}
          <GoalsAffordabilityTable
            beforeGoals={before?.goals}
            afterGoals={after?.goals}
          />

          {/* AI narrative */}
          {result.narrative && (
            <Card hover={false} className="bg-indigo-50/60 border-indigo-200/80">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <p className="font-mono text-xs uppercase tracking-wider text-indigo-700 font-bold">
                  AI Deterministic Summary
                </p>
              </div>
              <p className="font-body text-sm text-slate-800 leading-relaxed font-medium">
                {result.narrative}
              </p>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
