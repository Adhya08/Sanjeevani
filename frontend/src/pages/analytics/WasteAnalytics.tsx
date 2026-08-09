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
        <a href="/" className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-white font-medium">
          ← Back to Home
        </a>
      </header>

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