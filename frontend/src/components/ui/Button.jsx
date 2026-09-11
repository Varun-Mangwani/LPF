export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const base = 'inline-flex items-center gap-2 font-mono font-bold uppercase tracking-wider rounded-xl transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none'

  const variants = {
    primary:   'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 shadow-sm',
    emerald:   'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md',
    danger:    'bg-rose-600 hover:bg-rose-700 text-white shadow-sm',
    ghost:     'text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-3 py-2 rounded-xl',
    indigo:    'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md',
  }

  const sizes = {
    sm:  'text-[10px] px-3.5 py-2',
    md:  'text-[11px] px-4 py-2.5',
    lg:  'text-xs px-6 py-3',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${base} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Loading…</span>
        </>
      ) : (
        <>
          {leftIcon  && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
