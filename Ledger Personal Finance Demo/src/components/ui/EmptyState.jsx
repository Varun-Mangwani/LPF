export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white border border-slate-200/80 rounded-2xl shadow-card">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-3xl mb-4">
        {icon}
      </div>
      <h3 className="font-display text-lg font-bold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="font-body text-sm text-slate-500 max-w-sm leading-relaxed mb-6">{description}</p>
      )}
      {action}
    </div>
  )
}
