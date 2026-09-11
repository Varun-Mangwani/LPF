import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center p-8">
        <div className="w-16 h-16 rounded-2xl bg-primary-50 text-primary-600 font-display font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 border border-primary-200/60">
          404
        </div>
        <h1 className="font-display text-2xl font-bold text-slate-900 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 mb-6 leading-relaxed">
          The financial route you are trying to access does not exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
