export function Select({ label, id, options, children, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="font-body text-xs font-semibold text-slate-700 block">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all shadow-subtle ${className}`}
        {...props}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value} className="bg-white text-slate-900">
                {o.label}
              </option>
            ))
          : children}
      </select>
    </div>
  )
}

