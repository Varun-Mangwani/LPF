export function Table({ children, className = '' }) {
  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-card overflow-hidden">
      <table className={`w-full ${className}`}>{children}</table>
    </div>
  )
}
export function TableHeader({ children }) {
  return <thead className="bg-slate-50/80 border-b border-slate-100">{children}</thead>
}
export function TableBody({ children }) {
  return <tbody className="divide-y divide-slate-100">{children}</tbody>
}
export function TableRow({ children, className = '', hover = true, ...props }) {
  return (
    <tr className={`${hover ? 'hover:bg-slate-50/60 transition-colors' : ''} ${className}`} {...props}>
      {children}
    </tr>
  )
}
export function TableHead({ children, className = '', ...props }) {
  return (
    <th className={`font-mono text-[10px] uppercase tracking-widest text-slate-500 font-bold py-3 px-4 text-left ${className}`} {...props}>
      {children}
    </th>
  )
}
export function TableCell({ children, className = '', ...props }) {
  return (
    <td className={`py-3.5 px-4 text-sm ${className}`} {...props}>
      {children}
    </td>
  )
}
