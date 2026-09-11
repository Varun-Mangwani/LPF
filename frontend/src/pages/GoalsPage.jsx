import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import GoalForm           from '../components/GoalForm.jsx'
import RecommendationCard from '../components/RecommendationCard.jsx'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

/** Inline edit form for an existing goal — calls PUT /api/goals/{id} */
function GoalEditForm({ goal, onSave, onCancel }) {
  const [name,    setName]    = useState(goal.name)
  const [target,  setTarget]  = useState(String(goal.target_amount))
  const [current, setCurrent] = useState(String(goal.current_amount || 0))
  const [date,    setDate]    = useState(goal.target_date?.slice(0, 10) || '')
  const [saving,  setSaving]  = useState(false)
  const [error,   setError]   = useState('')

  const handleSave = async (e) => {
    e.preventDefault()
    if (!name || !target || !date) return
    setSaving(true)
    setError('')
    try {
      const updated = await api.updateGoal(goal.id, {
        name,
        target_amount:   Number(target),
        current_amount:  Number(current) || 0,
        target_date:     date,
      })
      onSave(updated)
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = "w-full px-3.5 py-2.5 border border-slate-300 rounded-xl font-mono text-xs bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none"

  return (
    <form onSubmit={handleSave} className="space-y-3 mt-3 p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl">
      <p className="font-mono text-[10px] uppercase tracking-widest text-indigo-700 font-bold">Edit Goal</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Goal name"
        required
        className={inputCls}
      />

      <div className="grid grid-cols-3 gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-slate-500 font-bold">₹</span>
          <input
            type="number"
            min="1"
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Target"
            className={`${inputCls} pl-6`}
          />
        </div>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-[11px] text-slate-500 font-bold">₹</span>
          <input
            type="number"
            min="0"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Saved so far"
            className={`${inputCls} pl-6`}
          />
        </div>
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && <p className="font-mono text-xs text-rose-600">⚠️ {error}</p>}

      <div className="flex items-center gap-2">
        <Button type="submit" variant="primary" size="sm" isLoading={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </Button>
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function GoalCard({ goal, onDelete, onUpdated }) {
  const [editing, setEditing] = useState(false)

  const progress     = goal.current_amount > 0
    ? Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100))
    : 0
  const remaining    = goal.target_amount - goal.current_amount
  const mcr          = goal.monthly_contribution_required || 0
  const months       = goal.months_remaining ?? goal.months_left ?? '?'
  const targetLabel  = new Date(goal.target_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })

  const handleUpdated = (updated) => {
    if (updated) onUpdated(updated)
    setEditing(false)
  }

  return (
    <div className="space-y-2 animate-slide-up">
      {/* Row: progress info + actions */}
      <div className="flex items-center justify-between px-1">
        <span className="font-mono text-xs text-slate-500 font-bold uppercase tracking-wider">
          {progress}% Saved · Target {targetLabel}
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-xs font-mono text-slate-400 hover:text-indigo-600 transition-colors p-1"
            title="Edit goal"
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-xs font-mono text-slate-400 hover:text-rose-600 transition-colors p-1"
            title="Remove goal"
          >
            ✕ Remove
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-emerald-600 transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Edit form (inline) */}
      {editing && (
        <GoalEditForm
          goal={goal}
          onSave={handleUpdated}
          onCancel={() => setEditing(false)}
        />
      )}

      {/* Recommendation card */}
      <RecommendationCard
        kicker={`${progress}% of goal saved`}
        accent="emerald"
        headline={`Save ${inr(mcr)}/month to hit "${goal.name}" by ${targetLabel}`}
        why="Required monthly contribution divides the remaining target gap evenly across the months left before your target date."
        numbers={[
          { label: 'Goal Name',             value: goal.name },
          { label: 'Target Amount',         value: inr(goal.target_amount) },
          { label: 'Saved So Far',          value: inr(goal.current_amount) },
          { label: 'Remaining Balance',     value: inr(remaining) },
          { label: 'Months Remaining',      value: `${months} months` },
          { label: 'Monthly Contribution',  value: `${inr(mcr)}/mo` },
        ]}
      />
    </div>
  )
}

export default function GoalsPage() {
  const [goals,      setGoals]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const load = () =>
    api.getGoals()
      .then((g) => { setGoals(g); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })

  useEffect(() => { load() }, [])

  const handleCreate = async (goal) => {
    setSubmitting(true)
    setError('')
    try {
      await api.createGoal(goal)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteGoal(id)
      setGoals((g) => g.filter((goal) => goal.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  /** Merge an updated goal from PUT response */
  const handleUpdated = (updated) => {
    if (!updated) return
    setGoals((prev) => prev.map((g) => (g.id === updated.id ? { ...g, ...updated } : g)))
  }

  const totalRequired = goals.reduce((s, g) => s + (g.monthly_contribution_required || 0), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <span className="w-2 h-2 rounded-full bg-emerald-600" />
          Target Projections
        </div>
        <h1 className="page-title">Savings Goals</h1>
        <p className="page-subtitle">
          Define financial milestones. LPF back-calculates the exact monthly savings needed.
          <strong className="text-slate-700"> Click ✏️ Edit to update any goal.</strong>
        </p>
      </header>

      {/* Add goal form */}
      <GoalForm onCreate={handleCreate} submitting={submitting} />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-mono text-xs text-rose-700 font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* Goals list */}
      <section className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-32" />)}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon="🎯"
            title="No savings goals defined"
            description="Add your first savings goal above to track exact required monthly contributions."
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Active Goals</h3>
              <Badge variant="emerald">{goals.length} Goals</Badge>
            </div>

            {goals.map((g) => (
              <GoalCard
                key={g.id}
                goal={g}
                onDelete={handleDelete}
                onUpdated={handleUpdated}
              />
            ))}

            {goals.length > 1 && (
              <Card hover={false} className="p-4 bg-emerald-50/70 border-emerald-200 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-wider font-bold text-emerald-800">
                  Total monthly commitment across {goals.length} goals
                </p>
                <p className="font-display text-2xl font-extrabold text-emerald-700 tabular">
                  {inr(totalRequired)}/mo
                </p>
              </Card>
            )}
          </>
        )}
      </section>
    </div>
  )
}
