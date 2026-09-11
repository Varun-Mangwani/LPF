import { useEffect, useState, useMemo, useCallback } from 'react'
import { api } from '../api/client.js'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table'
import { Input } from '../components/ui/Input'
import { Select } from '../components/ui/Select'
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

/** Single row with inline PATCH editing */
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

  return (
    <TableRow className={editing ? 'bg-indigo-50/50 ring-2 ring-inset ring-indigo-200' : ''}>
      {/* Date */}
      <TableCell className="font-mono text-xs text-slate-500 whitespace-nowrap">
        {dateStr}
      </TableCell>

      {/* Merchant */}
      <TableCell>
        <p className="font-body text-sm font-bold text-slate-900 leading-tight">{txn.merchant}</p>
        {txn.description && txn.description !== txn.merchant && (
          <p className="font-mono text-[11px] text-slate-400 truncate max-w-xs mt-0.5">{txn.description}</p>
        )}
      </TableCell>

      {/* Category — inline editable */}
      <TableCell>
        {editing ? (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-indigo-400 rounded-lg px-2 py-1 font-mono text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        ) : (
          txn.category && <Badge variant={badgeVariant} size="sm">{txn.category}</Badge>
        )}
      </TableCell>

      {/* Amount */}
      <TableCell className="text-right font-mono text-xs sm:text-sm tabular font-bold whitespace-nowrap">
        <span className={isCredit ? 'text-emerald-700' : 'text-slate-900'}>
          {isCredit ? '+' : '−'}{inr(Math.abs(txn.amount))}
        </span>
      </TableCell>

      {/* Essential toggle — inline editable */}
      <TableCell>
        <div className="flex items-center gap-1.5 flex-wrap">
          {editing ? (
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={essential}
                onChange={(e) => setEssential(e.target.checked)}
                className="w-4 h-4 accent-indigo-600 rounded"
              />
              <span className="font-mono text-[11px] text-slate-700">Essential</span>
            </label>
          ) : (
            <>
              {txn.is_recurring && (
                <Badge variant="indigo" size="sm" title="Recurring subscription">⟳ Sub</Badge>
              )}
              {txn.is_essential && (
                <Badge variant="emerald" size="sm">Essential</Badge>
              )}
              {txn.categorized_by && (
                <Badge variant="slate" size="sm" title={`Categorized by: ${txn.categorized_by}`}>
                  {txn.categorized_by === 'rule' ? 'Rule' : txn.categorized_by === 'llm' ? 'AI' : txn.categorized_by === 'manual' ? '✏️ Manual' : txn.categorized_by}
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
              className="font-mono text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-50"
            >
              {saving ? '…' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              className="font-mono text-[11px] font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="font-mono text-[10px] text-slate-400 hover:text-indigo-600 transition-colors p-1 rounded-md hover:bg-indigo-50"
            title="Edit category / essential flag"
          >
            ✏️
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
      .then((t) => { setTxns(t); setLoading(false) })
      .catch((e) => { setError(e.message); setLoading(false) })
  }, [])

  useEffect(() => { loadTxns() }, [loadTxns])

  /** Merge a patched transaction back into the list without full reload */
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
    <div className="max-w-7xl mx-auto space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <header className="page-header">
        <div className="page-kicker">
          <span className="w-2 h-2 rounded-full bg-indigo-600" />
          Ledger Explorer
        </div>
        <h1 className="page-title">Transactions Ledger</h1>
        <p className="page-subtitle">
          Search, filter, and <strong>inline-edit</strong> transaction categories and essential flags.
          Auto-categorized via deterministic rules and AI.
        </p>
      </header>

      {/* Filter Toolbar */}
      <Card hover={false} className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-3 items-end">
          <div className="sm:col-span-2">
            <Input
              type="search"
              placeholder="Search merchant or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              id="txn-search"
            />
          </div>

          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            id="txn-category-filter"
            className="border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              id="txn-month-filter"
              className="flex-1 border border-slate-300 rounded-xl px-3.5 py-2.5 font-mono text-xs bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/20 focus:outline-none text-slate-700"
            >
              <option value="">All Months</option>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {hasFilters && (
              <Button onClick={clearFilters} variant="secondary" size="md">Clear</Button>
            )}
          </div>
        </div>
      </Card>

      {/* Summary strip */}
      <div className="grid grid-cols-3 gap-4">
        <Card hover={false} className="p-4 text-center">
          <p className="font-display text-2xl font-extrabold text-slate-900 tabular">{filtered.length}</p>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mt-1">Transactions</p>
        </Card>
        <Card hover={false} className="p-4 text-center border-l-4 border-l-rose-600">
          <p className="font-display text-2xl font-extrabold text-rose-600 tabular">{inr(totalDebit)}</p>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mt-1">Total Outflow</p>
        </Card>
        <Card hover={false} className="p-4 text-center border-l-4 border-l-emerald-600">
          <p className="font-display text-2xl font-extrabold text-emerald-700 tabular">{inr(totalCredit)}</p>
          <p className="font-mono text-xs uppercase tracking-wider text-slate-500 font-bold mt-1">Total Inflow</p>
        </Card>
      </div>

      {/* Edit hint */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5">
        <span>✏️</span>
        <span>Click the <strong className="text-indigo-700">pencil icon</strong> on any row to recategorize or toggle essential status. Changes are saved to the backend immediately.</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-12" />)}
        </div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl font-mono text-xs text-rose-700 font-bold">
          ⚠️ {error}
          <Button onClick={loadTxns} variant="secondary" size="sm" className="ml-3">Retry</Button>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon="💳"
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
              <TableHead>Merchant / Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Flags</TableHead>
              <TableHead className="text-right">Edit</TableHead>
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
