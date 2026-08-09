import React from 'react'
import { Link } from 'react-router-dom'
import { ActivityLog } from './components/log-console/ActivityLog'

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-teal-900 to-slate-900 text-white flex flex-col justify-between">
      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto w-full p-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌱</span>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">Sanjeevani</h1>
            <p className="text-[11px] text-emerald-200/80">AI-Native Fresh Produce Rescue &amp; Intelligence</p>
          </div>
        </div>
        <nav className="flex gap-4 text-sm font-medium">
          <Link to="/producer" className="hover:text-emerald-400 transition-colors">Producer</Link>
          <Link to="/buyer" className="hover:text-emerald-400 transition-colors">Buyer</Link>
          <Link to="/ngo" className="hover:text-emerald-400 transition-colors">NGO Rescue</Link>
          <Link to="/analytics" className="hover:text-emerald-400 transition-colors">Analytics</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="max-w-5xl mx-auto px-6 py-12 text-center space-y-8">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs text-emerald-300 font-semibold backdrop-blur-sm">
          ✨ Bounded AI Autonomous Negotiation Protocol • PRD v2.0
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Eliminate Fresh Produce Waste with <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            AI Agent Supply Networks
          </span>
        </h2>

        <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Dynamic freshness decay modeling, automated multi-turn agent bargaining, demand forecasting, and zero-waste NGO rescue routing.
        </p>

        {/* Action Cards */}
        <div className="grid md:grid-cols-4 gap-4 pt-6 text-left">
          {/* Producer */}
          <Link
            to="/producer"
            className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 p-5 rounded-2xl transition-all shadow-xl hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">🌾</div>
            <h3 className="font-bold text-lg text-amber-400 group-hover:text-amber-300">Producer Portal</h3>
            <p className="text-xs text-slate-400 mt-1">List crops, configure harvest dates, track real-time decay &amp; risk scores.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-amber-400">Enter Dashboard →</span>
          </Link>

          {/* Buyer */}
          <Link
            to="/buyer"
            className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 p-5 rounded-2xl transition-all shadow-xl hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="font-bold text-lg text-sky-400 group-hover:text-sky-300">Buyer Agent Portal</h3>
            <p className="text-xs text-slate-400 mt-1">AI demand forecasting, auto-bidding &amp; live floor-price bargaining.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-sky-400">Enter Dashboard →</span>
          </Link>

          {/* NGO */}
          <Link
            to="/ngo"
            className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/50 p-5 rounded-2xl transition-all shadow-xl hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">💚</div>
            <h3 className="font-bold text-lg text-emerald-400 group-hover:text-emerald-300">NGO Rescue Hub</h3>
            <p className="text-xs text-slate-400 mt-1">Free dispatch routing for high-risk (&gt;65%) expiring produce.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-emerald-400">Enter Hub →</span>
          </Link>

          {/* Analytics */}
          <Link
            to="/analytics"
            className="group bg-slate-800/80 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 p-5 rounded-2xl transition-all shadow-xl hover:-translate-y-1"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg text-cyan-400 group-hover:text-cyan-300">Waste Analytics</h3>
            <p className="text-xs text-slate-400 mt-1">ESG audit trail, total volume rescued vs lost, produce-wise trends.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-cyan-400">View Audit →</span>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto w-full p-6 text-center text-xs text-slate-500 border-t border-slate-800">
        Sanjeevani v2.0 • Powered by Fastify WebSocket Engine &amp; React Vite • Zero-Waste Agriculture Initiative
      </footer>

      <ActivityLog />
    </div>
  )
}

export default App