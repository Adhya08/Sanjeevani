import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { api, Listing } from '../../services/api'

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-black text-slate-100 pb-20 font-sans">
      {/* Sticky Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 p-5 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Detailed Crop Management
              </h1>
              <p className="text-xs text-amber-200/70 font-medium">अपनी विस्तृत फसल सूची का प्रबंधन करें</p>
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

      <main className="max-w-4xl mx-auto p-6 space-y-8">
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

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-400 text-sm font-medium">Fetching crop registers…</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
              <p className="text-slate-550 font-bold">No registered listings found.</p>
              <p className="text-xs text-slate-600 mt-1">Go back to the main dashboard to list your first batch.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-slate-800/80">
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
                        <td className="px-4 py-3.5 font-mono text-slate-500">{item.id}</td>
                        <td className="px-4 py-3.5">{item.city}</td>
                        <td className="px-4 py-3.5 font-semibold text-emerald-450">
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
      </main>
    </div>
  )
}