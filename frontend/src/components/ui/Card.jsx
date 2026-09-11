/** Modern Elegant Light Card System */

function cn(...classes) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ className, children, hover = true, ...props }) {
  return (
    <div
      className={cn(
        'relative bg-white border border-slate-200/80 rounded-2xl shadow-card p-6 transition-all duration-200',
        hover && 'hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-card-hover',
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
      className={cn('font-display text-lg sm:text-xl font-bold text-slate-900 tracking-[-0.02em]', className)}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn('font-body text-xs sm:text-sm text-slate-500 mt-1.5 leading-relaxed font-normal', className)} {...props}>
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

/** Stat / Metric card with refined light aesthetic */
export function StatCard({ title, value, subtitle, variant = 'default', icon, trend }) {
  const borderVariants = {
    emerald: 'border-emerald-200/80 hover:border-emerald-300',
    rose:    'border-rose-200/80 hover:border-rose-300',
    indigo:  'border-indigo-200/80 hover:border-indigo-300',
    violet:  'border-purple-200/80 hover:border-purple-300',
    cyan:    'border-cyan-200/80 hover:border-cyan-300',
    amber:   'border-amber-200/80 hover:border-amber-300',
    default: 'border-slate-200/80 hover:border-slate-300',
  }

  const iconBg = {
    emerald: 'bg-emerald-50 text-emerald-600 border border-emerald-100/80',
    rose:    'bg-rose-50 text-rose-600 border border-rose-100/80',
    indigo:  'bg-indigo-50 text-indigo-600 border border-indigo-100/80',
    violet:  'bg-purple-50 text-purple-600 border border-purple-100/80',
    cyan:    'bg-cyan-50 text-cyan-600 border border-cyan-100/80',
    amber:   'bg-amber-50 text-amber-600 border border-amber-100/80',
    default: 'bg-slate-50 text-slate-600 border border-slate-100',
  }

  const valueColors = {
    emerald: 'text-emerald-700',
    rose:    'text-rose-700',
    indigo:  'text-indigo-700',
    violet:  'text-purple-700',
    cyan:    'text-cyan-700',
    amber:   'text-amber-700',
    default: 'text-slate-900',
  }

  return (
    <div
      className={cn(
        'relative bg-white border rounded-2xl p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover overflow-hidden group',
        borderVariants[variant] || borderVariants.default
      )}
    >
      <div className="flex items-start justify-between gap-3 relative z-10">
        <div className="min-w-0 flex-1">
          <p className="font-body text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5 truncate">
            {title}
          </p>
          <p className={cn('font-display text-2xl sm:text-3xl font-extrabold tabular leading-tight truncate', valueColors[variant] || valueColors.default)}>
            {value}
          </p>
          {subtitle && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500 font-medium truncate">
              {subtitle}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-transform group-hover:scale-105', iconBg[variant] || iconBg.default)}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

