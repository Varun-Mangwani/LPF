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
  ShieldCheck,
  Cpu,
  Layers,
  Wallet
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Footer } from '../components/ui/Footer'
import { Rupee3DSvg } from '../components/ui/Rupee3DSvg'
import { AnimatedBackground } from '../components/ui/AnimatedBackground'

const FAQS = [
  {
    q: 'How does LPF guarantee 100% mathematical precision?',
    a: 'Every metric — interest amortization, forward-looking 90-day cashflow cushions, required goal contributions — is calculated by deterministic Python algorithms. AI language models are used strictly for merchant normalization and narrative explanations, never for underlying arithmetic.',
  },
  {
    q: 'What bank statement formats does LPF support?',
    a: 'LPF features an intelligent multi-column parser supporting bank CSV exports from HDFC, ICICI, SBI, Axis, Kotak, Chase, and generic standard formats, automatically reconciling debit/credit splits and multi-standard date formats.',
  },
  {
    q: 'How does the Debt Avalanche methodology minimize my interest loss?',
    a: 'Unlike standard snowball methods that prioritize smallest principal balances, our Avalanche engine ranks debt strictly by Annual Percentage Rate (APR). Eliminating a 42% credit card before a 9% student loan eliminates thousands in compounding finance charges.',
  },
  {
    q: 'Is my financial data kept strictly private and self-contained?',
    a: 'Yes. All parsing, categorization, and ledger calculations execute in your own local environment. We do not transmit or sell raw transaction records or banking credentials to external clouds.',
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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 selection:bg-indigo-500 selection:text-white flex flex-col font-sans overflow-x-hidden">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center shadow-subtle">
              <Wallet className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl font-bold tracking-tight text-slate-900">
                  Ledger Personal Finance
                </span>
                <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full uppercase tracking-wider">
                  v2.0 PRO
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 font-mono text-xs uppercase tracking-wider text-slate-600 font-semibold">
            <a href="#features" className="hover:text-slate-900 transition-colors">
              Features
            </a>
            <a href="#calculator" className="hover:text-slate-900 transition-colors">
              Avalanche Calculator
            </a>
            <a href="#faqs" className="hover:text-slate-900 transition-colors">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/upload')}
              variant="primary"
              size="md"
              icon={ArrowRight}
            >
              Launch App
            </Button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-20 pb-28 overflow-hidden min-h-[88vh] flex items-center">
        <AnimatedBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy Column */}
            <div className="lg:col-span-7 text-left space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 border border-indigo-200/80 text-indigo-700 font-mono text-xs uppercase tracking-wider font-semibold shadow-subtle backdrop-blur-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Deterministic Financial Architecture</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.08]"
              >
                Algorithmic Clarity for <br />
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                  Personal Wealth Operations
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed"
              >
                Ledger Personal Finance (LPF) ingests multi-bank statements, categorizes burn rates, ranks high-interest liabilities by APR Avalanche, and stress-tests what-if life moves — with 100% mathematical integrity.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-center gap-4"
              >
                <Button
                  onClick={() => navigate('/upload')}
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full sm:w-auto"
                >
                  Start Ledger Onboarding
                </Button>

                <Button
                  onClick={() => navigate('/dashboard')}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Explore Demo Ledger
                </Button>
              </motion.div>
            </div>

            {/* Right Interactive Card Preview */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3 }}
                className="relative rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-card hover:shadow-card-hover backdrop-blur-xl overflow-hidden"
              >
                <div className="absolute -top-6 -right-6 w-32 h-32 pointer-events-none z-20">
                  <motion.img
                    src="/rupee_3d.png"
                    alt="3D Rupee Coin"
                    className="w-full h-full object-contain drop-shadow-xl"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 4, -4, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut',
                    }}
                  />
                </div>

                <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                  <div className="flex items-center gap-2">
                    <Rupee3DSvg size={28} variant="gold" animate={false} />
                    <span className="font-mono text-xs text-slate-700 font-bold tracking-wider uppercase">
                      Executive Ledger Summary
                    </span>
                  </div>
                  <Badge variant="emerald" pulse>Deterministic</Badge>
                </div>

                {/* Stat blocks */}
                <div className="space-y-3.5">
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between shadow-subtle">
                    <div>
                      <p className="font-mono text-xs uppercase text-emerald-700 font-semibold">Monthly Net Inflow</p>
                      <p className="font-mono text-2xl font-bold text-slate-900 mt-0.5">₹85,000</p>
                    </div>
                    <Rupee3DSvg size={36} variant="emerald" />
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-between shadow-subtle">
                    <div>
                      <p className="font-mono text-xs uppercase text-slate-500 font-semibold">Monthly Outflow</p>
                      <p className="font-mono text-2xl font-bold text-slate-900 mt-0.5">₹58,400</p>
                    </div>
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-mono font-bold text-slate-600 shadow-subtle">
                      ↓
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between shadow-subtle">
                    <div>
                      <p className="font-mono text-xs uppercase text-indigo-700 font-semibold">Avalanche Interest Saved</p>
                      <p className="font-mono text-2xl font-bold text-indigo-700 mt-0.5">₹18,900 / yr</p>
                    </div>
                    <Rupee3DSvg size={36} variant="gold" />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Stats Strip */}
      <section className="bg-white border-y border-slate-200/80 py-12 relative z-10 shadow-subtle">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col items-center">
            <Rupee3DSvg size={40} variant="gold" className="mb-2" />
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900">₹45M+</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Parsed Ledger Volume</p>
          </div>

          <div className="flex flex-col items-center">
            <Rupee3DSvg size={40} variant="emerald" className="mb-2" />
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600">100%</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Mathematical Precision</p>
          </div>

          <div className="flex flex-col items-center">
            <Rupee3DSvg size={40} variant="indigo" className="mb-2" />
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-indigo-600">42.0%</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Maximum APR Mitigated</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg mb-2 shadow-subtle">
              <Zap className="w-5 h-5" />
            </div>
            <p className="font-mono text-3xl sm:text-4xl font-extrabold text-slate-900">&lt; 2s</p>
            <p className="font-mono text-xs uppercase tracking-wider text-slate-500 mt-1 font-semibold">Statement Parse Latency</p>
          </div>
        </div>
      </section>

      {/* 4. Core Features Showcase */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="indigo" className="mb-3">Transparent Financial Architecture</Badge>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900">
            Built for Absolute Financial Truth
          </h2>
          <p className="text-slate-600 mt-3 font-sans text-base">
            Every metric incorporates expandable telemetry revealing the exact underlying formulas, dates, and numbers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <Card className="h-full flex flex-col justify-between p-8 space-y-5 border-slate-200/80 bg-white shadow-card hover:shadow-card-hover hover:border-emerald-300 transition-all hover:scale-[1.01]" hover={false}>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shadow-subtle">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <Rupee3DSvg size={36} variant="emerald" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-slate-900">Universal Statement Parser</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Reconciles split debit/credit columns, normalizes multi-standard dates (DD/MM/YYYY vs MM/DD/YYYY), and extracts merchant identities from noisy UPI/NEFT strings.
              </p>
            </div>
          </Card>

          <Card className="h-full flex flex-col justify-between p-8 space-y-5 border-slate-200/80 bg-white shadow-card hover:shadow-card-hover hover:border-indigo-300 transition-all hover:scale-[1.01]" hover={false}>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-subtle">
                <TrendingUp className="w-6 h-6" />
              </div>
              <Rupee3DSvg size={36} variant="gold" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-slate-900">Debt Avalanche Engine</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Ranks all liabilities descending by APR, computing the exact annual compounding finance charges to eliminate expensive debt first.
              </p>
            </div>
          </Card>

          <Card className="h-full flex flex-col justify-between p-8 space-y-5 border-slate-200/80 bg-white shadow-card hover:shadow-card-hover hover:border-purple-300 transition-all hover:scale-[1.01]" hover={false}>
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shadow-subtle">
                <PieIcon className="w-6 h-6" />
              </div>
              <Rupee3DSvg size={36} variant="indigo" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-xl font-bold text-slate-900">50/30/20 Dynamic Framework</h3>
              <p className="mt-2.5 text-sm text-slate-600 leading-relaxed">
                Monitors monthly burn against optimal benchmarks for Needs (50%), Wants (30%), and Future Savings (20%) with luminous telemetry meters.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Interactive Debt Avalanche Interest Calculator */}
      <section id="calculator" className="bg-slate-50/70 py-20 border-t border-slate-200/80 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 border-slate-200/80 bg-white shadow-card relative overflow-hidden" hover={false}>
            <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-5">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shadow-subtle">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-slate-900">
                  Interactive Debt Drag Calculator
                </h3>
                <p className="font-mono text-xs text-slate-500 mt-0.5">
                  Simulate compounding annual interest outflow based on APR rate
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 relative z-10">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    Outstanding Balance
                  </label>
                  <span className="font-mono text-sm font-bold text-slate-900 tabular">
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
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-mono text-xs uppercase tracking-wider text-slate-600 font-semibold">
                    Annual APR Interest Rate
                  </label>
                  <span className="font-mono text-sm font-bold text-indigo-600 tabular">
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
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10 shadow-subtle">
              <div className="flex items-center gap-4">
                <Rupee3DSvg size={48} variant="gold" />
                <div>
                  <p className="font-mono text-xs uppercase font-semibold text-slate-500">True Annual Interest Burn</p>
                  <p className="font-mono text-3xl font-extrabold text-indigo-700 tabular">
                    ₹{annualCost.toLocaleString('en-IN')} / yr
                  </p>
                </div>
              </div>
              <Button
                onClick={() => navigate('/liabilities')}
                variant="primary"
                size="lg"
                icon={ArrowRight}
                className="shrink-0"
              >
                Clear Debt via Avalanche
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. FAQ Accordion Section */}
      <section id="faqs" className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <Badge variant="indigo" className="mb-3">Frequently Asked Questions</Badge>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">Transparency First</h2>
          <p className="text-slate-500 mt-2 font-mono text-xs uppercase tracking-wider font-semibold">
            Everything you need to know about LPF deterministic accounting
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <Card key={idx} className="p-0 border-slate-200/80 bg-white shadow-card overflow-hidden" hover={false}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full px-6 py-5 text-left font-display text-base font-semibold text-slate-900 flex items-center justify-between hover:bg-slate-50/80 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-indigo-600' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-6 pb-5 font-sans text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.a}
                </div>
              )}
            </Card>
          ))}
        </div>
      </section>

      {/* 7. Call to Action Banner */}
      <section className="bg-white py-20 text-center relative z-10 border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 space-y-6">
          <div className="flex justify-center">
            <Rupee3DSvg size={64} variant="gold" />
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold text-slate-900">
            Ready to Take Command of Your Ledger?
          </h2>
          <p className="text-slate-600 max-w-xl mx-auto font-sans text-base leading-relaxed">
            Ingest your statement in seconds and gain mathematical clarity across your net cashflow, liabilities, and goal timelines.
          </p>
          <Button
            onClick={() => navigate('/upload')}
            variant="primary"
            size="lg"
            icon={ArrowRight}
          >
            Launch Free Application
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}

