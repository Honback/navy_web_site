import { useState, useEffect } from 'react'
import type { User } from './types'
import NavBar from './components/NavBar'
import HeroPage from './components/HeroPage'
import LoginScreen from './components/LoginScreen'
import Layout from './components/Layout'
import RequestForm from './components/RequestForm'
import RequestList from './components/RequestList'
import RequestManagement from './components/RequestManagement'
import AccountManagement from './components/AccountManagement'
import InstructorManagement from './components/InstructorManagement'
import VenueManagement from './components/VenueManagement'
import VenueContactManagement from './components/VenueContactManagement'
import CalendarView from './components/CalendarView'
import VenueInfo from './components/VenueInfo'
import InstructorInfo from './components/InstructorInfo'
import Board from './components/Board'
import MyPage from './components/MyPage'
import './App.css'

type Tab = 'calendar' | 'form' | 'list' | 'admin' | 'accounts' | 'instructors' | 'venues' | 'venueContacts'
type Page = 'hero' | 'login' | 'venue' | 'instructor' | 'board' | 'mypage' | 'app'

export default function App() {
  const [user, setUser] = useState<User | null>(null)
  const [page, setPage] = useState<Page>('hero')
  const [activeTab, setActiveTab] = useState<Tab>('form')
  const [refreshKey, setRefreshKey] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const [boardTab, setBoardTab] = useState<'notice' | 'posts'>('notice')

  const toggleDarkMode = () => setDarkMode(d => !d)

  useEffect(() => {
    document.body.classList.toggle('light-theme', !darkMode)
  }, [darkMode])

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser)
    setPage('app')
    setActiveTab('calendar')
  }

  const handleLogout = () => {
    setUser(null)
    setPage('hero')
    setActiveTab('form')
  }

  const handleSubmitSuccess = () => {
    setRefreshKey((k) => k + 1)
  }

  const navProps = {
    onLogin: () => setPage('login' as Page),
    onGoHome: () => setPage('hero'),
    onVenue: () => setPage('venue'),
    onInstructor: () => setPage('instructor'),
    onNotice: () => { setPage('board'); setBoardTab('notice') },
    onBoard: () => { setPage('board'); setBoardTab('posts') },
    onMyPage: () => setPage('mypage'),
    darkMode,
    onToggleDarkMode: toggleDarkMode,
  }

  /* ── Hero page ── */
  if (page === 'hero') {
    return (
      <>
        <NavBar {...navProps} currentPage="hero" />
        <HeroPage onEnter={() => setPage('login')} onVenue={() => setPage('venue')} />
      </>
    )
  }

  /* ── Venue page ── */
  if (page === 'venue') {
    return (
      <>
        <NavBar {...navProps} currentPage="login" user={user} onLogout={handleLogout} onTabChange={(tab) => { setPage('app'); setActiveTab(tab) }} />
        <div className={`venue-page-wrap${!darkMode ? ' venue-light' : ''}`}>
          <VenueInfo />
        </div>
      </>
    )
  }

  /* ── Instructor page ── */
  if (page === 'instructor') {
    return (
      <>
        <NavBar {...navProps} currentPage="login" user={user} onLogout={handleLogout} onTabChange={(tab) => { setPage('app'); setActiveTab(tab) }} />
        <div className={`instructor-page-wrap${!darkMode ? ' venue-light' : ''}`}>
          <InstructorInfo />
        </div>
      </>
    )
  }

  /* ── Board page (notices + posts) ── */
  if (page === 'board') {
    return (
      <>
        <NavBar {...navProps} currentPage="login" user={user} onLogout={handleLogout} onTabChange={(tab) => { setPage('app'); setActiveTab(tab) }} />
        <div className={`board-page-wrap${!darkMode ? ' venue-light' : ''}`}>
          <Board user={user} initialTab={boardTab} />
        </div>
      </>
    )
  }

  /* ── My Page ── */
  if (page === 'mypage' && user) {
    return (
      <>
        <NavBar {...navProps} currentPage="app" user={user} onLogout={handleLogout} onTabChange={setActiveTab} />
        <div className={`mypage-wrap${!darkMode ? ' venue-light' : ''}`}>
          <MyPage user={user} refreshKey={refreshKey} onBack={() => { setPage('app'); setActiveTab(user.role === 'ADMIN' ? 'calendar' : 'form') }} onUserUpdate={setUser} />
        </div>
      </>
    )
  }

  /* ── Login page ── */
  if (!user) {
    return (
      <>
        <NavBar {...navProps} currentPage="login" />
        <LoginScreen onLogin={handleLogin} />
      </>
    )
  }

  /* ── App (logged in) ── */
  return (
    <>
      <NavBar
        {...navProps}
        onLogin={() => {}}
        currentPage="app"
        user={user}
        onLogout={handleLogout}
        onTabChange={setActiveTab}
      />
      <Layout user={user} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'calendar' && (
          <CalendarView
            user={user}
            onSelectRequest={user.role === 'ADMIN' ? () => setActiveTab('admin') : undefined}
          />
        )}
        {activeTab === 'form' && user.fleet !== '해군본부' && (
          <RequestForm userId={user.id} user={user} onSubmitSuccess={handleSubmitSuccess} />
        )}
        {activeTab === 'list' && (
          <RequestList userId={user.id} user={user} refreshKey={refreshKey} />
        )}
        {activeTab === 'admin' && <RequestManagement />}
        {activeTab === 'accounts' && <AccountManagement />}
        {activeTab === 'instructors' && <InstructorManagement />}
        {activeTab === 'venues' && <VenueManagement />}
        {activeTab === 'venueContacts' && <VenueContactManagement />}
      </Layout>
    </>
  )
}
