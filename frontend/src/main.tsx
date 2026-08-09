import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

import { ProducerDashboard } from './pages/producer/Dashboard'
import { BuyerDashboard, BrowsePage } from './pages/buyer/Dashboard'
import { NGODashboard } from './pages/buyer/NGODashboard'
import { ListingsPage } from './pages/producer/ListingsPage'
import { AnalyticsPage } from './pages/analytics/WasteAnalytics'
import { NotFoundPage } from './pages/NotFound'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/producer" element={<ProducerDashboard />} />
        <Route path="/buyer" element={<BuyerDashboard />} />
        <Route path="/ngo" element={<NGODashboard />} />
        <Route path="/listings" element={<ListingsPage />} />
        <Route path="/browse" element={<BrowsePage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)