import { useState, useEffect, type ReactNode } from 'react'
import { api } from '../services/api'
import type { User } from '../types'

type Tab = 'info' | 'form' | 'list' | 'venueInfo' | 'admin' | 'accounts' | 'instructors' | 'venues'

interface LayoutProps {
  user: User
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  onLogout: () => void
  children: ReactNode
}

export default function Layout({ user, activeTab, onTabChange, onLogout, children }: LayoutProps) {
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (user.role !== 'ADMIN') return
    api.getUsers().then(users => {
      setPendingCount(users.filter(u => u.status === 'PENDING').length)
    }).catch(() => {})
  }, [user.role, activeTab])

  return (
    <div className="layout">
      <header className="header">
        <h1>해군 교육 일정 요청 시스템</h1>
        <div className="user-info">
          <span>{user.name} ({user.email})</span>
          {user.role === 'ADMIN' && <span className="badge-admin">관리자</span>}
          {user.role === 'ADMIN' && pendingCount > 0 && (
            <button
              className="header-pending-btn"
              onClick={() => onTabChange('accounts')}
            >
              승인 대기 {pendingCount}건
            </button>
          )}
          <button className="logout-btn" onClick={onLogout}>로그아웃</button>
        </div>
      </header>
      <nav className="tabs">
        <button
          className={`tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => onTabChange('info')}
        >
          교육 설명
        </button>
        <button
          className={`tab ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => onTabChange('form')}
        >
          교육 요청
        </button>
        <button
          className={`tab ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => onTabChange('list')}
        >
          내 요청 목록
        </button>
        <button
          className={`tab ${activeTab === 'venueInfo' ? 'active' : ''}`}
          onClick={() => onTabChange('venueInfo')}
        >
          교육장 안내
        </button>
        {user.role === 'ADMIN' && (
          <>
            <button
              className={`tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => onTabChange('admin')}
            >
              요청 관리
            </button>
            <button
              className={`tab ${activeTab === 'accounts' ? 'active' : ''}`}
              onClick={() => onTabChange('accounts')}
            >
              계정 관리
              {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
            </button>
            <button
              className={`tab ${activeTab === 'instructors' ? 'active' : ''}`}
              onClick={() => onTabChange('instructors')}
            >
              강사 관리
            </button>
            <button
              className={`tab ${activeTab === 'venues' ? 'active' : ''}`}
              onClick={() => onTabChange('venues')}
            >
              장소 관리
            </button>
          </>
        )}
      </nav>
      <main className="content">{children}</main>
    </div>
  )
}
