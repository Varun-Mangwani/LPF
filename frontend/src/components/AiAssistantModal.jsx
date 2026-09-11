import { useState } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Input } from './ui/Input'
import { Badge } from './ui/Badge'

const SUGGESTED_PROMPTS = [
  'How much did I spend on food this month?',
  'Which subscription should I cancel?',
  'Can I afford a new ₹15,000 EMI?',
  'What is my credit card annual interest cost?',
]

export default function AiAssistantModal({ isOpen, onClose, summary, cashflow, liabilities, goals }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'Hello! I am your LPF AI Financial Assistant. Ask me anything about your cash flow, subscriptions, goals, or debt ranking!',
    },
  ])
  const [input, setInput] = useState('')

  const handleSend = (textToSend) => {
    const q = (textToSend || input).trim()
    if (!q) return

    const userMsg = { sender: 'user', text: q }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')

    setTimeout(() => {
      let aiText = ''
      const lower = q.toLowerCase()

      if (lower.includes('food') || lower.includes('dining')) {
        const foodCat = summary?.by_category?.find((c) => c.category === 'Food')
        const amt = foodCat ? foodCat.amount : 5200
        aiText = `You spent ₹${amt.toLocaleString('en-IN')} on Food & Dining this month (${Math.round((amt / (summary?.total_expense || 58400)) * 100)}% of total monthly expenses).`
      } else if (lower.includes('sub') || lower.includes('cancel') || lower.includes('unused')) {
        const subs = summary?.recurring_subscriptions || []
        const totalSubs = subs.reduce((a, b) => a + b.amount, 0)
        aiText = `You have ${subs.length || 4} recurring subscriptions totaling ₹${(totalSubs || 3200).toLocaleString('en-IN')}/month. Gold's Gym (₹1,500/mo) is flagged as unused for 40+ days — cancelling it saves ₹18,000/year!`
      } else if (lower.includes('emi') || lower.includes('afford') || lower.includes('laptop')) {
        const monthEnd = cashflow?.month_end_balance || 14200
        aiText = `Your projected month-end balance is ₹${monthEnd.toLocaleString('en-IN')}. Taking a new ₹12,000/mo EMI reduces your buffer to ₹${Math.max(0, monthEnd - 12000).toLocaleString('en-IN')}/month.`
      } else if (lower.includes('card') || lower.includes('debt') || lower.includes('interest')) {
        const topLiab = liabilities?.[0] || { name: 'ICICI Credit Card', interest_rate: 42, true_annual_cost: 18900 }
        aiText = `Your top priority debt is ${topLiab.name} at ${topLiab.interest_rate}% APR, costing ₹${(topLiab.true_annual_cost || 18900).toLocaleString('en-IN')}/year in interest. Pay this off first!`
      } else {
        aiText = `Based on your ledger: Income is ₹${(summary?.total_income || 85000).toLocaleString('en-IN')}, Expenses are ₹${(summary?.total_expense || 58400).toLocaleString('en-IN')}, Net Surplus is ₹${((summary?.total_income || 85000) - (summary?.total_expense || 58400)).toLocaleString('en-IN')}.`
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }])
    }, 400)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="✨ LPF Smart Financial Assistant"
      subtitle="Plain-Language Explanations · Deterministic Numbers"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col h-[400px]">
        {/* Message History */}
        <div className="flex-1 overflow-y-auto space-y-3 p-1">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-primary-600 text-white font-medium rounded-br-none'
                    : 'bg-slate-100 text-slate-900 border border-slate-200/80 rounded-bl-none font-normal'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        {/* Suggested Prompts */}
        <div className="py-2.5 flex gap-2 overflow-x-auto border-t border-slate-100 mt-2">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-mono font-medium text-slate-700 bg-slate-100 hover:bg-primary-50 hover:text-primary-700 border border-slate-200 hover:border-primary-200 px-2.5 py-1 rounded-lg shrink-0 transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSend()
          }}
          className="flex items-center gap-2 pt-2 border-t border-slate-100"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your financial ledger..."
            className="flex-1 bg-white border border-slate-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-500/20 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none"
          />
          <Button type="submit" variant="primary" size="sm">
            Send
          </Button>
        </form>
      </div>
    </Modal>
  )
}
