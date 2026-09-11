import React from 'react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-slate-200 mt-auto py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <img
            src="/lpf_logo.jpg"
            alt="LPF Logo"
            className="w-7 h-7 rounded-lg object-contain border border-slate-200 shadow-subtle"
          />
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-slate-900 text-sm tracking-tight">
              Ledger Finance
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/90 flex items-center gap-1.5 shadow-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Engine Online
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
          <Link to="/" className="hover:text-slate-900 transition-colors">Home</Link>
          <Link to="/dashboard" className="hover:text-slate-900 transition-colors">Dashboard</Link>
          <Link to="/upload" className="hover:text-slate-900 transition-colors">Import Statement</Link>
          <Link to="/simulate" className="hover:text-slate-900 transition-colors">Simulator</Link>
        </div>

        {/* Copyright */}
        <div className="text-xs text-slate-400">
          © {new Date().getFullYear()} LPF · Deterministic Financial Telemetry
        </div>
      </div>
    </footer>
  )
}

