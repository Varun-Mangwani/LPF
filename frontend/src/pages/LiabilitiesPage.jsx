import { useEffect, useState } from 'react'
import { api } from '../api/client.js'
import LiabilityRankCard from '../components/LiabilityRankCard.jsx'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const TYPES = [
  { value: 'card', label: 'Credit Card' },
  { value: 'loan', label: 'Personal Loan / EMI' },
]

function AddLiabilityForm({ onCreate, submitting }) {
  const [name,     setName]     = useState('')
  const [type,     setType]     = useState('card')
  const [balance,  setBalance]  = useState('')
  const [rate,     setRate]     = useState('')
  const [minPay,   setMinPay]   = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !balance || !rate) return
    onCreate({
      name,
      type,
      balance: Number(balance),
      interest_rate: Number(rate),
      min_payment: Number(minPay) || 0,
    })
    setName('')
    setBalance('')
    setRate('')
    setMinPay('')
  }

  return (
    <Card hover={false}>
      <CardHeader>
        <CardTitle>Add Debt / Credit Card Liability</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit} className="space-y-4">
        <CardContent className="space-y-4">
          <Input
            label="Liability Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. HDFC Credit Card, Car Loan"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={TYPES}
            />

            <Input
              label="Outstanding Balance (₹)"
              required
              type="number"
              min="1"
              leftIcon="₹"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              placeholder="50000"
            />

            <Input
              label="Annual Interest Rate (%)"
              required
              type="number"
              min="0"
              step="0.1"
              rightIcon="%"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="36"
            />

            <Input
              label="Min. Monthly Payment (₹)"
              type="number"
              min="0"
              leftIcon="₹"
              value={minPay}
              onChange={(e) => setMinPay(e.target.value)}
              placeholder="2500"
            />
          </div>

          {balance && rate && (
            <div className="bg-rose-50 border border-rose-200/80 rounded-xl p-3 font-mono text-xs text-slate-700">
              True Annual Cost Preview:{' '}
              <span className="text-rose-600 font-bold">
                {inr(Number(balance) * (Number(rate) / 100))}/yr
              </span>
              {' '}at {rate}% APR on {inr(balance)}
            </div>
          )}
        </CardContent>

        <CardFooter className="mt-4 pt-4 border-t border-slate-100">
          <Button type="submit" variant="danger" isLoading={submitting}>
            {submitting ? 'Adding...' : 'Add Liability →'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function LiabilitiesPage() {
  const [liabilities, setLiabilities] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [submitting,  setSubmitting]  = useState(false)
  const [error,       setError]       = useState('')

  const load = () =>
    api.getLiabilities()
      .then((l) => {
        setLiabilities([...l].sort((a, b) => (a.priority_rank || 0) - (b.priority_rank || 0)))
        setLoading(false)
      })
      .catch((e) => { setError(e.message); setLoading(false) })

  useEffect(() => { load() }, [])

  const handleCreate = async (liability) => {
    setSubmitting(true)
    setError('')
    try {
      await api.createLiability(liability)
      await load()
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.deleteLiability(id)
      setLiabilities((l) => l.filter((li) => li.id !== id))
    } catch (e) {
      setError(e.message)
    }
  }

  const totalInterest = liabilities.reduce((s, l) => s + (l.true_annual_cost || 0), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <span className="w-2 h-2 rounded-full bg-rose-600" />
          Debt Avalanche Engine
        </div>
        <h1 className="page-title">Liabilities & Debt Ranking</h1>
        <p className="page-subtitle">
          Liabilities ranked by true annual interest cost (balance × APR). The Debt Avalanche method prioritizes paying highest-rate debt first to minimize total interest paid.
        </p>
      </header>

      {/* Add form */}
      <AddLiabilityForm onCreate={handleCreate} submitting={submitting} />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-mono text-xs text-rose-700 font-bold">
          ⚠️ {error}
        </div>
      )}

      {/* Ranked list */}
      <section className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-36" />)}
          </div>
        ) : liabilities.length === 0 ? (
          <EmptyState
            icon="💳"
            title="No liabilities added"
            description="Add your credit cards or personal loans to generate an automated Debt Avalanche payoff strategy."
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Priority Ranked Liabilities</h3>
              <Badge variant="rose">{liabilities.length} Debts</Badge>
            </div>

            {liabilities.map((l) => (
              <div key={l.id} className="relative group">
                <button
                  onClick={() => handleDelete(l.id)}
                  className="absolute top-3 right-3 z-10 font-mono text-xs text-slate-400 hover:text-rose-600 transition-colors p-1"
                  title="Remove liability"
                >
                  ✕ Remove
                </button>
                <LiabilityRankCard liability={l} />
              </div>
            ))}

            {liabilities.length > 0 && (
              <Card hover={false} className="p-4 bg-rose-50/80 border-rose-200 flex items-center justify-between">
                <p className="font-mono text-xs uppercase tracking-wider font-bold text-rose-800">
                  Total annual interest outflow across all debts
                </p>
                <p className="font-display text-2xl font-extrabold text-rose-700 tabular">{inr(totalInterest)}/yr</p>
              </Card>
            )}
          </>
        )}
      </section>
    </div>
  )
}
