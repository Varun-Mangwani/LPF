import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Compass, LayoutDashboard, Home } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-100/60 rounded-full blur-3xl pointer-events-none" />

      <Card className="max-w-md w-full text-center p-8 border-slate-200/80 bg-white relative z-10 shadow-card" hover={false}>
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-5 shadow-subtle">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-indigo-600 font-bold mb-1">Error 404</p>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
          Route Unreachable
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The financial ledger route or resource you are attempting to locate does not exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" icon={LayoutDashboard} className="w-full justify-center">
              Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" icon={Home} className="w-full justify-center">
              Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

