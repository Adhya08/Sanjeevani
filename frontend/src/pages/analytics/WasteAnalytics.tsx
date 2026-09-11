import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts'
import { ActivityLog } from '../../components/log-console/ActivityLog'
import { api, WasteAnalytics } from '../../services/api'

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<WasteAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCertificate, setShowCertificate] = useState(false)

  useEffect(() => {
    api
      .getWasteAnalytics()
      .then((res) => setData(res))
      .catch((err) => console.error('Failed to load analytics', err))
      .finally(() => setLoading(false))
  }, [])

  // Chart data formatting using strict palette tokens:
  // Sold: Moss (#5C6B4F), Rescued: Turmeric (#B9791F), Lost: Rust (#8B3A2B)
  const pieData = [
    { name: 'Commercial trade', value: data?.totalSold || 1350, fill: '#5C6B4F' },
    { name: 'NGO rescued', value: data?.totalRescued || 315, fill: '#B9791F' },
    { name: 'Spoiled / lost', value: data?.totalLost || 105, fill: '#8B3A2B' },
  ]

  const produceWiseData = Object.entries(data?.byProduceType || {}).map(([produce, info]) => ({
    produce,
    listed: info.listed,
    sold: info.sold,
    rescued: info.rescued,
  }))

  const monthlyTrends = [
    { month: 'Jul', sold: 1200, rescued: 300, lost: 100 },
    { month: 'Aug', sold: 1350, rescued: 350, lost: 80 },
    { month: 'Sep', sold: 1280, rescued: 400, lost: 60 },
    { month: 'Oct', sold: data?.totalSold || 1400, rescued: data?.totalRescued || 380, lost: data?.totalLost || 50 },
  ]

  return (
    <div className="min-h-screen bg-paper text-ink font-sans selection:bg-turmeric selection:text-ink">
      {/* Top Status Strip */}
      <div className="w-full bg-slate text-paper px-4 md:px-10 py-2 border-b border-ink/20 flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
        <div className="flex items-center gap-3">
          <span className="border border-paper/30 px-1.5 py-0.5 text-[11px] font-semibold">
            APMC Audit Log
          </span>
          <span className="text-paper/80">
            Physical waste diversion ledger • Statutory ESG sustainability audit
          </span>
        </div>
        <div className="flex items-center gap-4 text-paper/90">
          <span>Carbon offset factor: 1.9 kg CO₂/kg</span>
          <span className="hidden sm:inline text-paper/70">Audit cycle: 2024–Q3</span>
        </div>
      </div>

      {/* Main Header */}
      <header className="w-full bg-paper border-b border-ink/20 sticky top-0 z-30">
        <div className="px-4 md:px-10 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex flex-col group focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
              <span className="font-serif text-2xl font-bold text-ink tracking-tight">
                Sanjeevani
              </span>
              <span className="text-[11px] font-sans text-ink/70 leading-none">
                Waste analytics & ESG audit ledger
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
              <Link to="/ngo" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                NGO dispatch feed
              </Link>
              <Link to="/listings" className="px-3 py-1.5 text-ink/80 hover:text-ink hover:bg-ink/5 transition-none focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Crate inventory
              </Link>
              <Link to="/analytics" className="px-3 py-1.5 bg-ink/10 text-ink border-b-2 border-turmeric focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none">
                Waste analytics
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              className="px-3.5 py-1.5 bg-turmeric text-paper border border-ink text-xs font-semibold hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
            >
              Generate ESG certificate
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

      {/* Printed ESG Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 bg-ink/50 z-50 flex items-center justify-center p-4">
          <div className="bg-paper ledger-double-border p-8 max-w-xl w-full text-center space-y-6 text-ink">
            <div className="flex justify-between items-start border-b border-ink/20 pb-3">
              <div className="text-left">
                <span className="font-serif text-xl font-bold block text-ink">Sanjeevani Mandi Ledger</span>
                <span className="text-[11px] text-ink/60">APMC Environmental Sustainability Certification</span>
              </div>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="text-ink/60 hover:text-ink text-xl font-bold focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-ink/70 italic">This certificate of food waste diversion is awarded to</p>
              <h3 className="font-serif text-2xl font-bold text-ink">Sanjeevani Verified Partner Network</h3>
              <p className="text-xs text-ink/80 max-w-md mx-auto leading-relaxed pt-1">
                For continuous compliance with APMC Produce Rescue protocols, mitigating post-harvest biochemical spoilage and facilitating cold-chain handoffs to accredited community kitchens.
              </p>
            </div>

            <div className="border border-ink/20 p-4 bg-paper/60 max-w-xs mx-auto space-y-1 tabular-nums">
              <span className="text-xs text-ink/70 font-semibold block">Total produce diverted from landfill</span>
              <span className="font-serif text-3xl font-bold text-moss block">{data?.totalRescued ?? 315} kg</span>
              <span className="text-[10px] text-ink/60 block">
                Equivalent to ~{(((data?.totalRescued ?? 315) * 1.9)).toFixed(1)} kg CO₂ emissions avoided
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-ink/20 pt-4 text-ink/70">
              <div className="text-left">
                <div className="font-semibold text-ink">APMC Inspectorate Seal</div>
                <div>Hash: #0x9B4E_AUDIT</div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-ink">Date authenticated</div>
                <div>{new Date().toLocaleDateString('en-IN')}</div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-ink/15">
              <button
                type="button"
                onClick={() => window.print()}
                className="w-full bg-turmeric text-paper border border-ink py-2 text-xs font-semibold hover:bg-turmeric/90 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Print official folio
              </button>
              <button
                type="button"
                onClick={() => setShowCertificate(false)}
                className="w-1/3 bg-paper text-ink border border-ink py-2 text-xs font-semibold hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-turmeric focus-visible:outline-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="p-16 text-center text-xs text-ink/60">
            Compiling biological diversion metrics…
          </div>
        ) : (
          <>
            {/* Metric Summary Tally (4-column grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border border-ink/20 divide-y sm:divide-y-0 sm:divide-x divide-ink/20 bg-paper">
              <div className="p-5">
                <div className="text-xs text-ink/70">Total produce logged</div>
                <div className="font-serif text-3xl font-bold text-ink mt-1 tabular-nums">
                  {data?.totalListed ?? 2100} <span className="font-sans text-xs font-normal text-ink/60">kg</span>
                </div>
                <div className="text-[11px] text-ink/60 mt-1">Across all registered crops</div>
              </div>

              <div className="p-5">
                <div className="text-xs text-moss font-semibold">Commercial sales cleared</div>
                <div className="font-serif text-3xl font-bold text-moss mt-1 tabular-nums">
                  {data?.totalSold ?? 1350} <span className="font-sans text-xs font-normal text-moss/80">kg</span>
                </div>
                <div className="text-[11px] text-ink/60 mt-1">Direct mandi trade velocity</div>
              </div>

              <div className="p-5">
                <div className="text-xs text-turmeric font-semibold">Rescued via accredited NGOs</div>
                <div className="font-serif text-3xl font-bold text-turmeric mt-1 tabular-nums">
                  {data?.totalRescued ?? 315} <span className="font-sans text-xs font-normal text-turmeric/80">kg</span>
                </div>
                <div className="text-[11px] text-turmeric font-semibold mt-1 tabular-nums">
                  {data?.rescuePercentage ?? 15}% total rescue rate
                </div>
              </div>

              <div className="p-5">
                <div className="text-xs text-rust font-semibold">Biological waste (spoilage)</div>
                <div className="font-serif text-3xl font-bold text-rust mt-1 tabular-nums">
                  {data?.totalLost ?? 105} <span className="font-sans text-xs font-normal text-rust/80">kg</span>
                </div>
                <div className="text-[11px] text-ink/60 mt-1 tabular-nums">
                  {data?.wastePercentage ?? 5}% waste index (Target &lt; 8%)
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Distribution Donut */}
              <div className="border border-ink/20 p-5 bg-paper">
                <div className="flex justify-between items-center pb-2 mb-4 border-b border-ink/15">
                  <h3 className="font-serif text-base font-bold text-ink">Produce allocation breakdown</h3>
                  <span className="text-[11px] text-ink/60">Sold vs rescued vs lost</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={85}
                      dataKey="value"
                      stroke="#EDE6D6"
                      strokeWidth={2}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} kg`, 'Volume']}
                      contentStyle={{
                        backgroundColor: '#EDE6D6',
                        borderColor: '#2B2620',
                        borderRadius: 0,
                        color: '#2B2620',
                        fontSize: 12,
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend */}
              <div className="border border-ink/20 p-5 bg-paper">
                <div className="flex justify-between items-center pb-2 mb-4 border-b border-ink/15">
                  <h3 className="font-serif text-base font-bold text-ink">Monthly rescue & trade trends (kg)</h3>
                  <span className="text-[11px] text-ink/60">Supply chain efficiency</span>
                </div>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="2 2" stroke="#2B2620" strokeOpacity={0.15} />
                    <XAxis dataKey="month" stroke="#2B2620" fontSize={11} tickLine={false} />
                    <YAxis stroke="#2B2620" fontSize={11} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#EDE6D6',
                        borderColor: '#2B2620',
                        borderRadius: 0,
                        color: '#2B2620',
                        fontSize: 12,
                      }}
                    />
                    <Legend />
                    <Bar dataKey="sold" name="Sold" fill="#5C6B4F" />
                    <Bar dataKey="rescued" name="Rescued" fill="#B9791F" />
                    <Bar dataKey="lost" name="Lost" fill="#8B3A2B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Produce-wise table */}
            {produceWiseData.length > 0 && (
              <div className="border border-ink/20 bg-paper">
                <div className="bg-slate text-paper px-4 py-2.5 flex items-center justify-between border-b border-ink/20 text-xs">
                  <h3 className="font-semibold">Produce-wise supply performance</h3>
                  <span className="text-paper/70">Audit by commodity</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs tabular-nums border-collapse">
                    <thead>
                      <tr className="bg-paper/80 border-b border-ink/20 text-ink/80 font-semibold">
                        <th className="p-3 border-r border-ink/10">Produce type</th>
                        <th className="p-3 border-r border-ink/10 text-right">Total listed</th>
                        <th className="p-3 border-r border-ink/10 text-right">Commercial sold</th>
                        <th className="p-3 text-right">NGO rescued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/10 text-ink">
                      {produceWiseData.map((row) => (
                        <tr key={row.produce} className="hover:bg-ink/5 transition-none">
                          <td className="p-3 border-r border-ink/10 font-bold">{row.produce}</td>
                          <td className="p-3 border-r border-ink/10 text-right">{row.listed} kg</td>
                          <td className="p-3 border-r border-ink/10 text-right font-semibold text-moss">{row.sold} kg</td>
                          <td className="p-3 text-right font-semibold text-turmeric">{row.rescued} kg</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <ActivityLog />
    </div>
  )
}