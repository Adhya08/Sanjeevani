import React from 'react'
import { Link } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper text-ink p-6">
      <div className="text-center max-w-md border border-ink/20 p-8 bg-paper">
        <h1 className="text-6xl font-serif font-bold text-slate mb-4">404</h1>
        <h2 className="text-xl font-serif font-semibold mb-2">Page not found</h2>
        <p className="text-sm font-sans text-ink/70 mb-6">
          The requested ledger folio does not exist or has been archived.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center bg-turmeric text-paper border border-ink px-6 py-2.5 font-sans font-semibold text-sm hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
        >
          Return to overview
        </Link>
      </div>
    </div>
  )
}