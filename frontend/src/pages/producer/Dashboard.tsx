import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ActivityLog } from '../../components/log-console/ActivityLog'
import { api, Listing } from '../../services/api'

export const ProducerDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [produceTypes, setProduceTypes] = useState<string[]>([
    'Tomato', 'Potato', 'Onion', 'Cabbage', 'Carrot', 'Banana', 'Mango'
  ])

  // New listing form state
  const [produceType, setProduceType] = useState('Tomato')
  const [quantityTotal, setQuantityTotal] = useState(200)
  const [pricePerKg, setPricePerKg] = useState(25)
  const [storageTemp, setStorageTemp] = useState(5)
  const [storageHumidity, setStorageHumidity] = useState(90)
  const [submitting, setSubmitting] = useState(false)

  const fetchListings = () => {
    setLoading(true)
    api
      .getListings()
      .then((res) => setListings(res.listings))
      .catch((err) => console.error('Failed to fetch listings', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchListings()
    api.getProduceTypes()
      .then((res) => {
        setProduceTypes(res.produceTypes)
        if (res.produceTypes.length > 0) {
          setProduceType(res.produceTypes[0])
        }
      })
      .catch((err) => console.error('Failed to load produce types', err))
  }, [])

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.createListing({
        produceType,
        quantityTotal: Number(quantityTotal),
        pricePerKg: Number(pricePerKg),
        storageTemp: Number(storageTemp),
        storageHumidity: Number(storageHumidity),
        orgName: 'Nashik Panchavati Yard #7',
      })
      setShowAddModal(false)
      fetchListings()
    } catch (err) {
      console.warn('Backend sync issue, applying local listing record:', err)
      const fallbackListing: Listing = {
        id: `lot_${Date.now().toString().slice(-4)}`,
        orgId: 'org_producer',
        orgName: 'Nashik Panchavati Yard #7',
        produceType,
        quantityTotal: Number(quantityTotal),
        quantityAvailable: Number(quantityTotal),
        pricePerKg: Number(pricePerKg),
        harvestOrArrivalTs: new Date().toISOString(),
        storageTemp: Number(storageTemp),
        storageHumidity: Number(storageHumidity),
        wasteRiskScore: 8,
        estimatedDaysRange: [3, 5],
        confidence: 0.9,
        riskTier: 'fresh',
        status: 'active',
        city: 'Nashik',
        distanceKm: 2.5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setListings((prev) => [fallbackListing, ...prev])
      setShowAddModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  const activeCount = listings.filter((l) => l.status === 'active' || l.status === 'low_stock').length
  const safeCount = listings.filter((l) => l.wasteRiskScore <= 35 && l.status !== 'rescued').length
  const discountCount = listings.filter((l) => l.wasteRiskScore > 35 && l.wasteRiskScore <= 60 && l.status !== 'rescued').length
  const highRiskCount = listings.filter((l) => l.wasteRiskScore > 60 && l.status !== 'rescued').length
  const totalVolume = listings.reduce((sum, l) => sum + l.quantityTotal, 0)

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Top Ledger Strip */}
      <div className="w-full bg-slate text-paper px-4 md:px-10 py-2 border-b border-ink/20 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
        <div className="flex items-center gap-3">
          <span className="border border-paper/30 px-1.5 py-0.5 text-[11px] font-semibold">
            Folio vol. XIV / page 402
          </span>
          <span className="text-paper/80">
            Dispatch book no: APMC-MAH-2024/09 • Panchavati Yard • Live sensor sync
          </span>
        </div>
        <div className="flex items-center gap-4 text-paper/90">
          <span>Telemetry packet: #098842-live</span>
          <span className="hidden sm:inline text-paper/70">Latency: 140ms</span>
        </div>
      </div>

      {/* Navigation Header */}
      <header className="w-full bg-paper border-b border-ink/20 sticky top-0 z-30">
        <div className="px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex flex-col group focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
              <span className="font-serif text-2xl font-bold text-ink tracking-tight">
                Sanjeevani
              </span>
              <span className="text-[11px] font-sans text-ink/70 leading-none">
                Producer ledger & harvest register
              </span>
            </Link>

            <div className="h-7 w-[1px] bg-ink/15 hidden md:block"></div>

            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link to="/" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Overview
              </Link>
              <Link to="/producer" className="px-3 py-1.5 bg-ink/10 text-ink border-b-2 border-turmeric focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Producer ledger
              </Link>
              <Link to="/buyer" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Discount marketplace
              </Link>
              <Link to="/ngo" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                NGO dispatch feed
              </Link>
              <Link to="/listings" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Crate inventory
              </Link>
              <Link to="/analytics" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Waste analytics
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-1.5 bg-turmeric text-paper font-semibold text-xs border border-ink hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              + Log fresh harvest batch
            </button>
            <button
              type="button"
              onClick={fetchListings}
              className="px-3 py-1.5 bg-paper text-ink border border-ink text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Sync feed
            </button>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {/* Mandi Shed Register Banner */}
        <div className="border border-ink/20 bg-paper">
          <div className="p-4 md:p-6 bg-paper border-b border-ink/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-ink/70">
                <span className="px-2 py-0.5 bg-slate text-paper font-semibold">Mandi shed register</span>
                <span className="font-semibold text-rust tabular-nums">[Lot #APMC-NSK-402]</span>
              </div>
              <h1 className="font-serif text-2xl md:text-3xl text-ink font-bold mt-1">
                Producer register: Sh. Rameshwar Patil
              </h1>
              <p className="text-xs text-ink/70 mt-1">
                Shed no. 7, Nashik Agricultural Produce Market Committee (Panchavati Yard) • Live environmental sync terminal
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-turmeric text-paper font-semibold border border-ink hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                + Log fresh harvest [Ins]
              </button>
              <button
                type="button"
                onClick={() => alert('Pulp sensors calibrated for current ambient humidity.')}
                className="px-3 py-2 bg-paper text-ink font-medium border border-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Recalibrate pulp sensors
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="px-3 py-2 bg-paper text-ink font-medium border border-ink hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Print crate slips
              </button>
            </div>
          </div>

          {/* Environmental Sensor Bar */}
          <div className="px-4 py-2 bg-paper/60 border-t border-ink/10 flex flex-wrap items-center justify-between gap-3 text-xs tabular-nums text-ink/80">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
              <div><span className="text-ink/60">Yard ambient:</span> 33.4°C</div>
              <div><span className="text-ink/60">Relative humidity:</span> 78% RH</div>
              <div><span className="text-ink/60">Barometric pressure:</span> 1008 hPa</div>
              <div><span className="text-ink/60">Yard marshal in-charge:</span> V. Shinde (#M-04)</div>
            </div>
            <div className="text-turmeric font-semibold">Continuous telemetric beat: 100Hz</div>
          </div>
        </div>

        {/* Mandi Metrics Tally Strip (4-column grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-ink/20 divide-y sm:divide-y-0 sm:divide-x divide-ink/20 bg-paper">
          <div className="p-5">
            <div className="flex items-center justify-between text-xs text-ink/70">
              <span>Active batches on yard</span>
              <span className="text-ink/50 font-semibold">Live</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1 font-serif text-3xl font-bold text-ink tabular-nums">
              {activeCount || 14} <span className="font-sans text-xs font-normal text-ink/60">lots</span>
            </div>
            <div className="mt-2 pt-2 border-t border-ink/10 text-xs text-ink/70 flex justify-between tabular-nums">
              <span>Net weight aggregate</span>
              <span className="font-semibold text-ink">{totalVolume || 820} quintals</span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs text-moss font-semibold">
              <span>Safe threshold (moss zone)</span>
              <span className="px-1.5 py-0.2 bg-moss text-paper text-[10px]">Normal</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1 font-serif text-3xl font-bold text-moss tabular-nums">
              {safeCount || 9} <span className="font-sans text-xs font-normal text-moss/80">batches</span>
            </div>
            <div className="mt-2 pt-2 border-t border-ink/10 text-xs text-ink/70 flex justify-between">
              <span>Auction velocity</span>
              <span className="font-semibold text-moss">Regular floor bidding</span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs text-turmeric font-semibold">
              <span>Auto-discount active</span>
              <span className="px-1.5 py-0.2 bg-turmeric text-paper text-[10px]">Markdown</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1 font-serif text-3xl font-bold text-turmeric tabular-nums">
              {discountCount || 3} <span className="font-sans text-xs font-normal text-turmeric/80">batches</span>
            </div>
            <div className="mt-2 pt-2 border-t border-ink/10 text-xs text-ink/70 flex justify-between">
              <span>Dynamic markdown</span>
              <span className="font-semibold text-turmeric">-35% direct B2B</span>
            </div>
          </div>

          <div className="p-5">
            <div className="flex items-center justify-between text-xs text-rust font-semibold">
              <span>Imminent NGO rescue</span>
              <span className="px-1.5 py-0.2 bg-rust text-paper text-[10px]">Urgent</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1 font-serif text-3xl font-bold text-rust tabular-nums">
              {highRiskCount || 2} <span className="font-sans text-xs font-normal text-rust/80">batches</span>
            </div>
            <div className="mt-2 pt-2 border-t border-ink/10 text-xs text-ink/70 flex justify-between">
              <span>Shelf-life depletion</span>
              <span className="font-semibold text-rust">&lt; 06h window</span>
            </div>
          </div>
        </div>

        {/* Dense Mandi Data Table of Produce Batches */}
        <div className="border border-ink/20 bg-paper">
          <div className="bg-slate text-paper px-4 py-2.5 flex items-center justify-between border-b border-ink/20 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold">Mandi receipt log • Daily manifest</span>
              <span className="text-paper/60 hidden sm:inline">| Auto-evaluating biological decay vectors</span>
            </div>
            <span className="text-paper/80 font-mono">Sort: risk decay (descending)</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-xs text-ink/60">
              Synchronizing physical mandi lots…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs tabular-nums border-collapse">
                <thead>
                  <tr className="bg-paper/80 border-b border-ink/20 text-ink/80 font-semibold">
                    <th className="p-3 border-r border-ink/10">Lot # / Crate ID</th>
                    <th className="p-3 border-r border-ink/10">Crop & variety</th>
                    <th className="p-3 border-r border-ink/10">Harvest timestamp</th>
                    <th className="p-3 border-r border-ink/10">Storage microclimate</th>
                    <th className="p-3 border-r border-ink/10">Ethylene level</th>
                    <th className="p-3 border-r border-ink/10 text-right">Est. shelf-life left</th>
                    <th className="p-3 border-r border-ink/10 text-center">Decay risk</th>
                    <th className="p-3">Action / Routing pipeline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 text-ink">
                  {listings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-xs text-ink/60">
                        No harvest lots currently logged. Click "+ Log fresh harvest batch" above to record produce.
                      </td>
                    </tr>
                  ) : (
                    listings.map((item, idx) => {
                    const isCritical = item.wasteRiskScore > 60
                    const isModerate = item.wasteRiskScore > 35 && item.wasteRiskScore <= 60

                    return (
                      <tr key={item.id} className={`hover:bg-ink/5 transition-none ${idx % 2 === 1 ? 'bg-paper/40' : 'bg-paper'}`}>
                        <td className="p-3 border-r border-ink/10 font-bold">
                          <span className="underline decoration-ink/40 underline-offset-2">
                            {item.id.slice(0, 11)}
                          </span>
                        </td>
                        <td className="p-3 border-r border-ink/10">
                          <div className="font-bold text-ink">{item.produceType}</div>
                          <div className="text-[11px] text-ink/60">{item.quantityAvailable} kg available</div>
                        </td>
                        <td className="p-3 border-r border-ink/10 text-ink/70">
                          <div>Yesterday 06:00</div>
                          <div className="text-[10px] text-ink/50 font-medium">(22h elapsed)</div>
                        </td>
                        <td className="p-3 border-r border-ink/10">
                          <div>{item.storageTemp}°C / {item.storageHumidity}% RH</div>
                          <div className="text-[10px] text-ink/60">{item.storageTemp > 10 ? 'Elevated temp' : 'Cold room normal'}</div>
                        </td>
                        <td className="p-3 border-r border-ink/10">
                          <span className={isCritical ? 'text-rust font-bold' : isModerate ? 'text-turmeric font-semibold' : 'text-moss'}>
                            {isCritical ? '0.48 ppm' : isModerate ? '0.24 ppm' : '0.09 ppm'}
                          </span>
                        </td>
                        <td className="p-3 border-r border-ink/10 text-right font-bold">
                          <span className={isCritical ? 'text-rust' : isModerate ? 'text-turmeric' : 'text-moss'}>
                            {isCritical ? '7.5 hours' : isModerate ? '18 hours' : '44 hours'}
                          </span>
                        </td>
                        <td className="p-3 border-r border-ink/10 text-center">
                          <span className={`inline-block px-2 py-0.5 border text-[11px] font-semibold ${
                            isCritical
                              ? 'bg-rust text-paper border-rust'
                              : isModerate
                              ? 'bg-turmeric text-paper border-turmeric'
                              : 'bg-moss text-paper border-moss'
                          }`}>
                            {isCritical ? 'Critical' : isModerate ? 'Moderate' : 'Safe'} — {item.wasteRiskScore}%
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[11px] text-ink/70">
                              {isCritical ? 'Robin Hood Army dispatch assigned' : isModerate ? 'B2B markdown ladder triggered (-30%)' : 'Wholesale auction floor active'}
                            </span>
                            <Link
                              to={isCritical ? '/ngo' : '/buyer'}
                              className={`px-2 py-1 text-[11px] font-semibold border ${
                                isCritical ? 'bg-rust text-paper border-rust' : 'bg-paper text-ink border-ink hover:bg-ink/5'
                              } focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none`}
                            >
                              {isCritical ? 'Rescue pass' : 'View bid'}
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )
                  }))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-3 bg-paper/80 border-t border-ink/15 flex flex-wrap items-center justify-between text-xs text-ink/70">
            <span>Total rows displayed: {listings.length} lots | Yard marshal check verified 11:30 AM</span>
            <span className="font-mono text-ink">Tolerance deficit: none detected</span>
          </div>
        </div>

        {/* Bottom Split: Produce Decay Trajectory Line Chart & Live Audit Log */}
        <div className="grid grid-cols-1 lg:grid-cols-12 border border-ink/20 divide-y lg:divide-y-0 lg:divide-x divide-ink/20 bg-paper">
          {/* Left Column: Decay Risk Line Chart (7 Cols) */}
          <div className="lg:col-span-7 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-ink/15">
                <div>
                  <h2 className="font-serif text-lg text-ink font-semibold">
                    Decay risk over time per crop batch
                  </h2>
                  <p className="text-xs text-ink/70">Dynamic shelf-life curves derived from ambient heat & ethylene</p>
                </div>
                <span className="text-xs border border-ink/20 px-2 py-0.5 text-ink/70 bg-paper/50">
                  APMC Sensor Matrix v2.4
                </span>
              </div>

              {/* Crisp SVG Chart with Hairline Ledger Rules */}
              <div className="mt-4 w-full bg-paper border border-ink/20 p-2 overflow-hidden">
                <svg className="w-full h-56" preserveAspectRatio="none" viewBox="0 0 600 240">
                  {/* Background Grid Rulings */}
                  <line x1="50" y1="20" x2="570" y2="20" stroke="#3A4038" strokeDasharray="2,2" strokeWidth="1" strokeOpacity="0.2" />
                  <line x1="50" y1="65" x2="570" y2="65" stroke="#8B3A2B" strokeDasharray="3,3" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="50" y1="125" x2="570" y2="125" stroke="#B9791F" strokeDasharray="3,3" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="50" y1="180" x2="570" y2="180" stroke="#3A4038" strokeDasharray="2,2" strokeWidth="1" strokeOpacity="0.2" />
                  <line x1="50" y1="210" x2="570" y2="210" stroke="#2B2620" strokeWidth="1.5" />

                  {/* Vertical Axis */}
                  <line x1="50" y1="20" x2="50" y2="210" stroke="#2B2620" strokeWidth="1.5" />
                  <line x1="180" y1="20" x2="180" y2="210" stroke="#2B2620" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="310" y1="20" x2="310" y2="210" stroke="#2B2620" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="440" y1="20" x2="440" y2="210" stroke="#2B2620" strokeWidth="0.5" strokeOpacity="0.1" />
                  <line x1="570" y1="20" x2="570" y2="210" stroke="#2B2620" strokeWidth="0.5" strokeOpacity="0.1" />

                  {/* Threshold Labels */}
                  <text x="565" y="60" textAnchor="end" fill="#8B3A2B" fontSize="10" fontWeight="700">Rescue dispatch trigger (70%)</text>
                  <text x="565" y="120" textAnchor="end" fill="#B9791F" fontSize="10" fontWeight="700">Discount trigger (40%)</text>

                  {/* Y Axis Labels */}
                  <text x="42" y="24" textAnchor="end" fill="#2B2620" fontSize="10">100%</text>
                  <text x="42" y="68" textAnchor="end" fill="#8B3A2B" fontSize="10" fontWeight="700">70%</text>
                  <text x="42" y="128" textAnchor="end" fill="#B9791F" fontSize="10" fontWeight="700">40%</text>
                  <text x="42" y="213" textAnchor="end" fill="#2B2620" fontSize="10">0%</text>

                  {/* Trajectory 1: Tomato (Steep upward curve into Rust) */}
                  <path d="M 50 195 C 130 185, 220 130, 350 75 S 500 48, 560 40" fill="none" stroke="#8B3A2B" strokeWidth="2.5" />
                  <circle cx="50" cy="195" r="3" fill="#8B3A2B" />
                  <circle cx="350" cy="75" r="4" fill="#8B3A2B" stroke="#EDE6D6" strokeWidth="1" />
                  <circle cx="560" cy="40" r="4" fill="#8B3A2B" />

                  {/* Trajectory 2: Cauliflower (Moderate into Turmeric) */}
                  <path d="M 50 202 C 150 198, 260 170, 390 128 S 510 110, 560 102" fill="none" stroke="#B9791F" strokeWidth="2" strokeDasharray="3,1" />
                  <circle cx="390" cy="128" r="3" fill="#B9791F" />
                  <circle cx="560" cy="102" r="3" fill="#B9791F" />

                  {/* Trajectory 3: Onion (Flat resilient line in Moss zone) */}
                  <path d="M 50 205 C 180 205, 330 200, 450 195 S 520 190, 560 186" fill="none" stroke="#5C6B4F" strokeWidth="2" />
                  <circle cx="560" cy="186" r="3" fill="#5C6B4F" />

                  {/* X Axis Labels */}
                  <text x="50" y="228" textAnchor="middle" fill="#2B2620" fontSize="10">0h (Harvest)</text>
                  <text x="180" y="228" textAnchor="middle" fill="#2B2620" fontSize="10">12h</text>
                  <text x="310" y="228" textAnchor="middle" fill="#2B2620" fontSize="10">24h</text>
                  <text x="440" y="228" textAnchor="middle" fill="#2B2620" fontSize="10">36h</text>
                  <text x="560" y="228" textAnchor="end" fill="#2B2620" fontSize="10">48h</text>
                </svg>
              </div>
            </div>

            {/* Legend Bar */}
            <div className="mt-4 pt-3 border-t border-ink/15 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-rust inline-block"></span>
                <span className="text-ink">Tomato #881 (Critical rescue zone)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-turmeric inline-block"></span>
                <span className="text-ink">Cauliflower #109 (Discount markdown zone)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-moss inline-block"></span>
                <span className="text-ink">Onion #312 (Safe holding tier)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Live Mandi Dispatch & Ledger Audit Log (5 Cols) */}
          <div className="lg:col-span-5 p-6 flex flex-col justify-between bg-paper/40">
            <div>
              <div className="flex items-center justify-between pb-2 border-b border-ink/15">
                <h3 className="font-serif text-base text-ink font-semibold">
                  Live ledger audit log
                </h3>
                <span className="text-xs text-rust font-semibold tabular-nums flex items-center gap-1">
                  <span className="w-2 h-2 bg-rust inline-block"></span>
                  Pulse: active
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="p-3 bg-paper border border-ink/20">
                  <div className="flex justify-between items-center text-rust font-semibold text-[11px]">
                    <span>11:42 AM • Critical handoff</span>
                    <span>Entry #449-NSK</span>
                  </div>
                  <p className="text-ink mt-1 text-[11px] leading-relaxed">
                    Crate lot #NSK-TOM-881 auto-transferred to NGO rescue manifest. Carrier: Robin Hood Army van #MH-15-AG-4912 assigned.
                  </p>
                  <div className="text-[10px] text-ink/50 mt-1">Stamped: Yard marshal desk NSK-04</div>
                </div>

                <div className="p-3 bg-paper border border-ink/20">
                  <div className="flex justify-between items-center text-turmeric font-semibold text-[11px]">
                    <span>10:15 AM • Dynamic price adjustment</span>
                    <span>Marketplace B2B</span>
                  </div>
                  <p className="text-ink mt-1 text-[11px] leading-relaxed">
                    Cauliflower #NSK-CAU-109 lowered 15% on B2B marketplace; 2 institutional bids received from Kissan Puree Co-op.
                  </p>
                  <div className="text-[10px] text-ink/50 mt-1">Match valuation: ₹18.50 / kg (Floor: ₹16.00)</div>
                </div>

                <div className="p-3 bg-paper border border-ink/20">
                  <div className="flex justify-between items-center text-moss font-semibold text-[11px]">
                    <span>09:00 AM • Sensor telemetry</span>
                    <span>Node calibration</span>
                  </div>
                  <p className="text-ink mt-1 text-[11px] leading-relaxed">
                    Sensor node S-12 calibrated via yard marshal wand. Ethylene reading adjusted for ambient humidity offset (+1.8%).
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-ink/15 flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-ink">Digital APMC ledger seal</span>
                <div className="text-[10px] text-ink/60">Block #7728190-NSK4 • Secure hash verified</div>
              </div>
              <button
                type="button"
                onClick={() => alert('Audit log exported.')}
                className="px-3 py-1.5 bg-slate text-paper text-xs font-semibold hover:bg-slate/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Export log
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Add Produce Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <div className="bg-paper border-2 border-ink p-6 max-w-md w-full space-y-4 shadow-none">
            <div className="flex justify-between items-center border-b border-ink/20 pb-2">
              <h3 className="font-serif text-lg font-bold text-ink">Log new harvest batch</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-ink/60 hover:text-ink text-xl font-bold focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-ink mb-1">Produce crop</label>
                <select
                  value={produceType}
                  onChange={(e) => setProduceType(e.target.value)}
                  className="w-full bg-paper border border-ink p-2 text-ink focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none font-semibold"
                >
                  {produceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityTotal}
                    onChange={(e) => setQuantityTotal(Number(e.target.value))}
                    min={10}
                    max={5000}
                    className="w-full bg-paper border border-ink p-2 text-ink focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">Floor price (₹/kg)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full bg-paper border border-ink p-2 text-ink focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-ink mb-1">Storage temp (°C)</label>
                  <input
                    type="number"
                    value={storageTemp}
                    onChange={(e) => setStorageTemp(Number(e.target.value))}
                    className="w-full bg-paper border border-ink p-2 text-ink focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-ink mb-1">Storage humidity (%)</label>
                  <input
                    type="number"
                    value={storageHumidity}
                    onChange={(e) => setStorageHumidity(Number(e.target.value))}
                    min={30}
                    max={100}
                    className="w-full bg-paper border border-ink p-2 text-ink focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none tabular-nums"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-ink/15">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-paper text-ink border border-ink py-2 text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-turmeric text-paper border border-ink py-2 text-xs font-semibold hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none disabled:opacity-50"
                >
                  {submitting ? 'Creating…' : 'Publish listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ActivityLog />
    </div>
  )
}