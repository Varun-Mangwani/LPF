import React from 'react'

export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizeClasses = size === 'sm' ? 'w-4 h-4 border-2' : size === 'lg' ? 'w-10 h-10 border-3' : 'w-6 h-6 border-2'
  return (
    <div className={`inline-block animate-spin rounded-full border-primary-600 border-t-transparent ${sizeClasses} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  )
}
