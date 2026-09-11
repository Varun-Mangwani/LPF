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
    <div className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 shadow-xl text-xs space-y-1 z-30 font-body">
      <p className="text-slate-900 font-bold text-sm mb-1">{label}</p>
      <div className="flex items-center gap-1.5 font-medium" style={{ color: d.essential ? COLORS.essential : COLORS.discretionary }}>
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.essential ? COLORS.essential : COLORS.discretionary }} />
        <span>{d.essential ? 'Essential Need' : 'Discretionary Want'}</span>
      </div>
      <p className="text-slate-900 font-extrabold tabular text-sm mt-1">₹{Number(d.amount).toLocaleString('en-IN')}</p>
    </div>
  )
}

export default function CategoryChart({ data = [] }) {
  const sorted = [...data].sort((a, b) => b.amount - a.amount).slice(0, 10)

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-56 text-slate-400 font-body text-xs">
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
            tick={{ fontSize: 10, fill: '#64748B', fontFamily: 'Plus Jakarta Sans' }}
            angle={-30}
            textAnchor="end"
            interval={0}
            height={60}
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
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.03)' }} />
          <Bar dataKey="amount" radius={[6, 6, 2, 2]} maxBarSize={38}>
            {sorted.map((entry, i) => (
              <Cell
                key={i}
                fill={entry.essential === true ? COLORS.essential : COLORS.discretionary}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-6 mt-3 text-xs text-slate-500 justify-center font-body">
        <span className="flex items-center gap-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          Essential Needs
        </span>
        <span className="flex items-center gap-2 font-medium">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
          Discretionary Wants
        </span>
      </div>
    </div>
  )
}

