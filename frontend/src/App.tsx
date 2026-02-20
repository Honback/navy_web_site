import { useState } from 'react'
import type { User } from './types'
import HeroPage from './components/HeroPage'
import LoginScreen from './components/LoginScreen'
import Layout from './components/Layout'
import RequestForm from './components/RequestForm'
import RequestList from './components/RequestList'
import RequestManagement from './components/RequestManagement'
import TrainingInfo from './components/TrainingInfo'
import AccountManagement from './components/AccountManagement'
import InstructorManagement from './components/InstructorManagement'
import VenueManagement from './components/VenueManagement'
import VenueInfo from './components/VenueInfo'
import './App.css'

type Tab = 'info' | 'form' | 'list' | 'venueInfo' | 'admin' | 'accounts' | 'instructors' | 'venues'
type Page = 'hero' | 'login' | 'app'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [page, setPage] = useState<Page>('hero')
  const [activeTab, setActiveTab] = useState<Tab>('form')
  const [refreshKey, setRefreshKey] = useState(0)

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    setPage('app')
    setActiveTab('info')
  }

  const handleLogout = () => {
    setUser(null)
    setPage('hero')
    setActiveTab('info')
  }

  const handleSubmitSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  if (page === 'hero') {
    return <HeroPage onEnter={() => setPage('login')} />
  }

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <Layout user={user} activeTab={activeTab} onTabChange={setActiveTab} onLogout={handleLogout}>
      {activeTab === 'info' && <TrainingInfo />}
      {activeTab === 'form' && (
        <RequestForm userId={user.id} onSubmitSuccess={handleSubmitSuccess} />
      )}
      {activeTab === 'list' && (
        <RequestList userId={user.id} refreshKey={refreshKey} />
      )}
      {activeTab === 'venueInfo' && <VenueInfo />}
      {activeTab === 'admin' && <RequestManagement />}
      {activeTab === 'accounts' && <AccountManagement />}
      {activeTab === 'instructors' && <InstructorManagement />}
      {activeTab === 'venues' && <VenueManagement />}
    </Layout>
  )
}
