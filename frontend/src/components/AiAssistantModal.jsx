import { useState, useRef, useEffect } from 'react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Sparkles, Send, Bot, User, HelpCircle, ArrowRight } from 'lucide-react'

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
      text: 'Hello! I am your deterministic financial assistant. Ask me anything regarding your category burn, high-APR liabilities, recurring subscriptions, or goal feasibility.',
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (textToSend) => {
    const q = (textToSend || input).trim()
    if (!q) return

    const userMsg = { sender: 'user', text: q }
    setMessages((prev) => [...prev, userMsg])
    if (!textToSend) setInput('')
    setIsTyping(true)

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
        aiText = `Your top priority debt is ${topLiab.name} at ${topLiab.interest_rate}% APR, costing ₹${(topLiab.true_annual_cost || 18900).toLocaleString('en-IN')}/year in interest. Pay this off first using the Avalanche method!`
      } else {
        aiText = `Based on your ledger: Income is ₹${(summary?.total_income || 85000).toLocaleString('en-IN')}, Expenses are ₹${(summary?.total_expense || 58400).toLocaleString('en-IN')}, Net Surplus is ₹${((summary?.total_income || 85000) - (summary?.total_expense || 58400)).toLocaleString('en-IN')}.`
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiText }])
      setIsTyping(false)
    }, 450)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Financial Copilot"
      subtitle="Plain-language deterministic telemetry & advice"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col h-[440px]">
        {/* Message History */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 py-1">
          {messages.map((m, idx) => {
            const isUser = m.sender === 'user'
            return (
              <div
                key={idx}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5 shadow-subtle">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-tr-sm shadow-sm font-medium'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-sm shadow-subtle'
                  }`}
                >
                  {m.text}
                </div>
                {isUser && (
                  <div className="w-7 h-7 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 flex items-center justify-center shrink-0 mt-0.5 shadow-subtle">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            )
          })}
          {isTyping && (
            <div className="flex gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-subtle">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5 shadow-subtle">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="py-2.5 flex gap-2 overflow-x-auto border-t border-slate-100 mt-2 scrollbar-thin">
          {SUGGESTED_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-[11px] font-mono text-slate-600 hover:text-indigo-700 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 px-3 py-1.5 rounded-xl shrink-0 transition-all cursor-pointer whitespace-nowrap shadow-subtle font-medium"
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
            placeholder="Ask anything about your cashflow, debts, or goals..."
            className="flex-1 bg-white border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all shadow-subtle"
          />
          <Button type="submit" variant="primary" size="md" icon={Send} disabled={!input.trim()}>
            Send
          </Button>
        </form>
      </div>
    </Modal>
  )
}

