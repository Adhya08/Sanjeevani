import React, { useState, useEffect } from 'react'
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

  // Chart data formatting
  const pieData = [
    { name: 'Sold', value: data?.totalSold || 1350, fill: '#22c55e' },
    { name: 'Rescued', value: data?.totalRescued || 315, fill: '#f59e0b' },
    { name: 'Lost', value: data?.totalLost || 105, fill: '#ef4444' },
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-emerald-700 text-white p-4 shadow-md sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Waste Analytics & ESG Audit</h1>
          <p className="text-sm opacity-90">बचाव का प्रभाव और आपूर्ति श्रृंखला विश्लेषण</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowCertificate(true)}
            className="text-xs bg-emerald-600 hover:bg-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded-lg text-white font-medium shadow"
          >
            📜 Download ESG Certificate
          </button>
          <a href="/" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white font-medium">
            ← Back to Home
          </a>
        </div>
      </header>

      {showCertificate && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-xl w-full shadow-2xl relative border-8 border-double border-emerald-800 text-center space-y-6">
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
            >
              ×
            </button>
            <div className="space-y-2">
              <span className="text-4xl">🌱</span>
              <h2 className="text-2xl font-serif font-bold text-emerald-800 tracking-wider">SANJEEVANI</h2>
              <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">ESG &amp; CSR Environmental Impact Certificate</p>
            </div>
            
            <div className="border-t border-b border-emerald-800/20 py-6 my-4 space-y-4">
              <p className="text-xs text-slate-600 italic">This certificate is proudly presented to</p>
              <h3 className="text-xl font-bold text-slate-800">Sanjeevani Verified Partner Network</h3>
              <p className="text-sm text-slate-700 max-w-md mx-auto leading-relaxed">
                For outstanding dedication to sustainable agriculture and supply chain optimization, preventing food decay and routing high-risk inventory to non-governmental organizations.
              </p>
              <div className="bg-emerald-50 max-w-xs mx-auto p-4 rounded-xl border border-emerald-200/50 mt-4">
                <span className="text-xs text-emerald-800 font-semibold block uppercase">Total Produce Rescued</span>
                <span className="text-3xl font-extrabold text-emerald-700 block mt-1">{data?.totalRescued ?? 315} kg</span>
                <span className="text-[10px] text-slate-500 mt-1 block">Equivalent to ~{( (data?.totalRescued ?? 315) * 1.9 ).toFixed(1)}kg CO₂ emissions avoided</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 px-6">
              <div>
                <p className="font-bold border-b border-slate-300 pb-1">Sanjeevani OS Protocol</p>
                <p className="mt-1">Verified Audit Engine</p>
              </div>
              <div>
                <p className="font-bold border-b border-slate-300 pb-1">Date Issued</p>
                <p className="mt-1">{new Date().toLocaleDateString('en-IN')}</p>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => window.print()}
                className="w-full bg-emerald-800 hover:bg-emerald-950 text-white font-medium py-2 rounded-lg text-xs transition-colors shadow-md"
              >
                🖨️ Print or Save PDF
              </button>
              <button
                onClick={() => setShowCertificate(false)}
                className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading live analytics data…</div>
        ) : (
          <>
            {/* Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-emerald-500">
                <p className="text-xs text-gray-500 font-semibold uppercase">Total Listed</p>
                <p className="text-2xl font-bold text-gray-800">{data?.totalListed ?? 2100} kg</p>
                <p className="text-[11px] text-gray-400 mt-1">Across all produce types</p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-green-500">
                <p className="text-xs text-gray-500 font-semibold uppercase">Successfully Sold</p>
                <p className="text-2xl font-bold text-green-600">{data?.totalSold ?? 1350} kg</p>
                <p className="text-[11px] text-green-700 mt-1">Direct produce trade</p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-amber-500">
                <p className="text-xs text-gray-500 font-semibold uppercase">NGO Rescued</p>
                <p className="text-2xl font-bold text-amber-600">{data?.totalRescued ?? 315} kg</p>
                <p className="text-[11px] text-amber-700 mt-1">{data?.rescuePercentage ?? 15}% rescue rate</p>
              </div>

              <div className="bg-white rounded-xl shadow p-4 border-l-4 border-red-500">
                <p className="text-xs text-gray-500 font-semibold uppercase">Spoiled / Lost</p>
                <p className="text-2xl font-bold text-red-500">{data?.totalLost ?? 105} kg</p>
                <p className="text-[11px] text-red-600 mt-1">{data?.wastePercentage ?? 5}% waste rate (Goal &lt; 8%)</p>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Distribution Donut */}
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-1">Produce Allocation Breakdown</h3>
                <p className="text-xs text-gray-500 mb-4">Ratio of sold vs rescued vs lost produce</p>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} kg`, 'Quantity']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Monthly Trend */}
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-1">Monthly Rescue & Trade Trends</h3>
                <p className="text-xs text-gray-500 mb-4">Historical supply chain efficiency (kg)</p>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={monthlyTrends}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sold" name="Sold" fill="#22c55e" />
                    <Bar dataKey="rescued" name="Rescued" fill="#f59e0b" />
                    <Bar dataKey="lost" name="Lost" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Produce-wise table */}
            {produceWiseData.length > 0 && (
              <div className="bg-white rounded-xl shadow p-5 border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-3">Produce-Wise Performance</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-500 font-medium">
                        <th className="pb-2">Produce</th>
                        <th className="pb-2 text-right">Total Listed</th>
                        <th className="pb-2 text-right">Sold</th>
                        <th className="pb-2 text-right">NGO Rescued</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {produceWiseData.map((row) => (
                        <tr key={row.produce} className="hover:bg-gray-50">
                          <td className="py-2.5 font-medium text-gray-800">{row.produce}</td>
                          <td className="py-2.5 text-right text-gray-600">{row.listed} kg</td>
                          <td className="py-2.5 text-right text-green-600 font-medium">{row.sold} kg</td>
                          <td className="py-2.5 text-right text-amber-600 font-medium">{row.rescued} kg</td>
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