export function Table({ children, className = '' }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className={`w-full text-left ${className}`}>{children}</table>
      </div>
    </div>
  )
}
export function TableHeader({ children }) {
  return <thead className="bg-slate-50 border-b border-slate-200/80">{children}</thead>
}
export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>
}
export function TableRow({ children, className = '', hover = true, ...props }) {
  return (
    <tr className={`${hover ? 'hover:bg-slate-50/70 transition-colors duration-150' : ''} ${className}`} {...props}>
      {children}
    </tr>
  )
}
export function TableHead({ children, className = '', ...props }) {
  return (
    <th className={`font-body text-xs uppercase tracking-wider text-slate-500 font-semibold py-3.5 px-4 text-left select-none ${className}`} {...props}>
      {children}
    </th>
  )
}
export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`py-3.5 px-4 text-sm text-slate-700 ${className}`} {...props}>
      {children}
    </td>
  )
}

