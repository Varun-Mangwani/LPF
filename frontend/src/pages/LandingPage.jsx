import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  PieChart as PieIcon,
  Calculator,
  ArrowRight,
  Sparkles,
  ChevronDown,
  FileSpreadsheet,
  CheckCircle2,
  Shield,
  Zap,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Footer } from '../components/ui/Footer'
import { Rupee3DSvg } from '../components/ui/Rupee3DSvg'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'

const FAQS = [
  {
    q: 'How does LPF guarantee 100% mathematical accuracy?',
    a: 'Every figure — interest rates, daily cash flow projections, required goal contributions — is calculated by deterministic Python algorithms in our core engine. LLM AI is used exclusively for merchant text categorization and plain-language narrations, never for arithmetic.',
  },
  {
    q: 'What bank statement formats does LPF support?',
    a: 'LPF features an intelligent universal parser supporting multi-column bank CSVs (SBI, HDFC, ICICI, Axis, Kotak, Chase, etc.) with automatic date normalization and narration cleaning.',
  },
  {
    q: 'How does the Debt Avalanche ranking save me money?',
    a: 'Unlike standard snowball methods, the Avalanche engine sorts liabilities descending by annual interest rate. Clearing your 42% interest credit card before your 11% car loan minimizes total cash outflow.',
  },
  {
    q: 'Is my financial statement data private and secure?',
    a: 'Yes. All data processing occurs locally in memory and within your isolated database environment. We never sell, transmit, or retain your raw banking credentials.',
  },
]

