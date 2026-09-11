const VARIANT_CLASSES = {
  indigo:  'bg-indigo-100 text-indigo-700 border border-indigo-200',
  primary: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
  violet:  'bg-violet-100 text-violet-700 border border-violet-200',
  emerald: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
  rose:    'bg-rose-100 text-rose-700 border border-rose-200',
  amber:   'bg-amber-100 text-amber-700 border border-amber-200',
  warning: 'bg-amber-100 text-amber-700 border border-amber-200',
  slate:   'bg-slate-100 text-slate-600 border border-slate-200',
  glass:   'bg-slate-100 text-slate-600 border border-slate-200',
  cyan:    'bg-cyan-100 text-cyan-700 border border-cyan-200',
  default: 'bg-slate-100 text-slate-600 border border-slate-200',
}

export function Badge({ children, variant = 'default', size = 'md', className = '', ...props }) {
  const cls = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default
  return (
    <span
      className={`inline-flex items-center font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${cls} ${className}`}
      {...props}
    >
      {children}
    </span>
  )
}
