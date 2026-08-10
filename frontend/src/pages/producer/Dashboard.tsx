import React, { useState, useEffect } from 'react'
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

  const activeCount = listings.filter((l) => l.status === 'active' || l.status === 'low_stock').length
  const highRiskCount = listings.filter((l) => l.wasteRiskScore > 60 && l.status !== 'rescued').length
  const totalVolume = listings.reduce((sum, l) => sum + l.quantityTotal, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-slate-900 to-black text-slate-100 pb-20 font-sans">
      {/* Sticky Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-amber-500/20 p-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🌾</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-amber-400 via-orange-300 to-amber-200 bg-clip-text text-transparent">
                Producer Dashboard
              </h1>
              <p className="text-xs text-amber-200/70 font-medium">किसान / उत्पादक पोर्टल — Crop Shelf-Life Tracker & Listings</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="text-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 px-4 py-2 rounded-xl text-white font-bold shadow-lg shadow-amber-900/30 hover:shadow-amber-900/50 transition-all transform hover:-translate-y-0.5"
            >
              + List New Produce
            </button>
            <a
              href="/"
              className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-slate-200 font-bold transition-all"
            >
              ← Home
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Overview and Metrics */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-amber-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="font-extrabold text-amber-400 text-lg mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span> Status Overview
            </h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400">Active Batches:</span>
                <span className="font-extrabold text-amber-400 text-base">{activeCount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-slate-400">Total Volume:</span>
                <span className="font-extrabold text-emerald-400 text-base">{totalVolume} kg</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-slate-400">High Risk Batches (&gt;60%):</span>
                <span className="font-extrabold text-red-400 text-base">{highRiskCount}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-emerald-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-extrabold text-emerald-400 mb-4 flex items-center gap-2">
              <span className="text-xl">⚡</span> Quick Actions
            </h3>
            <button
              onClick={() => setShowAddModal(true)}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-3 rounded-xl text-sm mb-3 transition-all transform hover:-translate-y-0.5 shadow-md shadow-emerald-950/50"
            >
              🌱 Add New Crop Listing
            </button>
            <a
              href="/listings"
              className="block text-center w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm transition-all"
            >
              📋 Detailed Management View
            </a>
          </div>
        </div>

        {/* Right Side: Active Listings */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">Live Farm Batches</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time waste risk score &amp; buyer agent connection</p>
              </div>
              <button
                onClick={fetchListings}
                className="text-xs text-amber-400 hover:text-amber-300 font-bold underline transition-colors"
              >
                Refresh Board
              </button>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm font-medium">Scanning crop configurations…</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500 font-bold text-lg">No active crop listings found.</p>
                <p className="text-xs text-slate-600 mt-1">Click "+ List New Produce" to get started.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {listings.map((item) => {
                  const riskColor =
                    item.wasteRiskScore > 60
                      ? 'bg-red-950/80 text-red-300 border-red-800/40'
                      : item.wasteRiskScore > 35
                      ? 'bg-amber-950/80 text-amber-300 border-amber-800/40'
                      : 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40'

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 hover:border-amber-500/35 transition-all duration-300 shadow-md relative overflow-hidden group hover:shadow-amber-950/20"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-extrabold text-slate-100 text-lg group-hover:text-amber-400 transition-colors">
                            {item.produceType}
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">ID: {item.id} • 📍 {item.city}</p>
                        </div>
                        <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full border ${riskColor}`}>
                          Risk: {item.wasteRiskScore}%
                        </span>
                      </div>

                      <div className="space-y-2 text-xs text-slate-300 my-4 bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Total Harvested:</span>
                          <span className="font-semibold text-slate-200">{item.quantityTotal} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Stock Available:</span>
                          <span className="font-semibold text-emerald-400">{item.quantityAvailable} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Storage Temp:</span>
                          <span className="font-semibold text-slate-200">{item.storageTemp}°C</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Humidity:</span>
                          <span className="font-semibold text-slate-200">{item.storageHumidity}%</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-3 border-t border-slate-800/60">
                        <span className="text-lg font-extrabold text-amber-400">₹{item.pricePerKg} <span className="text-xs font-normal text-slate-500">/ kg</span></span>
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          item.status === 'active' ? 'bg-emerald-950 text-emerald-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.status}
                        </span>
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
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/20 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 animate-scale-up">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-lg text-slate-100">List New Produce Batch</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-300 text-xl font-bold transition-colors"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">Produce Crop</label>
                <select
                  value={produceType}
                  onChange={(e) => setProduceType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-amber-500/40 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 transition-colors"
                >
                  {produceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Quantity (kg)</label>
                  <input
                    type="number"
                    value={quantityTotal}
                    onChange={(e) => setQuantityTotal(Number(e.target.value))}
                    min={10}
                    max={5000}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-amber-500/40 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Floor Price (₹/kg)</label>
                  <input
                    type="number"
                    value={pricePerKg}
                    onChange={(e) => setPricePerKg(Number(e.target.value))}
                    min={1}
                    max={500}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-amber-500/40 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Storage Temp (°C)</label>
                  <input
                    type="number"
                    value={storageTemp}
                    onChange={(e) => setStorageTemp(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-amber-500/40 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5">Storage Humidity (%)</label>
                  <input
                    type="number"
                    value={storageHumidity}
                    onChange={(e) => setStorageHumidity(Number(e.target.value))}
                    min={30}
                    max={100}
                    className="w-full bg-slate-950 border border-slate-850 hover:border-amber-500/40 rounded-xl p-3 text-sm text-slate-200 focus:border-amber-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm transition-all shadow-md shadow-amber-950/50"
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