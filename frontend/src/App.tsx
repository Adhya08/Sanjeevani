import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ActivityLog } from './components/log-console/ActivityLog'

export const App: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(2) // default on Stage 02/03

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Top Ledger Strip / Breadcrumb Metadata */}
      <div className="w-full bg-slate text-paper px-4 md:px-10 py-2 border-b border-ink/20 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
        <div className="flex items-center gap-3">
          <span className="border border-paper/30 px-1.5 py-0.5 text-[11px] font-semibold">
            MH-NSK-APMC-REG-2024
          </span>
          <span className="text-paper/80 hidden sm:inline">
            Nashik APMC Mandi #4 • Real-time sensor sync active • Ambient: 33°C / 78% RH
          </span>
        </div>
        <div className="flex items-center gap-4 text-paper/90">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-rust inline-block"></span>
            <span>Critical rescue window: 04h 22m</span>
          </div>
          <span className="hidden md:inline text-paper/70">Lots recorded: 1,482 quintals</span>
        </div>
      </div>

      {/* Main Header / Navigation */}
      <header className="w-full bg-paper border-b border-ink/20 sticky top-0 z-40">
        <div className="px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex flex-col group focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
              <span className="font-serif text-2xl font-bold text-ink tracking-tight">
                Sanjeevani
              </span>
              <span className="text-[11px] font-sans text-ink/70 leading-none">
                Decay ledger & produce rescue
              </span>
            </Link>

            <div className="h-7 w-[1px] bg-ink/15 hidden lg:block"></div>

            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold">
              <Link
                to="/"
                className="px-3 py-1.5 bg-ink/10 text-ink border-b-2 border-turmeric focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Overview
              </Link>
              <Link
                to="/producer"
                className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Producer ledger
              </Link>
              <Link
                to="/buyer"
                className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Discount marketplace
              </Link>
              <Link
                to="/ngo"
                className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                NGO dispatch feed
              </Link>
              <Link
                to="/listings"
                className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Crate inventory
              </Link>
              <Link
                to="/analytics"
                className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Waste analytics
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center border border-ink/20 px-2.5 py-1 text-xs bg-paper">
              <span className="text-rust font-semibold mr-1.5">Critical spoilage risk:</span>
              <span className="font-bold text-ink tabular-nums">18.4 tons</span>
            </div>
            <Link
              to="/producer"
              className="px-3 py-1.5 bg-turmeric text-paper font-semibold text-xs border border-ink hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Open terminal
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex lg:hidden overflow-x-auto border-t border-ink/10 px-4 py-2 gap-2 text-xs font-semibold">
          <Link to="/" className="px-2.5 py-1 bg-ink/10 text-ink whitespace-nowrap">Overview</Link>
          <Link to="/producer" className="px-2.5 py-1 text-ink/80 hover:bg-ink/5 whitespace-nowrap">Producer</Link>
          <Link to="/buyer" className="px-2.5 py-1 text-ink/80 hover:bg-ink/5 whitespace-nowrap">Marketplace</Link>
          <Link to="/ngo" className="px-2.5 py-1 text-ink/80 hover:bg-ink/5 whitespace-nowrap">Rescue</Link>
          <Link to="/listings" className="px-2.5 py-1 text-ink/80 hover:bg-ink/5 whitespace-nowrap">Inventory</Link>
          <Link to="/analytics" className="px-2.5 py-1 text-ink/80 hover:bg-ink/5 whitespace-nowrap">Analytics</Link>
        </div>
      </header>

      <main className="w-full">
        <div className="p-8 text-center text-xs text-ink/70">
          Sanjeevani Agricultural Perishable Rescue Platform. Active clearance stage: {activeStage}
          <button className="hidden" onClick={() => setActiveStage(1)}>{activeStage}</button>
        </div>
      </main>
      <ActivityLog sessionId={undefined} />
    </div>
  )
}

export default App