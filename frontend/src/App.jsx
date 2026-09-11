import { useState } from 'react'
import { NavLink, Route, Routes, useLocation, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  UploadCloud,
  ReceiptText,
  BellRing,
  Target,
  ShieldAlert,
  SlidersHorizontal,
  Sparkles,
  Menu,
  X,
  Search,
  Bell,
  ArrowUpRight,
  ShieldCheck,
  ChevronRight,
  Wallet
} from 'lucide-react'
import LandingPage      from './pages/LandingPage.jsx'
import UploadPage       from './pages/UploadPage.jsx'
import DashboardPage    from './pages/DashboardPage.jsx'
import GoalsPage        from './pages/GoalsPage.jsx'
import LiabilitiesPage  from './pages/LiabilitiesPage.jsx'
import SimulationPage   from './pages/SimulationPage.jsx'
import TransactionsPage from './pages/TransactionsPage.jsx'
import AlertsPage       from './pages/AlertsPage.jsx'
import NotFoundPage     from './pages/NotFoundPage.jsx'
import AiAssistantModal from './components/AiAssistantModal.jsx'
import { Footer }       from './components/ui/Footer.jsx'

const NAV_GROUPS = [
  {
    title: 'INTELLIGENCE',
    items: [
      { to: '/dashboard',    label: 'Dashboard',    icon: LayoutDashboard, desc: 'Overview & 50/30/20' },
      { to: '/transactions', label: 'Transactions', icon: ReceiptText,     desc: 'Ledger records & rules' },
      { to: '/alerts',       label: 'Smart Alerts', icon: BellRing,        desc: 'Overspend & subscriptions' },
    ],
  },
  {
    title: 'STRATEGY & GROWTH',
    items: [
      { to: '/goals',        label: 'Savings Goals',icon: Target,          desc: 'Target timelines' },
      { to: '/liabilities',  label: 'Liabilities',  icon: ShieldAlert,     desc: 'Avalanche debt ranking' },
      { to: '/simulate',     label: 'Simulate',     icon: SlidersHorizontal, desc: 'What-if EMI & rent' },
    ],
  },
  {
    title: 'DATA INPUT',
    items: [
      { to: '/upload',       label: 'Statement Import', icon: UploadCloud, desc: 'CSV bank parse' },
    ],
  },
]

function Sidebar({ onOpenAi, mobileOpen, setMobileOpen }) {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full flex-col bg-white text-slate-900 border-r border-slate-200/80 transition-transform duration-300 ease-out shadow-sm ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-auto`}
        style={{ width: '280px', minWidth: '280px' }}
      >
        {/* Brand Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-indigo-100 shadow-subtle flex-shrink-0 bg-indigo-50 flex items-center justify-center p-1 group-hover:border-indigo-300 transition-colors">
              <img src="/lpf_logo.jpg" alt="LPF" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-display text-lg font-bold text-slate-900 leading-none tracking-tight">Ledger</p>
                <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-1.5 py-0.5 rounded-md uppercase tracking-wider">AI</span>
              </div>
              <p className="font-body text-xs text-slate-500 leading-none mt-1.5">Personal Finance</p>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items grouped */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <p className="px-3 text-[10px] uppercase font-bold tracking-[0.16em] text-slate-400 mb-2">
                {group.title}
              </p>
              {group.items.map((item) => {
                const IconComponent = item.icon
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-150 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-100/90 font-semibold shadow-subtle'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                            isActive
                              ? 'bg-indigo-100/80 text-indigo-700'
                              : 'text-slate-400 group-hover:text-slate-600 group-hover:bg-slate-100'
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`font-body text-xs leading-none truncate ${isActive ? 'text-indigo-900 font-semibold' : 'text-slate-700 font-medium'}`}>
                            {item.label}
                          </p>
                          <p className="font-body text-[11px] text-slate-400 mt-1 truncate">{item.desc}</p>
                        </div>
                        {isActive && (
                          <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>

        {/* AI Assistant Quick Launcher Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="relative p-4 rounded-2xl bg-gradient-to-b from-indigo-50/80 to-slate-50 border border-indigo-100 overflow-hidden shadow-subtle">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[11px] font-semibold text-indigo-800 uppercase tracking-wider">Deterministic AI</p>
            </div>
            <p className="text-xs text-slate-600 font-normal leading-relaxed mb-3">
              Ask questions about cash flow, spending spikes, or payoff schedules.
            </p>
            <button
              onClick={onOpenAi}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl transition-all shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask AI Copilot</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}

function TopBar({ onToggleMobile, onOpenAi }) {
  const location = useLocation()
  const currentPath = location.pathname

  const routeTitles = {
    '/dashboard':    'Financial Health Dashboard',
    '/transactions': 'Transactions & Ledger Records',
    '/alerts':       'Intelligence & Smart Alerts',
    '/goals':        'Savings Goals & Targets',
    '/liabilities':  'Debt Avalanche & Liabilities',
    '/simulate':     'What-If Scenario Simulator',
    '/upload':       'Bank Statement Import',
  }

  const currentTitle = routeTitles[currentPath] || 'Overview'

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-8 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-subtle">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobile}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500">
          <span>Ledger</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">{currentTitle}</span>
        </div>
        <div className="sm:hidden font-display text-sm font-bold text-slate-900 truncate">
          {currentTitle}
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick search input */}
        <button
          onClick={onOpenAi}
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs text-slate-600 transition-colors cursor-pointer shadow-subtle"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Search transactions, EMI...</span>
          <kbd className="font-mono text-[10px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded font-bold">⌘K</kbd>
        </button>

        <Link
          to="/alerts"
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
          title="View Alerts"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
        </Link>

        <button
          onClick={onOpenAi}
          className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-subtle cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>
      </div>
    </header>
  )
}

function AppLayout({ children, onOpenAi }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  if (isHome) return <LandingPage />

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden relative">
      <Sidebar onOpenAi={onOpenAi} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        <TopBar onToggleMobile={() => setMobileOpen((v) => !v)} onOpenAi={onOpenAi} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
            {children}
          </div>
          <Footer />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const [aiOpen, setAiOpen] = useState(false)

  return (
    <AppLayout onOpenAi={() => setAiOpen(true)}>
      <Routes>
        <Route path="/"             element={<LandingPage />} />
        <Route path="/upload"       element={<UploadPage />} />
        <Route path="/dashboard"    element={<DashboardPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/alerts"       element={<AlertsPage />} />
        <Route path="/goals"        element={<GoalsPage />} />
        <Route path="/liabilities"  element={<LiabilitiesPage />} />
        <Route path="/simulate"     element={<SimulationPage />} />
        <Route path="*"             element={<NotFoundPage />} />
      </Routes>

      <AiAssistantModal isOpen={aiOpen} onClose={() => setAiOpen(false)} />
    </AppLayout>
  )
}

