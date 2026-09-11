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
        {/* Editorial Header & Single Hero Anchor (Decay Dial) */}
        <section className="w-full border-b border-ink/20 bg-paper">
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-ink/20">
            {/* Left Side: Editorial Lead */}
            <div className="lg:col-span-7 px-6 md:px-12 py-10 md:py-14 flex flex-col justify-between">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 border border-slate/40 px-2.5 py-1 text-xs text-slate">
                  <span className="w-2 h-2 bg-rust inline-block"></span>
                  <span>Physical harvest dispatch record • Nashik APMC Section B-12</span>
                </div>

                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-ink leading-tight">
                  Automated produce decay prediction and rescue logistics
                </h1>

                <p className="text-base text-ink/80 leading-relaxed font-sans">
                  A predictive decay ledger connecting mandi farmers, commercial discount buyers,
                  and food-rescue NGOs across India to clear perishable harvests before biological
                  spoilage turns viable food into landfill waste.
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-3">
                  <Link
                    to="/producer"
                    className="px-5 py-2.5 bg-turmeric text-paper font-semibold text-sm border border-ink hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
                  >
                    Open producer register
                  </Link>
                  <Link
                    to="/ngo"
                    className="px-5 py-2.5 bg-paper text-ink font-semibold text-sm border border-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
                  >
                    Review NGO rescue protocols
                  </Link>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-ink/15 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink/70 tabular-nums">
                <div>Statutory compliance: G.S.R. 784(E)</div>
                <div>•</div>
                <div>Auction handoff window: &lt; 04 hours</div>
                <div>•</div>
                <div>FSSAI surplus hygiene verified</div>
              </div>
            </div>

            {/* Right Side: Sole Hero Anchor — 48h Freshness Clock Decay Dial */}
            <div className="lg:col-span-5 px-6 md:px-10 py-8 md:py-10 bg-paper/60 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-ink/20 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-rust inline-block"></span>
                    <span className="font-semibold text-xs text-ink">Physiological profile #TK-91</span>
                  </div>
                  <span className="text-xs text-ink/70 tabular-nums">48-hour post-harvest clock</span>
                </div>

                {/* SVG Chronograph Dial */}
                <div className="flex flex-col items-center">
                  <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px]">
                    <svg className="w-full h-full text-ink" viewBox="0 0 280 280">
                      {/* Outer Rim */}
                      <circle cx="140" cy="140" r="132" fill="none" stroke="#3A4038" strokeWidth="2" />
                      <circle cx="140" cy="140" r="126" fill="#EDE6D6" stroke="#3A4038" strokeWidth="1" />

                      {/* Quadrant Fills */}
                      {/* 0 - 180 deg (0-24h Freshness - Moss) */}
                      <path d="M140 140 L140 18 A122 122 0 0 1 262 140 Z" fill="#5C6B4F" fillOpacity="0.25" />
                      {/* 180 - 270 deg (24-36h Discount - Turmeric) */}
                      <path d="M140 140 L262 140 A122 122 0 0 1 140 262 Z" fill="#B9791F" fillOpacity="0.3" />
                      {/* 270 - 337.5 deg (36-48h NGO Rescue - Rust) */}
                      <path d="M140 140 L140 262 A122 122 0 0 1 32 188 Z" fill="#8B3A2B" fillOpacity="0.35" />
                      {/* 337.5 - 360 deg (>48h Biomethane - Slate) */}
                      <path d="M140 140 L32 188 A122 122 0 0 1 140 18 Z" fill="#3A4038" fillOpacity="0.45" />

                      {/* Radial Ticks */}
                      <g stroke="#3A4038" strokeWidth="1">
                        <line x1="140" y1="18" x2="140" y2="30" strokeWidth="2" />
                        <line x1="262" y1="140" x2="250" y2="140" strokeWidth="2" />
                        <line x1="140" y1="262" x2="140" y2="250" strokeWidth="2" />
                        <line x1="18" y1="140" x2="30" y2="140" strokeWidth="2" />
                        {/* Needle Critical Threshold at 31.4h */}
                        <line x1="52" y1="228" x2="59" y2="219" stroke="#8B3A2B" strokeWidth="2" />
                      </g>

                      {/* Dial Center Hub */}
                      <circle cx="140" cy="140" r="16" fill="#EDE6D6" stroke="#3A4038" strokeWidth="2" />
                      <circle cx="140" cy="140" r="5" fill="#3A4038" />

                      {/* Needle Pointer pointing to T+31.4h (~218 deg) */}
                      <g transform="rotate(218 140 140)">
                        <path d="M140 148 L136 140 L139 36 L140 24 L141 36 L144 140 Z" fill="#8B3A2B" stroke="#2B2620" strokeWidth="1" />
                        <circle cx="140" cy="140" r="3" fill="#EDE6D6" />
                      </g>

                      {/* Hour Markers */}
                      <text x="140" y="46" textAnchor="middle" fill="#3A4038" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Sans', sans-serif">0h</text>
                      <text x="238" y="144" textAnchor="middle" fill="#5C6B4F" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Sans', sans-serif">12h</text>
                      <text x="140" y="244" textAnchor="middle" fill="#B9791F" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Sans', sans-serif">24h</text>
                      <text x="46" y="144" textAnchor="middle" fill="#8B3A2B" fontSize="10" fontWeight="700" fontFamily="'IBM Plex Sans', sans-serif">36h</text>
                    </svg>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-12">
                      <span className="text-[10px] bg-paper border border-ink/30 px-1.5 py-0.5 text-rust font-bold tabular-nums">
                        T+31.4h
                      </span>
                    </div>
                  </div>

                  {/* Stage breakdown cards */}
                  <div className="w-full space-y-1.5 mt-5 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveStage(1)}
                      className={`w-full flex items-center justify-between p-2 border transition-none text-left ${
                        activeStage === 1 ? 'border-ink bg-paper' : 'border-ink/20 bg-paper/40'
                      }`}
                    >
                      <span className="font-medium text-ink">Stage 01: 0–24h</span>
                      <span className="px-2 py-0.5 bg-moss text-paper text-[11px] font-semibold">Premium mandi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStage(2)}
                      className={`w-full flex items-center justify-between p-2 border transition-none text-left ${
                        activeStage === 2 ? 'border-ink bg-paper' : 'border-ink/20 bg-paper/40'
                      }`}
                    >
                      <span className="font-medium text-ink">Stage 02: 24–36h</span>
                      <span className="px-2 py-0.5 bg-turmeric text-paper text-[11px] font-semibold">Discount desk</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStage(3)}
                      className={`w-full flex items-center justify-between p-2 border transition-none text-left ${
                        activeStage === 3 ? 'border-rust bg-paper font-semibold' : 'border-ink/20 bg-paper/40'
                      }`}
                    >
                      <span className="text-rust">Stage 03: 36–48h</span>
                      <span className="px-2 py-0.5 bg-rust text-paper text-[11px] font-semibold">NGO rescue</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveStage(4)}
                      className={`w-full flex items-center justify-between p-2 border transition-none text-left ${
                        activeStage === 4 ? 'border-ink bg-paper' : 'border-ink/20 bg-paper/40'
                      }`}
                    >
                      <span className="text-ink/70">Stage 04: &gt; 48h</span>
                      <span className="px-2 py-0.5 bg-slate text-paper text-[11px]">Biomethane</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Dial Sensor Telemetry Bar */}
              <div className="mt-5 pt-3 border-t border-ink/20 grid grid-cols-3 gap-2 text-[11px] tabular-nums text-ink/80">
                <div>
                  <span className="text-ink/60 block">Ambient RH</span>
                  <span className="font-bold text-ink">82%</span>
                </div>
                <div>
                  <span className="text-ink/60 block">Pulp core</span>
                  <span className="font-bold text-ink">29.4°C</span>
                </div>
                <div>
                  <span className="text-ink/60 block">Respiration</span>
                  <span className="font-bold text-rust">CO₂ +14%</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="hidden">{activeStage}</div>
      </main>
      <ActivityLog sessionId={undefined} />
    </div>
  )
}

export default App