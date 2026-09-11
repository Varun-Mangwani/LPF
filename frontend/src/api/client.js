/**
 * api/client.js — Single place that decides mock vs real backend.
 *
 * Set VITE_USE_MOCK=true in .env to use bundled JSON fixtures.
 * Set VITE_USE_MOCK=false (or leave unset) to hit the real FastAPI backend.
 *
 * No component code needs to change when switching modes.
 */
import dashboardMock from '../mock/dashboard.json'
import cashflowMock  from '../mock/cashflow.json'
import goalsSeed     from '../mock/goals.json'
import liabilitiesMock from '../mock/liabilities.json'
import alertsMock    from '../mock/alerts.json'
import transactionsMock from '../mock/transactions.json'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
const USER_ID  = import.meta.env.VITE_USER_ID || '1'

const wait = (ms) => new Promise((res) => setTimeout(res, ms))

// In-memory mock goals list (allows add without reload)
let _goals = [...goalsSeed]
// In-memory mock liabilities
let _liabilities = [...liabilitiesMock]

function fallbackMock(path, options = {}) {
  const p = path.split('?')[0]
  if (p.includes('/api/dashboard/summary')) return dashboardMock
  if (p.includes('/api/cashflow')) return cashflowMock
  if (p.includes('/api/alerts')) return alertsMock
  if (p.includes('/api/goals')) {
    if (options.method === 'POST') {
      const g = JSON.parse(options.body || '{}')
      const created = { id: _goals.length + 1, ...g, months_remaining: 12, monthly_contribution_required: Math.round((g.target_amount || 10000) / 12) }
      _goals = [..._goals, created]
      return created
    }
    return _goals
  }
  if (p.includes('/api/liabilities')) {
    if (options.method === 'POST') {
      const l = JSON.parse(options.body || '{}')
      const created = { id: _liabilities.length + 1, ...l, true_annual_cost: (l.balance || 0) * ((l.interest_rate || 0) / 100), priority_rank: 1 }
      _liabilities = [..._liabilities, created]
      return created
    }
    return _liabilities
  }
  if (p.includes('/api/transactions')) return transactionsMock
  if (p.includes('/api/simulate')) {
    const { scenario, amount } = JSON.parse(options.body || '{}')
    const delta = scenario === 'income_change' ? Number(amount) : -Number(amount)
    const beforeBal = cashflowMock.month_end_balance || 14200
    const afterBal = Math.max(0, beforeBal + delta)
    return {
      before: { projected_balance: beforeBal, cashflow: cashflowMock, goals: goalsSeed },
      after: { projected_balance: afterBal, cashflow: { ...cashflowMock, month_end_balance: afterBal }, goals: goalsSeed },
      narrative: delta < 0
        ? `Adding ₹${Number(amount).toLocaleString('en-IN')}/mo reduces your projected buffer to ₹${afterBal.toLocaleString('en-IN')}.`
        : `An income addition of ₹${Number(amount).toLocaleString('en-IN')}/mo enhances runway and accelerates debt payoff.`
    }
  }
  return {}
}

/** Fetch wrapper for real backend calls with auto fallback */
async function real(path, options = {}) {
  try {
    const separator = path.includes('?') ? '&' : '?'
    const url = `${BASE_URL}${path}${separator}user_id=${USER_ID}`
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), 2500)
    const res = await fetch(url, {
      signal: controller.signal,
      headers: options.body instanceof FormData
        ? {}  // let browser set multipart boundary
        : { 'Content-Type': 'application/json' },
      ...options,
    })
    clearTimeout(timer)
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail?.detail || `${options.method || 'GET'} ${path} → ${res.status}`)
    }
    return res.json()
  } catch (err) {
    console.warn(`[LPF Engine] Backend call to ${path} failed (${err.message}). Using mock data.`)
    return fallbackMock(path, options)
  }
}

// ─────────────────────────────────────────────────────────────
// API methods
// ─────────────────────────────────────────────────────────────

