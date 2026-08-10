import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ActivityLog } from './components/log-console/ActivityLog'

interface MapNode {
  id: string
  type: 'producer' | 'buyer' | 'ngo'
  name: string
  x: number
  y: number
  produce?: string
  qty?: string
  freshness?: string
  urgency?: string
  status: string
  required?: string
  distance?: string
  capacity?: string
  available?: string
}

export const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  
  // Selection states
  const [activeCardTab, setActiveCardTab] = useState<'tomato' | 'apple' | 'spinach' | 'potato' | 'carrot'>('tomato')
  const [activeTimelineStage, setActiveTimelineStage] = useState(0)
  const [decayDay, setDecayDay] = useState(0)
  const [selectedMapNode, setSelectedMapNode] = useState<MapNode | null>(null)
  const [hoveredMapNode, setHoveredMapNode] = useState<MapNode | null>(null)
  const [smartMatchTarget, setSmartMatchTarget] = useState<'buyer' | 'ngo' | 'kitchen'>('buyer')

  // Stats auto-counter simulation on viewport enter
  const [statsCounter, setStatsCounter] = useState({ lost: 0, time: 0, saved: 0, meals: 0 })

  const heroRef = useRef<HTMLDivElement>(null)

  // Listen to scroll events
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen to mouse movement for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      const width = window.innerWidth
      const height = window.innerHeight
      const x = (clientX / width) - 0.5
      const y = (clientY / height) - 0.5
      setMousePos({ x, y })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Auto increment counters for cinematic load
  useEffect(() => {
    const timer = setInterval(() => {
      setStatsCounter(prev => ({
        lost: prev.lost < 35 ? prev.lost + 1 : 35,
        time: prev.time < 4.8 ? Math.min(prev.time + 0.2, 4.8) : 4.8,
        saved: prev.saved < 12480 ? prev.saved + 240 : 12480,
        meals: prev.meals < 3240 ? prev.meals + 80 : 3240
      }))
    }, 40)
    return () => clearInterval(timer)
  }, [])

  // Parallax calculations
  const heroHeight = heroRef.current?.clientHeight || 800
  const scrollRatio = Math.min(scrollY / heroHeight, 1)
  
  const bgScale = 1 + scrollRatio * 0.15
  const bgTranslateY = scrollRatio * 120
  const midTranslateY = scrollRatio * -60
  const textTranslateY = scrollRatio * 80
  const textOpacity = 1 - scrollRatio * 1.5

  const mouseX = mousePos.x
  const mouseY = mousePos.y

  // Map nodes dataset
  const mapNodes: MapNode[] = [
    { id: 'farm_a', type: 'producer', name: 'Green Valley Farm', x: 120, y: 150, produce: 'Tomato', qty: '120 kg', freshness: '48%', urgency: 'HIGH', status: 'Redirect within 12 hrs' },
    { id: 'farm_b', type: 'producer', name: 'Valley Organic Crops', x: 220, y: 80, produce: 'Spinach', qty: '80 kg', freshness: '41%', urgency: 'HIGH', status: 'NGO Rescue pending' },
    { id: 'retail_a', type: 'buyer', name: 'Delhi Supermart', x: 420, y: 180, required: '150 kg', produce: 'Tomato', distance: '4.2 km', status: 'ACCEPTING' },
    { id: 'retail_b', type: 'buyer', name: 'Noida Veg Distributors', x: 480, y: 250, required: '200 kg', produce: 'Apple', distance: '8.5 km', status: 'ACCEPTING' },
    { id: 'ngo_a', type: 'ngo', name: 'Greater Noida Food Bank', x: 650, y: 120, capacity: '500 kg', available: '320 kg', distance: '3.2 km', status: 'ACTIVE' },
    { id: 'ngo_b', type: 'ngo', name: 'Delhi Community Kitchen', x: 600, y: 280, capacity: '300 kg', available: '140 kg', distance: '5.1 km', status: 'ACTIVE' }
  ]

  // Timeline dataset
  const timelineStages = [
    { title: 'Harvest', freshness: 100, temp: '14°C', hum: '85%', desc: 'Crops detached. Baseline decay calculations set.' },
    { title: 'Transport', freshness: 92, temp: '12°C', hum: '85%', desc: 'Cold chain transit. Active telemetry tracking.' },
    { title: 'Storage', freshness: 84, temp: '6°C', hum: '90%', desc: 'Microclimate validation in regional warehouses.' },
    { title: 'Retail', freshness: 72, temp: '16°C', hum: '80%', desc: 'Shelf placement. Dynamic bargain pricing triggers.' },
    { title: 'NGO Rescue', freshness: 45, temp: '18°C', hum: '75%', desc: 'Critical preservation threshold crossed. Redirection.' }
  ]

  // Interactive selector parameters
  const produceIntelligence = {
    tomato: { name: 'Tomato', freshness: 82, life: '3 Days', temp: '12°C', hum: '90%', risk: 'Moderate', code: 'T-0922', desc: 'Preservation Action Required: Move to cold storage. Initiate buyer bargaining.' },
    apple: { name: 'Apple', freshness: 94, life: '12 Days', temp: '4°C', hum: '90%', risk: 'Low', code: 'A-0199', desc: 'Preservation Action Required: Keep in sealed crates. Stock is stable.' },
    spinach: { name: 'Spinach', freshness: 61, life: '1 Day', temp: '2°C', hum: '95%', risk: 'High', code: 'S-0044', desc: 'Preservation Action Required: Automatic NGO rescue triggered. Re-route in 4 hours.' },
    potato: { name: 'Potato', freshness: 89, life: '28 Days', temp: '8°C', hum: '90%', risk: 'Low', code: 'P-0881', desc: 'Preservation Action Required: Stable bulk storage. No urgent action needed.' },
    carrot: { name: 'Carrot', freshness: 75, life: '7 Days', temp: '3°C', hum: '95%', risk: 'Moderate', code: 'C-0422', desc: 'Preservation Action Required: Monitor weight/water loss rates in dry room.' }
  }

  // Decay properties based on slider day (0 to 4)
  const decayVisual = [
    { label: 'Fresh', desc: 'Peak biochemical levels', color: 'text-emerald-400', sepia: 0, saturate: 100, blur: 0, scale: 1 },
    { label: 'Good', desc: 'Standard distribution grade', color: 'text-emerald-500', sepia: 10, saturate: 90, blur: 0.2, scale: 0.99 },
    { label: 'Aging', desc: 'Water loss starting', color: 'text-amber-400', sepia: 25, saturate: 75, blur: 0.5, scale: 0.97 },
    { label: 'Risk', desc: 'Urgent commercial action required', color: 'text-amber-500', sepia: 50, saturate: 60, blur: 1, scale: 0.95 },
    { label: 'Critical', desc: 'Redirecting to NGO loop', color: 'text-red-400', sepia: 80, saturate: 40, blur: 2, scale: 0.92 }
  ]

  const activeDecay = decayVisual[decayDay]

  return (
    <div className="min-h-screen bg-[#050c08] text-[#f5f3ef] selection:bg-amber-600/30 selection:text-amber-200 relative overflow-hidden font-sans">
      
      {/* Film Grain Effect */}
      <div className="film-grain" />

      {/* Floating Ambient Atmosphere (Orbs) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Running Forest Background Animation */}
        <div className="absolute inset-0 bg-running-forest opacity-[0.08] mix-blend-color-dodge" />
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
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 md:px-12 transition-all duration-500 bg-[#050c08]/50 backdrop-blur-md border-b border-[#f5f3ef]/5">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 group">
            <span className="text-2xl transition-transform duration-700 group-hover:rotate-12">🌿</span>
            <div>
              <span className="font-display-serif text-xl font-bold tracking-wide text-amber-250 group-hover:text-amber-100 transition-colors">Sanjeevani</span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#f5f3ef]/70 font-sans font-semibold">Freshness Intelligence</span>
            </div>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8 text-sm uppercase tracking-[0.15em] font-bold text-[#f5f3ef]/90">
            <Link to="/producer" className="hover:text-amber-250 transition-colors">Producer Portal</Link>
            <Link to="/buyer" className="hover:text-amber-250 transition-colors">Buyer Agent</Link>
            <Link to="/ngo" className="hover:text-amber-250 transition-colors">NGO Rescue</Link>
            <Link to="/analytics" className="hover:text-amber-250 transition-colors">Analytics</Link>
          </nav>

          <Link
            to="/producer"
            className="text-xs uppercase tracking-[0.1em] font-extrabold border border-amber-500/40 hover:border-amber-400 bg-amber-950/30 hover:bg-amber-900/50 text-amber-200 px-6 py-3 rounded-xl transition-all"
          >
            Launch System
          </Link>
        </div>
      </header>

      {/* Cinematic Hero Section (Unchanged) */}
      <section ref={heroRef} className="h-screen w-full relative flex items-center justify-center overflow-hidden z-10">
        <div 
          className="absolute inset-0 z-0 scale-105 pointer-events-none"
          style={{
            transform: `translate3d(${mouseX * -10}px, ${mouseY * -10 + bgTranslateY * 0.5}px, 0) scale(${bgScale})`,
            transition: 'transform 0.15s ease-out'
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,12,8,0)_30%,rgba(5,12,8,0.55)_90%)] z-10" />
          <img 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=2000" 
            alt="Cinematic Agriculture Sunrise Landscape" 
            className="w-full h-full object-cover filter brightness-[0.75] saturate-[0.8] sepia-[0.1]" 
          />
        </div>

        {/* Swaying Middle Crops */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 z-10 pointer-events-none scale-105 select-none"
             style={{ transform: `translate3d(${mouseX * -18}px, ${mouseY * -18 + midTranslateY * 0.7}px, 0)`, transition: 'transform 0.15s ease-out' }}>
          <div className="absolute bottom-0 left-[10%] w-32 h-48 opacity-80 animate-sway-slow">
            <svg viewBox="0 0 100 150" className="w-full h-full text-emerald-800/85 fill-current">
              <path d="M50,150 C30,120 10,90 20,60 C30,30 50,0 50,0 C50,0 70,30 80,60 C90,90 70,120 50,150 Z" />
              <path d="M50,150 C40,110 30,80 35,50 C40,20 50,10 50,10 C50,10 60,20 65,50 C70,80 60,110 50,150 Z" className="text-emerald-700/85" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-[15%] w-36 h-52 opacity-80 animate-sway-slow" style={{ animationDelay: '-2s' }}>
            <svg viewBox="0 0 100 150" className="w-full h-full text-emerald-800/85 fill-current">
              <path d="M50,150 C30,120 10,90 20,60 C30,30 50,0 50,0 C50,0 70,30 80,60 C90,90 70,120 50,150 Z" />
              <path d="M50,150 C40,110 30,80 35,50 C40,20 50,10 50,10 C50,10 60,20 65,50 C70,80 60,110 50,150 Z" className="text-emerald-700/85" />
            </svg>
          </div>
        </div>

        {/* Swaying Foreground Crops */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 z-20 pointer-events-none scale-110 select-none"
             style={{ transform: `translate3d(${mouseX * -25}px, ${mouseY * -25 + midTranslateY * 0.9}px, 0)`, transition: 'transform 0.15s ease-out' }}>
          <div className="absolute bottom-[-20px] left-[-30px] w-64 h-80 opacity-95 animate-sway-medium">
            <svg viewBox="0 0 200 300" className="w-full h-full text-emerald-950 fill-current">
              <path d="M10,300 C30,230 80,150 110,80 C130,30 150,0 150,0 C150,0 150,40 130,100 C110,160 60,240 10,300 Z" className="text-emerald-900" />
              <path d="M0,300 C40,240 100,180 120,110 C135,50 135,10 135,10 C135,10 125,50 105,120 C85,190 35,260 0,300 Z" className="text-emerald-850" />
              <path d="M80,150 Q110,100 130,50" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="3" fill="none" />
            </svg>
          </div>
          <div className="absolute bottom-[-20px] right-[-30px] w-72 h-88 opacity-95 animate-sway-medium" style={{ animationDelay: '-1.5s', transform: 'scaleX(-1)' }}>
            <svg viewBox="0 0 200 300" className="w-full h-full text-emerald-950 fill-current">
              <path d="M10,300 C30,230 80,150 110,80 C130,30 150,0 150,0 C150,0 150,40 130,100 C110,160 60,240 10,300 Z" className="text-emerald-900" />
              <path d="M0,300 C40,240 100,180 120,110 C135,50 135,10 135,10 C135,10 125,50 105,120 C85,190 35,260 0,300 Z" className="text-emerald-850" />
              <path d="M80,150 Q110,100 130,50" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="3" fill="none" />
            </svg>
          </div>
        </div>

        {/* Particles */}
        <div className="absolute inset-0 z-20 pointer-events-none mix-blend-screen opacity-50"
             style={{ transform: `translate3d(${mouseX * 15}px, ${mouseY * 15 + midTranslateY * 0.4}px, 0)`, transition: 'transform 0.15s ease-out' }}>
          <div className="absolute w-2.5 h-2.5 bg-amber-400/40 rounded-full blur-[1px] top-1/4 left-1/3 animate-float-slow" />
          <div className="absolute w-3.5 h-3.5 bg-emerald-500/20 rounded-full blur-[2px] bottom-1/3 right-1/4 animate-float-slower" />
          <div className="absolute w-2 h-2 bg-amber-200/35 rounded-full top-1/2 left-2/3 animate-float-slow" />
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(5,12,8,0.65)_0%,rgba(5,12,8,0.25)_55%,transparent_90%)] z-25 pointer-events-none" />

        {/* Central Content */}
        <div className="relative max-w-4xl mx-auto px-6 text-center z-30 transition-organic"
             style={{ transform: `translate3d(0, ${textTranslateY}px, 0)`, opacity: textOpacity }}>
          <div className="inline-flex items-center gap-2 bg-[#f5f3ef]/10 border border-[#f5f3ef]/20 rounded-full px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-amber-250 font-bold backdrop-blur-md mb-8 animate-fade-in-up">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI-Native Preservation Network
          </div>
          <h1 className="text-6xl md:text-9xl font-display-serif tracking-tight text-[#f5f3ef] leading-[1.05] mb-8 font-light">
            Every Harvest <br />
            <span className="italic font-normal text-amber-100">Has a Window.</span>
          </h1>
          <p className="text-lg md:text-xl text-[#f5f3ef]/90 max-w-2xl mx-auto font-medium leading-relaxed mb-12">
            Predict freshness. Reduce waste. Redirect surplus. Give every piece of produce a better chance to reach a plate.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">
            <a href="#intelligence" className="px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold bg-[#f5f3ef] text-[#050c08] hover:bg-amber-100 transition-all duration-300 shadow-xl shadow-black/40 hover:-translate-y-0.5">
              Explore the Intelligence
            </a>
            <a href="#how-it-works" className="px-8 py-4 rounded-xl text-xs uppercase tracking-[0.15em] font-bold border border-[#f5f3ef]/20 hover:border-[#f5f3ef]/40 text-[#f5f3ef] hover:bg-[#f5f3ef]/5 transition-all duration-300">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Section 1: Freshness Has a Clock */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#050c08] via-[#030905] to-[#040e09] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
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
            
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#f5f3ef]/10">
              <div>
                <span className="text-3xl font-display-serif text-red-400 font-bold block">{statsCounter.lost}%</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Produce Lost</span>
              </div>
              <div>
                <span className="text-3xl font-display-serif text-amber-400 font-bold block">{statsCounter.time} Hrs</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Response Time</span>
              </div>
              <div>
                <span className="text-lg font-bold text-emerald-400 block mt-1.5">Active Match</span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">Surplus Loop</span>
              </div>
            </div>
          </div>

          {/* Interactive Freshness Clock Centerpiece */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-80 h-80 bg-slate-900/60 border border-[#f5f3ef]/10 rounded-full p-8 shadow-2xl backdrop-blur-md flex flex-col justify-center items-center group hover:border-amber-500/30 transition-all duration-700">
              
              {/* Animated Circular Ring SVG */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90 scale-95" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="42" 
                  stroke="rgba(245, 158, 11, 0.05)" 
                  strokeWidth="2" 
                  fill="transparent" 
                />
                <circle 
                  cx="50" cy="50" r="42" 
                  stroke="#f5a708" 
                  strokeWidth="2.5" 
                  fill="transparent" 
                  strokeDasharray="264" 
                  strokeDashoffset={264 - (264 * 0.82)}
                  className="transition-all duration-1000 group-hover:stroke-emerald-500"
                />
              </svg>

              <div className="text-center space-y-2 z-10">
                <span className="text-[10px] uppercase tracking-[0.2em] text-[#f5f3ef]/50">Freshness Status</span>
                <div className="text-5xl font-display-serif text-amber-200 group-hover:text-emerald-350 transition-colors font-bold">82%</div>
                <div className="inline-block bg-amber-950/60 border border-amber-800/40 text-amber-300 text-[10px] uppercase tracking-wider px-3.5 py-1 rounded-full font-bold">
                  Tomato (टमाटर)
                </div>
                <p className="text-xs text-slate-400 font-light mt-2">Predicted window: <span className="font-bold text-slate-200">3 Days</span></p>
                <p className="text-[10px] text-amber-400 font-semibold tracking-wide uppercase">Moderate Risk</p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* Section 2: Interactive Produce Prediction Panel */}
      <section id="intelligence" className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#040e09] to-[#04120c] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-450 font-semibold">Biochemical Predictions</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              Know What <span className="italic">Happens Next.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Interactive prediction matrices modeling moisture degradation, harvest timelines, and baseline decay curves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Interactive Selectors List */}
            <div className="lg:col-span-4 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0">
              {Object.keys(produceIntelligence).map((key) => {
                const item = produceIntelligence[key as keyof typeof produceIntelligence]
                const isActive = activeCardTab === key
                return (
                  <button 
                    key={key}
                    onClick={() => setActiveCardTab(key as any)}
                    className={`w-full text-left p-4 rounded-xl border transition-all text-sm font-semibold flex justify-between items-center ${
                      isActive 
                        ? 'bg-amber-950/20 border-amber-500/40 text-amber-200' 
                        : 'bg-slate-900/20 border-transparent hover:border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>
                      {key === 'tomato' ? '🍅' : key === 'apple' ? '🍎' : key === 'spinach' ? '🥬' : key === 'potato' ? '🥔' : '🥕'} {item.name}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      item.risk === 'Low' ? 'bg-emerald-950/60 text-emerald-400' : item.risk === 'High' ? 'bg-red-990/60 text-red-400' : 'bg-amber-950/60 text-amber-400'
                    }`}>
                      {item.freshness}%
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Simulated Live Premium Floating Card with AI Scan Line */}
            <div className="lg:col-span-8 bg-[#051109]/95 border border-[#f5f3ef]/10 rounded-3xl p-8 backdrop-blur-md shadow-2xl relative overflow-hidden group hover:border-amber-500/25 transition-all duration-500">
              
              {/* Scanner Line Effect */}
              <div className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/80 to-transparent top-0 animate-[bounce_4s_infinite] z-30" />
              <div className="absolute top-0 right-0 p-8 opacity-5 text-9xl">🌿</div>
              
              <div className="space-y-6 relative z-10">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-amber-400/80 font-bold">Produce Code: {produceIntelligence[activeCardTab].code}</span>
                    <h3 className="text-3xl font-display-serif text-slate-100 mt-1 font-bold">
                      {produceIntelligence[activeCardTab].name} Batch
                    </h3>
                  </div>
                  <span className={`text-[11px] font-extrabold px-3 py-1.5 rounded-full border ${
                    produceIntelligence[activeCardTab].risk === 'Low' 
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40' 
                      : produceIntelligence[activeCardTab].risk === 'High' 
                      ? 'bg-red-950/80 text-red-300 border-red-800/40' 
                      : 'bg-amber-950/80 text-amber-300 border-amber-800/40'
                  }`}>
                    {produceIntelligence[activeCardTab].risk} Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4 border-y border-slate-800/50 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-1">Predicted Freshness</span>
                    <span className={`font-extrabold text-lg ${
                      produceIntelligence[activeCardTab].risk === 'Low' ? 'text-emerald-400' : produceIntelligence[activeCardTab].risk === 'High' ? 'text-red-400' : 'text-amber-400'
                    }`}>{produceIntelligence[activeCardTab].freshness}%</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Shelf-Life Estimate</span>
                    <span className="font-extrabold text-lg text-slate-100">{produceIntelligence[activeCardTab].life}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Storage Temp</span>
                    <span className="font-extrabold text-lg text-slate-100">{produceIntelligence[activeCardTab].temp}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-1">Humidity Target</span>
                    <span className="font-extrabold text-lg text-slate-100">{produceIntelligence[activeCardTab].hum}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-slate-950/40 p-4 rounded-xl text-xs">
                  <span className="text-xl">💡</span>
                  <p className="text-slate-350">
                    <strong>Preservation Guide:</strong> {produceIntelligence[activeCardTab].desc}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 3: Interactive Freshness Timeline */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#04120c] to-[#04180f] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold">Supply Traceability</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              The Journey of <span className="italic">Decay.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Interactive timeline following crops from harvest to distribution channels. Click steps to track variables.
            </p>
          </div>

          {/* Interactive Timeline Graph */}
          <div className="space-y-12">
            <div className="relative flex justify-between items-center max-w-4xl mx-auto">
              
              {/* Progress Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-slate-800 z-0" />
              <div 
                className="absolute left-0 h-0.5 bg-emerald-500 transition-all duration-700 z-0"
                style={{ width: `${(activeTimelineStage / 4) * 100}%` }}
              />

              {timelineStages.map((stage, idx) => {
                const isActive = activeTimelineStage === idx
                const isPassed = idx < activeTimelineStage
                return (
                  <button
                    key={idx}
                    onClick={() => setActiveTimelineStage(idx)}
                    className="relative flex flex-col items-center z-10 focus:outline-none group"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
                      isActive 
                        ? 'bg-slate-900 border-emerald-400 text-emerald-400 shadow-lg shadow-emerald-500/20 scale-115' 
                        : isPassed 
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-500' 
                        : 'bg-slate-950 border-slate-800 text-slate-500 group-hover:border-slate-700'
                    }`}>
                      <span className="text-xs font-bold">{idx + 1}</span>
                    </div>
                    <span className={`text-[10px] uppercase tracking-wider mt-2.5 font-bold transition-colors ${
                      isActive ? 'text-slate-100' : 'text-slate-500'
                    }`}>
                      {stage.title}
                    </span>
                  </button>
                )
              })}
            </div>

            {/* Interactive Timeline Detail Box */}
            <div className="max-w-xl mx-auto bg-[#051109]/80 border border-[#f5f3ef]/5 rounded-2xl p-6 backdrop-blur-sm space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-slate-100">Stage: {timelineStages[activeTimelineStage].title}</h4>
                <span className="text-xs font-extrabold text-emerald-400">
                  Predicted Freshness: {timelineStages[activeTimelineStage].freshness}%
                </span>
              </div>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                {timelineStages[activeTimelineStage].desc}
              </p>
              <div className="grid grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-slate-500 block mb-0.5">Stage Temp</span>
                  <span className="font-bold text-slate-200">{timelineStages[activeTimelineStage].temp}</span>
                </div>
                <div>
                  <span className="text-slate-500 block mb-0.5">Stage Humidity</span>
                  <span className="font-bold text-slate-200">{timelineStages[activeTimelineStage].hum}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 4: Produce Decay Visual Comparison */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#04180f] to-[#03150d] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-250 font-semibold block">Time-Series Simulations</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-[1.1] font-light">
              Visualizing <br />
              <span className="italic font-normal text-amber-100">Preservation Decay.</span>
            </h2>
            <div className="h-0.5 w-16 bg-amber-500/30 my-4" />
            <p className="text-sm text-slate-400 leading-relaxed font-light">
              Use the interactive slider to track predicted crop degradation velocities. Biochemical simulation maps cell structure loss, water evaporation levels, and surface color shifts across the harvest days timeline.
            </p>
            
            {/* Interactive Slider */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between text-xs text-slate-500 font-bold uppercase tracking-wider">
                <span>Day 0 (Harvest)</span>
                <span>Day 4 (Expiry)</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="4" 
                value={decayDay}
                onChange={(e) => setDecayDay(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 focus:outline-none"
              />
              <div className="flex justify-between items-center bg-slate-950/40 p-4 rounded-xl">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">Predicted State</span>
                  <p className={`text-base font-extrabold ${activeDecay.color}`}>{activeDecay.label}</p>
                </div>
                <p className="text-xs text-slate-400 italic">"{activeDecay.desc}"</p>
              </div>
            </div>
          </div>

          {/* Interactive Vegetable Decay Container */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="bg-[#051109]/95 border border-[#f5f3ef]/10 rounded-3xl p-10 shadow-2xl backdrop-blur-md flex flex-col justify-center items-center h-88 w-88 relative overflow-hidden">
              <div className="text-[10px] uppercase tracking-widest text-[#f5f3ef]/40 mb-6">Simulation Render</div>
              
              {/* Vegetable Illustration scaling/shifting via styles */}
              <div 
                className="w-36 h-36 flex items-center justify-center transition-all duration-500 relative"
                style={{ 
                  transform: `scale(${activeDecay.scale})`,
                  filter: `saturate(${activeDecay.saturate}%) sepia(${activeDecay.sepia}%) blur(${activeDecay.blur}px)`
                }}
              >
                <span className="text-9xl">🍅</span>
                <span className="absolute text-5xl bottom-0 opacity-40">🍂</span>
              </div>
              
              <p className="text-xs text-slate-500 font-light mt-8">Drag the slider to test degradation velocity</p>
            </div>
          </div>

        </div>
      </section>

      {/* Section 5: Rebuilt Live Rescue Grid Map */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#03150d] to-[#041910] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-450 font-semibold">Active Distribution Nodes</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              Live Rescue <span className="italic">Grid.</span>
            </h2>
            <p className="text-xs md:text-sm text-[#f5f3ef]/60 font-light">
              Active farms, buyers, and NGO rescue dispatch locations in real-time coordination. Click nodes to trace connections.
            </p>
          </div>

          {/* Map Statistics panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center max-w-4xl mx-auto bg-slate-900/30 p-4 border border-slate-800 rounded-2xl">
            <div>
              <span className="text-2xl font-bold text-amber-400">12</span>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Active Producers</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-sky-400">8</span>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Active Buyers</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-emerald-400">5</span>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">NGO Centers</p>
            </div>
            <div>
              <span className="text-2xl font-bold text-red-400">420 kg</span>
              <p className="text-[9px] uppercase tracking-wider text-slate-500">Produce At Risk</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* SVG Interactive Map */}
            <div className="lg:col-span-8 bg-[#051109]/95 border border-[#f5f3ef]/10 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[420px]">
              
              <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050c08] opacity-60 z-10 pointer-events-none" />
              
              {/* Map Layout */}
              <svg viewBox="0 0 800 400" className="w-full h-auto max-w-4xl z-0 relative">
                {/* Connection lines */}
                <line x1="120" y1="150" x2="420" y2="180" stroke="rgba(245, 158, 11, 0.4)" strokeWidth="2.5" strokeDasharray="6 4" className="animate-[dash_20s_linear_infinite]" />
                <line x1="220" y1="80" x2="600" y2="280" stroke="rgba(16, 185, 129, 0.4)" strokeWidth="2.5" strokeDasharray="6 4" />
                <line x1="120" y1="150" x2="650" y2="120" stroke="rgba(239, 68, 68, 0.2)" strokeWidth="1" />

                {/* Draw SVG map outlines / topography path decorative details */}
                <path d="M 50,100 C 150,150 250,50 350,120 T 550,220 T 750,100" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="2" fill="none" />
                
                {/* Dynamic Markers */}
                {mapNodes.map((node) => {
                  const isSelected = selectedMapNode?.id === node.id
                  const isHovered = hoveredMapNode?.id === node.id

                  return (
                    <g key={node.id} className="cursor-pointer" onClick={() => setSelectedMapNode(node)}>
                      {/* Circle target for hover/click */}
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r={isSelected || isHovered ? 16 : 10} 
                        fill={node.type === 'producer' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)'} 
                        className="transition-all"
                      />
                      <circle 
                        cx={node.x} 
                        cy={node.y} 
                        r="5" 
                        fill={node.type === 'producer' ? '#f59e0b' : node.type === 'buyer' ? '#3b82f6' : '#10b981'} 
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Absolute DOM placement of labels overlaying SVG nodes to enable standard tooltips */}
              {mapNodes.map((node) => {
                const markerColor = 
                  node.type === 'producer' 
                    ? 'bg-amber-500' 
                    : node.type === 'buyer' 
                    ? 'bg-sky-500' 
                    : 'bg-emerald-500'

                return (
                  <div 
                    key={node.id}
                    className="absolute"
                    style={{ left: `${(node.x / 800) * 100}%`, top: `${(node.y / 400) * 100}%` }}
                    onMouseEnter={() => setHoveredMapNode(node)}
                    onMouseLeave={() => setHoveredMapNode(null)}
                  >
                    <span className="relative flex h-3 w-3 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${markerColor}`}></span>
                    </span>
                  </div>
                )
              })}

              <div className="absolute bottom-4 left-6 text-[10px] text-slate-500 font-medium">
                💡 Click glowing nodes to lock trace logs. Hover to inspect status metrics.
              </div>

            </div>

            {/* Sidebar details panel */}
            <div className="lg:col-span-4 space-y-4">
              
              {/* Selected / Hovered Info */}
              {(selectedMapNode || hoveredMapNode) ? (
                <div className="bg-[#051109]/95 border border-amber-500/20 p-5 rounded-2xl space-y-4 backdrop-blur-sm shadow-xl">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                    <h4 className="font-bold text-sm text-slate-100">{(hoveredMapNode || selectedMapNode)?.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {(hoveredMapNode || selectedMapNode)?.type}
                    </span>
                  </div>
                  
                  <div className="text-xs space-y-2 text-slate-300 font-light">
                    {(hoveredMapNode || selectedMapNode)?.type === 'producer' && (
                      <>
                        <p>Crop listed: <strong className="text-slate-100">{(hoveredMapNode || selectedMapNode)?.produce}</strong></p>
                        <p>Quantity: <strong className="text-slate-100">{(hoveredMapNode || selectedMapNode)?.qty}</strong></p>
                        <p>Freshness: <strong className="text-red-400">{(hoveredMapNode || selectedMapNode)?.freshness}</strong></p>
                        <p>Recommended: <strong className="text-amber-400">{(hoveredMapNode || selectedMapNode)?.status}</strong></p>
                      </>
                    )}
                    {(hoveredMapNode || selectedMapNode)?.type === 'buyer' && (
                      <>
                        <p>Target Required: <strong className="text-slate-100">{(hoveredMapNode || selectedMapNode)?.required}</strong></p>
                        <p>Distance: <strong className="text-slate-100">{(hoveredMapNode || selectedMapNode)?.distance}</strong></p>
                        <p>Network Status: <strong className="text-emerald-450">{(hoveredMapNode || selectedMapNode)?.status}</strong></p>
                      </>
                    )}
                    {(hoveredMapNode || selectedMapNode)?.type === 'ngo' && (
                      <>
                        <p>Shelter Capacity: <strong className="text-slate-100">{(hoveredMapNode || selectedMapNode)?.capacity}</strong></p>
                        <p>Available Storage: <strong className="text-slate-100">{(hoveredMapNode || selectedMapNode)?.available}</strong></p>
                        <p>Rescue Loop: <strong className="text-emerald-450">{(hoveredMapNode || selectedMapNode)?.status}</strong></p>
                      </>
                    )}
                  </div>
                  {selectedMapNode && (
                    <button 
                      onClick={() => setSelectedMapNode(null)}
                      className="text-[10px] text-slate-500 underline font-bold mt-2"
                    >
                      Clear Selection
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-[#051109]/60 border border-[#f5f3ef]/5 p-5 rounded-2xl backdrop-blur-sm">
                  <h4 className="font-bold text-sm text-slate-350">Node Inspection</h4>
                  <p className="text-xs text-slate-500 mt-2 font-light leading-relaxed">
                    Select any farm or rescue center point on the live grid to verify freshness logs and routing destinations.
                  </p>
                </div>
              )}

              {/* Live Activity Feed */}
              <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-5 space-y-3 h-64 overflow-y-auto">
                <h4 className="text-[10px] uppercase tracking-widest text-[#f5f3ef]/45 font-bold mb-1">Live Activity</h4>
                <div className="space-y-2.5 text-xs text-slate-400 font-light leading-relaxed">
                  <p className="border-l border-amber-500/30 pl-2.5">🟢 <span className="font-semibold text-slate-300">Valley Organic</span> listed 80kg Spinach (Critical risk)</p>
                  <p className="border-l border-emerald-500/30 pl-2.5">💛 <span className="font-semibold text-slate-300">Delhi Food Bank</span> accepted 60kg Spinach dispatch</p>
                  <p className="border-l border-sky-500/30 pl-2.5">💙 <span className="font-semibold text-slate-300">Delhi Supermart</span> matched with 120kg Tomato</p>
                  <p className="border-l border-red-500/30 pl-2.5">🔴 <span className="font-semibold text-slate-350">Alert:</span> Freshness threshold warning for Apple batch</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Section 6: How It Works (Unchanged) */}
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

      {/* Section 6.5: Smart Match Interaction */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#04140c] to-[#041209] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold">Matchmaking Engine</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-tight font-light">
              Autonomous <span className="italic">Destinations.</span>
            </h2>
            <p className="text-xs text-slate-400 font-light">
              Hover destinations below to review algorithmic priority scores for produce matching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Buyer */}
            <div 
              onMouseEnter={() => setSmartMatchTarget('buyer')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                smartMatchTarget === 'buyer' 
                  ? 'bg-sky-950/20 border-sky-500/40 shadow-xl' 
                  : 'bg-slate-900/10 border-transparent hover:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">🏢</span>
                <span className="text-[9px] uppercase font-extrabold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded">
                  Priority 1 (Stable)
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">Discount Retailer</h4>
              <p className="text-xs text-slate-400 mt-2 font-light">Commercial matching via dynamic floor prices. Preferred when freshness is &gt; 65%.</p>
              
              {smartMatchTarget === 'buyer' && (
                <div className="mt-4 pt-4 border-t border-sky-900/40 text-[11px] text-slate-350 space-y-1">
                  <p>Target Match: <strong className="text-slate-200">92%</strong></p>
                  <p>Est. Value Recaptured: <strong className="text-emerald-450">₹2,400</strong></p>
                </div>
              )}
            </div>

            {/* NGO */}
            <div 
              onMouseEnter={() => setSmartMatchTarget('ngo')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                smartMatchTarget === 'ngo' 
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-xl' 
                  : 'bg-slate-900/10 border-transparent hover:border-slate-800'
              }`}
            >
              <div className="absolute top-2 right-2 text-[8px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded">
                AI Recommended
              </div>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">💚</span>
                <span className="text-[9px] uppercase font-extrabold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded">
                  Priority 2 (High Risk)
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">NGO Rescue Center</h4>
              <p className="text-xs text-slate-400 mt-2 font-light">Zero-cost dispatch redirection. Initiated automatically when freshness drops under 65%.</p>
              
              {smartMatchTarget === 'ngo' && (
                <div className="mt-4 pt-4 border-t border-emerald-900/40 text-[11px] text-slate-350 space-y-1">
                  <p>Target Match: <strong className="text-slate-200">98%</strong></p>
                  <p>Est. Value Recaptured: <strong className="text-emerald-450">Free Donation</strong></p>
                </div>
              )}
            </div>

            {/* Community Kitchen */}
            <div 
              onMouseEnter={() => setSmartMatchTarget('kitchen')}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                smartMatchTarget === 'kitchen' 
                  ? 'bg-amber-950/20 border-amber-500/40 shadow-xl' 
                  : 'bg-slate-900/10 border-transparent hover:border-slate-800'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl">🍲</span>
                <span className="text-[9px] uppercase font-extrabold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                  Priority 3 (Critical)
                </span>
              </div>
              <h4 className="font-extrabold text-sm text-slate-100">Community Kitchen</h4>
              <p className="text-xs text-slate-400 mt-2 font-light">Immediate soup kitchen allocation. Triggered when shelf-life is less than 12 hours.</p>
              
              {smartMatchTarget === 'kitchen' && (
                <div className="mt-4 pt-4 border-t border-amber-900/40 text-[11px] text-slate-350 space-y-1">
                  <p>Target Match: <strong className="text-slate-200">95%</strong></p>
                  <p>Est. Value Recaptured: <strong className="text-emerald-450">Nutritional recovery</strong></p>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* Section 7: Impact */}
      <section className="py-32 px-6 md:px-12 bg-gradient-to-b from-[#041209] to-[#041009] border-t border-[#f5f3ef]/5 relative z-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[10px] uppercase tracking-[0.25em] text-amber-200/80 font-semibold block">ESG Auditing Tracker</span>
            <h2 className="text-4xl md:text-6xl font-display-serif text-[#f5f3ef] leading-[1.1] font-light">
              Less Waste. <br />
              <span className="italic font-normal text-amber-100">More Value.</span>
            </h2>
            <div className="h-0.5 w-16 bg-amber-500/30 my-4" />
            <p className="text-base text-slate-450 leading-relaxed font-light">
              Sanjeevani ensures agricultural outputs find productive utility cycles. Our real-time preservation routing registers metrics on total crop weight saved, potential dietary meals recovered, and retail waste prevented.
            </p>
            
            <div className="grid grid-cols-2 gap-6 pt-4 text-xs font-light">
              <div>
                <span className="text-slate-500 block mb-0.5">Active Partners</span>
                <span className="text-lg font-bold text-slate-100">84 Verified Nodes</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Waste Reduction</span>
                <span className="text-lg font-bold text-slate-100">31% Average drop</span>
              </div>
            </div>
          </div>

          {/* Visual Circular Impact progress ring */}
          <div className="lg:col-span-6 flex justify-center gap-6">
            <div className="relative w-72 h-72 bg-slate-900/60 border border-[#f5f3ef]/10 rounded-full p-8 shadow-2xl backdrop-blur-md flex flex-col justify-center items-center group">
              <svg className="absolute inset-0 w-full h-full transform -rotate-95 scale-90" viewBox="0 0 100 100">
                {/* Prevented */}
                <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="4" fill="transparent" strokeDasharray="251" strokeDashoffset={251 - (251 * 0.45)} />
                {/* Redirected */}
                <circle cx="50" cy="50" r="33" stroke="#f5a708" strokeWidth="4" fill="transparent" strokeDasharray="207" strokeDashoffset={207 - (207 * 0.35)} />
                {/* Recovered */}
                <circle cx="50" cy="50" r="26" stroke="#3b82f6" strokeWidth="4" fill="transparent" strokeDasharray="163" strokeDashoffset={163 - (163 * 0.20)} />
              </svg>
              
              <div className="text-center space-y-1.5 z-10 text-xs">
                <span className="text-2xl font-bold text-slate-100">{statsCounter.saved} kg</span>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">Total Crops Saved</p>
                <div className="pt-2 text-[9px] space-y-1 leading-relaxed text-left max-w-[120px] mx-auto">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-emerald-500" /> Prevented: 45%</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-amber-500" /> Redirected: 35%</div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded bg-blue-500" /> Recovered: 20%</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Section 8: Final CTA */}
      <section className="py-40 px-6 md:px-12 bg-gradient-to-b from-[#041009] to-[#050c08] border-t border-[#f5f3ef]/5 text-center relative z-20 overflow-hidden">
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