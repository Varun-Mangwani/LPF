import React from 'react'
import { Card } from './ui/Card'
import { Badge } from './ui/Badge'
import { CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react'

const inr = (n) => `₹${Math.round(n).toLocaleString('en-IN')}`

export default function Budget503020Tracker({ summary }) {
  const totalIncome = summary?.total_income || 85000
  const categories = summary?.by_category || []

  // Calculate actual spends
  let essentialSpend = 0
  let discretionarySpend = 0

  categories.forEach((cat) => {
    if (cat.essential || ['Rent', 'EMI', 'Groceries', 'Utilities', 'Health'].includes(cat.category)) {
      essentialSpend += cat.amount
    } else {
      discretionarySpend += cat.amount
    }
  })

  // 50/30/20 Targets
  const target50 = totalIncome * 0.5
  const target30 = totalIncome * 0.3
  const target20 = totalIncome * 0.2

  const actualSavings = Math.max(0, totalIncome - (essentialSpend + discretionarySpend))

  const pct50 = Math.round((essentialSpend / (target50 || 1)) * 100)
  const pct30 = Math.round((discretionarySpend / (target30 || 1)) * 100)
  const pct20 = Math.round((actualSavings / (target20 || 1)) * 100)

  const items = [
    {
      title: '50% Needs & Essentials',
      desc: 'Housing, Groceries, Utilities, Healthcare',
      spent: essentialSpend,
      target: target50,
      pct: pct50,
      isGood: pct50 <= 100,
      gradient: 'from-emerald-500 to-teal-500',
      badge: pct50 <= 100 ? 'On Target' : `${pct50 - 100}% Exceeded`,
      badgeVariant: pct50 <= 100 ? 'emerald' : 'rose',
    },
    {
      title: '30% Wants & Discretionary',
      desc: 'Dining, Entertainment, Shopping, Travel',
      spent: discretionarySpend,
      target: target30,
      pct: pct30,
      isGood: pct30 <= 100,
      gradient: 'from-amber-500 to-orange-500',
      badge: pct30 <= 100 ? 'Well Balanced' : `${pct30 - 100}% Above Cap`,
      badgeVariant: pct30 <= 100 ? 'amber' : 'rose',
    },
    {
      title: '20% Savings & Runway',
      desc: 'Emergency Fund, Investments, Debt Acceleration',
      spent: actualSavings,
      target: target20,
      pct: pct20,
      isGood: pct20 >= 100,
      gradient: 'from-indigo-500 to-violet-600',
      badge: pct20 >= 100 ? 'Goal Achieved' : `${100 - pct20}% Under Target`,
      badgeVariant: pct20 >= 100 ? 'indigo' : 'amber',
    },
  ]

  return (
    <Card className="animate-slide-up relative overflow-hidden" hover={false}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-5 mb-5 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-bold text-slate-900 tracking-tight">
              50 / 30 / 20 Budget Rule Adherence
            </h3>
            <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200/90 shadow-subtle">
              Gold Standard
            </span>
          </div>
          <p className="font-body text-xs sm:text-sm text-slate-500 mt-1 font-normal">
            Deterministic evaluation of essential needs, discretionary lifestyle, and savings runway.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="indigo" size="sm" dot>Active Analysis</Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.title}
            className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-body text-xs font-bold text-slate-800">
                  {item.title}
                </span>
                <Badge variant={item.badgeVariant} size="sm">
                  {item.badge}
                </Badge>
              </div>

              <div className="flex items-baseline justify-between mb-3">
                <span className="font-display text-xl font-extrabold text-slate-900 tabular">
                  {inr(item.spent)}
                </span>
                <span className="text-xs text-slate-500 tabular font-medium">
                  Cap: {inr(item.target)}
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-200/80 rounded-full overflow-hidden mb-2 relative">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.gradient} transition-all duration-700 shadow-sm`}
                  style={{ width: `${Math.min(100, item.pct)}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 font-body">
              <span className="truncate text-[11px]">{item.desc}</span>
              <span className="tabular font-bold text-slate-700 shrink-0 ml-2">{item.pct}%</span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

