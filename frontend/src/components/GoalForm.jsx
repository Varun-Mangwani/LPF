import { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/Card'
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

export default function GoalForm({ onCreate, submitting }) {
  const [name,          setName]          = useState('')
  const [targetAmount,  setTargetAmount]  = useState('')
  const [currentAmount, setCurrentAmount] = useState('')
  const [targetDate,    setTargetDate]    = useState('')

  const months = monthsUntil(targetDate)
  const remaining = Number(targetAmount) - Number(currentAmount || 0)
  const monthlyRequired = months && remaining > 0 ? Math.ceil(remaining / months) : null

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
  }

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 32)
  const minDateStr = minDate.toISOString().split('T')[0]

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Set a New Savings Goal</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-4">
          <Input
            label="Goal Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Emergency Fund, Vacation, New Laptop…"
            id="goal-name-input"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Target Amount (₹)"
              required
              type="number"
              min="1"
              leftIcon="₹"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="150000"
              id="goal-target-amount"
            />

            <Input
              label="Already Saved (₹)"
              type="number"
              min="0"
              leftIcon="₹"
              value={currentAmount}
              onChange={(e) => setCurrentAmount(e.target.value)}
              placeholder="0"
              id="goal-current-amount"
            />
          </div>

          <Input
            label="Target Date"
            required
            type="date"
            min={minDateStr}
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
            id="goal-target-date"
          />

          {monthlyRequired && targetAmount && (
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl px-4 py-3 font-mono text-sm">
              <span className="text-emerald-700 font-bold">
                ≈ {inr(monthlyRequired)} / month
              </span>
              <span className="text-slate-600 text-xs ml-2">
                required over {months} months to reach target
              </span>
            </div>
          )}
        </CardContent>

        <CardFooter className="mt-4 pt-4 border-t border-slate-100">
          <Button
            type="submit"
            variant="primary"
            isLoading={submitting}
            id="goal-submit-btn"
          >
            {submitting ? 'Saving...' : 'Add Goal →'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
