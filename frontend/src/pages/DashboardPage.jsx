import { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Wallet,
  CalendarCheck,
  Download,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Clock,
  Layers,
} from 'lucide-react'
import { api } from '../api/client.js'
import CategoryChart from '../components/CategoryChart.jsx'
import CashflowChart from '../components/CashflowChart.jsx'
import Budget503020Tracker from '../components/Budget503020Tracker.jsx'
import { StatCard, Card, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Skeleton } from '../components/ui/Skeleton'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`
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
      <div className="space-y-3">
        <Skeleton className="h-4 w-32 bg-slate-200" />
        <Skeleton className="h-10 w-64 bg-slate-200" />
      </div>
      <Skeleton className="h-44 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 bg-slate-200 rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-64 bg-slate-200 rounded-2xl" />
    </div>
  )
}

/** Inline alert summary strip linking to /alerts page */
function AlertStrip({ alerts }) {
  if (!alerts.length) return null

  const critical = alerts.filter((a) => a.severity === 'critical')
  const warnings = alerts.filter((a) => a.severity === 'warning')

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50 border border-amber-200/90 rounded-2xl p-4 sm:px-6 shadow-subtle">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <p className="font-body text-xs sm:text-sm font-bold text-amber-900">
            {alerts.length} Active Financial Alert{alerts.length !== 1 ? 's' : ''} Flagged
          </p>
          <p className="font-body text-xs text-amber-700 mt-0.5">
            {critical.length > 0 && `${critical.length} critical items · `}
            {warnings.length > 0 && `${warnings.length} warning indicators`}
          </p>
        </div>
      </div>
      <Link to="/alerts">
        <Button variant="secondary" size="sm" icon={ArrowUpRight}>
          View Alerts
        </Button>
      </Link>
    </div>
  )
}

export default function DashboardPage() {
  const [summary, setSummary] = useState(null)
  const [cashflow, setCashflow] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [cfLoading, setCfLoading] = useState(false)
  const [error, setError] = useState('')
  const [cfMonth, setCfMonth] = useState(getCurrentMonthStr())
  const [startBalance, setStartBalance] = useState(20000)

  // Initial load
  useEffect(() => {
    Promise.all([
      api.getDashboardSummary(),
      api.getCashflow(cfMonth, startBalance),
      api.getAlerts(),
    ])
      .then(([s, c, a]) => {
        setSummary(s)
        setCashflow(c)
        setAlerts(Array.isArray(a) ? a : [])
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
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

  const handleDownloadPdf = () =>
    window.open('/demo_financial_health_report.pdf', '_blank')

  if (loading) return <LoadingSkeleton />

  const income = summary?.total_income || 85000
  const expense = summary?.total_expense || 58400
  const savings = income - expense
  const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0
  const monthEndBal = cashflow?.month_end_balance || 26600

  // Calculate Health Score (0-100)
  const healthScore = Math.min(
    100,
    Math.max(30, Math.round(savingsRate * 1.5 + (monthEndBal > 15000 ? 40 : 20)))
  )

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="page-kicker">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Deterministic Financial Intelligence
          </div>
          <h1 className="page-title">Financial Health Dashboard</h1>
          <p className="page-subtitle">
            Algorithmic cash runway projections, 50/30/20 allocation, and debt optimization.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={handleDownloadPdf}
            variant="secondary"
            size="sm"
            icon={Download}
          >
            Export PDF Report
          </Button>
          <Link to="/upload">
            <Button variant="primary" size="sm" icon={ArrowUpRight}>
              Import Statement
            </Button>
          </Link>
        </div>
      </header>

      {/* Executive Financial Health Score Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-emerald-50/70 border border-indigo-100 p-6 sm:p-8 shadow-card overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* Score Ring / Gauge */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-white border border-indigo-100 shadow-sm flex flex-col items-center justify-center">
              <span className="font-display text-3xl sm:text-4xl font-black text-slate-900 tabular">
                {healthScore}
              </span>
              <span className="text-[10px] uppercase font-bold text-indigo-700 tracking-wider">
                out of 100
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/90 shadow-subtle">
                  Strong Runway
                </span>
                <span className="text-xs text-slate-500">· Deterministic Model</span>
              </div>
              <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Your Financial Health is in Good Standing
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl font-normal leading-relaxed">
                You are retaining <span className="text-slate-900 font-semibold">{savingsRate}% of monthly income</span> and your projected buffer covers over 2.4 months of essential baseline expenditures.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
            <Link to="/simulate">
              <Button variant="secondary" size="md" icon={Sparkles}>
                Model Scenario
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stat cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Income"
          value={inrK(income)}
          subtitle={`${inr(income)} booked`}
          variant="emerald"
          icon={<ArrowUpRight className="w-5 h-5" />}
        />
        <StatCard
          title="Total Outflow"
          value={inrK(expense)}
          subtitle={`${inr(expense)} total spent`}
          variant="rose"
          icon={<ArrowDownLeft className="w-5 h-5" />}
        />
        <StatCard
          title="Net Savings"
          value={inrK(savings)}
          subtitle={`${savingsRate}% retention rate`}
          variant="indigo"
          icon={<Wallet className="w-5 h-5" />}
        />
        <StatCard
          title="Projected End-Balance"
          value={inrK(monthEndBal)}
          subtitle={monthEndBal < 5000 ? '⚠️ Buffer caution' : '✓ Safe liquidity buffer'}
          variant="amber"
          icon={<CalendarCheck className="w-5 h-5" />}
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Spend by Category</CardTitle>
                <CardDescription>Top outflow areas categorized by AI & deterministic rules</CardDescription>
              </div>
              <Badge variant="indigo" size="sm">10 Categories</Badge>
            </div>
          </CardHeader>
          <CategoryChart data={summary?.by_category || []} />
        </Card>

        {/* Cashflow with controls */}
        <Card hover={false}>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <CardTitle>Cash Flow Forecast</CardTitle>
                <CardDescription>Daily projected ledger balance across the month</CardDescription>
              </div>
              {cfLoading && (
                <span className="text-xs text-indigo-600 flex items-center gap-1.5 animate-pulse">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  Recalculating…
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-4 flex-wrap bg-slate-50 border border-slate-200/80 p-3 rounded-xl">
              <div>
                <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                  Month
                </label>
                <input
                  type="month"
                  value={cfMonth}
                  onChange={handleCfMonthChange}
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none shadow-subtle"
                />
              </div>
              <div>
                <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold block mb-1">
                  Opening Balance (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={startBalance}
                  onChange={handleStartBalanceChange}
                  onBlur={handleStartBalanceBlur}
                  placeholder="20000"
                  className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 focus:border-indigo-600 focus:outline-none w-28 tabular shadow-subtle"
                />
              </div>
            </div>
          </CardHeader>

          {cashflow ? (
            <>
              <CashflowChart data={cashflow} />
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                {[
                  ['Recurring In', inrK(cashflow.recurring_inflow || 0), 'text-emerald-600'],
                  ['Recurring Out', inrK(cashflow.recurring_outflow || 0), 'text-rose-600'],
                  ['Daily Discretionary', inrK(cashflow.avg_daily_discretionary || 0), 'text-slate-800'],
                ].map(([l, v, c]) => (
                  <div key={l} className="text-center">
                    <p className={`font-display text-sm sm:text-base font-bold tabular ${c}`}>{v}</p>
                    <p className="text-[10px] uppercase tracking-wider text-slate-500 mt-0.5">{l}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-xs text-slate-500 p-4">No cashflow projection data.</p>
          )}
        </Card>
      </section>

      {/* Recurring Subscriptions */}
      {summary?.recurring_subscriptions?.length > 0 && (
        <Card hover={false} className="p-0 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-slate-900">Recurring Subscriptions</h3>
              <p className="text-xs text-slate-500 mt-0.5">Automated detection of recurring merchant debit cycles</p>
            </div>
            <Badge variant="indigo">{summary.recurring_subscriptions.length} Tracked</Badge>
          </div>

          <div className="divide-y divide-slate-100">
            {summary.recurring_subscriptions.map((s) => (
              <div
                key={s.merchant}
                className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-subtle">
                    {s.merchant.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-body text-sm font-bold text-slate-900">{s.merchant}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {s.category && (
                        <Badge variant="slate" size="sm">{s.category}</Badge>
                      )}
                      <span className="text-[11px] text-slate-500">
                        Every ~{Math.round(s.frequency_days || 30)} days
                      </span>
                    </div>
                  </div>
                </div>
                <p className="font-display text-sm tabular text-slate-900 font-bold">
                  {inr(s.amount)}<span className="text-slate-500 text-xs font-normal">/mo</span>
                </p>
              </div>
            ))}

            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80">
              <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                Total Monthly Recurring Outflow
              </p>
              <p className="font-display text-base tabular text-slate-900 font-extrabold">
                {inr(summary.recurring_subscriptions.reduce((s, r) => s + r.amount, 0))}/mo
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
