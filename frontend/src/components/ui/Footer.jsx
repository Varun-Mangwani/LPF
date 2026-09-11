import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="w-full bg-white border-t border-slate-200 mt-auto py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <img
            src="/lpf_logo.jpg"
            alt="LPF Logo"
            className="w-7 h-7 rounded-md object-contain border border-slate-200"
          />
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 text-sm tracking-tight">
              Ledger Personal Finance
            </span>
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Operational
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 font-mono text-xs text-slate-500">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link to="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          <Link to="/upload" className="hover:text-slate-900 transition-colors">Import Statement</Link>
          <Link to="/simulate" className="hover:text-slate-900 transition-colors">Simulator</Link>
        </div>

        {/* Copyright */}
        <div className="font-mono text-[11px] text-slate-400">
          © {new Date().getFullYear()} LPF. 50/30/20 & Debt Avalanche Engine.
        </div>
      </div>
    </footer>
  )
}
