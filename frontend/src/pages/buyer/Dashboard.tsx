import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
      alert(`Order placed! Autonomous negotiation started for order ID: ${res.orderId}. Watch live log in bottom right drawer.`)
      fetchListings()
    } catch (err) {
      alert(`Order error: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setOrderingListingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Top Status Strip */}
      <div className="w-full bg-slate text-paper px-4 md:px-10 py-2 border-b border-ink/20 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
        <div className="flex items-center gap-3">
          <span className="border border-paper/30 px-1.5 py-0.5 text-[11px] font-semibold">
            APMC Desk #2
          </span>
          <span className="text-paper/80">
            Mandi wholesale discount marketplace • Real-time dynamic markdown clearance
          </span>
        </div>
        <div className="flex items-center gap-4 text-paper/90">
          <span>Active buyers connected: 28</span>
          <span className="hidden sm:inline text-paper/70">Transit limit: &lt; 04h dispatch</span>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="w-full bg-paper border-b border-ink/20 sticky top-0 z-30">
        <div className="px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex flex-col group focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
              <span className="font-serif text-2xl font-bold text-ink tracking-tight">
                Sanjeevani
              </span>
              <span className="text-[11px] font-sans text-ink/70 leading-none">
                Discount marketplace & bulk buyer portal
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
              <Link to="/buyer" className="px-3 py-1.5 bg-ink/10 text-ink border-b-2 border-turmeric focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
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

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchListings}
              className="px-3 py-1.5 bg-paper text-ink border border-ink text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Refresh listings
            </button>
            <Link
              to="/"
              className="text-xs text-ink/70 hover:text-ink underline focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Home overview
            </Link>
          </div>
        </div>
      </header>

      <main className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Demand Insights & Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-ink/20 p-5 bg-paper space-y-4">
            <div className="flex items-center justify-between border-b border-ink/15 pb-2">
              <h2 className="font-serif text-lg font-bold text-ink">
                Demand forecasting ledger
              </h2>
              <span className="text-[11px] text-turmeric font-semibold">Tier 2 procurement</span>
            </div>

            <div className="p-4 bg-paper/60 border border-ink/15 space-y-2 text-xs">
              <span className="text-ink/60 block">Suggested daily order range ({selectedProduce})</span>
              <div className="font-serif text-2xl font-bold text-ink tabular-nums">
                {forecast ? `${forecast.min} - ${forecast.max} kg` : '35 - 50 kg'}
              </div>
              <p className="text-[11px] text-ink/75 pt-2 border-t border-ink/10 leading-relaxed italic">
                "{forecast?.rationale || 'Based on 4-week moving average + local weather factor'}"
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-ink mb-1">
                  Order quantity for selected batch (kg)
                </label>
                <input
                  type="number"
                  value={orderQuantity}
                  onChange={(e) => setOrderQuantity(Number(e.target.value))}
                  min={1}
                  max={1000}
                  className="w-full bg-paper border border-ink p-2 text-ink focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none tabular-nums"
                />
              </div>

              <button
                type="button"
                onClick={fetchListings}
                className="w-full bg-turmeric text-paper border border-ink py-2.5 font-semibold text-xs hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Sync market demand criteria
              </button>
            </div>
          </div>

          <div className="border border-ink/20 p-5 bg-paper space-y-3 text-xs">
            <h3 className="font-serif text-base font-bold text-ink">
              Automated markdown protocol
            </h3>
            <p className="text-ink/80 leading-relaxed text-[11px]">
              Upon initiating an order, your <strong>Buyer Agent</strong> negotiates directly with the producer desk to secure discounted bulk rates before the 36-hour rescue threshold.
            </p>
            {activeSessionId && (
              <div className="p-2.5 bg-paper/70 border border-ink/20 text-[11px] mt-2">
                <span className="font-semibold text-turmeric block">Active negotiation session</span>
                <p className="font-mono text-ink mt-0.5 break-all">{activeSessionId}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Marketplace Batches */}
        <div className="lg:col-span-2">
          <div className="border border-ink/20 p-5 bg-paper">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-ink/15">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink">
                  Available perishable batches
                </h2>
                <p className="text-xs text-ink/70">Directly sourced from Nashik APMC shed arrivals</p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <label className="font-semibold text-ink">Crop filter:</label>
                <select
                  value={selectedProduce}
                  onChange={(e) => setSelectedProduce(e.target.value)}
                  className="bg-paper border border-ink px-3 py-1 text-xs text-ink font-semibold focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
                >
                  {produceTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {loadingListings ? (
                <div className="p-12 text-center text-xs text-ink/60">Loading Nashik APMC lots...</div>
              ) : (
                <div className="space-y-3">
                  {listings.map((item) => (
                    <div key={item.id} className="border border-ink/20 p-4 bg-paper flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold font-serif text-ink">{item.produceType} - {item.quantityAvailable} kg</p>
                        <p className="text-ink/70 font-mono">Nashik APMC - ₹{item.pricePerKg}/kg</p>
                      </div>
                      <button
                        onClick={() => handlePlaceOrder(item)}
                        disabled={orderingListingId === item.id}
                        className="px-3 py-1.5 bg-turmeric text-paper border border-ink font-semibold hover:bg-turmeric/90"
                      >
                        {orderingListingId === item.id ? "Placing order..." : "Place order"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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