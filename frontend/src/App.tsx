import React from 'react'
import { Link } from 'react-router-dom'
import { ActivityLog } from './components/log-console/ActivityLog'

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-950 text-white flex flex-col justify-between overflow-hidden relative">
      
      {/* Dynamic Background Vegetable Graphics */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Tomato */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-red-500/10 fill-current animate-float-slow absolute top-1/4 left-10">
          <circle cx="50" cy="55" r="35" />
          <path d="M50 20 Q55 10 50 5 Q45 10 50 20" stroke="currentColor" strokeWidth="4" fill="none" className="text-emerald-500/20" />
          <path d="M50 20 L35 15 M50 20 L65 15 M50 20 L40 25 M50 20 L60 25" stroke="currentColor" strokeWidth="3" className="text-emerald-500/20" />
        </svg>

        {/* Carrot */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-orange-500/10 fill-current animate-float-slower absolute top-1/3 right-16">
          <path d="M30 20 L70 20 L50 85 Z" />
          <path d="M50 20 Q40 5 30 10 Q45 15 50 20 Q55 5 70 10 Q55 15 50 20" fill="currentColor" className="text-emerald-500/20" />
        </svg>

        {/* Corn */}
        <svg viewBox="0 0 100 100" className="w-24 h-24 text-yellow-500/10 fill-current animate-float-slow absolute bottom-1/4 left-24">
          <ellipse cx="50" cy="55" rx="18" ry="32" />
          <path d="M30 40 Q15 50 32 80 Q50 90 68 80 Q85 50 70 40 Z" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-600/20" />
        </svg>

        {/* Leafy Green */}
        <svg viewBox="0 0 100 100" className="w-28 h-28 text-emerald-400/10 fill-current animate-float-slower absolute bottom-1/3 right-32">
          <circle cx="50" cy="50" r="28" />
          <path d="M20 50 Q30 20 50 20 Q70 20 80 50 Q70 80 50 80 Q30 80 20 50" stroke="currentColor" strokeWidth="2.5" fill="none" className="text-emerald-300/20" />
        </svg>
      </div>

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto w-full p-6 flex justify-between items-center z-10">
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
      <main className="max-w-5xl mx-auto px-6 py-12 text-center space-y-8 z-10 animate-fade-in-up">
        <div className="inline-block bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-1.5 text-xs text-emerald-300 font-semibold backdrop-blur-sm">
          ✨ Bounded AI Autonomous Negotiation Protocol
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
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 p-5 rounded-2xl transition-all duration-300 shadow-xl hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="text-3xl mb-3">🌾</div>
            <h3 className="font-bold text-lg text-amber-400 group-hover:text-amber-300">Producer Portal</h3>
            <p className="text-xs text-slate-400 mt-1">List crops, configure harvest dates, track real-time decay &amp; risk scores.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-amber-400">Enter Dashboard →</span>
          </Link>

          {/* Buyer */}
          <Link
            to="/buyer"
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-sky-500/50 p-5 rounded-2xl transition-all duration-300 shadow-xl hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="text-3xl mb-3">🛒</div>
            <h3 className="font-bold text-lg text-sky-400 group-hover:text-sky-300">Buyer Agent Portal</h3>
            <p className="text-xs text-slate-400 mt-1">AI demand forecasting, auto-bidding &amp; live floor-price bargaining.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-sky-400">Enter Dashboard →</span>
          </Link>

          {/* NGO */}
          <Link
            to="/ngo"
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 p-5 rounded-2xl transition-all duration-300 shadow-xl hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="text-3xl mb-3">💚</div>
            <h3 className="font-bold text-lg text-emerald-400 group-hover:text-emerald-300">NGO Rescue Hub</h3>
            <p className="text-xs text-slate-400 mt-1">Free dispatch routing for high-risk (&gt;65%) expiring produce.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-emerald-400">Enter Hub →</span>
          </Link>

          {/* Analytics */}
          <Link
            to="/analytics"
            className="group bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 p-5 rounded-2xl transition-all duration-300 shadow-xl hover:-translate-y-1 backdrop-blur-sm"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg text-cyan-400 group-hover:text-cyan-300">Waste Analytics</h3>
            <p className="text-xs text-slate-400 mt-1">ESG audit trail, total volume rescued vs lost, produce-wise trends.</p>
            <span className="inline-block mt-4 text-xs font-semibold text-cyan-400">View Audit →</span>
          </Link>
        </div>
      </main>
      <ActivityLog />
    </div>
  )
}

export default App