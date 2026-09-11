import RecommendationCard from './RecommendationCard.jsx'

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
      <div className="grid grid-cols-3 gap-3 px-2 font-mono text-xs uppercase tracking-wider text-slate-500 font-semibold">
        <div>
          <span className="text-slate-900 font-bold tabular">{inr(balance)}</span>
          <span className="block text-[10px] text-slate-400 normal-case">Outstanding</span>
        </div>
        <div>
          <span className="text-slate-900 font-bold tabular">{interest_rate}%</span>
          <span className="block text-[10px] text-slate-400 normal-case">Annual Rate</span>
        </div>
        <div>
          <span className={`font-bold tabular ${isTopPriority ? 'text-rose-600' : 'text-slate-900'}`}>
            {inr(true_annual_cost)}
          </span>
          <span className="block text-[10px] text-slate-400 normal-case">True Cost / Year</span>
        </div>
      </div>

      <RecommendationCard
        rankBadge={priority_rank}
        kicker={isTopPriority ? '🎯 Priority 1 — Pay this first' : `Priority Rank #${priority_rank}`}
        accent={isTopPriority ? 'rose' : 'emerald'}
        headline={name}
        why={reasoning}
        numbers={[
          { label: 'Outstanding Balance', value: inr(balance) },
          { label: 'Annual Interest Rate (APR)', value: `${interest_rate}%` },
          { label: 'True Annual Interest Cost', value: inr(true_annual_cost) },
          { label: 'Min Monthly Payment', value: min_payment ? inr(min_payment) : '—' },
          { label: 'Rank', value: `#${priority_rank}` },
        ]}
      />
    </div>
  )
}
