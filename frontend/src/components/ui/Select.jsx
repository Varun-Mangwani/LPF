export function Select({ label, id, options, children, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="font-mono text-[10px] uppercase tracking-wider text-slate-700 font-bold block">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`w-full border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs bg-white text-slate-700 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none transition-all ${className}`}
        {...props}
      >
        {options
          ? options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))
          : children}
      </select>
    </div>
  )
}
