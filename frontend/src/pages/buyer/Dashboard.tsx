import React, { useState, useEffect } from 'react'
import { ActivityLog } from '../../components/log-console/ActivityLog'
import { api, Listing, DemandForecast } from '../../services/api'

export const BuyerDashboard: React.FC = () => {
  const [selectedProduce, setSelectedProduce] = useState('Tomato')
  const [listings, setListings] = useState<Listing[]>([])
  const [loadingListings, setLoadingListings] = useState(true)
  const [forecast, setForecast] = useState<DemandForecast | null>(null)
  const [orderQuantity, setOrderQuantity] = useState<number>(40)
  const [orderingListingId, setOrderingListingId] = useState<string | null>(null)
  const [activeSessionId, setActiveSessionId] = useState<string | undefined>(undefined)
  const [produceTypes, setProduceTypes] = useState<string[]>([
    'Tomato', 'Potato', 'Onion', 'Cabbage', 'Carrot', 'Banana', 'Mango'
  ])

  const fetchListings = () => {
    setLoadingListings(true)
    api
      .getListings({ produceType: selectedProduce })
      .then((res) => setListings(res.listings))
      .catch((err) => console.error('Failed to fetch buyer listings', err))
      .finally(() => setLoadingListings(false))
  }

  const fetchForecast = () => {
    api
      .getDemandForecast(selectedProduce)
      .then((res) => setForecast(res))
      .catch((err) => console.error('Failed to fetch forecast', err))
  }

  useEffect(() => {
    fetchListings()
    fetchForecast()
  }, [selectedProduce])

  useEffect(() => {
    api.getProduceTypes()
      .then((res) => {
        setProduceTypes(res.produceTypes)
        if (res.produceTypes.length > 0 && !res.produceTypes.includes(selectedProduce)) {
          setSelectedProduce(res.produceTypes[0])
        }
      })
      .catch((err) => console.error('Failed to fetch produce types', err))
  }, [])

  const handlePlaceOrder = async (listing: Listing) => {
    setOrderingListingId(listing.id)
    try {
      const res = await api.placeOrder({
        listingId: listing.id,
        quantity: Number(orderQuantity),
      })
      setActiveSessionId(res.orderId)
      alert(`🎉 Order placed! AI Agent negotiation started for Order ID: ${res.orderId}. Watch live log in bottom right!`)
      fetchListings()
    } catch (err) {
      alert(`Order error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setOrderingListingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-sky-950 to-slate-900 text-slate-100 pb-20 font-sans">
      {/* Sticky Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-sky-500/20 p-5 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-3xl animate-pulse">🛒</span>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-sky-400 via-teal-300 to-sky-200 bg-clip-text text-transparent">
                Buyer Agent Portal
              </h1>
              <p className="text-xs text-sky-200/70 font-medium">खरीदार स्वायत्त पैनल — Demand Forecasts & Autonomous Bargaining</p>
            </div>
          </div>
          <a
            href="/"
            className="text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-slate-205 font-bold transition-all"
          >
            ← Home
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column: AI Demand Insights */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/60 border border-sky-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 text-6xl group-hover:scale-110 transition-transform">🧠</div>
            <h2 className="font-extrabold text-sky-400 text-lg mb-4 flex items-center gap-2">
              <span>📊</span> AI Demand Forecast
            </h2>
            
            <div className="bg-slate-950/80 p-4 rounded-xl border border-sky-950/50 mb-4 space-y-2">
              <p className="text-xs text-slate-500">Suggested Daily Order Range:</p>
              <p className="font-extrabold text-sky-400 text-2xl">
                {forecast ? `${forecast.min} - ${forecast.max} kg` : '35 - 50 kg'}
              </p>
              <p className="text-xs text-slate-400 italic leading-relaxed mt-2 border-t border-slate-800/40 pt-2">
                "{forecast?.rationale || 'Based on 4-week moving average + local weather factor'}"
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1.5">
                  Order Quantity for Selected Crop (kg)
                </label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  min={1}
                  max={1000}
                  className="w-full bg-slate-950 border border-slate-850 hover:border-sky-500/40 rounded-xl p-3 text-sm text-slate-200 focus:border-sky-500 transition-colors"
                />
              </div>
              <button
                onClick={fetchListings}
                className="w-full bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-850 text-white font-bold py-3 rounded-xl text-xs transition-all transform hover:-translate-y-0.5 shadow-md shadow-sky-950/30"
              >
                Update Demand Criteria
              </button>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-amber-500/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h3 className="font-extrabold text-amber-400 mb-2 flex items-center gap-2">
              <span>🤖</span> Agent Buying Mode
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upon ordering, your <strong>Buyer Agent</strong> negotiates directly with the producer agent to secure the best deal, leveraging real-time decay and waste risk metrics.
            </p>
            {activeSessionId && (
              <div className="bg-slate-950/80 p-3 rounded-xl border border-amber-950/40 text-xs mt-3">
                <span className="font-bold text-amber-400">Active Session:</span>
                <p className="font-mono text-slate-300 mt-1 break-all bg-black/40 p-1.5 rounded">{activeSessionId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column: Search & Listings */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900/40 border border-slate-850 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100">Available Fresh Batches</h2>
                <p className="text-xs text-slate-400 mt-1">Sourced from verified local farm sellers</p>
              </div>

              <div className="flex gap-2 items-center">
                <label className="text-xs text-slate-500 font-bold">Crop Filter:</label>
                <select
                  value={selectedProduce}
                  onChange={(e) => setSelectedProduce(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:border-sky-500 font-semibold"
                >
                  {produceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loadingListings ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-3">
                <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-slate-400 text-sm font-medium">Scanning live marketplace inventories…</p>
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-500 font-bold">No active listings for {selectedProduce} right now.</p>
                <p className="text-xs text-slate-650 mt-1">Select a different crop from the filter above.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-slate-900/60 rounded-2xl border border-slate-800 p-5 hover:border-sky-500/35 transition-all duration-300 shadow-md group"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-extrabold text-slate-100 text-lg group-hover:text-sky-400 transition-colors">
                          {item.produceType} <span className="text-slate-550 font-normal text-xs">— {item.orgName || 'Producer'}</span>
                        </h3>
                        <p className="text-[10px] text-slate-550 mt-0.5">📍 {item.city} • {item.distanceKm} km away</p>
                      </div>
                      <span className="bg-sky-950/80 text-sky-300 font-extrabold text-sm px-3.5 py-1.5 rounded-xl border border-sky-800/40">
                        ₹{item.pricePerKg}/kg
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 my-4 text-xs bg-slate-950/40 p-3 rounded-xl border border-slate-850/50">
                      <div>
                        <span className="text-slate-500 block mb-0.5">Available Quantity</span>
                        <span className="font-bold text-slate-200">{item.quantityAvailable} kg</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Waste Risk Status</span>
                        <span
                          className={`font-bold ${
                            item.wasteRiskScore > 60
                              ? 'text-red-400'
                              : item.wasteRiskScore > 35
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {item.wasteRiskScore}% Risk
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block mb-0.5">Storage Temp</span>
                        <span className="font-bold text-slate-200">{item.storageTemp}°C</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlaceOrder(item)}
                      disabled={orderingListingId === item.id || item.quantityAvailable <= 0}
                      className="w-full bg-slate-850 hover:bg-sky-600 border border-slate-755 hover:border-sky-505 disabled:opacity-50 text-slate-200 hover:text-white font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-sky-900/30"
                    >
                      {orderingListingId === item.id ? (
                        <span>Initiating AI Negotiation…</span>
                      ) : (
                        <span>🛒 Order Batch &amp; Start Bargaining ({orderQuantity} kg)</span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <ActivityLog sessionId={activeSessionId} />
    </div>
  )
}

export const BrowsePage: React.FC = () => {
  return <BuyerDashboard />
}