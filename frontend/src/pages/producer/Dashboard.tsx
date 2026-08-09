import React, { useState, useEffect } from 'react'
import { ActivityLog } from '../../components/log-console/ActivityLog'
import { api, Listing } from '../../services/api'

export const ProducerDashboard: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  // New listing form state
  const [produceType, setProduceType] = useState('Tomato')
  const [quantityTotal, setQuantityTotal] = useState(200)
  const [pricePerKg, setPricePerKg] = useState(25)
  const [storageTemp, setStorageTemp] = useState(5)
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
        orgName: 'My Local Farm',
      })
      setShowAddModal(false)
      fetchListings()
    } catch (err) {
      alert(`Error creating listing: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setSubmitting(false)
    }
  }

  const activeCount = listings.filter((l) => l.status === 'active').length
  const highRiskCount = listings.filter((l) => l.wasteRiskScore > 60).length
  const totalVolume = listings.reduce((sum, l) => sum + l.quantityTotal, 0)

  return (
    <div className="min-h-screen bg-amber-50/50 pb-20">
      <header className="bg-amber-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Producer Dashboard</h1>
          <p className="text-sm opacity-90">किसान / उत्पादक पैनल - अपनी फसलें पंजीकृत करें</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 px-3 py-1.5 rounded-lg text-white font-medium shadow"
          >
            + New Produce Listing
          </button>
          <a href="/" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white font-medium">
            ← Home
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Producer Overview */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-amber-600">
            <h2 className="font-semibold text-gray-800 text-lg mb-3">आपकी स्थिति (Status Overview)</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Active Produce Batches:</span>
                <span className="font-bold text-amber-700">{activeCount}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Total Harvested Volume:</span>
                <span className="font-bold text-emerald-700">{totalVolume} kg</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-gray-600">High Risk Batches (&gt;60%):</span>
                <span className="font-bold text-red-600">{highRiskCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-emerald-600">
            <h3 className="font-semibold text-gray-800 mb-2">Quick Actions</h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-medium py-2.5 rounded-lg text-sm mb-2 transition-colors shadow-sm"
            >
              🌱 Add New Crop Listing
            </button>
            <a
              href="/listings"
              className="block text-center w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              📋 Detailed Management View
            </a>
          </div>
        </div>

        {/* Live Active Listings */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Live Farm Batches</h2>
                <p className="text-xs text-gray-500">Real-time waste risk score &amp; buyer agent connection</p>
              </div>
              <button onClick={fetchListings} className="text-xs text-amber-800 hover:underline font-medium">
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="text-center py-10 text-gray-500 text-sm">Loading produce listings…</p>
            ) : listings.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm">No active crop listings found.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {listings.map((item) => {
                  const riskColor =
                    item.wasteRiskScore > 60
                      ? 'bg-red-100 text-red-800 border-red-200'
                      : item.wasteRiskScore > 35
                      ? 'bg-amber-100 text-amber-800 border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border-emerald-200'

                  return (
                    <div
                      key={item.id}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{item.produceType}</h3>
                          <p className="text-xs text-gray-500">ID: {item.id} • {item.city}</p>
                        </div>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${riskColor}`}>
                          Risk: {item.wasteRiskScore}%
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-gray-600 my-3 bg-gray-50 p-2.5 rounded-lg">
                        <div className="flex justify-between">
                          <span>Total Harvested:</span>
                          <span className="font-semibold text-gray-800">{item.quantityTotal} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Stock Available:</span>
                          <span className="font-semibold text-emerald-700">{item.quantityAvailable} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Storage Temp:</span>
                          <span className="font-semibold text-gray-800">{item.storageTemp}°C</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-1 border-t">
                        <span className="text-base font-bold text-amber-800">₹{item.pricePerKg} / kg</span>
                        <span className="text-xs capitalize font-medium text-gray-500">Status: {item.status}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Listing Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-lg text-gray-800">List New Produce Batch</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Produce Crop</label>
                <select
                  value={produceType}
                  onChange={(e) => setProduceType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                >
                  <option value="Tomato">Tomato (टमाटर)</option>
                  <option value="Potato">Potato (आलू)</option>
                  <option value="Onion">Onion (प्याज)</option>
                  <option value="Cabbage">Cabbage (पत्ता गोभी)</option>
                  <option value="Carrot">Carrot (गाजर)</option>
                  <option value="Banana">Banana (केला)</option>
                  <option value="Mango">Mango (आम)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityTotal}
                    onChange={(e) => setQuantityTotal(Number(e.target.value))}
                    min={10}
                    max={5000}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Floor Price (₹/kg)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Storage Temp (°C)</label>
                <input
                  type="number"
                  value={storageTemp}
                  onChange={(e) => setStorageTemp(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm"
                >
                  {submitting ? 'Creating…' : 'Publish Listing'}
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