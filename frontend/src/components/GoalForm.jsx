import { useState } from 'react'
import { Target, Plus, Calendar, Sparkles } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from './ui/Card'
import { Input } from './ui/Input'
import { Button } from './ui/Button'

const inr = (n) => n ? `₹${Number(n).toLocaleString('en-IN')}` : ''

function monthsUntil(dateStr) {
  if (!dateStr) return null
  const target = new Date(dateStr)
  const now = new Date()
  const months = (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
  return Math.max(1, months)
}

const TEMPLATES = [
  { name: 'Emergency Fund', amount: 150000, months: 12 },
  { name: 'Vacation Trip', amount: 60000, months: 6 },
  { name: 'New Laptop', amount: 90000, months: 5 },
  { name: 'Vehicle Down Payment', amount: 200000, months: 18 },
]

export default function GoalForm({ onCreate, submitting }) {
  const [isOpen,         setIsOpen]         = useState(false)
  const [name,           setName]           = useState('')
  const [targetAmount,   setTargetAmount]   = useState('')
  const [currentAmount,  setCurrentAmount]  = useState('')
  const [targetDate,     setTargetDate]     = useState('')

  const months = monthsUntil(targetDate)
  const remaining = Number(targetAmount) - Number(currentAmount || 0)
  const monthlyRequired = months && remaining > 0 ? Math.ceil(remaining / months) : null

  const applyTemplate = (t) => {
    setName(t.name)
    setTargetAmount(String(t.amount))
    const d = new Date()
    d.setMonth(d.getMonth() + t.months)
    setTargetDate(d.toISOString().split('T')[0])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !targetAmount || !targetDate) return
    onCreate({
      name,
      target_amount:  Number(targetAmount),
      current_amount: Number(currentAmount) || 0,
      target_date:    targetDate,
    })
    setName('')
    setTargetAmount('')
    setCurrentAmount('')
    setTargetDate('')
    setIsOpen(false)
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 30)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <Card hover={false} className="border-slate-200/80 bg-white shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Set a New Savings Goal</CardTitle>
          <CardDescription>Track target completion, required monthly deposits, and feasibility</CardDescription>
        </div>
        <Button
          onClick={() => setIsOpen((v) => !v)}
          variant={isOpen ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={isOpen ? null : <Plus className="w-4 h-4" />}
        >
          {isOpen ? 'Cancel' : 'New Goal'}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6 pt-5 border-t border-slate-100 animate-slide-down">
          {/* Quick preset chips */}
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-2">Quick Presets:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {TEMPLATES.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => applyTemplate(t)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-indigo-400 px-3 py-1.5 rounded-xl transition-all shadow-subtle font-medium"
                >
                  {t.name} (₹{(t.amount / 1000)}k)
                </button>
              ))}
            </div>
          </div>

          <CardContent className="space-y-4 p-0">
            <Input
              label="Goal Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Emergency Fund, New Vehicle, Vacation…"
              id="goal-name-input"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Target Amount (₹)"
                required
                type="number"
                min="1"
                leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="150000"
                id="goal-target-amount"
              />

              <Input
                label="Already Saved (₹)"
                type="number"
                min="0"
                leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
                value={currentAmount}
                onChange={(e) => setCurrentAmount(e.target.value)}
                placeholder="0"
                id="goal-current-amount"
              />
            </div>

            <Input
              label="Target Achievement Date"
              required
              type="date"
              min={minDateStr}
              value={targetDate}
              onChange={(e) => setTargetDate(e.target.value)}
              id="goal-target-date"
            />

            {monthlyRequired && targetAmount && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 flex items-center justify-between shadow-subtle">
                <div>
                  <span className="text-emerald-700 font-extrabold text-sm tabular">
                    ≈ {inr(monthlyRequired)} / month
                  </span>
                  <span className="text-slate-600 text-xs ml-2">
                    deposit needed over {months} months
                  </span>
                </div>
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Feasible
                </span>
              </div>
            )}
          </CardContent>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} size="sm">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="emerald"
              isLoading={submitting}
              id="goal-submit-btn"
              size="sm"
            >
              {submitting ? 'Saving...' : 'Create Goal'}
            </Button>
          </div>
        </form>
      )}
    </Card>
  )
}
