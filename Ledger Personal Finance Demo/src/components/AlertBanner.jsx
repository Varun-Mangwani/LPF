import RecommendationCard from './RecommendationCard.jsx'
import { Badge } from './ui/Badge'

const SEVERITY_ACCENT = {
  high: 'rose',
  warning: 'amber',
  medium: 'amber',
  info: 'indigo',
  low: 'indigo',
}

const SEVERITY_LABEL = {
  high: 'Action Required',
  warning: 'Heads Up',
  medium: 'Heads Up',
  info: 'Information',
  low: 'Information',
}

const TYPE_ICON = {
  overspend: '🚨',
  large_upcoming_debit: '⚡',
  unused_subscription: '⏳',
}

export default function AlertBanner({ alerts = [] }) {
  if (!alerts.length) return null

  return (
    <section aria-label="Alerts" className="space-y-3 animate-slide-up">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
          Active Financial Alerts
        </h2>
        <Badge variant="rose" dot={true}>
          {alerts.length} Alert{alerts.length > 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {alerts.map((a) => {
          const numbers = Array.isArray(a.numbers)
            ? a.numbers
            : Object.entries(a.numbers || {}).map(([label, value]) => ({ label, value }))

          return (
            <RecommendationCard
              key={a.id}
              kicker={SEVERITY_LABEL[a.severity] || 'Alert'}
              accent={SEVERITY_ACCENT[a.severity] || 'indigo'}
              headline={`${TYPE_ICON[a.type] || '⚠️'} ${a.title}`}
              why={a.message}
              numbers={numbers}
            />
          )
        })}
      </div>
    </section>
  )
}
