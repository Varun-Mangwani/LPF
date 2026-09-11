import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`
const inrK = (v) => {
  if (Math.abs(v) >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (Math.abs(v) >= 1000)   return `₹${Math.round(v / 1000)}k`
  return `₹${Math.round(v)}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg font-mono text-xs space-y-1 z-20">
      <p className="text-slate-500 font-bold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold flex items-center justify-between gap-3">
          <span>{p.name}:</span>
          <span className="tabular font-bold">{inr(p.value)}</span>
        </p>
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
      <div className="flex items-center justify-center h-52 text-slate-400 font-mono text-xs">
        No data available yet — upload a bank statement first.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={merged} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
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
        <Legend wrapperStyle={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: '#64748B', paddingTop: 8 }} />
        {compareData ? (
          <>
            <Line type="monotone" dataKey="before" name="Before Scenario" stroke="#94A3B8" strokeWidth={2} strokeDasharray="4 3" dot={false} />
            <Line type="monotone" dataKey="after"  name="Simulated Scenario"  stroke="#4F46E5" strokeWidth={2.5} dot={{ r: 3, fill: '#4F46E5' }} />
          </>
        ) : (
          <Line type="monotone" dataKey="balance" name="Projected Cash Balance" stroke="#059669" strokeWidth={2.5} dot={{ r: 2.5, fill: '#059669' }} activeDot={{ r: 5 }} />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
