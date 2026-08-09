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
    <div className="min-h-screen bg-blue-50/50 pb-20">
      <header className="bg-sky-800 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Buyer Autonomous Dashboard</h1>
          <p className="text-sm opacity-90">खरीदार स्वायत्त पैनल - मांग पूर्वानुमान और एजेंट ऑर्डरिंग</p>
        </div>
        <a href="/" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white font-medium">
          ← Back to Home
        </a>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demand Forecasting & Requirement Input */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-sky-600">
            <h2 className="font-semibold text-gray-800 text-lg mb-2">Demand Forecast (AI Engine)</h2>
            <div className="bg-sky-50 p-3 rounded-lg border border-sky-100 mb-3 space-y-1 text-xs">
              <p className="text-gray-500">Suggested Daily Order Range:</p>
              <p className="font-bold text-sky-800 text-lg">
                {forecast ? `${forecast.min} - ${forecast.max} kg` : '35 - 50 kg'}
              </p>
              <p className="text-gray-600 italic mt-1">
                "{forecast?.rationale || 'Based on 4-week moving average + local weather factor'}"
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Order Quantity for Selected Crop (kg)
              </label>
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Number(e.target.value))}
                min={1}
                max={1000}
                className="w-full border border-gray-300 rounded-lg p-2 text-sm mb-2"
              />
              <button
                onClick={fetchListings}
                className="w-full bg-sky-700 hover:bg-sky-800 text-white font-medium py-2 rounded-lg text-xs transition-colors"
              >
                Update Demand Criteria
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow p-5 border-l-4 border-amber-500">
            <h3 className="font-semibold text-gray-800 mb-2">Agent Buying Mode</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              When you order, your <strong>Buyer Agent</strong> will automatically negotiate with the producer agent to get floor pricing based on waste risk scores.
            </p>
            {activeSessionId && (
              <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-xs">
                <span className="font-bold text-amber-800">Active Session:</span>
                <p className="font-mono text-gray-700 mt-0.5">{activeSessionId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Listings Search & Ordering */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-800">Available Fresh Batches</h2>

              <div className="flex gap-2 items-center">
                <label className="text-xs text-gray-500 font-medium">Crop:</label>
                <select
                  value={selectedProduce}
                  onChange={(e) => setSelectedProduce(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white font-medium text-gray-800"
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
            </div>

            {loadingListings ? (
              <p className="text-center py-10 text-gray-500 text-sm">Searching available produce listings…</p>
            ) : listings.length === 0 ? (
              <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed">
                <p className="text-gray-500 font-medium">No listings for {selectedProduce}</p>
                <p className="text-xs text-gray-400 mt-1">Try selecting a different crop above.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-sky-300 transition-all shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-gray-800 text-base">
                          {item.produceType} — {item.orgName || 'Producer'}
                        </h3>
                        <p className="text-xs text-gray-500">📍 {item.city} ({item.distanceKm} km away)</p>
                      </div>
                      <span className="bg-sky-100 text-sky-800 text-xs px-2.5 py-1 rounded-full font-semibold">
                        ₹{item.pricePerKg}/kg
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 my-3 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                      <div>
                        <span className="text-gray-400 block">Available</span>
                        <span className="font-semibold text-gray-800">{item.quantityAvailable} kg</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Waste Risk</span>
                        <span
                          className={`font-bold ${
                            item.wasteRiskScore > 60
                              ? 'text-red-600'
                              : item.wasteRiskScore > 30
                              ? 'text-amber-600'
                              : 'text-green-600'
                          }`}
                        >
                          {item.wasteRiskScore}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-400 block">Storage Temp</span>
                        <span className="font-semibold text-gray-800">{item.storageTemp}°C</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handlePlaceOrder(item)}
                      disabled={orderingListingId === item.id || item.quantityAvailable <= 0}
                      className="w-full bg-sky-700 hover:bg-sky-800 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {orderingListingId === item.id ? (
                        <span>Initiating AI Negotiation…</span>
                      ) : (
                        <span>🛒 Place Order &amp; Start AI Agent Deal ({orderQuantity} kg)</span>
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

// Standalone Browse Page export (mirrors dashboard search)
export const BrowsePage: React.FC = () => {
  return <BuyerDashboard />
}