const VARIANT_CLASSES = {
  indigo:  'bg-indigo-50 text-indigo-700 border-indigo-200/90',
  primary: 'bg-indigo-50 text-indigo-700 border-indigo-200/90',
  violet:  'bg-purple-50 text-purple-700 border-purple-200/90',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200/90',
  rose:    'bg-rose-50 text-rose-700 border-rose-200/90',
  amber:   'bg-amber-50 text-amber-800 border-amber-200/90',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/90',
  slate:   'bg-slate-100 text-slate-700 border-slate-200',
  neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  glass:   'bg-white/80 text-slate-700 border-slate-200 shadow-sm backdrop-blur-md',
  cyan:    'bg-cyan-50 text-cyan-700 border-cyan-200/90',
  default: 'bg-slate-100 text-slate-700 border-slate-200',
}

const DOT_CLASSES = {
  indigo:  'bg-indigo-500',
  primary: 'bg-indigo-500',
  violet:  'bg-purple-500',
  emerald: 'bg-emerald-500',
  rose:    'bg-rose-500',
  amber:   'bg-amber-500',
  warning: 'bg-amber-500',
  slate:   'bg-slate-500',
  neutral: 'bg-slate-500',
  glass:   'bg-indigo-500',
  cyan:    'bg-cyan-500',
  default: 'bg-slate-500',
}

export function Badge({ children, variant = 'default', dot = false, pulse = false, size = 'md', className = '', ...props }) {
  const cls = VARIANT_CLASSES[variant] || VARIANT_CLASSES.default
  const dotCls = DOT_CLASSES[variant] || DOT_CLASSES.default
  const showDot = dot || pulse

  const sizeCls = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5 font-semibold',
    lg: 'text-xs px-3 py-1 gap-2 font-semibold',
  }[size] || 'text-[11px] px-2.5 py-0.5 gap-1.5 font-semibold'

  return (
    <span
      className={`inline-flex items-center font-body tracking-normal rounded-full border shadow-subtle ${cls} ${sizeCls} ${className}`}
      {...props}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotCls} ${pulse ? 'animate-pulse' : ''}`} />}
      {children}
    </span>
  )
}

