import React from 'react'

export const ListingsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50">
      <header className="bg-primary-600 text-white p-4 shadow-md">
        <h1 className="text-2xl font-display font-bold">अपनी लिस्टिंगें</h1>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">नया आउटपुट सूचीबद्ध करें</h2>

          <form className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">उत्पाद प्रकार</label>
                <select className="w-full border border-gray-300 rounded px-3 py-2">
                  <option>टमाटा</option>
                  <option>आलू</option>
                  <option>प्याज</option>
                  <option>कबाब</option>
                  <option>गाजर</option>
                  <option>केला</option>
                  <option>आम</option>
                  <option>संतरा</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">एकक (किलोग्राम)</label>
                <input
                  type="number"
                  placeholder="कुल मात्रा"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">मूल्य (₹/किग्राम)</label>
                <input
                  type="number"
                  placeholder="लगभग मूल्य"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">भंडारण तापमान (°C)</label>
                <input
                  type="number"
                  defaultValue="2"
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">भंडारण नमी (%)</label>
              <input
                type="number"
                defaultValue="85"
                className="w-full border border-gray-300 rounded px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">छवि अपलोड करें</label>
              <input type="file" accept="image/*" className="w-full" />
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700"
            >
              लिस्टिंग की पुष्टि करें
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}