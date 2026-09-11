import { useState } from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

const ACCENTS = {
  emerald: {
    chip:  'emerald',
    border: 'border-l-4 border-l-emerald-600',
    stamp: 'text-emerald-700 border-emerald-300 bg-emerald-50',
  },
  amber: {
    chip:  'amber',
    border: 'border-l-4 border-l-amber-600',
    stamp: 'text-amber-800 border-amber-300 bg-amber-50',
  },
  rose: {
    chip:  'rose',
    border: 'border-l-4 border-l-rose-600',
    stamp: 'text-rose-700 border-rose-300 bg-rose-50',
  },
  indigo: {
    chip:  'indigo',
    border: 'border-l-4 border-l-primary-600',
    stamp: 'text-primary-700 border-primary-300 bg-primary-50',
  },
}

export default function RecommendationCard({
  kicker,
  headline,
  why,
  numbers = [],
  accent = 'indigo',
  rankBadge,
}) {
  const [open, setOpen] = useState(false)
  const palette = ACCENTS[accent] || ACCENTS.indigo

  return (
    <Card className={`group ${palette.border}`} hover={true}>
      <div className="flex items-start gap-3">
        {/* Rank badge circle */}
        {rankBadge != null && (
          <div
            className={`shrink-0 w-9 h-9 rounded-xl border flex items-center justify-center font-display font-bold text-sm ${palette.stamp}`}
            aria-hidden="true"
          >
            {rankBadge}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Kicker badge */}
          {kicker && (
            <Badge variant={palette.chip} className="mb-2">
              {kicker}
            </Badge>
          )}

          {/* Headline */}
          <p className="font-display text-base sm:text-lg font-bold leading-snug text-slate-900">
            {headline}
          </p>

          {/* Why toggle */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-primary-600 hover:text-primary-700 font-bold mt-3 transition-all"
            aria-expanded={open}
          >
            <span
              className={`inline-block transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
              aria-hidden="true"
            >
              ›
            </span>
            {open ? 'Hide Ledger Numbers' : 'Why this recommendation?'}
          </button>

          {/* Expanded numbers panel */}
          {open && (
            <div className="mt-3 pt-3 border-t border-dashed border-slate-200 font-mono text-xs leading-relaxed text-slate-900 animate-slide-down">
              {why && (
                <p className="text-slate-600 mb-3 font-body text-xs sm:text-sm leading-relaxed">
                  {why}
                </p>
              )}
              {numbers.length > 0 && (
                <div className="space-y-1.5 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
                  {numbers.map((n, i) => (
                    <div className="flex items-center justify-between text-xs py-0.5 border-b border-dotted border-slate-200 last:border-b-0" key={i}>
                      <span className="text-slate-500 font-mono">{n.label}</span>
                      <span className="font-bold tabular text-slate-900">{n.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
