import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Datasets from './pages/Datasets'
import Upload from './pages/Upload'
import Marketplace from './pages/Marketplace'
import Earnings from './pages/Earnings'
import Activity from './pages/Activity'
import Insights from './pages/Insights'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Wallet from './pages/Wallet'
import Chain from './pages/Chain'
import Mint from './pages/Mint'
import Inspect from './pages/Inspect'
import Sidebar from './components/Sidebar'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/datasets" element={<Datasets />} />
            <Route path="/upload" element={<Upload />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/earnings" element={<Earnings />} />
            <Route path="/activity" element={<Activity />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/chain" element={<Chain />} />
            <Route path="/mint" element={<Mint />} />
            <Route path="/inspect" element={<Inspect />} />
            <Route path="*" element={<div style={{padding:24}}><h1>404</h1></div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
