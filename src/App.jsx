import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import Tasks from './pages/Tasks'
import Applications from './pages/Applications'
import ApplicationDetail from './pages/ApplicationDetail'
import Benefits from './pages/Benefits'
import Inbox from './pages/Inbox'
import Search from './pages/Search'
import Profile from './pages/Profile'
import LoginPage from './pages/LoginPage'
import AiGuide from './components/AiGuide'
import AiAssistant from './components/AiAssistant'
import HighlightAsk from './components/HighlightAsk'
import SettingsPanel from './components/SettingsPanel'
import { useState } from 'react'
import { useApp } from './context/AppContext'

function App() {
  const [isLoggedIn] = useState(true) // Auto-login for demo
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { aiGuideOpen } = useApp()

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => {}} />
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Layout
        onOpenAssistant={() => setAssistantOpen(true)}
        onOpenSettings={() => setSettingsOpen(true)}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:serviceId" element={<ServiceDetail />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/applications/:appId" element={<ApplicationDetail />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/search" element={<Search />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </Layout>
      {aiGuideOpen && <AiGuide />}
      {assistantOpen && <AiAssistant onClose={() => setAssistantOpen(false)} />}
      {settingsOpen && <SettingsPanel onClose={() => setSettingsOpen(false)} />}
      <HighlightAsk />
    </div>
  )
}

export default App
