import { useState } from 'react'
import { NavLink, Route, Routes, useLocation, Link } from 'react-router-dom'
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

const NAV = [
  { to: '/upload',       label: 'Upload & Import',      num: '01', icon: '↑', desc: 'Statement import' },
  { to: '/dashboard',    label: 'Dashboard',            num: '02', icon: '◎', desc: 'Overview & 50/30/20' },
  { to: '/transactions', label: 'Transactions',         num: '03', icon: '≡', desc: 'All transactions' },
  { to: '/alerts',       label: 'Alerts',               num: '04', icon: '⚡', desc: 'Smart alerts' },
  { to: '/goals',        label: 'Goals',                num: '05', icon: '◈', desc: 'Savings targets' },
  { to: '/liabilities',  label: 'Liabilities',          num: '06', icon: '⊖', desc: 'Debt ranking' },
  { to: '/simulate',     label: 'Simulate',             num: '07', icon: '⟳', desc: 'What-if scenarios' },
]

function Sidebar({ onOpenAi, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full z-40 flex flex-col bg-white border-r border-slate-200/80 transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}
        style={{ width: '236px', minWidth: '236px' }}
      >
        {/* Brand */}
        <div className="px-5 pt-7 pb-5 border-b border-slate-100">
          <Link to="/" className="flex items-center gap-3 group" onClick={() => setMobileOpen(false)}>
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-slate-200 shadow-subtle flex-shrink-0">
              <img src="/lpf_logo.jpg" alt="LPF" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-display text-base font-extrabold text-slate-900 leading-none tracking-tight">LPF</p>
              <p className="font-mono text-[9px] uppercase tracking-widest text-indigo-600 leading-none mt-0.5 font-semibold">Ledger Finance</p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`font-mono text-xs font-bold w-5 text-center tabular flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-300 group-hover:text-slate-400'}`}>
                    {item.num}
                  </span>
                  <span className="text-base leading-none flex-shrink-0">{item.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className={`font-mono text-xs font-semibold leading-none truncate ${isActive ? 'text-indigo-800' : 'text-slate-700'}`}>
                      {item.label}
                    </p>
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5 truncate">{item.desc}</p>
                  </div>
                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* AI Button */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={onOpenAi}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow-md"
          >
            <span>✨</span>
            Ask AI Assistant
          </button>
        </div>
      </aside>
    </>
  )
}

function TopBar({ onToggleMobile }) {
  return (
    <header className="sticky top-0 z-20 flex items-center justify-between h-14 px-4 sm:px-6 bg-white/95 backdrop-blur-md border-b border-slate-200/80 lg:hidden">
      <Link to="/" className="flex items-center gap-2">
        <img src="/lpf_logo.jpg" alt="LPF" className="w-7 h-7 rounded-lg border border-slate-200 object-cover" />
        <span className="font-display text-sm font-extrabold text-slate-900">LPF</span>
      </Link>
      <button
        onClick={onToggleMobile}
        className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
        aria-label="Open menu"
      >
        ☰
      </button>
    </header>
  )
}

function AppLayout({ children, onOpenAi }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  if (isHome) return <LandingPage />

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar onOpenAi={onOpenAi} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <TopBar onToggleMobile={() => setMobileOpen((v) => !v)} />

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
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
