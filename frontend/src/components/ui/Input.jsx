export function Input({
  label,
  helperText,
  error,
  leftIcon,
  rightIcon,
  id,
  className = '',
  ...props
}) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="font-body text-xs font-semibold text-slate-700 block">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-subtle ${
            leftIcon ? 'pl-10' : ''
          } ${rightIcon ? 'pr-10' : ''} ${error ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20' : ''} ${className}`}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            {rightIcon}
          </span>
        )}
      </div>
      {helperText && !error && (
        <p className="font-body text-xs text-slate-500">{helperText}</p>
      )}
      {error && (
        <p className="font-body text-xs text-rose-600 font-medium">{error}</p>
      )}
    </div>
  )
}

