import { useEffect, useState, useMemo, useCallback } from 'react'
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  Edit2,
  Check,
  X,
  CreditCard,
  RefreshCw,
  Sparkles,
  Layers,
  Calendar,
} from 'lucide-react'
import { api } from '../api/client.js'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Skeleton } from '../components/ui/Skeleton'

const inr = (n) => `₹${Number(n).toLocaleString('en-IN')}`

const CATEGORY_BADGES = {
  Food:         'amber',
  Groceries:    'emerald',
  Rent:         'rose',
  EMI:          'rose',
  Subscription: 'indigo',
  Utilities:    'emerald',
  Transport:    'slate',
  Shopping:     'amber',
  Health:       'emerald',
  Entertainment:'amber',
  Investment:   'emerald',
  Salary:       'emerald',
  Transfer:     'slate',
  Other:        'slate',
}

const CATEGORIES = [
  'Food', 'Groceries', 'Rent', 'EMI', 'Subscription', 'Utilities',
  'Transport', 'Shopping', 'Health', 'Entertainment', 'Investment', 'Salary', 'Transfer', 'Other',
]

function getMonths(txns) {
  const months = [...new Set(txns.map((t) => (t.date || t.txn_date)?.slice(0, 7)).filter(Boolean))].sort().reverse()
  return months
}

