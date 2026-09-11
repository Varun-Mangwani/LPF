import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'

const ACCENTS = {
  emerald: {
    chip:   'emerald',
    border: 'border-emerald-200 hover:border-emerald-300',
    stamp:  'text-emerald-700 border-emerald-200 bg-emerald-50 shadow-subtle',
    text:   'text-emerald-700',
  },
  amber: {
    chip:   'amber',
    border: 'border-amber-200 hover:border-amber-300',
    stamp:  'text-amber-800 border-amber-200 bg-amber-50 shadow-subtle',
    text:   'text-amber-700',
  },
  rose: {
    chip:   'rose',
    border: 'border-rose-200 hover:border-rose-300',
    stamp:  'text-rose-700 border-rose-200 bg-rose-50 shadow-subtle',
    text:   'text-rose-700',
  },
  indigo: {
    chip:   'indigo',
    border: 'border-indigo-200 hover:border-indigo-300',
    stamp:  'text-indigo-700 border-indigo-200 bg-indigo-50 shadow-subtle',
    text:   'text-indigo-700',
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
    <Card className={`group ${palette.border} bg-white border shadow-card hover:shadow-card-hover rounded-2xl`} hover={true}>
      <div className="flex items-start gap-4">
        {/* Rank badge circle */}
        {rankBadge != null && (
          <div
            className={`shrink-0 w-10 h-10 rounded-2xl border flex items-center justify-center font-display font-extrabold text-sm ${palette.stamp}`}
            aria-hidden="true"
          >
            #{rankBadge}
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* Kicker badge */}
          {kicker && (
            <Badge variant={palette.chip} size="sm" className="mb-2">
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
            className="inline-flex items-center gap-1.5 font-body text-xs text-indigo-600 hover:text-indigo-700 font-semibold mt-3 transition-colors cursor-pointer"
            aria-expanded={open}
          >
            {open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
            <span>{open ? 'Hide Ledger Numbers' : 'Why this recommendation?'}</span>
          </button>

          {/* Expanded numbers panel */}
          {open && (
            <div className="mt-3 pt-3 border-t border-slate-100 text-xs leading-relaxed text-slate-700 animate-slide-down">
              {why && (
                <p className="text-slate-600 mb-3 font-body text-xs sm:text-sm leading-relaxed">
                  {why}
                </p>
              )}
              {numbers.length > 0 && (
                <div className="space-y-1.5 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200/70">
                  {numbers.map((n, i) => (
                    <div className="flex items-center justify-between text-xs py-1 border-b border-slate-200/50 last:border-b-0" key={i}>
                      <span className="text-slate-500 font-body">{n.label}</span>
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
