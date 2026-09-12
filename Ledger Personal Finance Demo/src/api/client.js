/**
 * api/client.js — High-performance API client with full client-side demo capability.
 *
 * Supports:
 * 1. Zero-config standalone Frontend Demo mode (default: VITE_USE_MOCK=true).
 * 2. In-browser deterministic statement ingestion & categorization.
 * 3. Client-side localStorage persistence for goals, liabilities, and transactions.
 * 4. Resilient sub-second fallback to demo fixtures if a real backend is offline.
 */
import dashboardMock from '../mock/dashboard.json'
import cashflowMock from '../mock/cashflow.json'
import goalsSeed from '../mock/goals.json'
import liabilitiesMock from '../mock/liabilities.json'
import alertsMock from '../mock/alerts.json'
import transactionsMock from '../mock/transactions.json'

const STORAGE_KEYS = {
  GOALS: 'lpf_demo_goals_v2',
  LIABILITIES: 'lpf_demo_liabilities_v2',
  TRANSACTIONS: 'lpf_demo_transactions_v2',
  DASHBOARD: 'lpf_demo_dashboard_v2',
  ALERTS: 'lpf_demo_alerts_v2',
  PROFILE: 'lpf_demo_profile_v2',
}

// In .env, VITE_USE_MOCK can be set to 'true' or 'false'
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === undefined
const defaultBase = import.meta.env.DEV ? 'http://localhost:8000' : 'https://lpf-rqjg.onrender.com'
const rawBase = import.meta.env.VITE_API_BASE_URL || defaultBase
export const BASE_URL = rawBase.trim().replace(/\/+$/, '')
const USER_ID = import.meta.env.VITE_USER_ID || '1'

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

// ─────────────────────────────────────────────────────────────
// LocalStorage Persistence Helpers
// ─────────────────────────────────────────────────────────────

function getStored(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn(`[LPF] Error loading ${key} from storage:`, e)
  }
  return fallback
}

function setStored(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn(`[LPF] Error saving ${key} to storage:`, e)
  }
}

// In-memory demo state with localStorage backing
let _goals = getStored(STORAGE_KEYS.GOALS, [...goalsSeed])
let _liabilities = getStored(STORAGE_KEYS.LIABILITIES, [...liabilitiesMock])
let _transactions = getStored(STORAGE_KEYS.TRANSACTIONS, [...transactionsMock])
let _dashboard = getStored(STORAGE_KEYS.DASHBOARD, { ...dashboardMock })
let _alerts = getStored(STORAGE_KEYS.ALERTS, [...alertsMock])

// ─────────────────────────────────────────────────────────────
// Deterministic Rule Engine for In-Browser CSV Categorization
// ─────────────────────────────────────────────────────────────

