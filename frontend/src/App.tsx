import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ActivityLog } from './components/log-console/ActivityLog'

export const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [activeCardTab, setActiveCardTab] = useState<'tomato' | 'apple' | 'spinach'>('tomato')
  const heroRef = useRef<HTMLDivElement>(null)

  // Listen to scroll events for parallax
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen to mouse movement for layered parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const width = window.innerWidth
      const height = window.innerHeight
      // Normalize values between -0.5 and 0.5
      const x = (clientX / width) - 0.5
      const y = (clientY / height) - 0.5
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Parallax calculations
  const heroHeight = heroRef.current?.clientHeight || 800
  const scrollRatio = Math.min(scrollY / heroHeight, 1)
  
  const bgScale = 1 + scrollRatio * 0.15
  const bgTranslateY = scrollRatio * 120
  const midTranslateY = scrollRatio * -60
  const textTranslateY = scrollRatio * 80
  const textOpacity = 1 - scrollRatio * 1.5

  // Mouse parallax coefficients
  const mouseX = mousePos.x
  const mouseY = mousePos.y

  return (
    <div className="min-h-screen bg-[#050c08] text-[#f5f3ef] selection:bg-amber-600/30 selection:text-amber-200 relative overflow-hidden font-sans">
      
      {/* Film Grain Effect */}
      <div className="film-grain" />

      {/* Floating Ambient Atmosphere (Orbs) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute top-[20%] left-[10%] w-[45vw] h-[45vw] bg-emerald-950/20 rounded-full blur-[120px] animate-drift-slow" 
          style={{ transform: `translate3d(${mouseX * -30}px, ${mouseY * -30}px, 0)` }}
        />
        <div 
          className="absolute top-[50%] right-[5%] w-[40vw] h-[40vw] bg-amber-950/15 rounded-full blur-[100px] animate-drift-slow" 
          style={{ transform: `translate3d(${mouseX * 25}px, ${mouseY * 25}px, 0)` }}
        />
      </div>

      {/* Transparent Floating Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 transition-all duration-500 bg-[#050c08]/40 backdrop-blur-md border-b border-[#f5f3ef]/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-2xl transition-transform duration-700 group-hover:rotate-12">🌿</span>
            <div>
              <span className="font-display-serif text-lg font-bold tracking-wide text-amber-200 group-hover:text-amber-100 transition-colors">Sanjeevani</span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-[#f5f3ef]/50 font-sans">Freshness Intelligence</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em] font-medium text-[#f5f3ef]/75">
            <Link to="/producer" className="hover:text-amber-200 transition-colors">Producer Portal</Link>
            <Link to="/buyer" className="hover:text-amber-200 transition-colors">Buyer Agent</Link>
            <Link to="/ngo" className="hover:text-amber-200 transition-colors">NGO Rescue</Link>
            <Link to="/analytics" className="hover:text-amber-200 transition-colors">Analytics</Link>
          </nav>

          <Link
            to="/producer"
            className="text-xs uppercase tracking-[0.1em] font-semibold border border-amber-500/30 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-900/40 text-amber-200 px-5 py-2.5 rounded-xl transition-all"
          >
            Launch System
          </Link>
        </div>
      </header>

      {/* Cinematic Hero Section */}
      <section ref={heroRef} className="h-screen w-full relative flex items-center justify-center overflow-hidden z-10">
        
        {/* Parallax Background Images Layer */}
        <div 
          className="absolute inset-0 z-0 scale-105 pointer-events-none"
          style={{
            transform: `translate3d(${mouseX * -15}px, ${mouseY * -15 + bgTranslateY}px, 0) scale(${bgScale})`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Immersive Agriculture Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050c08] via-[#050c08]/50 to-transparent z-10" />
          <div className="absolute inset-0 bg-[#050c08]/20 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000" 
            alt="Cinematic Agriculture Landscape" 
            className="w-full h-full object-cover filter brightness-[0.4] saturate-[0.6] sepia-[0.15]" 
          />
        </div>

        {/* Foreground / Midground organic particle effects */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-40"
          style={{
            transform: `translate3d(${mouseX * 20}px, ${mouseY * 20 + midTranslateY}px, 0)`,
            transition: 'transform 0.1s ease-out'
          }}
        >
          {/* Floating dust/spores particles */}
          <div className="absolute w-2 h-2 bg-amber-500/40 rounded-full blur-[1px] top-1/4 left-1/3 animate-float-slow" />
          <div className="absolute w-3 h-3 bg-emerald-500/20 rounded-full blur-[2px] bottom-1/3 right-1/4 animate-float-slower" />
          <div className="absolute w-1.5 h-1.5 bg-amber-300/30 rounded-full top-1/2 left-2/3 animate-float-slow" />
        </div>

        {/* Hero Central Content */}
        <div 
          className="relative max-w-4xl mx-auto px-6 text-center z-30 transition-organic"
          style={{
            transform: `translate3d(0, ${textTranslateY}px, 0)`,
            opacity: textOpacity
          }}
        >
          <div className="inline-flex items-center gap-2 bg-[#f5f3ef]/5 border border-[#f5f3ef]/10 rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-amber-200/90 backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI-Native Preservation Network
          </div>

          <h1 className="text-5xl md:text-8xl font-display-serif tracking-tight text-[#f5f3ef] leading-[1.05] mb-8 font-light">
            Every Harvest <br />
            <span className="italic font-normal text-amber-100">Has a Window.</span>
          </h1>

          <p className="text-base md:text-lg text-[#f5f3ef]/75 max-w-2xl mx-auto font-light leading-relaxed mb-12">
            Predict freshness. Reduce waste. Redirect surplus. Give every piece of produce a better chance to reach a plate.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <a 
              href="#intelligence"
              className="px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold bg-[#f5f3ef] text-[#050c08] hover:bg-amber-100 transition-all duration-300 shadow-xl shadow-black/40 hover:-translate-y-0.5"
            >
              Explore the Intelligence
            </a>
            <a 
              href="#how-it-works"
              className="px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold border border-[#f5f3ef]/20 hover:border-[#f5f3ef]/40 text-[#f5f3ef] hover:bg-[#f5f3ef]/5 transition-all duration-300"
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Section 1: The Problem */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#050c08] via-[#030905] to-[#040e09] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold block">The Window of Loss</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-[1.1] font-light">
              Freshness <span className="italic">Has a Clock.</span>
            </h2>
            <div className="h-0.5 w-16 bg-amber-500/30 my-4" />
            <p className="text-base text-[#f5f3ef]/70 leading-relaxed font-light">
              Fresh crops decay rapidly after harvest. Without accurate insight into actual biochemical degradation thresholds, millions of tons of high-grade food are thrown away simply because supply lines miss their narrow consumption windows.
            </p>
            <p className="text-base text-[#f5f3ef]/70 leading-relaxed font-light">
              Sanjeevani bridges this gap. By utilizing deep decay predictors, we connect producers directly to optimal commercial buyers, automatically dispatching remaining stocks to charities and NGOs when critical thresholds are reached.
            </p>
          </div>

          <div className="lg:col-span-5 grid grid-cols-2 gap-6">
            <div className="bg-[#051109]/80 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-2 backdrop-blur-sm">
              <span className="text-3xl md:text-5xl font-display-serif text-red-400 font-bold block">35%</span>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Average produce lost globally before retail</p>
            </div>
            <div className="bg-[#051109]/80 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-2 backdrop-blur-sm">
              <span className="text-3xl md:text-5xl font-display-serif text-amber-400 font-bold block">Hours</span>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Mean response time required for distribution</p>
            </div>
            <div className="bg-[#051109]/80 border border-[#f5f3ef]/5 p-6 rounded-2xl col-span-2 space-y-2 backdrop-blur-sm">
              <span className="text-xl font-display-serif text-emerald-400 font-bold block">Surplus → Opportunity</span>
              <p className="text-xs text-slate-400 leading-relaxed">Dynamic pricing floor algorithms match near-expiry stocks to active demand streams instantly.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 2: The Intelligence */}
      <section id="intelligence" className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#040e09] to-[#04120c] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-semibold">Biochemical Predictions</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              Know What <span className="italic">Happens Next.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Interactive prediction matrices modeling moisture degradation, harvest timelines, and baseline decay curves.
            </p>
          </div>

          {/* Interactive Produce Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Card Selectors */}
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
              <button 
                onClick={() => setActiveCardTab('tomato')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeCardTab === 'tomato' 
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                    : 'bg-slate-900/20 border-transparent hover:border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-lg mr-2">🍅</span> Tomato (टमाटर)
              </button>
              <button 
                onClick={() => setActiveCardTab('apple')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeCardTab === 'apple' 
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                    : 'bg-slate-900/20 border-transparent hover:border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-lg mr-2">🍎</span> Apple (आम/सेब)
              </button>
              <button 
                onClick={() => setActiveCardTab('spinach')}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  activeCardTab === 'spinach' 
                    ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                    : 'bg-slate-900/20 border-transparent hover:border-slate-800 text-slate-400'
                }`}
              >
                <span className="text-lg mr-2">🥬</span> Spinach (पालक)
              </button>
            </div>

            {/* Simulated Live Premium Floating Card */}
            <div className="lg:col-span-8 bg-[#051109]/90 border border-[#f5f3ef]/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-amber-500/20 transition-all duration-500">
              <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl">🌿</div>
              
              {activeCardTab === 'tomato' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold">Produce Code: T-0922</span>
                      <h3 className="text-3xl font-display-serif text-slate-100 mt-1 font-bold">Plum Tomato</h3>
                    </div>
                    <span className="bg-amber-950 text-amber-400 font-extrabold text-xs px-3 py-1 rounded-full border border-amber-800/30">
                      Moderate Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800/50 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Predicted Freshness</span>
                      <span className="font-extrabold text-lg text-amber-400">82%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Shelf-Life Estimate</span>
                      <span className="font-extrabold text-lg text-slate-100">3 Days</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Storage Temp</span>
                      <span className="font-extrabold text-lg text-slate-100">12°C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Humidity Target</span>
                      <span className="font-extrabold text-lg text-slate-100">90%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl text-xs">
                    <span className="text-xl">💡</span>
                    <p className="text-slate-300">
                      <strong>Preservation Action Required:</strong> Move block to cold storage. Initiate Bounded bargaining with nearby retailers within 12 hours to secure optimal floor price.
                    </p>
                  </div>
                </div>
              )}

              {activeCardTab === 'apple' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-emerald-450 font-bold">Produce Code: A-0199</span>
                      <h3 className="text-3xl font-display-serif text-slate-100 mt-1 font-bold">Royal Gala Apple</h3>
                    </div>
                    <span className="bg-emerald-950 text-emerald-400 font-extrabold text-xs px-3 py-1 rounded-full border border-emerald-800/30">
                      Safe / Stable
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800/50 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Predicted Freshness</span>
                      <span className="font-extrabold text-lg text-emerald-400">95%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Shelf-Life Estimate</span>
                      <span className="font-extrabold text-lg text-slate-100">22 Days</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Storage Temp</span>
                      <span className="font-extrabold text-lg text-slate-100">1°C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Humidity Target</span>
                      <span className="font-extrabold text-lg text-slate-100">90%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl text-xs">
                    <span className="text-xl">💡</span>
                    <p className="text-slate-300">
                      <strong>Preservation Action Required:</strong> Keep in sealed crates under optimal humidity. Stock is stable and has no urgent risk parameters.
                    </p>
                  </div>
                </div>
              )}

              {activeCardTab === 'spinach' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-red-400 font-bold">Produce Code: S-0044</span>
                      <h3 className="text-3xl font-display-serif text-slate-100 mt-1 font-bold">Organic Spinach</h3>
                    </div>
                    <span className="bg-red-950 text-red-400 font-extrabold text-xs px-3 py-1 rounded-full border border-red-800/30">
                      Critical Risk
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800/50 text-xs">
                    <div>
                      <span className="text-slate-500 block mb-1">Predicted Freshness</span>
                      <span className="font-extrabold text-lg text-red-400">41%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Shelf-Life Estimate</span>
                      <span className="font-extrabold text-lg text-red-400">1 Day</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Storage Temp</span>
                      <span className="font-extrabold text-lg text-slate-100">0°C</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Humidity Target</span>
                      <span className="font-extrabold text-lg text-slate-100">95%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl text-xs">
                    <span className="text-xl">💡</span>
                    <p className="text-slate-300">
                      <strong>Preservation Action Required:</strong> Free NGO Rescue triggered automatically. Re-routing all remaining quantities to verified local community kitchens within 4 hours.
                    </p>
                  </div>
                </div>
              )}

            </div>

          </div>

        </div>
      </section>

      {/* Section 3: Freshness Timeline */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#04120c] to-[#04180f] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold">Supply Traceability</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              The Journey of <span className="italic">Decay.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Track quality degradation points from farm gates to consumer plates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            
            {/* Step 1 */}
            <div className="bg-[#051109]/50 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
              <span className="text-amber-200/30 text-4xl font-display-serif block font-bold">01</span>
              <h4 className="font-extrabold text-sm text-slate-100">Harvest / Arrival</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Crops logged with exact timestamp. Optimal temperature thresholds initialized.</p>
            </div>

            {/* Step 2 */}
            <div className="bg-[#051109]/50 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
              <span className="text-amber-200/30 text-4xl font-display-serif block font-bold">02</span>
              <h4 className="font-extrabold text-sm text-slate-100">Cold Chain</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Active telemetry monitors storage moisture parameters and shelf-life forecasts.</p>
            </div>

            {/* Step 3 */}
            <div className="bg-[#051109]/50 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
              <span className="text-amber-200/30 text-4xl font-display-serif block font-bold">03</span>
              <h4 className="font-extrabold text-sm text-slate-100">Marketplace</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Active listings paired to commercial buyer agents via automated price floors.</p>
            </div>

            {/* Step 4 */}
            <div className="bg-[#051109]/50 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
              <span className="text-amber-200/30 text-4xl font-display-serif block font-bold">04</span>
              <h4 className="font-extrabold text-sm text-slate-100">NGO Dispatch</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">If waste risk crosses 65%, automated routing notifies regional NGOs for pickup.</p>
            </div>

            {/* Step 5 */}
            <div className="bg-[#051109]/50 border border-[#f5f3ef]/5 p-6 rounded-2xl space-y-4 backdrop-blur-sm">
              <span className="text-amber-200/30 text-4xl font-display-serif block font-bold">05</span>
              <h4 className="font-extrabold text-sm text-slate-100">Zero Waste</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">100% of produce successfully channeled to commercial kitchens or soup shelters.</p>
            </div>

          </div>

        </div>
      </section>

      {/* Section 4: Smart Redistribution */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#04180f] to-[#03150d] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-450 font-semibold block">Preservation Routing</span>
              <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-[1.1] font-light">
                When It Can't Be Sold, <br />
                <span className="italic font-normal text-amber-100">It Can Still Matter.</span>
              </h2>
              <div className="h-0.5 w-16 bg-amber-500/30 my-4" />
              <p className="text-base text-[#f5f3ef]/70 leading-relaxed font-light">
                Our algorithmic gateway maps decay velocities dynamically. When produce approaches critical shelf-life markers, it transitions from traditional marketplaces to local community projects.
              </p>
              <div className="flex gap-4 items-center text-xs tracking-wider uppercase font-bold text-amber-200">
                <span>Predict</span>
                <span>→</span>
                <span>Decide</span>
                <span>→</span>
                <span>Redirect</span>
              </div>
            </div>

            {/* Smart Routing Visualizer Cards */}
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-[#051109]/95 border border-[#f5f3ef]/5 hover:border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4 transition-all">
                <span className="text-2xl p-3 bg-emerald-950 rounded-xl text-emerald-400">🏢</span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Discount Retailers</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Automated discounts offered to local stores for near-expiry crops.</p>
                </div>
              </div>
              <div className="bg-[#051109]/95 border border-[#f5f3ef]/5 hover:border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4 transition-all">
                <span className="text-2xl p-3 bg-teal-950 rounded-xl text-teal-400">💚</span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Verified NGOs</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Free dispatch logistics for soup kitchens and emergency shelters.</p>
                </div>
              </div>
              <div className="bg-[#051109]/95 border border-[#f5f3ef]/5 hover:border-emerald-500/20 p-5 rounded-2xl flex items-center gap-4 transition-all">
                <span className="text-2xl p-3 bg-amber-950 rounded-xl text-amber-400">🍂</span>
                <div>
                  <h4 className="font-extrabold text-sm text-slate-100">Compost &amp; Feed</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Final fallback routing ensuring organic materials return to soil nourishment cycles.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 5: Interactive Custom Map */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#03150d] to-[#041910] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold">Active Distribution Nodes</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              Live Rescue <span className="italic">Grid.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Active farms, buyers, and NGO rescue dispatch locations in real-time coordination.
            </p>
          </div>

          {/* Immersive Organic Custom Map */}
          <div className="bg-[#051109]/95 border border-[#f5f3ef]/10 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]">
            <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050c08] opacity-60 z-10" />
            
            {/* Custom SVG Map Visualization */}
            <svg viewBox="0 0 800 400" className="w-full h-auto max-w-4xl text-emerald-900/20 fill-current opacity-80 z-0">
              <path d="M 100,200 Q 200,100 300,180 T 500,120 T 700,220" stroke="rgba(245, 158, 11, 0.15)" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
              <path d="M 150,250 Q 300,320 450,220 T 750,280" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
              <path d="M 220,100 Q 350,150 480,80 T 650,180" stroke="rgba(16, 185, 129, 0.15)" strokeWidth="1.5" strokeDasharray="5 5" fill="none" />
            </svg>

            {/* Glowing Map Markers */}
            <div className="absolute top-1/3 left-1/4 z-20 flex flex-col items-center group cursor-pointer">
              <span className="relative flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-amber-500"></span>
              </span>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] mt-2 absolute -top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                🌾 Ramesh Farms (Tomato ID: 81)
              </div>
            </div>

            <div className="absolute top-[60%] left-[45%] z-20 flex flex-col items-center group cursor-pointer">
              <span className="relative flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-emerald-500"></span>
              </span>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] mt-2 absolute -top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                🏢 Delhi Mandi (Active Buyer)
              </div>
            </div>

            <div className="absolute top-[25%] right-[25%] z-20 flex flex-col items-center group cursor-pointer">
              <span className="relative flex h-4.5 w-4.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4.5 w-4.5 bg-red-500"></span>
              </span>
              <div className="bg-slate-900/90 border border-slate-800 rounded-lg p-2 text-[10px] mt-2 absolute -top-12 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                💚 NGO Soup Kitchen (Rescue Dispatch)
              </div>
            </div>

            <div className="absolute bottom-6 left-6 text-[10px] text-slate-500 font-medium">
              💡 Hover glowing nodes to inspect live active transactions
            </div>

          </div>

        </div>
      </section>

      {/* Section 6: How It Works */}
      <section id="how-it-works" className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#041910] to-[#04140c] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-400 font-semibold">Platform Operation</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              How It <span className="italic">Works.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Four steps that prevent food from going to waste.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">01 — Capture</span>
              <h4 className="text-lg font-bold text-slate-100">Upload Produce</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Producers register harvest date, quantity, storage temperature, and humidity directly in the portal.</p>
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">02 — Predict</span>
              <h4 className="text-lg font-bold text-slate-100">AI Analysis</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Our machine learning models estimate decay velocities, spoilage risks, and remaining days.</p>
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">03 — Detect Risk</span>
              <h4 className="text-lg font-bold text-slate-100">Assess Thresholds</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">The system alerts when the crop approaches its critical window, suggesting floor price discounts.</p>
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-bold block">04 — Redirect</span>
              <h4 className="text-lg font-bold text-slate-100">Fulfill Rescue</h4>
              <p className="text-xs text-slate-400 leading-relaxed font-light">Near-expiry crops are purchased by discount buyer agents or auto-redirected to NGOs for free pickup.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 7: Impact */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#04140c] to-[#041009] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold">ESG Auditing Tracker</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              Less Waste. <span className="italic">More Value.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-[#051109]/30 border border-[#f5f3ef]/5 rounded-2xl space-y-2">
              <span className="text-4xl md:text-6xl font-display-serif text-emerald-400 font-bold block">15,800kg</span>
              <p className="text-xs text-slate-400">Total volume of fresh produce rescued to date</p>
            </div>
            <div className="p-8 bg-[#051109]/30 border border-[#f5f3ef]/5 rounded-2xl space-y-2">
              <span className="text-4xl md:text-6xl font-display-serif text-amber-400 font-bold block">94%</span>
              <p className="text-xs text-slate-400">Efficiency rating in commercial negotiation settlement</p>
            </div>
            <div className="p-8 bg-[#051109]/30 border border-[#f5f3ef]/5 rounded-2xl space-y-2">
              <span className="text-4xl md:text-6xl font-display-serif text-sky-400 font-bold block">4.8 Hours</span>
              <p className="text-xs text-slate-400">Average response time for local NGO collection dispatch</p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="py-40 px-6 md:px-12 bg-gradient-to-b from-[#041009] to-[#050c08] border-t border-[#f5f3ef]/5 text-center relative z-20 overflow-hidden">
        
        {/* Background Trees Silhouette Overlay */}
        <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
          <img 
            src="https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&q=80&w=2000" 
            alt="Forest Trees background"
            className="w-full h-full object-cover filter saturate-0 contrast-125"
          />
        </div>

        <div className="relative max-w-3xl mx-auto space-y-8 z-10">
          <h2 className="text-5xl md:text-7xl font-display-serif text-[#f5f3ef] font-light leading-tight">
            Give Freshness <br />
            <span className="italic font-normal text-amber-100">More Time.</span>
          </h2>
          <p className="text-base text-[#f5f3ef]/70 leading-relaxed font-light max-w-xl mx-auto">
            Turn predicted spoilage into timely action. Put the power of AI-native produce prediction inside your supply chain.
          </p>
          <div className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link 
              to="/producer"
              className="px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold bg-[#f5f3ef] text-[#050c08] hover:bg-amber-100 transition-all shadow-xl shadow-black/40 hover:-translate-y-0.5"
            >
              Start Saving Produce
            </Link>
            <a 
              href="#how-it-works"
              className="px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold border border-[#f5f3ef]/25 hover:border-[#f5f3ef]/45 text-[#f5f3ef] hover:bg-[#f5f3ef]/5 transition-all"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#030704] border-t border-[#f5f3ef]/5 py-12 px-6 md:px-12 text-[#f5f3ef]/55 text-xs relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span className="font-display-serif text-slate-100 font-bold text-base tracking-wide">Sanjeevani</span>
            </div>
            <p className="leading-relaxed font-light pr-4">
              AI-Native Fresh Produce Preservation, dynamic decay modeling, autonomous bargaining, and zero-waste NGO rescue routing.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 uppercase tracking-widest text-[10px]">Operations</h4>
            <ul className="space-y-2">
              <li><Link to="/producer" className="hover:text-amber-200 transition-colors">Producer Dashboard</Link></li>
              <li><Link to="/buyer" className="hover:text-amber-200 transition-colors">Buyer Agent Portal</Link></li>
              <li><Link to="/ngo" className="hover:text-amber-200 transition-colors">NGO Rescue Hub</Link></li>
              <li><Link to="/analytics" className="hover:text-amber-200 transition-colors">Waste Analytics</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 uppercase tracking-widest text-[10px]">Portal Core</h4>
            <ul className="space-y-2">
              <li><Link to="/listings" className="hover:text-amber-200 transition-colors">Listings Registers</Link></li>
              <li><Link to="/browse" className="hover:text-amber-200 transition-colors">Browse Batches</Link></li>
              <li><a href="#how-it-works" className="hover:text-amber-200 transition-colors">System Mechanics</a></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-slate-100 uppercase tracking-widest text-[10px]">Contact &amp; Location</h4>
            <p className="leading-relaxed font-light">
              Sanjeevani Technologies Co.<br />
              New Delhi National Capital Region, India<br />
              Email: info@sanjeevani-preserve.org
            </p>
          </div>

        </div>
        <div className="max-w-6xl mx-auto border-t border-slate-900 mt-12 pt-6 flex flex-col sm:flex-row justify-between text-[11px] text-slate-500 font-light">
          <p>© {new Date().getFullYear()} Sanjeevani. Empowering eco-intelligent agricultural supply nodes.</p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:underline">Privacy Charter</a>
            <a href="#" className="hover:underline">System Terms</a>
          </div>
        </div>
      </footer>

      <ActivityLog />
    </div>
  )
}

export default App