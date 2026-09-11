import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Listing } from '../../services/api'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts'

export const ListingsPage: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)

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
  }, [])

  // Process data for crop stock bar chart
  const cropDataMap: Record<string, number> = {}
  listings.forEach((item) => {
    if (item.status === 'active' || item.status === 'low_stock') {
      cropDataMap[item.produceType] = (cropDataMap[item.produceType] || 0) + item.quantityAvailable
    }
  })
  const cropChartData = Object.entries(cropDataMap).map(([crop, qty]) => ({
    name: crop,
    Quantity: qty,
  }))

  // Process data for risk distribution pie chart
  let lowRisk = 0
  let midRisk = 0
  let highRisk = 0
  listings.forEach((item) => {
    if (item.status === 'active' || item.status === 'low_stock') {
      if (item.wasteRiskScore > 60) highRisk++
      else if (item.wasteRiskScore > 35) midRisk++
      else lowRisk++
    }
  })
  const riskChartData = [
    { name: 'Safe (<35%)', value: lowRisk, color: '#5C6B4F' },
    { name: 'Moderate (35–60%)', value: midRisk, color: '#B9791F' },
    { name: 'Critical (>60%)', value: highRisk, color: '#8B3A2B' },
  ].filter((d) => d.value > 0)

  // Identify items that need to be sold fast (High Risk)
  const urgentBatches = listings.filter(
    (item) => item.wasteRiskScore > 60 && item.quantityAvailable > 0 && item.status !== 'rescued'
  )

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Top Status Strip */}
      <div className="w-full bg-slate text-paper px-4 md:px-10 py-2 border-b border-ink/20 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
        <div className="flex items-center gap-3">
          <span className="border border-paper/30 px-1.5 py-0.5 text-[11px] font-semibold">
            Mandi Crate Register
          </span>
          <span className="text-paper/80">
            Physical inventory breakdown • Weight, calibration, and decay vectors
          </span>
        </div>
        <div className="flex items-center gap-4 text-paper/90">
          <span>Active registered lots: {listings.length}</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-paper border-b border-ink/20 sticky top-0 z-30">
        <div className="px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex flex-col group focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
              <span className="font-serif text-2xl font-bold text-ink tracking-tight">
                Sanjeevani
              </span>
              <span className="text-[11px] font-sans text-ink/70 leading-none">
                Detailed crate management
              </span>
            </Link>

            <div className="h-7 w-[1px] bg-ink/15 hidden md:block"></div>

            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
              <Link to="/" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Overview
              </Link>
              <Link to="/producer" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Producer ledger
              </Link>
              <Link to="/buyer" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Discount marketplace
              </Link>
              <Link to="/ngo" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                NGO dispatch feed
              </Link>
              <Link to="/listings" className="px-3 py-1.5 bg-ink/10 text-ink border-b-2 border-turmeric focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
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
              onClick={fetchListings}
              className="px-3.5 py-1.5 bg-paper text-ink border border-ink text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Refresh inventory
            </button>
            <Link
              to="/producer"
              className="px-3.5 py-1.5 bg-turmeric text-paper border border-ink text-xs font-semibold hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Back to producer desk
            </Link>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="p-16 text-center text-xs text-ink/60">
            Compiling crate ledger analytics…
          </div>
        ) : (
          <>
            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Bar Chart Card */}
              <div className="border border-ink/20 p-5 bg-paper">
                <div className="flex justify-between items-center pb-2 mb-4 border-b border-ink/15">
                  <h3 className="font-serif text-base font-bold text-ink">Stock levels by crop (kg)</h3>
                  <span className="text-[11px] text-ink/60 tabular-nums">Panchavati Yard #7</span>
                </div>
                <div className="h-64 w-full">
                  {cropChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-ink/50">
                      No active crop stock to display
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cropChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="2 2" stroke="#2B2620" strokeOpacity={0.15} />
                        <XAxis dataKey="name" stroke="#2B2620" fontSize={11} tickLine={false} />
                        <YAxis stroke="#2B2620" fontSize={11} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#EDE6D6',
                            borderColor: '#2B2620',
                            borderRadius: 0,
                            color: '#2B2620',
                            fontSize: 12,
                          }}
                        />
                        <Bar dataKey="Quantity" fill="#B9791F">
                          {cropChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#B9791F' : '#3A4038'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie Chart Card */}
              <div className="border border-ink/20 p-5 bg-paper">
                <div className="flex justify-between items-center pb-2 mb-4 border-b border-ink/15">
                  <h3 className="font-serif text-base font-bold text-ink">Crop decay-risk distribution</h3>
                  <span className="text-[11px] text-ink/60 tabular-nums">Biological tri-tier</span>
                </div>
                <div className="h-64 w-full flex flex-col md:flex-row items-center justify-center gap-6">
                  {riskChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-ink/50">
                      No active batches to assess
                    </div>
                  ) : (
                    <>
                      <div className="h-48 w-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={75}
                              dataKey="value"
                              stroke="#EDE6D6"
                              strokeWidth={2}
                            >
                              {riskChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{
                                backgroundColor: '#EDE6D6',
                                borderColor: '#2B2620',
                                borderRadius: 0,
                                color: '#2B2620',
                                fontSize: 12,
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="space-y-2 text-xs">
                        {riskChartData.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-3 h-3 inline-block" style={{ backgroundColor: entry.color }} />
                            <span className="text-ink/80">{entry.name}:</span>
                            <span className="font-bold text-ink tabular-nums">{entry.value} batch(es)</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Urgent Sale Alert Box */}
            {urgentBatches.length > 0 && (
              <div className="border border-rust p-5 bg-paper space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-base font-bold text-rust">
                    Action required: immediate markdown or rescue dispatch
                  </h3>
                  <span className="px-2 py-0.5 bg-rust text-paper text-[10px] font-semibold">
                    Critical window
                  </span>
                </div>
                <p className="text-xs text-ink/80 leading-relaxed">
                  The following produce lots have crossed the 60% decay risk threshold. Reduce clearance price on the discount marketplace or verify for immediate NGO relief routing.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  {urgentBatches.map((item) => (
                    <div key={item.id} className="border border-rust/40 p-3 bg-paper/70 space-y-1 text-xs tabular-nums">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-ink">{item.produceType}</span>
                        <span className="text-rust font-semibold">{item.wasteRiskScore}% risk</span>
                      </div>
                      <div className="text-ink/70 text-[11px] space-y-0.5">
                        <p>Stock: <strong>{item.quantityAvailable} kg</strong></p>
                        <p>Storage: <strong>{item.storageTemp}°C</strong></p>
                        <p>Estimated life: <strong>{item.estimatedDaysRange ? `${item.estimatedDaysRange[0]}-${item.estimatedDaysRange[1]} days` : '4–8 hours'}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </>
        )}
      </main>
    </div>
  )
}