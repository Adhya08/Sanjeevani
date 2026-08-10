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
  Pie
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
    Quantity: qty
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
    { name: 'Low Risk (<35%)', value: lowRisk, color: '#10b981' },
    { name: 'Moderate (35-60%)', value: midRisk, color: '#f59e0b' },
    { name: 'High Risk (>60%)', value: highRisk, color: '#ef4444' }
  ].filter((d) => d.value > 0)

  // Identify items that need to be sold fast (High Risk)
  const urgentBatches = listings.filter(
    (item) => item.wasteRiskScore > 60 && item.quantityAvailable > 0 && item.status !== 'rescued'
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-black text-slate-100 pb-20 font-sans">
      {/* Sticky Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 p-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Detailed Crop Management
              </h1>
              <p className="text-xs text-amber-200/70 font-medium">विस्तृत विश्लेषण और वास्तविक समय की स्थिति</p>
            </div>
          </div>
          <Link
            to="/producer"
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-slate-200 font-bold transition-all"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Compiling visual analytics…</p>
          </div>
        ) : (
          <>
            {/* Visual Analytics Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Bar Chart Card */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h3 className="text-base font-extrabold text-slate-100 mb-4">Stock Levels by Crop (kg)</h3>
                <div className="h-64 w-full">
                  {cropChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs">No active stock to display</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cropChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f1f5f9' }}
                        />
                        <Bar dataKey="Quantity" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                          {cropChartData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#f59e0b' : '#d97706'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Pie Chart Card */}
              <div className="bg-slate-900/50 border border-slate-850 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
                <h3 className="text-base font-extrabold text-slate-100 mb-4">Crop Waste-Risk Distribution</h3>
                <div className="h-64 w-full flex flex-col md:flex-row items-center justify-center gap-4">
                  {riskChartData.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-500 text-xs">No active batches to assess</div>
                  ) : (
                    <>
                      <div className="h-48 w-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={riskChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={75}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              {riskChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: 8, color: '#f1f5f9' }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2 text-xs">
                        {riskChartData.map((entry, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 rounded" style={{ backgroundColor: entry.color }} />
                            <span className="text-slate-350">{entry.name}:</span>
                            <span className="font-bold text-slate-100">{entry.value} batch(es)</span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Urgent Sale Panels */}
            {urgentBatches.length > 0 && (
              <div className="bg-red-950/20 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm shadow-lg shadow-red-950/25 animate-pulse">
                <h3 className="text-base font-extrabold text-red-400 mb-3 flex items-center gap-2">
                  <span>🚨</span> Action Required: Sell / Rescue Immediately
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  The following produce batches have exceeded a 60% waste risk threshold. We recommend dropping their target prices in the marketplace or verifying them for free NGO dispatch.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {urgentBatches.map((item) => (
                    <div key={item.id} className="bg-slate-900/80 border border-red-500/30 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-200">{item.produceType}</span>
                        <span className="bg-red-950 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded border border-red-800/30">
                          {item.wasteRiskScore}% Risk
                        </span>
                      </div>
                      <div className="text-xs text-slate-450 space-y-1">
                        <p>Available: <strong className="text-slate-300">{item.quantityAvailable} kg</strong></p>
                        <p>Storage: <strong className="text-slate-300">{item.storageTemp}°C</strong></p>
                        <p>Est. Shelf Life: <strong className="text-amber-450">{item.estimatedDaysRange ? `${item.estimatedDaysRange[0]}-${item.estimatedDaysRange[1]} days` : '1-2 days'}</strong></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* List Table Card */}
            <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-extrabold text-slate-100">All Registered Farm Listings</h2>
                <button
                  onClick={fetchListings}
                  className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
                >
                  Refresh Table
                </button>
              </div>

              {listings.length === 0 ? (
                <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                  <p className="text-slate-550 font-bold">No registered listings found.</p>
                  <p className="text-xs text-slate-650 mt-1">Go back to the main dashboard to list your first batch.</p>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-slate-850">
                  <table className="min-w-full divide-y divide-slate-800 text-left text-xs text-slate-300">
                    <thead className="bg-slate-950/60 font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-4 py-3.5">Produce</th>
                        <th className="px-4 py-3.5">ID</th>
                        <th className="px-4 py-3.5">Location</th>
                        <th className="px-4 py-3.5">Stock</th>
                        <th className="px-4 py-3.5">Risk Score</th>
                        <th className="px-4 py-3.5">Price</th>
                        <th className="px-4 py-3.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-900/20">
                      {listings.map((item) => {
                        const riskColor =
                          item.wasteRiskScore > 60
                            ? 'text-red-400'
                            : item.wasteRiskScore > 35
                            ? 'text-amber-400'
                            : 'text-emerald-400'

                        return (
                          <tr key={item.id} className="hover:bg-slate-900/50 transition-colors">
                            <td className="px-4 py-3.5 font-bold text-slate-100">{item.produceType}</td>
                            <td className="px-4 py-3.5 font-mono text-slate-550">{item.id}</td>
                            <td className="px-4 py-3.5">{item.city}</td>
                            <td className="px-4 py-3.5 font-semibold text-emerald-400">
                              {item.quantityAvailable} / {item.quantityTotal} kg
                            </td>
                            <td className={`px-4 py-3.5 font-extrabold ${riskColor}`}>
                              {item.wasteRiskScore}%
                            </td>
                            <td className="px-4 py-3.5 font-extrabold text-amber-400">₹{item.pricePerKg}/kg</td>
                            <td className="px-4 py-3.5">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                item.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-850 text-slate-400'
                              }`}>
                                {item.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  )
}