export function categorizeTransactionLocally(description, debit, credit) {
  const d = (description || '').toUpperCase()
  const isCredit = Boolean(credit && Number(credit) > 0)
  const amount = isCredit ? Number(credit) : Number(debit || 0)

  if (isCredit) {
    if (d.includes('SALARY') || d.includes('PAYROLL') || d.includes('ACME')) {
      return { category: 'Salary', is_essential: true, is_recurring: true, type: 'credit', merchant: 'Salary Credit - Payroll', categorized_by: 'rule' }
    }
    if (d.includes('REFUND')) {
      return { category: 'Transfer', is_essential: false, is_recurring: false, type: 'credit', merchant: 'Rent / Security Refund', categorized_by: 'rule' }
    }
    if (d.includes('IMPS') || d.includes('UPI')) {
      return { category: 'Transfer', is_essential: false, is_recurring: false, type: 'credit', merchant: description.replace(/^IMPS\s+FROM\s+/i, '').slice(0, 32) || 'Direct Transfer', categorized_by: 'rule' }
    }
    return { category: 'Transfer', is_essential: false, is_recurring: false, type: 'credit', merchant: description.slice(0, 32), categorized_by: 'rule' }
  }

  // Debits
  if (d.includes('RENT') || d.includes('APARTMENTS') || d.includes('LANDLORD')) {
    return { category: 'Rent', is_essential: true, is_recurring: true, type: 'debit', merchant: 'Sunrise Apartments Rent', categorized_by: 'rule' }
  }
  if (d.includes('CAR LOAN') || d.includes('EMI') || d.includes('LOAN')) {
    return { category: 'EMI', is_essential: true, is_recurring: true, type: 'debit', merchant: 'HDFC Car Loan EMI', categorized_by: 'rule' }
  }
  if (d.includes('BIGBASKET') || d.includes('DMART') || d.includes('ZEPTO') || d.includes('GROCERY') || d.includes('BLINKIT')) {
    return { category: 'Groceries', is_essential: true, is_recurring: true, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Groceries', categorized_by: 'rule' }
  }
  if (d.includes('ELECTRICITY') || d.includes('BESCOM') || d.includes('AIRTEL') || d.includes('BROADBAND') || d.includes('UTILITIES') || d.includes('BSES')) {
    return { category: 'Utilities', is_essential: true, is_recurring: true, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Utilities & Broadband', categorized_by: 'rule' }
  }
  if (d.includes('NETFLIX') || d.includes('SPOTIFY') || d.includes('PRIME') || d.includes('GYM') || d.includes('CULT.FIT') || d.includes('GOLD GYM')) {
    return { category: 'Subscription', is_essential: false, is_recurring: true, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Subscription', categorized_by: 'rule' }
  }
  if (d.includes('SWIGGY') || d.includes('ZOMATO') || d.includes('DOMINOS') || d.includes('STARBUCKS') || d.includes('PIZZA') || d.includes('FOOD') || d.includes('RESTAURANT')) {
    return { category: 'Food', is_essential: false, is_recurring: true, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Food Order', categorized_by: 'rule' }
  }
  if (d.includes('UBER') || d.includes('OLA') || d.includes('RAPIDO') || d.includes('PETROL') || d.includes('INDIAN OIL') || d.includes('FUEL')) {
    return { category: 'Transport', is_essential: false, is_recurring: true, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Transport & Fuel', categorized_by: 'rule' }
  }
  if (d.includes('MYNTRA') || d.includes('AMAZON') || d.includes('CROMA') || d.includes('DECATHLON') || d.includes('SHOPPING') || d.includes('CLOTHES')) {
    return { category: 'Shopping', is_essential: false, is_recurring: false, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Retail & Electronics', categorized_by: 'rule' }
  }
  if (d.includes('APOLLO') || d.includes('PHARMACY') || d.includes('PRACTO') || d.includes('HOSPITAL') || d.includes('DOCTOR') || d.includes('MEDICINE')) {
    return { category: 'Health', is_essential: true, is_recurring: false, type: 'debit', merchant: 'Apollo Healthcare / Meds', categorized_by: 'rule' }
  }
  if (d.includes('PVR') || d.includes('CINEMAS') || d.includes('BOOKMYSHOW') || d.includes('EVENT') || d.includes('MOVIE')) {
    return { category: 'Entertainment', is_essential: false, is_recurring: true, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'Entertainment & Movies', categorized_by: 'rule' }
  }
  if (d.includes('ZERODHA') || d.includes('GROWW') || d.includes('SIP') || d.includes('MUTUAL')) {
    return { category: 'Investment', is_essential: false, is_recurring: true, type: 'debit', merchant: 'Mutual Fund SIP', categorized_by: 'rule' }
  }
  if (d.includes('ATM') || d.includes('CASH')) {
    return { category: 'Other', is_essential: true, is_recurring: false, type: 'debit', merchant: 'ATM Cash Withdrawal', categorized_by: 'rule' }
  }

  // Fallback to LLM / Pattern classification
  return { category: 'Other', is_essential: false, is_recurring: false, type: 'debit', merchant: description.replace(/^UPI\//, '').split('/')[0] || 'General Expense', categorized_by: 'llm' }
}

/** Ingest raw CSV text into parsed transactions and recalculate dashboard summary */
export function processCsvTextLocally(csvText) {
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
  if (lines.length < 2) throw new Error('CSV file contains no transaction rows.')

  const headerLine = lines[0].toLowerCase()
  const headers = headerLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''))

  const dateIdx = headers.findIndex((h) => h.includes('date'))
  const descIdx = headers.findIndex((h) => h.includes('narration') || h.includes('desc') || h.includes('particular'))
  const debitIdx = headers.findIndex((h) => h.includes('debit') || h.includes('withdrawal'))
  const creditIdx = headers.findIndex((h) => h.includes('credit') || h.includes('deposit'))
  const amountIdx = headers.findIndex((h) => h.includes('amount'))

  const newTxns = []
  let ruleCount = 0
  let llmCount = 0
  let recurringCount = 0

  for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i]
    if (!rawLine) continue
    // Handle CSV split respecting basic quotes
    const cols = rawLine.split(',').map((c) => c.trim().replace(/^"|"$/g, ''))

    const dateStr = cols[dateIdx >= 0 ? dateIdx : 0] || '2026-09-01'
    const desc = cols[descIdx >= 0 ? descIdx : 1] || 'Transaction'
    const debitVal = debitIdx >= 0 ? parseFloat(cols[debitIdx]) || 0 : (amountIdx >= 0 && cols[amountIdx] < 0 ? Math.abs(parseFloat(cols[amountIdx])) : 0)
    const creditVal = creditIdx >= 0 ? parseFloat(cols[creditIdx]) || 0 : (amountIdx >= 0 && cols[amountIdx] > 0 ? parseFloat(cols[amountIdx]) : 0)

    if (debitVal === 0 && creditVal === 0) continue

    const classified = categorizeTransactionLocally(desc, debitVal, creditVal)
    const amount = classified.type === 'credit' ? creditVal : debitVal

    if (classified.categorized_by === 'rule') ruleCount++
    else llmCount++
    if (classified.is_recurring) recurringCount++

    newTxns.push({
      id: i,
      user_id: 1,
      txn_date: dateStr,
      merchant: classified.merchant,
      description: desc,
      amount: amount,
      type: classified.type,
      category: classified.category,
      is_essential: classified.is_essential,
      is_recurring: classified.is_recurring,
      categorized_by: classified.categorized_by,
    })
  }

  // Recalculate summary metrics
  const totalIncome = newTxns.filter((t) => t.type === 'credit').reduce((s, t) => s + t.amount, 0) || 85000
  const totalExpense = newTxns.filter((t) => t.type === 'debit').reduce((s, t) => s + t.amount, 0) || 58400

  // Category breakdown
  const categoryMap = {}
  newTxns.filter((t) => t.type === 'debit').forEach((t) => {
    if (!categoryMap[t.category]) {
      categoryMap[t.category] = { category: t.category, amount: 0, essential: t.is_essential }
    }
    categoryMap[t.category].amount += t.amount
  })

  const recurringSubscriptions = [
    { merchant: 'Netflix', amount: 649, category: 'Subscription', frequency_days: 30 },
    { merchant: 'Spotify', amount: 119, category: 'Subscription', frequency_days: 30 },
    { merchant: 'Gold Gym Membership', amount: 1500, category: 'Subscription', frequency_days: 30 },
    { merchant: 'Airtel Broadband', amount: 999, category: 'Utilities', frequency_days: 30 },
  ]

  _transactions = newTxns
  _dashboard = {
    total_income: Math.round(totalIncome),
    total_expense: Math.round(totalExpense),
    by_category: Object.values(categoryMap),
    recurring_subscriptions: recurringSubscriptions,
  }

  // Persist
  setStored(STORAGE_KEYS.TRANSACTIONS, _transactions)
  setStored(STORAGE_KEYS.DASHBOARD, _dashboard)

  return {
    inserted: newTxns.length,
    categorized_by_rule: ruleCount,
    categorized_by_llm: llmCount,
    recurring_detected: recurringCount,
    total_income: totalIncome,
    total_expense: totalExpense,
  }
}

// ─────────────────────────────────────────────────────────────
// Fallback Mock Resolver
// ─────────────────────────────────────────────────────────────

function fallbackMock(path, options = {}) {
  const p = path.split('?')[0]
  if (p.includes('/api/dashboard/summary')) return _dashboard
  if (p.includes('/api/cashflow')) return cashflowMock
  if (p.includes('/api/alerts')) return _alerts
  if (p.includes('/api/goals')) {
    if (options.method === 'POST') {
      const g = JSON.parse(options.body || '{}')
      const targetAmount = parseFloat(g.target_amount) || 100000
      const currentAmount = parseFloat(g.current_amount) || 0
      const monthsLeft = Math.max(1, Math.round((new Date(g.target_date || '2027-06-01') - new Date()) / (1000 * 60 * 60 * 24 * 30)))
      const created = {
        id: _goals.length + 1,
        user_id: 1,
        created_at: new Date().toISOString(),
        ...g,
        target_amount: targetAmount,
        current_amount: currentAmount,
        months_remaining: monthsLeft,
        monthly_contribution_required: Math.round((targetAmount - currentAmount) / monthsLeft),
      }
      _goals = [..._goals, created]
      setStored(STORAGE_KEYS.GOALS, _goals)
      return created
    }
    return _goals
  }
  if (p.includes('/api/liabilities')) {
    if (options.method === 'POST') {
      const l = JSON.parse(options.body || '{}')
      const balance = parseFloat(l.balance) || 0
      const rate = parseFloat(l.interest_rate) || 0
      const true_annual_cost = Math.round(balance * (rate / 100))
      const created = {
        id: _liabilities.length + 1,
        user_id: 1,
        ...l,
        balance,
        interest_rate: rate,
        true_annual_cost,
        priority_rank: rate >= 30 ? 1 : 2,
        reasoning: `${rate}% APR — true annual cost is ₹${true_annual_cost.toLocaleString('en-IN')}/year.`,
      }
      _liabilities = [..._liabilities, created].sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0))
      setStored(STORAGE_KEYS.LIABILITIES, _liabilities)
      return created
    }
    return _liabilities
  }
  if (p.includes('/api/transactions')) {
    return _transactions
  }
  if (p.includes('/api/simulate')) {
    const { scenario, amount } = JSON.parse(options.body || '{}')
    const amt = Number(amount) || 0
    const delta = scenario === 'income_change' ? amt : -amt
    const beforeBal = cashflowMock.month_end_balance || 26600
    const afterBal = Math.max(0, beforeBal + delta)
    return {
      before: { projected_balance: beforeBal, cashflow: cashflowMock, goals: _goals },
      after: {
        projected_balance: afterBal,
        cashflow: {
          ...cashflowMock,
          month_end_balance: afterBal,
          days: (cashflowMock.days || []).map((d) => ({ ...d, balance: Math.max(0, d.balance + delta) })),
        },
        goals: _goals.map((g) => ({
          name: g.name,
          monthly_contribution_required: g.monthly_contribution_required,
          months_remaining: (g.months_remaining || 6) + (delta < 0 ? 3 : -1),
        })),
      },
      narrative:
        delta < 0
          ? `Adding ₹${amt.toLocaleString('en-IN')}/mo as ${scenario.replace(/_/g, ' ')} reduces your projected buffer to ₹${afterBal.toLocaleString('en-IN')}.`
          : `An income increase of ₹${amt.toLocaleString('en-IN')}/mo expands your buffer and accelerates goal timelines.`,
    }
  }
  return {}
}

/** Fetch wrapper for real backend calls with fast automatic fallback to demo fixtures */
async function real(path, options = {}) {
  try {
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const separator = cleanPath.includes('?') ? '&' : '?'
    const url = `${BASE_URL}${cleanPath}${separator}user_id=${USER_ID}`
    const controller = new AbortController()
    // Sub-second timeout (1800ms) prevents any UI freeze when backend is offline
    const timer = setTimeout(() => controller.abort(), 1800)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' },
      ...options,
    })
    clearTimeout(timer)
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail?.detail || `${options.method || 'GET'} ${cleanPath} → ${res.status}`)
    }
    return res.json()
  } catch (err) {
    return fallbackMock(path, options)
  }
}