/** Single row with inline editing */
function TransactionRow({ txn, onPatch }) {
  const isCredit   = txn.type === 'credit'
  const [editing,  setEditing]  = useState(false)
  const [category, setCategory] = useState(txn.category || 'Other')
  const [essential, setEssential] = useState(!!txn.is_essential)
  const [saving,   setSaving]   = useState(false)

  const badgeVariant = CATEGORY_BADGES[txn.category] || 'slate'
  const dateStr = txn.date || txn.txn_date || '—'

  const handleSave = async () => {
    setSaving(true)
    try {
      const updated = await api.patchTransaction(txn.id, { category, is_essential: essential })
      onPatch(updated)
      setEditing(false)
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setCategory(txn.category || 'Other')
    setEssential(!!txn.is_essential)
    setEditing(false)
  }

  const merchantInitials = (txn.merchant || 'TX').slice(0, 2).toUpperCase()

  return (
    <TableRow className={editing ? 'bg-indigo-50/60 border-indigo-200/80' : ''}>
      {/* Date */}
      <TableCell className="tabular text-xs text-slate-500 whitespace-nowrap">
        {dateStr}
      </TableCell>

      {/* Merchant */}
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center text-xs font-bold text-slate-700 shrink-0 shadow-subtle">
            {merchantInitials}
          </div>
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-slate-900 leading-tight truncate">
              {txn.merchant}
            </p>
            {txn.description && txn.description !== txn.merchant && (
              <p className="font-body text-xs text-slate-500 truncate max-w-xs mt-0.5">
                {txn.description}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Category — inline editable */}
      <TableCell>
        {editing ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-white border border-indigo-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-white text-slate-900">{c}</option>
            ))}
          </select>
        ) : (
          txn.category && <Badge variant={badgeVariant} size="sm">{txn.category}</Badge>
        )}
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right tabular font-bold text-sm whitespace-nowrap">
        <span className={isCredit ? 'text-emerald-600 font-extrabold' : 'text-slate-900'}>
          {isCredit ? '+' : '−'}{inr(Math.abs(txn.amount))}
        </span>
      </TableCell>

      {/* Essential / AI Flags */}
      <TableCell>
        <div className="flex items-center gap-1.5 flex-wrap">
          {editing ? (
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-xs text-slate-600">
              <input
                type="checkbox"
                checked={essential}
                onChange={(e) => setEssential(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span>Essential</span>
            </label>
          ) : (
            <>
              {txn.is_recurring && (
                <Badge variant="indigo" size="sm">Recurring</Badge>
              )}
              {txn.is_essential && (
                <Badge variant="emerald" size="sm">Essential</Badge>
              )}
              {txn.categorized_by && (
                <Badge variant="slate" size="sm">
                  {txn.categorized_by === 'rule' ? 'Rule' : txn.categorized_by === 'llm' ? '✨ AI' : txn.categorized_by}
                </Badge>
              )}
            </>
          )}
        </div>
      </TableCell>

      {/* Edit / Save / Cancel */}
      <TableCell className="text-right">
        {editing ? (
          <div className="flex items-center gap-1.5 justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className="text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1 shadow-sm"
            >
              <Check className="w-3 h-3" />
              <span>{saving ? '…' : 'Save'}</span>
            </button>
            <button
              onClick={handleCancel}
              className="text-xs text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-2 py-1 rounded-lg transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="text-slate-400 hover:text-indigo-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Edit category or flags"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}
      </TableCell>
    </TableRow>
  )
}

export default function TransactionsPage() {
  const [txns,        setTxns]        = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [catFilter,   setCatFilter]   = useState('')
  const [monthFilter, setMonthFilter] = useState('')
  const [search,      setSearch]      = useState('')

  const loadTxns = useCallback(() => {
    setLoading(true)
    api.getTransactions()
      .then((t) => { setTxns(Array.isArray(t) ? t : []); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [])

  useEffect(() => { loadTxns() }, [loadTxns])

  const handlePatch = useCallback((updated) => {
    if (!updated) return
    setTxns((prev) => prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)))
  }, [])

  const months = useMemo(() => getMonths(txns), [txns])

  const filtered = useMemo(() => {
    return txns.filter((t) => {
      const dateStr = t.date || t.txn_date || ''
      if (catFilter   && t.category !== catFilter) return false
      if (monthFilter && !dateStr.startsWith(monthFilter)) return false
      if (search) {
        const q = search.toLowerCase()
        if (!t.merchant?.toLowerCase().includes(q) && !t.category?.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [txns, catFilter, monthFilter, search])

  const totalDebit  = filtered.filter((t) => t.type === 'debit' || t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0)
  const totalCredit = filtered.filter((t) => t.type === 'credit' || t.amount > 0).reduce((s, t) => s + Math.abs(t.amount), 0)

  const clearFilters = () => { setCatFilter(''); setMonthFilter(''); setSearch('') }
  const hasFilters = catFilter || monthFilter || search

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
          Ledger Records
        </div>
        <h1 className="page-title">Transactions Ledger</h1>
        <p className="page-subtitle">
          Search, filter, and inline-edit transaction categories and essential flags. Auto-categorized via deterministic rules & AI.
        </p>
      </header>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card hover={false} className="p-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Filtered</p>
            <p className="font-display text-2xl font-extrabold text-slate-900 tabular mt-0.5">{filtered.length}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-subtle">
            <Layers className="w-5 h-5" />
          </div>
        </Card>

        <Card hover={false} className="p-4 flex items-center justify-between border-rose-100">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Outflow</p>
            <p className="font-display text-2xl font-extrabold text-rose-600 tabular mt-0.5">{inr(totalDebit)}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shadow-subtle">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </Card>

        <Card hover={false} className="p-4 flex items-center justify-between border-emerald-100">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total Inflow</p>
            <p className="font-display text-2xl font-extrabold text-emerald-600 tabular mt-0.5">{inr(totalCredit)}</p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-subtle">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </Card>
      </div>

      {/* Search & Filter Toolbar */}
      <Card hover={false} className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <Input
              type="search"
              placeholder="Search merchant, description, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="txn-search"
              leftIcon={<Search className="w-4 h-4 text-slate-400" />}
            />
          </div>

          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            id="txn-category-filter"
            className="bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none shadow-subtle"
          >
            <option value="" className="bg-white">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-white">{c}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              id="txn-month-filter"
              className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 focus:outline-none shadow-subtle"
            >
              <option value="" className="bg-white">All Months</option>
              {months.map((m) => <option key={m} value={m} className="bg-white">{m}</option>)}
            </select>
            {hasFilters && (
              <Button onClick={clearFilters} variant="secondary" size="md">Clear</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Interactive Helper Hint */}
      <div className="flex items-center gap-2.5 text-xs text-slate-600 bg-indigo-50/80 border border-indigo-100/90 rounded-2xl px-4 py-3 shadow-subtle">
        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
        <span>
          Click the <strong className="text-indigo-700 font-semibold">pencil icon</strong> on any row to recategorize or toggle essential status. Changes update your 50/30/20 budget calculations immediately.
        </span>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12 bg-slate-100 rounded-xl" />)}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 font-semibold flex items-center justify-between">
          <span>⚠️ {error}</span>
          <Button onClick={loadTxns} variant="secondary" size="sm">Retry</Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-8 h-8 text-slate-400" />}
          title="No transactions found"
          description={txns.length === 0
            ? 'No transactions in ledger yet. Import a bank statement first.'
            : 'No transactions match your current search and filter criteria.'}
          action={
            hasFilters && (
              <Button onClick={clearFilters} variant="secondary">Reset Filters</Button>
            )
          }
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow hover={false}>
              <TableHead>Date</TableHead>
              <TableHead>Merchant & Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TransactionRow key={t.id} txn={t} onPatch={handlePatch} />
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
