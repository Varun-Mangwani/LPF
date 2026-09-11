import { useEffect, useState } from 'react'
import {
  ShieldAlert,
  Flame,
  Plus,
  Trash2,
  AlertCircle,
  CreditCard,
  Percent,
  TrendingDown,
  Info,
} from 'lucide-react'
import { api } from '../api/client.js'
import LiabilityRankCard from '../components/LiabilityRankCard.jsx'
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '../components/ui/Card'
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
  const [isOpen,    setIsOpen]    = useState(false)
  const [name,      setName]      = useState('')
  const [type,      setType]      = useState('card')
  const [balance,   setBalance]   = useState('')
  const [rate,      setRate]      = useState('')
  const [minPay,    setMinPay]    = useState('')

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
    setIsOpen(false)
  }

  return (
    <Card hover={false} className="border-slate-200/80 bg-white shadow-card">
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Add Debt / Credit Card Liability</CardTitle>
          <CardDescription>Include credit cards, personal loans, or consumer credit</CardDescription>
        </div>
        <Button
          onClick={() => setIsOpen((v) => !v)}
          variant={isOpen ? 'secondary' : 'primary'}
          size="sm"
          leftIcon={isOpen ? null : <Plus className="w-4 h-4" />}
        >
          {isOpen ? 'Cancel' : 'Add Liability'}
        </Button>
      </div>

      {isOpen && (
        <form onSubmit={handleSubmit} className="space-y-4 mt-6 pt-5 border-t border-slate-100 animate-slide-down">
          <CardContent className="space-y-4 p-0">
            <Input
              label="Liability / Creditor Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. HDFC Millennia Card, Car Loan"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Liability Type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                options={TYPES}
              />

              <Input
                label="Outstanding Balance (₹)"
                required
                type="number"
                min="1"
                leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="50000"
              />

              <Input
                label="Annual APR Interest Rate (%)"
                required
                type="number"
                min="0"
                step="0.1"
                rightIcon={<Percent className="w-3.5 h-3.5" />}
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="36"
              />

              <Input
                label="Min. Monthly Payment (₹)"
                type="number"
                min="0"
                leftIcon={<span className="text-xs font-bold text-slate-400">₹</span>}
                value={minPay}
                onChange={(e) => setMinPay(e.target.value)}
                placeholder="2500"
              />
            </div>

            {balance && rate && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-slate-700 shadow-subtle">
                <span className="text-slate-500">True Annual Interest Bleed: </span>
                <span className="text-rose-600 font-extrabold tabular text-sm">
                  {inr(Number(balance) * (Number(rate) / 100))}/year
                </span>
                <span className="text-slate-500"> at {rate}% APR on {inr(balance)}</span>
              </div>
            )}
          </CardContent>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={() => setIsOpen(false)} size="sm">
              Cancel
            </Button>
            <Button type="submit" variant="danger" isLoading={submitting} size="sm">
              {submitting ? 'Adding...' : 'Save Liability'}
            </Button>
          </div>
        </form>
      )}
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

  const totalBalance  = liabilities.reduce((s, l) => s + (l.balance || 0), 0)
  const totalInterest = liabilities.reduce((s, l) => s + (l.true_annual_cost || 0), 0)

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
          Debt Avalanche Engine
        </div>
        <h1 className="page-title">Liabilities & Debt Optimization</h1>
        <p className="page-subtitle">
          Liabilities ranked strictly by APR to minimize total wealth loss. The mathematical Avalanche strategy eliminates the highest-rate burden first.
        </p>
      </header>

      {/* Debt Avalanche Hero Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-rose-50/90 via-white to-amber-50/60 border border-rose-100 p-6 sm:p-7 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-6 overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 w-64 h-64 bg-rose-200/20 rounded-full blur-3xl" />
        
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4 text-rose-600" />
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-700">
              Total Debt Burden
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-display text-3xl font-black text-slate-900 tabular">
              {inr(totalBalance)}
            </span>
            <span className="text-xs text-rose-600 font-bold">
              Bleeding {inr(totalInterest)}/yr in APR
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-md leading-relaxed">
            Direct any excess monthly surplus toward Rank #1 to halt compounding interest immediately.
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-3">
          <Badge variant="rose" size="lg" dot>
            {liabilities.length} Active Debts
          </Badge>
        </div>
      </div>

      {/* Add Form */}
      <AddLiabilityForm onCreate={handleCreate} submitting={submitting} />

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Ranked list */}
      <section className="space-y-6">
        {loading ? (
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => <Skeleton key={i} className="h-36 bg-slate-100 rounded-2xl" />)}
          </div>
        ) : liabilities.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-8 h-8 text-slate-400" />}
            title="No liabilities added"
            description="Add your credit cards or loans to calculate your Debt Avalanche payoff schedule and savings."
          />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-900">Priority Ranked Liabilities</h3>
              <span className="text-xs text-slate-500">Sorted by APR (Highest to Lowest)</span>
            </div>

            <div className="space-y-4">
              {liabilities.map((l) => (
                <div key={l.id} className="relative group">
                  <button
                    onClick={() => handleDelete(l.id)}
                    className="absolute top-4 right-4 z-10 text-xs text-slate-400 hover:text-rose-600 transition-colors p-1.5 rounded-lg hover:bg-slate-100 flex items-center gap-1"
                    title="Remove liability"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                  <LiabilityRankCard liability={l} />
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
