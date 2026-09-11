import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
      alert(`Rescue manifest confirmed! Lot dispatched under zero-cost APMC Rule 32-B. Transit van notified.`)
    } catch (err) {
      alert(`Failed to claim rescue: ${err instanceof Error ? err.message : String(err)}`)
    } finally {
      setClaimingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Top Status Strip */}
      <div className="w-full bg-slate text-paper px-4 md:px-10 py-2 border-b border-ink/20 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
        <div className="flex items-center gap-3">
          <span className="border border-paper/30 px-1.5 py-0.5 text-[11px] font-semibold">
            APMC Desk #3
          </span>
          <span className="text-paper/80">
            Mandi emergency relief marshaling • Zero-cost food rescue routing
          </span>
        </div>
        <div className="flex items-center gap-4 text-paper/90">
          <span className="text-paper">Accredited kitchens on network: 14</span>
          <span className="hidden sm:inline text-paper/70">Transit limit: 45 min pickup</span>
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
                NGO rescue hub & dispatch feed
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
              <Link to="/ngo" className="px-3 py-1.5 bg-ink/10 text-ink border-b-2 border-turmeric focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
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
              onClick={fetchEligible}
              className="px-3 py-1.5 bg-paper text-ink border border-ink text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Refresh dispatch board
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
        {/* Left Column: Metrics & Capacity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="border border-ink/20 p-5 bg-paper space-y-4">
            <div className="flex items-center justify-between border-b border-ink/15 pb-2">
              <h2 className="font-serif text-lg font-bold text-ink">
                Daily rescue capacity
              </h2>
              <span className="text-[11px] text-rust font-semibold">Tier 3 relief</span>
            </div>

            <div className="p-4 bg-paper/60 border border-ink/15 text-center space-y-2">
              <div className="font-serif text-3xl font-bold text-ink tabular-nums">
                1,500 <span className="font-sans text-sm font-normal text-ink/60">kg</span>
              </div>
              <p className="text-[11px] text-ink/60">Target intake across community relief hubs</p>

              <div className="mt-3 pt-2">
                <div className="w-full bg-paper border border-ink/30 h-3 overflow-hidden">
                  <div
                    className="bg-moss h-full transition-none"
                    style={{ width: `${Math.min(100, ((rescuedKg + 350) / 1500) * 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-ink/70 mt-2 font-medium tabular-nums">
                  {350 + rescuedKg} kg / 1,500 kg routed today ({Math.round(((rescuedKg + 350) / 1500) * 100)}%)
                </p>
              </div>
            </div>
          </div>

          <div className="border border-ink/20 p-5 bg-paper space-y-3">
            <h3 className="font-serif text-base font-bold text-ink border-b border-ink/15 pb-2">
              Relief impact ledger
            </h3>
            <div className="space-y-2.5 text-xs tabular-nums">
              <div className="flex justify-between items-center border-b border-ink/10 pb-2">
                <span className="text-ink/70">Rescued sessions logged:</span>
                <span className="font-bold text-ink">{12 + rescuedCount}</span>
              </div>
              <div className="flex justify-between items-center border-b border-ink/10 pb-2">
                <span className="text-ink/70">Produce diverted from landfill:</span>
                <span className="font-bold text-moss">{1250 + rescuedKg} kg</span>
              </div>
              <div className="flex justify-between items-center pb-1">
                <span className="text-ink/70">Estimated market value preserved:</span>
                <span className="font-bold text-turmeric">₹{Math.floor((1250 + rescuedKg) * 22)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High Risk Batches For Rescue */}
        <div className="lg:col-span-2">
          <div className="border border-ink/20 p-5 bg-paper">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-ink/15">
              <div>
                <h2 className="font-serif text-xl font-bold text-ink">
                  Imminent spoil risk batches
                </h2>
                <p className="text-xs text-ink/70">
                  Batches crossing the 36-hour threshold eligible for zero-cost distribution
                </p>
              </div>

              <span className="text-xs border border-rust/40 text-rust font-semibold px-2 py-0.5 bg-paper">
                Zero-cost routing active
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-xs text-ink/60">
                Scanning perishable lots nearing threshold…
              </div>
            ) : listings.length === 0 ? (
              <div className="p-8 text-center border border-ink/15 bg-paper/40 text-xs">
                <p className="font-semibold text-moss">No imminent spoilage lots detected on yard.</p>
                <p className="text-ink/60 mt-1">All mandi storage configurations are currently within commercial safe windows.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {listings.map((item) => (
                  <div
                    key={item.id}
                    className="border border-ink/20 p-4 bg-paper hover:bg-paper/80 transition-none space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg font-bold text-ink">
                          {item.produceType}{' '}
                          <span className="font-sans text-xs font-normal text-ink/60">
                            — {item.orgName || 'Nashik Panchavati Yard'}
                          </span>
                        </h3>
                        <p className="text-xs text-ink/60 tabular-nums">
                          Lot #{item.id.slice(0, 12)} • {item.city} • {item.distanceKm || 3.8} km from dispatch dock
                        </p>
                      </div>

                      <span className="border border-rust text-rust bg-paper px-2.5 py-1 text-xs font-bold tabular-nums">
                        Risk score: {item.wasteRiskScore}%
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-2.5 bg-paper/60 border border-ink/15 text-xs tabular-nums">
                      <div>
                        <span className="text-ink/60 block text-[11px]">Available quantity</span>
                        <span className="font-bold text-ink">{item.quantityAvailable} kg</span>
                      </div>
                      <div>
                        <span className="text-ink/60 block text-[11px]">Remaining freshness window</span>
                        <span className="font-bold text-rust">
                          {item.estimatedDaysRange ? `${item.estimatedDaysRange[0]}-${item.estimatedDaysRange[1]} days` : '4–8 hours'}
                        </span>
                      </div>
                      <div>
                        <span className="text-ink/60 block text-[11px]">Cost to recipient</span>
                        <span className="font-bold text-moss">₹0 (Zero-cost rescue)</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleClaimRescue(item.id, item.quantityAvailable)}
                      disabled={claimingId === item.id}
                      className="w-full bg-rust text-paper border border-ink hover:bg-rust/90 disabled:opacity-50 py-2.5 text-xs font-semibold transition-none flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
                    >
                      {claimingId === item.id ? (
                        <span>Logging dispatch pass &amp; notifying carrier…</span>
                      ) : (
                        <span>Claim free rescue batch ({item.quantityAvailable} kg)</span>
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