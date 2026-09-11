import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = {
  essential:     '#059669', // Emerald
  discretionary: '#D97706', // Amber
}

const inrK = (v) => {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000)   return `₹${Math.round(v / 1000)}k`
  return `₹${Math.round(v)}`
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg font-mono text-xs z-20">
      <p className="text-slate-900 font-bold mb-1">{label}</p>
      <p className="font-semibold" style={{ color: d.essential ? COLORS.essential : COLORS.discretionary }}>
        {d.essential ? '● Essential' : '◉ Discretionary'}
      </p>
      <p className="text-slate-900 font-bold tabular mt-0.5">₹{Number(d.amount).toLocaleString('en-IN')}</p>
    </div>
  )
}

export default function CategoryChart({ data = [] }) {
  const sorted = [...data].sort((a, b) => b.amount - a.amount).slice(0, 10)

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 text-slate-400 font-mono text-xs">
        No spending breakdown data available.
      </div>
    )
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={sorted} margin={{ top: 8, right: 8, left: 0, bottom: 8 }}>
          <XAxis
            dataKey="category"
            tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'JetBrains Mono' }}
            angle={-30}
            textAnchor="end"
            interval={0}
            height={64}
            axisLine={{ stroke: '#E2E8F0' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'JetBrains Mono' }}
            axisLine={false}
            tickLine={false}
            width={48}
            tickFormatter={inrK}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(15, 23, 42, 0.03)' }} />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={36}>
            {sorted.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.essential === true ? COLORS.essential : COLORS.discretionary}
                opacity={entry.essential === null ? 0.7 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 font-mono text-[11px] text-slate-500 justify-center">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
          Essential Expense
        </span>
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-3 h-3 rounded bg-amber-600 inline-block" />
          Discretionary Spend
        </span>
      </div>
    </div>
  )
}
