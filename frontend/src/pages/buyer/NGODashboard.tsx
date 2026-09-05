import React, { useState, useEffect } from 'react'
import { ActivityLog } from '../../components/log-console/ActivityLog'
import { api, Listing } from '../../services/api'

export const NGODashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingId, setClaimingId] = useState<string | null>(null)
  const [rescuedCount, setRescuedCount] = useState(0)
  const [rescuedKg, setRescuedKg] = useState(0)

  const fetchEligible = () => {
    setLoading(true)
    api
      .getRescueEligible()
      .then((res) => setListings(res.listings))
      .catch((err) => console.error('Failed to fetch eligible listings', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEligible()
  }, [])

  const handleClaimRescue = async (listingId: string, kg: number) => {
    setClaimingId(listingId)
    try {
      await api.claimRescue(listingId)
      setRescuedCount((prev) => prev + 1)
      setRescuedKg((prev) => prev + kg)
      setListings((prev) => prev.filter((l) => l.id !== listingId))
    } catch (err) {
      alert(`Failed to claim rescue: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900 text-slate-100 pb-20 font-sans">
      {/* Sticky Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-emerald-500/20 p-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">💚</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                NGO Rescue Hub
              </h1>
              <p className="text-xs text-emerald-200/70 font-medium">खाद्य सुरक्षा एवं सहायता — Expired Crops Logistics Gateway</p>
            </div>
          </div>
          <a
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-slate-200 font-bold transition-all"
          >
            ← Home
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: Metrics & capacity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-emerald-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="font-extrabold text-emerald-400 text-lg mb-4 flex items-center gap-2">
              <span>🚛</span> Capacity & Target
            </h2>
            <div className="text-center py-4 bg-slate-950/40 border border-slate-850/50 rounded-xl mb-4">
              <p className="text-3xl font-extrabold text-emerald-400">1,500 kg</p>
              <p className="text-[10px] text-slate-500 mt-1 font-semibold uppercase tracking-wider">Daily Rescue Capacity</p>
              
              <div className="mt-5 px-4">
                <div className="bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((rescuedKg + 350) / 1500) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-2 font-medium">
                  {350 + rescuedKg}kg / 1,500kg claimed today
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-amber-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-extrabold text-amber-400 mb-4 flex items-center gap-2">
              <span>📈</span> NGO Impact metrics
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400">Rescued Sessions:</span>
                <span className="font-extrabold text-amber-400">{12 + rescuedCount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400">Food Rescued:</span>
                <span className="font-extrabold text-emerald-400">{1250 + rescuedKg} kg</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-400">Estimated Value Saved:</span>
                <span className="font-extrabold text-sky-400">₹{Math.floor((1250 + rescuedKg) * 22)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Donation lists */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">High Waste Risk Stock</h2>
                <p className="text-xs text-slate-400 mt-1">Crops with &gt;65% waste risk score prioritized for zero-cost distribution</p>
              </div>
              <button
                onClick={fetchEligible}
                className="text-xs text-emerald-400 hover:text-emerald-350 font-bold underline transition-colors"
              >
                Refresh Board
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm font-medium">Scanning high-risk inventories…</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-850 px-4">
                <p className="text-emerald-400 font-bold text-lg">No High-Risk Waste Found! 🎉</p>
                <p className="text-xs text-slate-550 mt-1.5">All local seller configurations are currently within safe preservation levels.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 hover:border-emerald-500/35 transition-all duration-300 shadow-md group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-100 text-lg group-hover:text-emerald-400 transition-colors">
                          {item.produceType} <span className="text-slate-500 font-normal text-xs">— {item.orgName || 'Local Farm'}</span>
                        </h3>
                        <p className="text-[10px] text-slate-550 mt-0.5">📍 {item.city} • {item.distanceKm} km away</p>
                      </div>
                      <span className="bg-red-950/80 text-red-300 font-extrabold text-xs px-3.5 py-1.5 rounded-xl border border-red-800/40">
                        Risk: {item.wasteRiskScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 my-4 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-850/50">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Available Quantity</span>
                        <span className="font-bold text-slate-200">{item.quantityAvailable} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Est. Fresh Days</span>
                        <span className="font-bold text-amber-400">
                          {item.estimatedDaysRange ? `${item.estimatedDaysRange[0]}-${item.estimatedDaysRange[1]} days` : '1-2 days'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">List Price</span>
                        <span className="font-bold text-slate-200">₹{item.pricePerKg}/kg</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimRescue(item.id, item.quantityAvailable)}
                      disabled={claimingId === item.id}
                      className="w-full bg-slate-850 hover:bg-emerald-600 border border-slate-750 hover:border-emerald-500 disabled:opacity-50 text-slate-200 hover:text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-emerald-900/30"
                    >
                      {claimingId === item.id ? (
                        <span>Claiming &amp; Dispatching…</span>
                      ) : (
                        <span>💚 Claim Free Rescue Batch ({item.quantityAvailable} kg)</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ActivityLog />
    </div>
  )
}