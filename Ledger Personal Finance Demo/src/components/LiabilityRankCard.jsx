import RecommendationCard from './RecommendationCard.jsx'
import { Flame, ShieldCheck } from 'lucide-react'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

export default function LiabilityRankCard({ liability }) {
  const {
    name, type, balance, interest_rate, min_payment,
    true_annual_cost, priority_rank, reasoning,
  } = liability

  const isTopPriority = priority_rank === 1

  return (
    <div className="space-y-2 animate-slide-up">
      {/* Meta header summary row */}
      <div className="grid grid-cols-3 gap-3 px-3.5 py-2.5 rounded-2xl bg-slate-50/90 border border-slate-200/80 text-xs shadow-subtle">
        <div>
          <span className="block text-[11px] text-slate-500 font-body">Outstanding</span>
          <span className="text-slate-900 font-bold tabular text-sm">{inr(balance)}</span>
        </div>
        <div>
          <span className="block text-[11px] text-slate-500 font-body">Annual APR</span>
          <span className="text-slate-900 font-bold tabular text-sm">{interest_rate}%</span>
        </div>
        <div>
          <span className="block text-[11px] text-slate-500 font-body">True Cost / Year</span>
          <span className={`font-bold tabular text-sm ${isTopPriority ? 'text-rose-600 font-extrabold' : 'text-slate-900'}`}>
            {inr(true_annual_cost)}
          </span>
        </div>
      </div>

      <RecommendationCard
        rankBadge={priority_rank}
        kicker={isTopPriority ? '🔥 Priority 1 — Pay this first' : `Priority Rank #${priority_rank}`}
        accent={isTopPriority ? 'rose' : 'emerald'}
        headline={name}
        why={reasoning}
        numbers={[
          { label: 'Outstanding Balance', value: inr(balance) },
          { label: 'Annual Interest Rate (APR)', value: `${interest_rate}%` },
          { label: 'True Annual Interest Bleed', value: inr(true_annual_cost) },
          { label: 'Min Monthly Payment', value: min_payment ? inr(min_payment) : '—' },
          { label: 'Avalanche Priority Rank', value: `#${priority_rank}` },
        ]}
      />
    </div>
  )
}
