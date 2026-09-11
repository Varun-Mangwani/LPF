import React from 'react'

function renderIconHelper(icon) {
  if (!icon) return null
  if (React.isValidElement(icon)) return icon
  if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && icon.$$typeof)) {
    const Component = icon
    return <Component className="w-4 h-4 shrink-0" />
  }
  return icon
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon,
  leftIcon,
  rightIcon,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const base =
    'inline-flex items-center justify-center font-body font-semibold transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none select-none cursor-pointer'

  const variants = {
    primary:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25 border border-indigo-600/20 hover:shadow-md',
    secondary:
      'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-200 shadow-sm hover:border-slate-300',
    emerald:
      'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/25 border border-emerald-600/20 hover:shadow-md',
    danger:
      'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80',
    ghost:
      'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80',
    glass:
      'bg-white/80 hover:bg-white text-slate-700 border border-slate-200 shadow-sm backdrop-blur-md',
    indigo:
      'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-500/25 border border-indigo-600/20',
    gold:
      'bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/25 border border-amber-500/20',
  }

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5',
    md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2',
    lg: 'text-sm sm:text-base px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl gap-2.5 font-bold',
  }

  const renderedIcon = renderIconHelper(icon)
  const renderedLeftIcon = renderIconHelper(leftIcon)
  const renderedRightIcon = renderIconHelper(rightIcon)

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
          {renderedIcon}
          {renderedLeftIcon && <span className="shrink-0 flex items-center justify-center">{renderedLeftIcon}</span>}
          {children}
          {renderedRightIcon && <span className="shrink-0 flex items-center justify-center">{renderedRightIcon}</span>}
        </>
      )}
    </button>
  )
}

