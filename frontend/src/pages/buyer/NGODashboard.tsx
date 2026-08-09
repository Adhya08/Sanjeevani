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
    <div className="min-h-screen bg-emerald-50 pb-20">
      <header className="bg-emerald-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">NGO Rescue Portal</h1>
          <p className="text-sm opacity-90">सहायता एवं खाद्य सुरक्षा - उच्च जोखिम वाले फल एवं सब्ज़ियां</p>
        </div>
        <a href="/" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white font-medium">
          ← Back to Home
        </a>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NGO Capacity & Impact */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-emerald-600">
            <h2 className="font-semibold text-gray-800 text-lg mb-2">Capacity & Target</h2>
            <div className="text-center py-2">
              <p className="text-3xl font-bold text-emerald-700">1,500 kg</p>
              <p className="text-xs text-gray-500 mt-0.5">Daily Rescue Capacity</p>
              <div className="mt-4">
                <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-3 rounded-full transition-all"
                    style={{ width: `${Math.min(100, ((rescuedKg + 350) / 1500) * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {350 + rescuedKg}kg / 1,500kg claimed today
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-amber-500">
            <h3 className="font-semibold text-gray-800 mb-2">NGO Impact Metric</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Rescued Sessions:</span>
                <span className="font-bold text-amber-700">{12 + rescuedCount}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Food Rescued:</span>
                <span className="font-bold text-emerald-700">{1250 + rescuedKg} kg</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Estimated Value Saved:</span>
                <span className="font-bold text-blue-700">₹{Math.floor((1250 + rescuedKg) * 22)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Donation-eligible Stock */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">High Waste Risk Stock (Eligible for Rescue)</h2>
                <p className="text-xs text-gray-500">Listings with &gt; 65% waste risk score prioritized for NGO dispatch</p>
              </div>
              <button
                onClick={fetchEligible}
                className="text-xs text-emerald-700 hover:text-emerald-900 font-medium underline"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-center py-10 text-gray-500 text-sm">Loading rescue-eligible produce…</p>
            ) : listings.length === 0 ? (
              <div className="text-center py-10 bg-emerald-50/50 rounded-xl border border-dashed border-emerald-200">
                <p className="text-emerald-800 font-medium">No High-Risk Waste Right Now! 🎉</p>
                <p className="text-xs text-gray-500 mt-1">All produce listings are active and within safe risk thresholds.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 border border-amber-200 hover:border-amber-400 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">
                          {item.produceType} — {item.orgName || 'Local Farm'}
                        </h3>
                        <p className="text-xs text-gray-500">📍 {item.city} ({item.distanceKm} km away)</p>
                      </div>
                      <span className="bg-red-100 text-red-800 font-bold text-xs px-2.5 py-1 rounded-full">
                        Risk: {item.wasteRiskScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-gray-400 block">Available</span>
                        <span className="font-semibold text-gray-800">{item.quantityAvailable} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Est. Fresh Days</span>
                        <span className="font-semibold text-amber-700">
                          {item.estimatedDaysRange ? `${item.estimatedDaysRange[0]}-${item.estimatedDaysRange[1]} days` : '1-2 days'}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Original Price</span>
                        <span className="font-semibold text-gray-800">₹{item.pricePerKg}/kg</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimRescue(item.id, item.quantityAvailable)}
                      disabled={claimingId === item.id}
                      className="w-full bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {claimingId === item.id ? (
                        <span>Claiming & Dispatching…</span>
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