export const api = {
  // ── Upload ──────────────────────────────────────────────
  async uploadCsv(file) {
    if (USE_MOCK) {
      await wait(900)
      return { inserted: transactionsMock.length, categorized_by_rule: 12, categorized_by_llm: 2, recurring_detected: 6 }
    }
    const form = new FormData()
    form.append('file', file)
    const res = await fetch(`${BASE_URL}/api/upload?user_id=${USER_ID}`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}))
      throw new Error(detail?.detail || `Upload failed: ${res.status}`)
    }
    return res.json()
  },

  // ── Transactions ─────────────────────────────────────────
  async getTransactions({ category, month } = {}) {
    if (USE_MOCK) {
      await wait(200)
      return transactionsMock
    }
    let qs = ''
    if (category) qs += `&category=${encodeURIComponent(category)}`
    if (month)    qs += `&month=${encodeURIComponent(month)}`
    return real(`/api/transactions?${qs}`)
  },

  async patchTransaction(id, patch) {
    if (USE_MOCK) {
      await wait(200)
      return transactionsMock.find(t => t.id === id)
    }
    return real(`/api/transactions/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
  },

  // ── Dashboard ────────────────────────────────────────────
  async getDashboardSummary() {
    if (USE_MOCK) {
      await wait(300)
      return dashboardMock
    }
    return real('/api/dashboard/summary')
  },

  // ── Cashflow ─────────────────────────────────────────────
  async getCashflow(month, startBalance) {
    if (USE_MOCK) {
      await wait(300)
      return cashflowMock
    }
    let qs = ''
    if (month)        qs += `&month=${encodeURIComponent(month)}`
    if (startBalance) qs += `&start_balance=${startBalance}`
    return real(`/api/cashflow?${qs}`)
  },

  // ── Alerts ───────────────────────────────────────────────
  async getAlerts() {
    if (USE_MOCK) {
      await wait(250)
      return alertsMock
    }
    return real('/api/alerts')
  },

  async generateAlerts() {
    if (USE_MOCK) {
      await wait(400)
      return alertsMock
    }
    return real('/api/alerts/generate', { method: 'POST' })
  },

  // ── Goals ────────────────────────────────────────────────
  async getGoals() {
    if (USE_MOCK) {
      await wait(250)
      return _goals
    }
    return real('/api/goals')
  },

  async createGoal(goal) {
    if (USE_MOCK) {
      await wait(400)
      const monthsLeft = Math.max(
        1,
        Math.round((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24 * 30))
      )
      const created = {
        id: _goals.length + 1,
        user_id: 1,
        created_at: new Date().toISOString(),
        ...goal,
        monthly_contribution_required: Math.round((goal.target_amount - (goal.current_amount || 0)) / monthsLeft),
        months_remaining: monthsLeft,
      }
      _goals = [..._goals, created]
      return created
    }
    return real('/api/goals', { method: 'POST', body: JSON.stringify(goal) })
  },

  async updateGoal(id, goal) {
    if (USE_MOCK) {
      await wait(300)
      const monthsLeft = Math.max(
        1,
        Math.round((new Date(goal.target_date) - new Date()) / (1000 * 60 * 60 * 24 * 30))
      )
      _goals = _goals.map((g) =>
        g.id === id
          ? { ...g, ...goal, monthly_contribution_required: Math.round((goal.target_amount - (goal.current_amount || 0)) / monthsLeft), months_remaining: monthsLeft }
          : g
      )
      return _goals.find((g) => g.id === id)
    }
    return real(`/api/goals/${id}`, { method: 'PUT', body: JSON.stringify(goal) })
  },

  async deleteGoal(id) {
    if (USE_MOCK) {
      await wait(200)
      _goals = _goals.filter((g) => g.id !== id)
      return
    }
    return real(`/api/goals/${id}`, { method: 'DELETE' })
  },

  // ── Liabilities ──────────────────────────────────────────
  async getLiabilities() {
    if (USE_MOCK) {
      await wait(300)
      return _liabilities
    }
    return real('/api/liabilities')
  },

  async createLiability(liability) {
    if (USE_MOCK) {
      await wait(400)
      const true_annual_cost = liability.balance * (liability.interest_rate / 100)
      const created = { id: _liabilities.length + 1, user_id: 1, ...liability, true_annual_cost, priority_rank: 1, reasoning: '' }
      _liabilities = [..._liabilities, created]
      return created
    }
    return real('/api/liabilities', { method: 'POST', body: JSON.stringify(liability) })
  },

  async deleteLiability(id) {
    if (USE_MOCK) {
      await wait(200)
      _liabilities = _liabilities.filter((l) => l.id !== id)
      return
    }
    return real(`/api/liabilities/${id}`, { method: 'DELETE' })
  },

  // ── Simulation ────────────────────────────────────────────
  async simulate({ scenario, amount }) {
    if (USE_MOCK) {
      await wait(700)
      // Build a simple mock before/after from cashflow data
      const days = cashflowMock.days || []
      const delta = scenario === 'income_change' ? amount : -amount
      const beforeBalance = cashflowMock.month_end_balance || 14200
      const afterBalance = Math.max(0, beforeBalance + delta)
      return {
        before: {
          projected_balance: beforeBalance,
          cashflow: cashflowMock,
          goals: goalsSeed.map(g => ({ name: g.name, monthly_contribution_required: g.monthly_contribution_required, months_remaining: g.months_left })),
        },
        after: {
          projected_balance: afterBalance,
          cashflow: { ...cashflowMock, month_end_balance: afterBalance, days: days.map(d => ({ ...d, balance: Math.max(0, d.balance + delta) })) },
          goals: goalsSeed.map(g => ({ name: g.name, monthly_contribution_required: g.monthly_contribution_required, months_remaining: g.months_left + (delta < 0 ? 3 : -1) })),
        },
        narrative:
          delta < 0
            ? `Adding ₹${amount.toLocaleString('en-IN')}/mo as ${scenario.replace(/_/g, ' ')} drops your projected month-end buffer by ₹${Math.abs(delta).toLocaleString('en-IN')} and may push goal timelines out.`
            : `An income increase of ₹${amount.toLocaleString('en-IN')}/mo lifts your month-end balance and accelerates your goal timelines.`,
      }
    }
    return real('/api/simulate', { method: 'POST', body: JSON.stringify({ scenario, amount }) })
  },

  // ── Admin ─────────────────────────────────────────────────
  async resetDb() {
    if (USE_MOCK) {
      _goals = [...goalsSeed]
      _liabilities = [...liabilitiesMock]
      return { status: 'reset_complete' }
    }
    return real('/api/admin/reset', { method: 'POST' })
  },
}
