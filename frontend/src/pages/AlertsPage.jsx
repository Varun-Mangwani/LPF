import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'
import {
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldAlert,
  Zap,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  TrendingUp,
  Receipt,
  BellRing,
  Clock
} from 'lucide-react'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const SEVERITY_CONFIG = {
  critical: {
    badge: 'rose',
    bar: 'bg-rose-500',
    bg: 'bg-white shadow-card',
    border: 'border-rose-200 hover:border-rose-300',
    icon: AlertOctagon,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 border-rose-200',
  },
  warning: {
    badge: 'amber',
    bar: 'bg-amber-500',
    bg: 'bg-white shadow-card',
    border: 'border-amber-200 hover:border-amber-300',
    icon: AlertTriangle,
    iconColor: 'text-amber-700',
    iconBg: 'bg-amber-50 border-amber-200',
  },
  info: {
    badge: 'indigo',
    bar: 'bg-indigo-500',
    bg: 'bg-white shadow-card',
    border: 'border-indigo-200 hover:border-indigo-300',
    icon: Info,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-200',
  },
}

const TYPE_CONFIG = {
  overspend:            { label: 'Overspend Velocity',     icon: TrendingUp },
  large_upcoming_debit: { label: 'Large Upcoming Debit',   icon: Receipt },
  unused_subscription:  { label: 'Unused Subscription',    icon: Clock },
}

function NumbersPanel({ numbers }) {
  if (!numbers || Object.keys(numbers).length === 0) return null

  return (
    <div className="mt-4 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 shadow-subtle">
      <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold">
        Deterministic Telemetry
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
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
            <div key={key} className="bg-white border border-slate-200/80 rounded-lg p-2.5 shadow-subtle">
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
  const SevIcon = sev.icon
  const typeConfig = TYPE_CONFIG[alert.type] || { label: alert.type?.replace(/_/g, ' '), icon: BellRing }
  const TypeIcon = typeConfig.icon

  return (
    <div
      className={`relative rounded-2xl border ${sev.border} ${sev.bg} overflow-hidden transition-all duration-200 animate-slide-up`}
      style={{ animationDelay: `${idx * 50}ms` }}
    >
      {/* Priority accent bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${sev.bar}`} />

      <div className="pl-6 pr-5 py-4.5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3.5 flex-1 min-w-0">
            <div className={`p-2 rounded-xl border ${sev.iconBg} ${sev.iconColor} shrink-0 mt-0.5 shadow-subtle`}>
              <SevIcon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <Badge variant={sev.badge} size="sm" pulse>
                  {alert.severity?.toUpperCase()}
                </Badge>
                <div className="flex items-center gap-1 text-xs font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/80">
                  <TypeIcon className="w-3 h-3 text-slate-500" />
                  <span>{typeConfig.label}</span>
                </div>
                {alert.created_at && (
                  <span className="font-mono text-[11px] text-slate-400 ml-auto">
                    {new Date(alert.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <h3 className="font-display text-sm font-semibold text-slate-900 leading-tight">
                {alert.title || typeConfig.label}
              </h3>
              <p className="font-sans text-sm text-slate-600 mt-1 leading-relaxed">
                {alert.message}
              </p>

              {expanded && (
                <NumbersPanel numbers={alert.numbers} />
              )}
            </div>
          </div>

          <button
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 font-mono text-[11px] font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-subtle"
          >
            <span>{expanded ? 'Hide Details' : 'View Telemetry'}</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
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
  const [filter,      setFilter]      = useState('all')

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

  const filteredAlerts = filter === 'critical'
    ? critical
    : filter === 'warning'
    ? warnings
    : filter === 'info'
    ? info
    : alerts

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 page-header">
        <div>
          <div className="page-kicker">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            Deterministic Anomaly Detection
          </div>
          <h1 className="page-title">Financial Alerts & Risks</h1>
          <p className="page-subtitle">
            Autonomous scanner continuously monitors your balance velocity, recurring bills, and spending surges against 90-day moving baselines.
            {lastGenTime && (
              <span className="text-slate-500 font-mono text-xs block sm:inline sm:ml-2 mt-1 sm:mt-0">
                • Scanned at {lastGenTime.toLocaleTimeString('en-IN')}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            onClick={handleGenerate}
            variant="primary"
            isLoading={generating}
            icon={Zap}
          >
            {generating ? 'Scanning Ledger...' : 'Run Ledger Audit'}
          </Button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl font-mono text-xs text-rose-700 flex items-center gap-2">
          <AlertOctagon className="w-4 h-4 flex-shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Stats strip */}
      {alerts.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          {[
            { id: 'critical', label: 'Critical', count: critical.length, color: 'text-rose-600', bg: 'border-rose-200 bg-rose-50/60', icon: AlertOctagon },
            { id: 'warning',  label: 'Warnings', count: warnings.length, color: 'text-amber-700', bg: 'border-amber-200 bg-amber-50/60', icon: AlertTriangle },
            { id: 'info',     label: 'Informational', count: info.length, color: 'text-indigo-600', bg: 'border-indigo-200 bg-indigo-50/60', icon: Info },
          ].map(({ id, label, count, color, bg, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setFilter(filter === id ? 'all' : id)}
              className={`rounded-2xl border p-4 text-center transition-all cursor-pointer shadow-subtle ${bg} ${
                filter === id ? 'ring-2 ring-indigo-500/40 shadow-sm' : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1 text-slate-500">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <span className="font-mono text-[11px] uppercase tracking-wider font-semibold">{label}</span>
              </div>
              <p className={`font-mono text-3xl font-extrabold tabular ${color}`}>{count}</p>
            </button>
          ))}
        </div>
      )}

      {/* Alert lists */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 bg-slate-100 rounded-2xl" />)}
        </div>
      ) : alerts.length === 0 ? (
        <EmptyState
          icon="🛡️"
          title="No anomalies detected"
          description="Your finances are operating smoothly within target variance thresholds. Run an audit anytime to scan new transactions."
          action={
            <Button onClick={handleGenerate} variant="primary" isLoading={generating} icon={Zap}>
              Run Ledger Audit Now
            </Button>
          }
        />
      ) : (
        <div className="space-y-3.5">
          {filteredAlerts.map((alert, idx) => (
            <AlertCard key={alert.id || idx} alert={alert} idx={idx} />
          ))}
        </div>
      )}

      {/* How it works */}
      <Card hover={false} className="bg-white border-slate-200/80 shadow-card relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-subtle">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold text-slate-900 mb-1">
              Deterministic Anomaly Engine Mechanics
            </h3>
            <p className="font-sans text-xs text-slate-600 leading-relaxed">
              Every alert is generated through strict mathematical rules:
              <strong className="text-slate-900 font-semibold"> Overspend Velocity</strong> triggers when category burn exceeds 1.3× 90-day baseline;
              <strong className="text-slate-900 font-semibold"> Large Debit</strong> flags transactions exceeding 15% of monthly recurring income; and
              <strong className="text-slate-900 font-semibold"> Inactive Subscriptions</strong> detects regular debits with zero user utility in 30+ days.
              No hallucinations — pure deterministic financial telemetry.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}

