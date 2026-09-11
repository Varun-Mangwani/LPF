import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription } from './ui/Card'
import { Badge } from './ui/Badge'

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

  const pct50 = Math.min(100, Math.round((essentialSpend / target50) * 100))
  const pct30 = Math.min(100, Math.round((discretionarySpend / target30) * 100))
  const pct20 = Math.min(100, Math.round((actualSavings / target20) * 100))

  return (
    <Card className="animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 mb-4 gap-2">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 mb-0.5">
            50/30/20 Budget Target Health
          </h3>
          <p className="font-mono text-xs text-slate-500 uppercase tracking-wider font-semibold">
            Standard Financial Benchmark vs Actual Monthly Allocation
          </p>
        </div>
        <Badge variant="amber" className="w-fit">50 / 30 / 20 Rule</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* 50% Essentials */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-700">
              50% Essentials
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 tabular">
              {inr(essentialSpend)} / {inr(target50)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct50 > 100 ? 'bg-rose-500' : 'bg-emerald-600'}`}
              style={{ width: `${pct50}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-slate-500 flex justify-between">
            <span>Rent, EMI, Groceries</span>
            <span className="font-bold">{pct50}% target</span>
          </div>
        </div>

        {/* 30% Discretionary */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-amber-700">
              30% Wants
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 tabular">
              {inr(discretionarySpend)} / {inr(target30)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct30 > 100 ? 'bg-rose-500' : 'bg-amber-500'}`}
              style={{ width: `${pct30}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-slate-500 flex justify-between">
            <span>Dining, Shopping, Entertainment</span>
            <span className="font-bold">{pct30}% target</span>
          </div>
        </div>

        {/* 20% Savings */}
        <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80">
          <div className="flex justify-between items-baseline mb-2">
            <span className="font-mono text-xs uppercase tracking-wider font-bold text-primary-700">
              20% Savings
            </span>
            <span className="font-mono text-xs font-bold text-slate-900 tabular">
              {inr(actualSavings)} / {inr(target20)}
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${pct20 >= 100 ? 'bg-primary-600' : 'bg-rose-500'}`}
              style={{ width: `${pct20}%` }}
            />
          </div>
          <div className="font-mono text-[11px] text-slate-500 flex justify-between">
            <span>Goals & Debt Surplus</span>
            <span className="font-bold">{pct20}% target</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
