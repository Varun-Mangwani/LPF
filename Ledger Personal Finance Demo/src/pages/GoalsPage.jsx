import { useEffect, useState } from 'react'
import {
  Target,
  Plus,
  Edit3,
  Trash2,
  Calendar,
  Sparkles,
  TrendingUp,
  CheckCircle2,
} from 'lucide-react'
import { api } from '../api/client.js'
import GoalForm           from '../components/GoalForm.jsx'
import RecommendationCard from '../components/RecommendationCard.jsx'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

/** Inline edit form for an existing goal */
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

  const inputCls = "w-full px-3.5 py-2 rounded-xl text-xs bg-white border border-slate-200 text-slate-900 focus:border-indigo-500 focus:outline-none shadow-subtle"

  return (
    <form onSubmit={handleSave} className="space-y-3 mt-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl animate-slide-down shadow-subtle">
      <p className="text-xs font-semibold text-indigo-700">Edit Goal Parameters</p>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Goal name"
        required
        className={inputCls}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <input
          type="number"
          min="1"
          required
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="Target Amount (₹)"
          className={inputCls}
        />
        <input
          type="number"
          min="0"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          placeholder="Saved so far (₹)"
          className={inputCls}
        />
        <input
          type="date"
          required
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className={inputCls}
        />
      </div>

      {error && <p className="text-xs text-rose-600 font-semibold">⚠️ {error}</p>}

      <div className="flex items-center gap-2 justify-end pt-1">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="emerald" size="sm" isLoading={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
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
  const remaining    = Math.max(0, goal.target_amount - goal.current_amount)
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
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-800">
            {progress}% Completed
          </span>
          <span className="text-slate-500 text-xs">· Target: {targetLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditing((v) => !v)}
            className="text-xs text-slate-400 hover:text-indigo-600 transition-colors p-1 flex items-center gap-1 font-medium"
            title="Edit goal"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="text-xs text-slate-400 hover:text-rose-600 transition-colors p-1 flex items-center gap-1 font-medium"
            title="Remove goal"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove</span>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-slate-100 border border-slate-200/60 rounded-full overflow-hidden mb-2">
        <div
          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-700 shadow-sm"
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
        kicker={`${progress}% of target saved`}
        accent="emerald"
        headline={`Contribute ${inr(mcr)}/month to hit "${goal.name}" by ${targetLabel}`}
        why="Your required monthly deposit is mathematically calculated by dividing remaining target balance across months to deadline."
        numbers={[
          { label: 'Goal Target',           value: inr(goal.target_amount) },
          { label: 'Saved Balance',         value: inr(goal.current_amount) },
          { label: 'Remaining Gap',         value: inr(remaining) },
          { label: 'Months to Target',      value: `${months} months` },
          { label: 'Required Deposit',      value: `${inr(mcr)}/month` },
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
      .then((g) => { setGoals(Array.isArray(g) ? g : []); setLoading(false) })
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
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Target Projections
        </div>
        <h1 className="page-title">Savings Goals</h1>
        <p className="page-subtitle">
          Define financial milestones. LPF deterministically back-calculates your exact monthly required allocation.
        </p>
      </header>

      {/* Add goal form */}
      <GoalForm onCreate={handleCreate} submitting={submitting} />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold">
          ⚠️ {error}
        </div>
      )}

      {/* Goals list */}
      <section className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : goals.length === 0 ? (
          <EmptyState
            icon={<Target className="w-8 h-8 text-slate-400" />}
            title="No savings goals defined"
            description="Add your first savings goal above to track exact required monthly contributions."
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Active Goals</h3>
              <Badge variant="emerald" dot>{goals.length} Goals Active</Badge>
            </div>

            <div className="space-y-6">
              {goals.map((g) => (
                <GoalCard
                  key={g.id}
                  goal={g}
                  onDelete={handleDelete}
                  onUpdated={handleUpdated}
                />
              ))}
            </div>

            {goals.length > 1 && (
              <Card hover={false} className="p-5 bg-gradient-to-r from-emerald-50/80 to-teal-50/50 border border-emerald-100 flex items-center justify-between shadow-card">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">
                    Total monthly commitment across {goals.length} goals
                  </p>
                  <p className="text-xs text-emerald-700 font-medium mt-0.5">Required to achieve all milestones on schedule</p>
                </div>
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
