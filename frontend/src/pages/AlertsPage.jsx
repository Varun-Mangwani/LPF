import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const SEVERITY_CONFIG = {
  critical: { badge: 'rose',   bar: 'bg-rose-600',   bg: 'bg-rose-50',   border: 'border-rose-200',  icon: '🚨' },
  warning:  { badge: 'amber',  bar: 'bg-amber-500',  bg: 'bg-amber-50',  border: 'border-amber-200', icon: '⚠️' },
  info:     { badge: 'indigo', bar: 'bg-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200',icon: 'ℹ️' },
}

const TYPE_LABELS = {
  overspend:             { label: 'Overspend',            icon: '📈' },
  large_upcoming_debit:  { label: 'Large Upcoming Debit', icon: '💸' },
  unused_subscription:   { label: 'Unused Subscription',  icon: '🔕' },
}

function NumbersPanel({ numbers, type }) {
  if (!numbers || Object.keys(numbers).length === 0) return null

  return (
    <div className="mt-3 bg-white/70 border border-slate-200 rounded-xl p-3 space-y-1.5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">
        Underlying Numbers
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {Object.entries(numbers).map(([key, val]) => {
          const label = key.replace(/_/g, ' ')
          let display = val
          if (typeof val === 'number') {
            if (key.includes('amount') || key.includes('spend') || key.includes('income') || key.includes('threshold')) {
              display = inr(val)
            } else if (key.includes('pct') || key.includes('rate')) {
              display = `${val}%`
            } else if (key.includes('days')) {
              display = `${val} days`
            } else {
              display = val.toLocaleString('en-IN')
            }
          }
          return (
            <div key={key} className="bg-slate-50 rounded-lg p-2">
              <p className="font-mono text-[10px] text-slate-500 capitalize truncate">{label}</p>
              <p className="font-mono text-xs font-bold text-slate-900 mt-0.5 truncate">{String(display)}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AlertCard({ alert, idx }) {
  const [expanded, setExpanded] = useState(false)
  const sev = SEVERITY_CONFIG[alert.severity] || SEVERITY_CONFIG.warning
  const typeInfo = TYPE_LABELS[alert.type] || { label: alert.type?.replace(/_/g, ' '), icon: '⚡' }

  return (
    <div className={`relative rounded-2xl border ${sev.border} ${sev.bg} overflow-hidden animate-slide-up`}
      style={{ animationDelay: `${idx * 60}ms` }}>
      {/* Priority bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${sev.bar}`} />

      <div className="pl-5 pr-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className="text-xl mt-0.5 shrink-0">{sev.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <Badge variant={sev.badge} size="sm">
                  {alert.severity?.toUpperCase()}
                </Badge>
                <Badge variant="slate" size="sm">
                  {typeInfo.icon} {typeInfo.label}
                </Badge>
                {alert.created_at && (
                  <span className="font-mono text-[10px] text-slate-400">
                    {new Date(alert.created_at).toLocaleDateString('en-IN')}
                  </span>
                )}
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900 leading-tight">
                {alert.title || typeInfo.label}
              </h3>
              <p className="font-body text-sm text-slate-700 mt-1 leading-relaxed">
                {alert.message}
              </p>

              {expanded && (
                <NumbersPanel numbers={alert.numbers} type={alert.type} />
              )}
            </div>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-slate-500 hover:text-slate-800 bg-white/80 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            {expanded ? 'Less ▲' : 'Details ▼'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AlertsPage() {
  const [alerts,      setAlerts]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [generating,  setGenerating]  = useState(false)
  const [error,       setError]       = useState('')
  const [lastGenTime, setLastGenTime] = useState(null)

  const loadAlerts = () => {
    setLoading(true)
    api.getAlerts()
      .then((a) => { setAlerts(Array.isArray(a) ? a : []); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }

  useEffect(() => { loadAlerts() }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError('')
    try {
      const freshAlerts = await api.generateAlerts()
      setAlerts(Array.isArray(freshAlerts) ? freshAlerts : [])
      setLastGenTime(new Date())
    } catch (e) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const critical = alerts.filter((a) => a.severity === 'critical')
  const warnings = alerts.filter((a) => a.severity === 'warning')
  const info     = alerts.filter((a) => !['critical', 'warning'].includes(a.severity))

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 page-header">
        <div>
          <div className="page-kicker">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            Smart Anomaly Detection
          </div>
          <h1 className="page-title">Financial Alerts</h1>
          <p className="page-subtitle">
            Deterministic engine scans your ledger for overspend, large debits, and unused subscriptions.
            {lastGenTime && (
              <span className="text-slate-400 text-xs ml-2">
                Last generated: {lastGenTime.toLocaleTimeString('en-IN')}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={handleGenerate}
            variant="primary"
            isLoading={generating}
            leftIcon={generating ? null : '⚡'}
          >
            {generating ? 'Analysing Ledger...' : 'Generate New Alerts'}
          </Button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-mono text-xs text-rose-700 font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* Stats strip */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Critical', count: critical.length, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200', icon: '🚨' },
            { label: 'Warnings', count: warnings.length, color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200', icon: '⚠️' },
            { label: 'Info',     count: info.length,     color: 'text-indigo-600', bg: 'bg-indigo-50 border-indigo-200', icon: 'ℹ️' },
          ].map(({ label, count, color, bg, icon }) => (
            <div key={label} className={`rounded-2xl border p-4 text-center ${bg}`}>
              <p className={`font-display text-3xl font-extrabold tabular ${color}`}>{count}</p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 font-bold mt-1">
                {icon} {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Alert lists */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon="✅"
          title="No alerts yet"
          description="Click 'Generate New Alerts' to have the engine scan your transaction ledger for anomalies, overspend patterns, and unused subscriptions."
          action={
            <Button onClick={handleGenerate} variant="primary" isLoading={generating}>
              Generate Alerts Now
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {[...critical, ...warnings, ...info].map((alert, idx) => (
            <AlertCard key={alert.id} alert={alert} idx={idx} />
          ))}
        </div>
      )}

      {/* How it works */}
      <Card hover={false} className="bg-slate-50/80 border-slate-200">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg shrink-0">
            🔍
          </div>
          <div>
            <h3 className="font-display text-sm font-bold text-slate-900 mb-1">How Alert Generation Works</h3>
            <p className="font-body text-xs text-slate-600 leading-relaxed">
              The deterministic engine analyzes your ledger for three patterns:
              <strong className="text-slate-800"> Overspend</strong> (this month vs 3-month average × 1.3),
              <strong className="text-slate-800"> Large Debits</strong> (transactions exceeding a % of avg monthly income), and
              <strong className="text-slate-800"> Unused Subscriptions</strong> (recurring merchants with no usage signal in 30+ days).
              Numbers are exact — AI only narrates the explanation.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
