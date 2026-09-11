import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const inrK = (v) => {
  if (Math.abs(v) >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (Math.abs(v) >= 1000)   return `₹${Math.round(v / 1000)}k`
  return `₹${Math.round(v)}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-xl text-xs space-y-1.5 z-30 font-body">
      <p className="text-slate-500 font-semibold text-[11px] pb-1 border-b border-slate-100">
        Timeline: {label}
      </p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-slate-600 font-medium">{p.name}:</span>
          </div>
          <span className="tabular font-bold text-slate-900 text-sm">{inr(p.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function CashflowChart({ data = null, compareData = null }) {
  const toPoints = (d) => {
    if (!d) return []
    if (Array.isArray(d)) {
      return d.map((pt) => ({ date: pt.date, balance: pt.balance ?? pt.projected_balance ?? 0 }))
    }
    if (d.days && Array.isArray(d.days)) {
      return d.days.map((pt) => ({ date: pt.date?.slice(5) || pt.date, balance: pt.balance }))
    }
    return []
  }

  const beforePoints = toPoints(data)
  const afterPoints  = compareData ? toPoints(compareData) : []

  const merged = compareData
    ? beforePoints.map((pt, i) => ({
        date: pt.date,
        before: pt.balance,
        after: afterPoints[i]?.balance ?? null,
      }))
    : beforePoints.map((pt) => ({ date: pt.date, balance: pt.balance }))

  const tickDates = merged.filter((_, i) => i % 5 === 0 || i === merged.length - 1).map(d => d.date)

  if (merged.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-slate-400 font-body text-xs">
        No projected cashflow data available.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={merged} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#059669" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
          </linearGradient>
          <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.0} />
          </linearGradient>
        </defs>

        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'JetBrains Mono' }}
          axisLine={{ stroke: '#E2E8F0' }}
          tickLine={false}
          ticks={tickDates}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'JetBrains Mono' }}
          axisLine={false}
          tickLine={false}
          width={54}
          tickFormatter={inrK}
        />
        <Tooltip content={<CustomTooltip />} />
        <ReferenceLine y={0} stroke="#E11D48" strokeDasharray="3 3" strokeWidth={1} />
        <Legend wrapperStyle={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#475569', paddingTop: 8 }} />

        {compareData ? (
          <>
            <Area type="monotone" dataKey="before" name="Before Scenario" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 3" fill="transparent" dot={false} />
            <Area type="monotone" dataKey="after"  name="Simulated Scenario" stroke="#4F46E5" strokeWidth={2.5} fill="url(#indigoGradient)" dot={{ r: 3, fill: '#4F46E5' }} />
          </>
        ) : (
          <Area
            type="monotone"
            dataKey="balance"
            name="Projected Balance"
            stroke="#059669"
            strokeWidth={2.5}
            fill="url(#emeraldGradient)"
            dot={{ r: 2.5, fill: '#059669' }}
            activeDot={{ r: 6, fill: '#059669', stroke: '#FFFFFF', strokeWidth: 2 }}
          />
        )}
      </AreaChart>
    </ResponsiveContainer>
  )
}

