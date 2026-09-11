/** Light-theme Card system */

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ className, children, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'relative bg-white border border-slate-200/80 rounded-2xl shadow-card transition-all duration-200 p-6',
        hover && 'hover:shadow-card-hover',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('mb-5', className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn('font-display text-lg font-bold text-slate-900 tracking-tight', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('font-body text-sm text-slate-500 mt-1 leading-relaxed', className)} {...props}>
      {children}
    </p>
  )
}

export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div
      className={cn('flex items-center justify-between gap-3 mt-6 pt-5 border-t border-slate-100', className)}
      {...props}
    >
      {children}
    </div>
  )
}

/** Stat / Metric card */
export function StatCard({ title, value, subtitle, variant = 'default', icon }) {
  const borders = {
    emerald: 'border-l-4 border-l-emerald-600',
    rose:    'border-l-4 border-l-rose-600',
    indigo:  'border-l-4 border-l-indigo-600',
    violet:  'border-l-4 border-l-violet-600',
    cyan:    'border-l-4 border-l-cyan-600',
    amber:   'border-l-4 border-l-amber-600',
    default: '',
  }
  const valueColors = {
    emerald: 'text-emerald-700',
    rose:    'text-rose-600',
    indigo:  'text-indigo-700',
    violet:  'text-violet-700',
    cyan:    'text-cyan-700',
    amber:   'text-amber-700',
    default: 'text-slate-900',
  }

  return (
    <div className={cn(
      'relative bg-white border border-slate-200/80 rounded-2xl shadow-card p-5 cursor-default transition-all duration-200 hover:shadow-card-hover',
      borders[variant] || ''
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2">{title}</p>
          <p className={cn('font-display text-2xl font-extrabold tabular leading-none', valueColors[variant] || valueColors.default)}>{value}</p>
          {subtitle && (
            <p className="font-mono text-[11px] text-slate-400 mt-1.5">{subtitle}</p>
          )}
        </div>
        {icon && (
          <span className="text-2xl leading-none opacity-50">{icon}</span>
        )}
      </div>
    </div>
  )
}