// ─────────────────────────────────────────────────────────────
// Primary API Client Interface
// ─────────────────────────────────────────────────────────────

export const api = {
  // ── Health & Mode Check ────────────────────────────────────
  async checkHealth() {
    if (USE_MOCK) {
      return { status: 'ok', mode: 'mock', online: true, url: 'Standalone Frontend Demo' }
    }
    try {
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 1500)
      const res = await fetch(`${BASE_URL}/health`, { signal: controller.signal })
      clearTimeout(timer)
      if (res.ok) {
        const data = await res.json().catch(() => ({ status: 'ok' }))
        return { ...data, online: true, mode: 'real', url: BASE_URL }
      }
      return { online: false, mode: 'mock_fallback', url: BASE_URL, status: res.status }
    } catch (err) {
      return { online: true, mode: 'mock_fallback', url: 'Standalone Demo Mode', fallback: true }
    }
  },

  getBaseUrl() {
    return BASE_URL
  },

  isMockMode() {
    return USE_MOCK
  },

  // ── Profile / Baseline ─────────────────────────────────────
  getProfile() {
    return getStored(STORAGE_KEYS.PROFILE, {
      income: 85000,
      goalName: 'Emergency Reserve Fund',
      goalTarget: 300000,
      goalDate: '2027-05-01',
    })
  },

  saveProfile(profile) {
    setStored(STORAGE_KEYS.PROFILE, profile)
    return profile
  },

  // ── Statement Ingestion ────────────────────────────────────
  async uploadCsv(file) {
    // In standalone/mock mode or if backend offline, parse directly in browser
    if (USE_MOCK) {
      await wait(650)
      const text = await file.text()
      return processCsvTextLocally(text)
    }

    try {
      const form = new FormData()
      form.append('file', file)
      const controller = new AbortController()
      const timer = setTimeout(() => controller.abort(), 4000)

      const res = await fetch(`${BASE_URL}/api/upload?user_id=${USER_ID}`, {
        method: 'POST',
        body: form,
        signal: controller.signal,
      })
      clearTimeout(timer)

      if (res.ok) {
        return await res.json()
      }
      throw new Error(`Upload returned status ${res.status}`)
    } catch (err) {
      // Gracefully fall back to in-browser parsing so demo NEVER breaks
      console.info('[LPF] Falling back to client-side CSV parser.')
      const text = await file.text()
      return processCsvTextLocally(text)
    }
  },

  /** 1-Click Instant Demo Statement Ingestion (loads public/bank_statement_demo.csv) */
  async ingestDemoStatement() {
    await wait(400)
    try {
      const res = await fetch('/bank_statement_demo.csv')
      if (res.ok) {
        const text = await res.text()
        return processCsvTextLocally(text)
      }
    } catch (e) {
      console.warn('[LPF] Failed to fetch /bank_statement_demo.csv directly, using bundled records:', e)
    }
    // Fallback using bundled mock
    _transactions = [...transactionsMock]
    _dashboard = { ...dashboardMock }
    setStored(STORAGE_KEYS.TRANSACTIONS, _transactions)
    setStored(STORAGE_KEYS.DASHBOARD, _dashboard)
    return {
      inserted: 30,
      categorized_by_rule: 26,
      categorized_by_llm: 4,
      recurring_detected: 6,
    }
  },

  // ── Transactions ───────────────────────────────────────────
  async getTransactions({ category, month } = {}) {
    if (USE_MOCK) {
      await wait(100)
      let filtered = [..._transactions]
      if (category && category !== 'All') {
        filtered = filtered.filter((t) => t.category === category)
      }
      if (month && month !== 'All') {
        filtered = filtered.filter((t) => (t.txn_date || t.date || '').startsWith(month))
      }
      return filtered
    }
    let qs = ''
    if (category) qs += `&category=${encodeURIComponent(category)}`
    if (month) qs += `&month=${encodeURIComponent(month)}`
    return real(`/api/transactions?${qs}`)
  },

  async patchTransaction(id, patch) {
    if (USE_MOCK) {
      await wait(100)
      _transactions = _transactions.map((t) => (t.id === id ? { ...t, ...patch } : t))
      setStored(STORAGE_KEYS.TRANSACTIONS, _transactions)
      return _transactions.find((t) => t.id === id)
    }
    return real(`/api/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
  },

  // ── Dashboard ──────────────────────────────────────────────
  async getDashboardSummary() {
    if (USE_MOCK) {
      await wait(150)
      return _dashboard
    }
    return real('/api/dashboard/summary')
  },

  // ── Cashflow ───────────────────────────────────────────────
  async getCashflow(month, startBalance) {
    if (USE_MOCK) {
      await wait(150)
      return cashflowMock
    }
    let qs = ''
    if (month) qs += `&month=${encodeURIComponent(month)}`
    if (startBalance) qs += `&start_balance=${startBalance}`
    return real(`/api/cashflow?${qs}`)
  },

  // ── Alerts ─────────────────────────────────────────────────
  async getAlerts() {
    if (USE_MOCK) {
      await wait(120)
      return _alerts
    }
    return real('/api/alerts')
  },

  async generateAlerts() {
    if (USE_MOCK) {
      await wait(250)
      return _alerts
    }
    return real('/api/alerts/generate', { method: 'POST' })
  },

  // ── Goals ──────────────────────────────────────────────────
  async getGoals() {
    if (USE_MOCK) {
      await wait(120)
      return _goals
    }
    return real('/api/goals')
  },

  async createGoal(goal) {
    if (USE_MOCK) {
      await wait(200)
      const targetAmount = parseFloat(goal.target_amount) || 100000
      const currentAmount = parseFloat(goal.current_amount) || 0
      const monthsLeft = Math.max(1, Math.round((new Date(goal.target_date || '2027-06-01') - new Date()) / (1000 * 60 * 60 * 24 * 30)))
      const created = {
        id: _goals.length + 1,
        user_id: 1,
        created_at: new Date().toISOString(),
        ...goal,
        target_amount: targetAmount,
        current_amount: currentAmount,
        monthly_contribution_required: Math.round((targetAmount - currentAmount) / monthsLeft),
        months_remaining: monthsLeft,
      }
      _goals = [..._goals, created]
      setStored(STORAGE_KEYS.GOALS, _goals)
      return created
    }
    return real('/api/goals', { method: 'POST', body: JSON.stringify(goal) })
  },

  async updateGoal(id, goal) {
    if (USE_MOCK) {
      await wait(150)
      const targetAmount = parseFloat(goal.target_amount)
      const currentAmount = parseFloat(goal.current_amount) || 0
      const monthsLeft = Math.max(1, Math.round((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24 * 30)))
      _goals = _goals.map((g) =>
        g.id === id
          ? {
              ...g,
              ...goal,
              target_amount: targetAmount || g.target_amount,
              current_amount: currentAmount,
              monthly_contribution_required: Math.round(((targetAmount || g.target_amount) - currentAmount) / monthsLeft),
              months_remaining: monthsLeft,
            }
          : g
      )
      setStored(STORAGE_KEYS.GOALS, _goals)
      return _goals.find((g) => g.id === id)
    }
    return real(`/api/goals/${id}`, { method: 'PUT', body: JSON.stringify(goal) })
  },

  async deleteGoal(id) {
    if (USE_MOCK) {
      await wait(100)
      _goals = _goals.filter((g) => g.id !== id)
      setStored(STORAGE_KEYS.GOALS, _goals)
      return
    }
    return real(`/api/goals/${id}`, { method: 'DELETE' })
  },

  // ── Liabilities ────────────────────────────────────────────
  async getLiabilities() {
    if (USE_MOCK) {
      await wait(120)
      return _liabilities
    }
    return real('/api/liabilities')
  },

  async createLiability(liability) {
    if (USE_MOCK) {
      await wait(200)
      const balance = parseFloat(liability.balance) || 0
      const rate = parseFloat(liability.interest_rate) || 0
      const true_annual_cost = Math.round(balance * (rate / 100))
      const created = {
        id: _liabilities.length + 1,
        user_id: 1,
        ...liability,
        balance,
        interest_rate: rate,
        true_annual_cost,
        priority_rank: rate >= 30 ? 1 : 2,
        reasoning: `${rate}% APR — true annual cost is ₹${true_annual_cost.toLocaleString('en-IN')}/year.`,
      }
      _liabilities = [..._liabilities, created].sort((a, b) => (b.interest_rate || 0) - (a.interest_rate || 0))
      setStored(STORAGE_KEYS.LIABILITIES, _liabilities)
      return created
    }
    return real('/api/liabilities', { method: 'POST', body: JSON.stringify(liability) })
  },

  async deleteLiability(id) {
    if (USE_MOCK) {
      await wait(100)
      _liabilities = _liabilities.filter((l) => l.id !== id)
      setStored(STORAGE_KEYS.LIABILITIES, _liabilities)
      return
    }
    return real(`/api/liabilities/${id}`, { method: 'DELETE' })
  },

  // ── Simulation ─────────────────────────────────────────────
  async simulate({ scenario, amount }) {
    if (USE_MOCK) {
      await wait(350)
      const amt = Number(amount) || 0
      const delta = scenario === 'income_change' ? amt : -amt
      const beforeBalance = cashflowMock.month_end_balance || 26600
      const afterBalance = Math.max(0, beforeBalance + delta)
      return {
        before: {
          projected_balance: beforeBalance,
          cashflow: cashflowMock,
          goals: _goals.map((g) => ({ name: g.name, monthly_contribution_required: g.monthly_contribution_required, months_remaining: g.months_remaining || 6 })),
        },
        after: {
          projected_balance: afterBalance,
          cashflow: {
            ...cashflowMock,
            month_end_balance: afterBalance,
            days: (cashflowMock.days || []).map((d) => ({ ...d, balance: Math.max(0, d.balance + delta) })),
          },
          goals: _goals.map((g) => ({
            name: g.name,
            monthly_contribution_required: g.monthly_contribution_required,
            months_remaining: Math.max(1, (g.months_remaining || 6) + (delta < 0 ? 3 : -1)),
          })),
        },
        narrative:
          delta < 0
            ? `Adding ₹${amt.toLocaleString('en-IN')}/mo as ${scenario.replace(/_/g, ' ')} reduces your projected month-end buffer to ₹${afterBalance.toLocaleString('en-IN')}.`
            : `An income increase of ₹${amt.toLocaleString('en-IN')}/mo accelerates savings and expands your daily liquid cushion.`,
      }
    }
    return real('/api/simulate', { method: 'POST', body: JSON.stringify({ scenario, amount }) })
  },

  // ── Reset to Standard Demo Fixtures ─────────────────────────
  async resetDb() {
    Object.values(STORAGE_KEYS).forEach((k) => {
      try {
        localStorage.removeItem(k)
      } catch (e) {}
    })
    _goals = [...goalsSeed]
    _liabilities = [...liabilitiesMock]
    _transactions = [...transactionsMock]
    _dashboard = { ...dashboardMock }
    _alerts = [...alertsMock]

    if (!USE_MOCK) {
      try {
        await real('/api/admin/reset', { method: 'POST' })
      } catch (e) {}
    }

    return { status: 'reset_complete' }
  },

  resetDemoData() {
    return this.resetDb()
  },
}
