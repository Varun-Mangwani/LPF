import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'
import CategoryChart    from '../components/CategoryChart.jsx'
import CashflowChart    from '../components/CashflowChart.jsx'
import Budget503020Tracker from '../components/Budget503020Tracker.jsx'
import { StatCard, Card, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'

const inr  = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const inrK = (n) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`
  if (n >= 1000)   return `₹${Math.round(n / 1000)}k`
  return `₹${Math.round(n)}`
}

function getCurrentMonthStr() {
  return new Date().toISOString().slice(0, 7) // "YYYY-MM"
}

function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-8 space-y-8 animate-pulse">
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-64" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
      <Skeleton className="h-48" />
      <div className="grid lg:grid-cols-2 gap-6">
        <Skeleton className="h-72" />
        <Skeleton className="h-72" />
      </div>
    </div>
  )
}

/** Inline alert summary strip linking to /alerts page */
function AlertStrip({ alerts }) {
  if (!alerts.length) return null

  const critical = alerts.filter((a) => a.severity === 'critical')
  const warnings = alerts.filter((a) => a.severity === 'warning')

  return (
    <div className="flex items-center justify-between gap-4 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5">
      <div className="flex items-center gap-3">
        <span className="text-xl">⚠️</span>
        <div>
          <p className="font-mono text-xs font-bold text-amber-900">
            {alerts.length} active alert{alerts.length !== 1 ? 's' : ''} detected
          </p>
          <p className="font-mono text-[11px] text-amber-700 mt-0.5">
            {critical.length > 0 && `${critical.length} critical · `}
            {warnings.length > 0 && `${warnings.length} warning`}
          </p>
        </div>
      </div>
      <Link to="/alerts">
        <Button variant="secondary" size="sm">View Alerts →</Button>
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  const [summary,       setSummary]       = useState(null)
  const [cashflow,      setCashflow]      = useState(null)
  const [alerts,        setAlerts]        = useState([])
  const [loading,       setLoading]       = useState(true)
  const [cfLoading,     setCfLoading]     = useState(false)
  const [error,         setError]         = useState('')
  const [cfMonth,       setCfMonth]       = useState(getCurrentMonthStr())
  const [startBalance,  setStartBalance]  = useState(20000)

  // Initial load
  useEffect(() => {
    Promise.all([api.getDashboardSummary(), api.getCashflow(cfMonth, startBalance), api.getAlerts()])
      .then(([s, c, a]) => {
        setSummary(s)
        setCashflow(c)
        setAlerts(Array.isArray(a) ? a : [])
        setLoading(false)
      })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-fetch cashflow when month/balance changes
  const refetchCashflow = useCallback(async (month, balance) => {
    setCfLoading(true)
    try {
      const c = await api.getCashflow(month, balance)
      setCashflow(c)
    } catch (e) {
      console.error(e)
    } finally {
      setCfLoading(false)
    }
  }, [])

  const handleCfMonthChange = (e) => {
    const m = e.target.value
    setCfMonth(m)
    refetchCashflow(m, startBalance)
  }

  const handleStartBalanceChange = (e) => {
    const b = Number(e.target.value) || 0
    setStartBalance(b)
  }

  const handleStartBalanceBlur = () => {
    refetchCashflow(cfMonth, startBalance)
  }

  const handleDownloadPdf = () => window.open('/demo_financial_health_report.pdf', '_blank')

  if (loading) return <LoadingSkeleton />
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl">
          <p className="font-mono text-sm text-rose-700 font-bold">⚠️ {error}</p>
          <p className="font-mono text-xs text-slate-500 mt-2">
            Make sure the FastAPI backend is running on port 8000.
          </p>
        </div>
      </div>
    )
  }

  const savings     = (summary?.total_income || 0) - (summary?.total_expense || 0)
  const savingsRate = summary?.total_income > 0
    ? Math.round((savings / summary.total_income) * 100)
    : 0
  const monthEndBal = cashflow?.month_end_balance || 0

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="page-kicker">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            Overview & Analytics
          </div>
          <h1 className="page-title">Financial Health Dashboard</h1>
          <p className="page-subtitle">
            Real-time, deterministic ledger analytics with explainable AI insights.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleDownloadPdf} variant="secondary" size="sm" leftIcon="📥">
            Export PDF Report
          </Button>
        </div>
      </header>

      {/* Stat cards */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Income"
          value={inrK(summary?.total_income || 0)}
          subtitle={inr(summary?.total_income || 0)}
          variant="emerald"
          icon="↑"
        />
        <StatCard
          title="Total Outflow"
          value={inrK(summary?.total_expense || 0)}
          subtitle={inr(summary?.total_expense || 0)}
          variant="rose"
          icon="↓"
        />
        <StatCard
          title="Net Savings"
          value={inrK(savings)}
          subtitle={`${savingsRate}% savings rate`}
          variant="indigo"
          icon="◈"
        />
        <StatCard
          title="Proj. Month-End"
          value={inrK(monthEndBal)}
          subtitle={monthEndBal < 5000 ? '⚠️ Buffer notice' : '✓ Healthy runway'}
          variant="amber"
          icon="⟳"
        />
      </section>

      {/* 50/30/20 Budget */}
      <Budget503020Tracker summary={summary} />

      {/* Alerts strip */}
      {alerts.length > 0 && <AlertStrip alerts={alerts} />}

      {/* Charts */}
      <section className="grid lg:grid-cols-2 gap-6">
        {/* Category breakdown */}
        <Card hover={false}>
          <CardHeader>
            <CardTitle>Spend by Category</CardTitle>
          </CardHeader>
          <CategoryChart data={summary?.by_category || []} />
        </Card>

        {/* Cashflow with controls */}
        <Card hover={false}>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle>Cash Flow Projection</CardTitle>
              {cfLoading && (
                <span className="font-mono text-[10px] text-indigo-600 animate-pulse">Recalculating…</span>
              )}
            </div>
            {/* Month + Start Balance pickers */}
            <div className="flex gap-3 mt-3 flex-wrap">
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={cfMonth}
                  onChange={handleCfMonthChange}
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none"
                />
              </div>
              <div>
                <label className="font-mono text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">
                  Opening Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={startBalance}
                  onChange={handleStartBalanceChange}
                  onBlur={handleStartBalanceBlur}
                  placeholder="20000"
                  className="border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-xs bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400/30 focus:outline-none w-28"
                />
              </div>
            </div>
          </CardHeader>

          {cashflow ? (
            <>
              <CashflowChart data={cashflow} />
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                {[
                  ['Recurring In',        inrK(cashflow.recurring_inflow || 0),          'text-emerald-700'],
                  ['Recurring Out',       inrK(cashflow.recurring_outflow || 0),         'text-rose-600'],
                  ['Daily Discretionary', inrK(cashflow.avg_daily_discretionary || 0),  'text-slate-700'],
                ].map(([l, v, c]) => (
                  <div key={l} className="text-center">
                    <p className={`font-mono text-sm font-bold tabular ${c}`}>{v}</p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="font-mono text-xs text-slate-400 p-4">No cashflow projection data.</p>
          )}
        </Card>
      </section>

      {/* Recurring Subscriptions */}
      {summary?.recurring_subscriptions?.length > 0 && (
        <Card hover={false} className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-slate-900">Recurring Subscriptions</h3>
            <Badge variant="indigo">{summary.recurring_subscriptions.length} Tracked</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {summary.recurring_subscriptions.map((s) => (
              <div
                key={s.merchant}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/70 transition-colors"
              >
                <div>
                  <p className="font-body text-sm font-bold text-slate-900">{s.merchant}</p>
                  <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                    {s.category && (
                      <Badge variant="slate" size="sm" className="mr-1.5">{s.category}</Badge>
                    )}
                    Every ~{Math.round(s.frequency_days || 30)} days
                  </p>
                </div>
                <p className="font-mono text-sm tabular text-slate-900 font-bold">
                  {inr(s.amount)}<span className="text-slate-400 text-xs font-normal">/mo</span>
                </p>
              </div>
            ))}

            <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/80">
              <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold">
                Total Monthly Recurring Outflow
              </p>
              <p className="font-mono text-sm tabular text-slate-900 font-extrabold">
                {inr(summary.recurring_subscriptions.reduce((s, r) => s + r.amount, 0))}/mo
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
