export function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded-xl bg-slate-100 animate-pulse ${className}`}
    />
  )
}
