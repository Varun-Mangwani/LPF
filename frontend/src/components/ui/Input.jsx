export function Input({
  label, helperText, error, leftIcon, rightIcon,
  id, className = '', ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-wider text-slate-700 font-bold block">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-sm text-slate-500 font-bold pointer-events-none">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`w-full border border-slate-300 rounded-xl px-4 py-3 font-mono text-sm text-slate-900 bg-white placeholder:text-slate-400 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all ${leftIcon ? 'pl-8' : ''} ${rightIcon ? 'pr-8' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 font-mono text-xs text-slate-500 pointer-events-none">
            {rightIcon}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="font-mono text-[10px] text-slate-500">{helperText}</p>
      )}
      {error && (
        <p className="font-mono text-[10px] text-rose-600">{error}</p>
      )}
    </div>
  )
}