export default function LandingPage() {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  // Interactive Calculator State
  const [calcBalance, setCalcBalance] = useState(50000)
  const [calcRate, setCalcRate] = useState(36)
  const annualCost = Math.round(calcBalance * (calcRate / 100))

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950 flex flex-col font-body overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/lpf_logo.jpg"
              alt="LPF Logo"
              className="w-10 h-10 rounded-xl shadow-md border border-amber-500/30 bg-white object-contain"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-white">
                  Ledger Personal Finance
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded uppercase tracking-wider">
                  v1.0
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold">
            <a href="#features" className="hover:text-amber-400 transition-colors">
              Features
            </a>
            <a href="#calculator" className="hover:text-amber-400 transition-colors">
              Avalanche Calculator
            </a>
            <a href="#faqs" className="hover:text-amber-400 transition-colors">
              FAQs
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/upload')}
              variant="emerald"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              className="shadow-glow-emerald"
            >
              Launch App
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Animated Background & 3D Rupee Graphics */}
      <section className="relative pt-20 pb-28 overflow-hidden min-h-[90vh] flex items-center">
        <AnimatedBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              {/* Animated Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 font-mono text-xs uppercase tracking-wider font-bold shadow-lg backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>100% Deterministic Accounting Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]"
              >
                Precision Cashflow & <br />
                <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-indigo-400 bg-clip-text text-transparent">
                  3D Rupee Wealth Intelligence
                </span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-xl text-slate-300 max-w-2xl leading-relaxed"
              >
                Ledger Personal Finance (LPF) ingests your bank statements, auto-categorizes transactions, ranks debt by true interest cost via Debt Avalanche, and models what-if scenarios — with zero arithmetic guesswork.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-center gap-4"
              >
                <button
                  onClick={() => navigate('/upload')}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-xl font-bold shadow-glow-indigo transition-all active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <span>Start Interactive Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto bg-slate-900/90 hover:bg-slate-800 text-white border border-slate-700 font-mono text-sm uppercase tracking-widest px-8 py-4 rounded-xl font-bold shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View Live Dashboard</span>
                </button>
              </motion.div>
            </div>

            {/* Right Interactive 3D Coin & System Preview Card */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative rounded-3xl border border-amber-500/30 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl overflow-hidden"
              >
                {/* Floating 3D Rupee Image Highlight */}
                <div className="absolute -top-6 -right-6 w-32 h-32 pointer-events-none z-20">
                  <motion.img
                    src="/rupee_3d.png"
                    alt="3D Rupee Coin"
                    className="w-full h-full object-contain drop-shadow-2xl"
                    animate={{
                      y: [0, -12, 0],
                      rotate: [0, 6, -6, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
                  <div className="flex items-center gap-2">
                    <Rupee3DSvg size={32} variant="gold" animate={false} />
                    <span className="font-mono text-xs text-amber-400 font-bold tracking-wider uppercase">
                      LPF Financial Suite
                    </span>
                  </div>
                  <Badge variant="emerald" dot={true}>Verified Math</Badge>
                </div>

                {/* Hero Stat Blocks */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-emerald-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase text-emerald-400 font-bold">Monthly Take-Home</p>
                      <p className="font-display text-2xl font-extrabold text-white">₹85,000</p>
                    </div>
                    <Rupee3DSvg size={40} variant="emerald" />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-rose-500/30 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase text-rose-400 font-bold">Monthly Expenses</p>
                      <p className="font-display text-2xl font-extrabold text-white">₹58,400</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-mono font-bold text-rose-400">
                      ↓
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-indigo-500/10 border border-amber-500/40 flex items-center justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase text-amber-300 font-bold">Avalanche Interest Saved</p>
                      <p className="font-display text-2xl font-extrabold text-amber-400">₹18,900 / yr</p>
                    </div>
                    <Rupee3DSvg size={40} variant="gold" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Counter Banner with Complementary Contrast */}
      <section className="bg-slate-900 border-y border-slate-800 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Rupee3DSvg size={48} variant="gold" className="mb-2" />
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400">₹45M+</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Ledger Ingestion</p>
          </div>

          <div className="flex flex-col items-center">
            <Rupee3DSvg size={48} variant="emerald" className="mb-2" />
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-emerald-400">100%</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Deterministic Accuracy</p>
          </div>

          <div className="flex flex-col items-center">
            <Rupee3DSvg size={48} variant="indigo" className="mb-2" />
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-indigo-400">42.0%</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Max APR Avoided</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xl mb-2">
              ⚡
            </div>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-amber-400">&lt; 2 sec</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400 mt-1 font-semibold">Statement Parse Time</p>
          </div>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="indigo" className="mb-3">Explainable Financial Engine</Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Built for Total Financial Clarity
          </h2>
          <p className="text-slate-400 mt-3 font-body text-base">
            Every card features an expandable "Why?" ledger breakdown disclosing the exact numbers behind every headline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-slate-900/80 border-slate-800 hover:border-emerald-500/50 p-8 space-y-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <Rupee3DSvg size={40} variant="emerald" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">Universal Statement Parser</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Auto-detects split debit/credit columns, standardizes multi-format bank dates (SBI, HDFC, ICICI), and cleans complex UPI/NEFT narration text.
            </p>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800 hover:border-amber-500/50 p-8 space-y-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-7 h-7" />
              </div>
              <Rupee3DSvg size={40} variant="gold" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">Debt Avalanche Intelligence</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Sorts credit card balances by APR annual interest rate, calculating exact rupee interest savings by clearing high-cost debt first.
            </p>
          </Card>

          <Card className="bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 p-8 space-y-5 transition-all hover:scale-[1.02]">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
                <PieIcon className="w-7 h-7" />
              </div>
              <Rupee3DSvg size={40} variant="indigo" />
            </div>
            <h3 className="font-display text-2xl font-bold text-white">50/30/20 Budget Target Health</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Measures monthly spending against target benchmarks for Essentials (50%), Wants (30%), and Savings (20%) with live progress bars.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Interactive Debt Avalanche Interest Calculator */}
      <section id="calculator" className="bg-slate-900/90 py-20 border-t border-slate-800 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-slate-950 border-amber-500/30 shadow-2xl relative overflow-hidden">
            {/* Background 3D Rupee Glow */}
            <div className="absolute -bottom-10 -right-10 opacity-20 pointer-events-none">
              <Rupee3DSvg size={220} variant="gold" animate={false} />
            </div>

            <div className="flex items-center gap-4 mb-8 border-b border-slate-800 pb-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-white">
                  Interactive Credit Card Interest Calculator
                </h3>
                <p className="font-mono text-xs text-slate-400">
                  Calculate your true annual interest cost before starting the Debt Avalanche payoff.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">
                    Credit Card Balance
                  </label>
                  <span className="font-mono text-sm font-bold text-amber-400 tabular">
                    ₹{calcBalance.toLocaleString('en-IN')}
                  </span>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="200000"
                  step="5000"
                  value={calcBalance}
                  onChange={(e) => setCalcBalance(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">
                    Annual Interest Rate (APR)
                  </label>
                  <span className="font-mono text-sm font-bold text-amber-400 tabular">
                    {calcRate}%
                  </span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="48"
                  step="1"
                  value={calcRate}
                  onChange={(e) => setCalcRate(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-800 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/20 via-slate-900 to-indigo-500/20 border border-amber-500/40 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-4">
                <Rupee3DSvg size={56} variant="gold" />
                <div>
                  <p className="font-mono text-xs uppercase font-bold text-amber-300">True Annual Interest Outflow</p>
                  <p className="font-display text-3xl font-extrabold text-amber-400 tabular">
                    ₹{annualCost.toLocaleString('en-IN')} / year
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/liabilities')}
                variant="emerald"
                size="lg"
                className="shrink-0"
              >
                Clear Debt via Avalanche →
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section id="faqs" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="amber" className="mb-3">Got Questions?</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
          <p className="text-slate-400 mt-2 font-mono text-xs uppercase tracking-wider font-bold">
            Everything you need to know about LPF deterministic accounting
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <Card key={idx} className="p-0 bg-slate-900/90 border-slate-800 overflow-hidden" hover={false}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 text-left font-display text-lg font-bold text-white flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-amber-400 transition-transform ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 font-body text-sm text-slate-300 leading-relaxed border-t border-slate-800 pt-4">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Call to Action Banner */}
      <section className="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-20 text-center relative z-10 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="flex justify-center">
            <Rupee3DSvg size={72} variant="gold" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-white">
            Ready for Explainable Personal Finance?
          </h2>
          <p className="text-slate-300 max-w-xl mx-auto font-body text-base leading-relaxed">
            Import your bank statement in seconds and gain immediate mathematical clarity into cashflow, goal timelines, and debt payoff.
          </p>
          <Button
            onClick={() => navigate('/upload')}
            variant="emerald"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="shadow-glow-emerald"
          >
            Launch Free App Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
