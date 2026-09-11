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

        {/* Visually Quiet Below the Fold: Three-Tier Rescue Clearance Pipeline */}
        <section className="w-full px-4 md:px-10 py-10 md:py-14 border-b border-ink/20 bg-paper">
          <div className="flex flex-col md:flex-row md:items-baseline justify-between pb-3 mb-6 border-b-2 border-slate">
            <div>
              <h2 className="font-serif text-2xl md:text-3xl text-ink">
                Three-tier rescue clearance pipeline
              </h2>
              <p className="text-xs text-ink/70 mt-0.5">
                Protocol schedule B-4 • Continuous ledger handoff with zero intermediary hold time
              </p>
            </div>
            <span className="text-xs text-ink/60 mt-1 md:mt-0 tabular-nums">
              Active mandi cycle: Nashik Panchavati yard
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border border-ink/20 divide-y md:divide-y-0 md:divide-x divide-ink/20 bg-paper">
            {/* Tier 1: The Farmer / Producer */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-ink/15 text-xs">
                  <span className="font-semibold text-slate">Tier 1</span>
                  <span className="text-ink/60">Stage 0–24h</span>
                </div>

                <h3 className="font-serif text-xl text-ink mt-3 mb-2">
                  The Farmer / Producer
                </h3>

                <p className="text-xs text-ink/80 leading-relaxed mb-4">
                  Logs harvest lots directly into the yard node. IoT pulp and temperature sensors calculate
                  the crop's physiological decay curve to initiate market discovery before visible softening begins.
                </p>

                <ul className="space-y-2 text-xs text-ink/90 border-t border-ink/10 pt-3">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-turmeric">01.</span>
                    <span><strong>Field sensor telemetry:</strong> Crate humidity and core pulp thermometers sync at gate weighment.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-turmeric">02.</span>
                    <span><strong>Decay curve calculation:</strong> Algorithmic shelf-life modeled against ambient mandi heat index.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-turmeric">03.</span>
                    <span><strong>Distress prevention:</strong> Automatic failover triggers prevent distressed dump-offs at day-end.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-ink/15 flex items-center justify-between text-xs">
                <span className="text-ink/60">Folio register</span>
                <span className="font-semibold text-slate">Dispatch desk #1</span>
              </div>
            </div>

            {/* Tier 2: The Discount Buyer */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-ink/15 text-xs">
                  <span className="font-semibold text-turmeric">Tier 2</span>
                  <span className="text-ink/60">Stage 24–36h</span>
                </div>

                <h3 className="font-serif text-xl text-ink mt-3 mb-2">
                  The Discount Buyer
                </h3>

                <p className="text-xs text-ink/80 leading-relaxed mb-4">
                  Commercial food processors, sauce makers, and institutional kitchens purchase high-volume,
                  ripe produce under automated hourly markdown ladders before retail viability expires.
                </p>

                <ul className="space-y-2 text-xs text-ink/90 border-t border-ink/10 pt-3">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-turmeric">01.</span>
                    <span><strong>Markdown ladder:</strong> Dynamic price cuts (-20% to -65%) decrement hourly to stimulate instant bids.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-turmeric">02.</span>
                    <span><strong>Bulk procurement:</strong> Dedicated dispatch routes for pulping units and canteen networks.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-turmeric">03.</span>
                    <span><strong>4-hour pickup:</strong> Immediate marshaling bay access ensures clearance within transit safety margins.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-ink/15 flex items-center justify-between text-xs">
                <span className="text-ink/60">Auction clearance</span>
                <span className="font-semibold text-turmeric">Discount desk #2</span>
              </div>
            </div>

            {/* Tier 3: The Rescue NGO */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-ink/15 text-xs">
                  <span className="font-semibold text-rust">Tier 3</span>
                  <span className="text-ink/60">Stage 36–48h</span>
                </div>

                <h3 className="font-serif text-xl text-ink mt-3 mb-2">
                  The Rescue NGO
                </h3>

                <p className="text-xs text-ink/80 leading-relaxed mb-4">
                  When commercial bidding closes at the 36-hour mark, lots transfer at zero cost to accredited
                  community feeding programs and relief kitchens under strict food safety guidelines.
                </p>

                <ul className="space-y-2 text-xs text-ink/90 border-t border-ink/10 pt-3">
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-rust">01.</span>
                    <span><strong>Zero-cost routing:</strong> Immediate ownership handoff occurs automatically when auction closes.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-rust">02.</span>
                    <span><strong>Fleet dispatch alerts:</strong> Verified NGO transit vans are directed to APMC Platform 7 within 45 minutes.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="font-bold text-rust">03.</span>
                    <span><strong>FSSAI audit stamps:</strong> Edibility and safe handling verified via rapid optical and thermal check.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-ink/15 flex items-center justify-between text-xs">
                <span className="text-ink/60">Relief marshaling</span>
                <span className="font-semibold text-rust">Rescue desk #3</span>
              </div>
            </div>
          </div>
        </section>

        {/* Visually Quiet Mandi Statistics Tally Strip */}
        <section className="w-full bg-paper border-b border-ink/20">
          <div className="px-4 md:px-10 py-2.5 bg-slate text-paper text-xs flex flex-wrap items-center justify-between">
            <span className="font-semibold">Official monthly physical aggregate summary</span>
            <span className="text-paper/70 tabular-nums">Audit record: closed 24:00 hrs IST</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-ink/20 text-ink">
            <div className="p-6">
              <div className="text-xs text-ink/70">Produce salvaged this month</div>
              <div className="font-serif text-3xl font-bold text-ink mt-1 tabular-nums">
                4,180 <span className="font-sans text-sm font-normal text-ink/60">quintals</span>
              </div>
              <div className="text-xs text-moss font-semibold mt-1 tabular-nums">+18.4% vs previous cycle</div>
            </div>

            <div className="p-6">
              <div className="text-xs text-ink/70">Farmer capital recovered</div>
              <div className="font-serif text-3xl font-bold text-turmeric mt-1 tabular-nums">
                ₹84.2 <span className="font-sans text-sm font-normal text-ink/60">lakh</span>
              </div>
              <div className="text-xs text-ink/60 mt-1">Direct RTGS mandi settlements</div>
            </div>

            <div className="p-6">
              <div className="text-xs text-ink/70">Meals distributed via NGOs</div>
              <div className="font-serif text-3xl font-bold text-rust mt-1 tabular-nums">
                312,400 <span className="font-sans text-sm font-normal text-ink/60">units</span>
              </div>
              <div className="text-xs text-ink/60 mt-1">Zero biological waste diverted</div>
            </div>

            <div className="p-6">
              <div className="text-xs text-ink/70">Zero-loss mandis</div>
              <div className="font-serif text-3xl font-bold text-ink mt-1 tabular-nums">
                18 <span className="font-sans text-sm font-normal text-ink/60">nodes</span>
              </div>
              <div className="text-xs text-ink/60 mt-1">Maharashtra & Gujarat regional hubs</div>
            </div>
          </div>
        </section>

        {/* Quiet Verification & Provenance Block (Explicit Sentence Case Throughout) */}
        <section className="w-full px-4 md:px-10 py-8 border-b border-ink/20 bg-paper">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-ink/20 p-6 bg-paper">
            <div className="flex items-start sm:items-center gap-4">
              {/* Double-rule Stamped Box */}
              <div className="ledger-double-border p-2 bg-paper text-center flex-shrink-0">
                <span className="font-serif text-xs font-bold text-slate block">Sanjeevani</span>
                <span className="text-[10px] font-sans font-semibold text-rust block">Seal no. 994</span>
              </div>

              <div>
                <h3 className="font-serif text-lg text-ink font-semibold">
                  Cold-chain integrity record
                </h3>
                <p className="text-xs text-ink/75 max-w-xl mt-0.5">
                  All temperature, ethylene, and auction entries logged on this terminal are final under APMC By-law 44-A.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-ink/10 pt-4 sm:pt-0">
              <div className="text-left sm:text-right">
                <div className="text-ink/60">Superintendent signature block</div>
                <div className="font-semibold text-ink">D. S. Thorat • NSK-APMC-04</div>
              </div>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 border border-ink bg-paper hover:bg-ink/5 text-xs font-semibold focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Print daily folio [P]
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Mandi Physical Register Footer */}
      <footer className="w-full bg-paper border-t border-ink/20 text-xs">
        <div className="px-4 md:px-10 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 border-b border-ink/15 text-ink/80">
          <div>
            <div className="font-serif font-bold text-ink mb-1">Physical register index</div>
            <p className="text-[11px] leading-relaxed text-ink/70">
              Book no. 12/B • Folio pages 0441-0520. Continuous APMC cold-chain logbook authenticated via electronic IoT probe telemetry.
            </p>
          </div>

          <div>
            <div className="font-serif font-bold text-ink mb-1">Mandi dispatch desks</div>
            <ul className="text-[11px] space-y-0.5 text-ink/70">
              <li>Gate 1A: Perishable green vegetables</li>
              <li>Gate 3B: Stone fruits & citrus</li>
              <li>Platform 7: Rescue cold marshaling</li>
            </ul>
          </div>

          <div>
            <div className="font-serif font-bold text-ink mb-1">Verification standards</div>
            <ul className="text-[11px] space-y-0.5 text-ink/70">
              <li>Ethylene sensor mesh (0.1 ppm resolution)</li>
              <li>Pulp core temperature standard (&lt; 6.5°C)</li>
              <li>FSSAI surplus hygiene code IX</li>
            </ul>
          </div>

          <div className="border border-ink/20 p-3 bg-paper/50">
            <div className="font-semibold text-rust text-[11px]">Registration protocol</div>
            <div className="text-[11px] font-bold text-ink mt-0.5 tabular-nums">Lot auth: MH-NSK-2024-8842</div>
            <p className="text-[10px] text-ink/60 mt-1">
              Stamps verify chain-of-custody handoff. Alteration invalidates ledger record.
            </p>
          </div>
        </div>

        <div className="px-4 md:px-10 py-3 bg-slate text-paper/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
          <div>Statutory declaration: FSSAI surplus food revenue & distribution recovery guidelines (2019 compliant)</div>
          <div className="tabular-nums text-paper/60">Sanjeevani APMC produce rescue system</div>
        </div>
      </footer>

      {/* Activity Log Drawer */}
      <ActivityLog />
    </div>
  )
}

export default App