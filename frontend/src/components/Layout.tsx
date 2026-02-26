import { useState, useEffect, type ReactNode } from 'react'
import { api } from '../services/api'
import type { User } from '../types'

type Tab = 'calendar' | 'form' | 'list' | 'admin' | 'accounts' | 'instructors' | 'venues' | 'venueContacts'

const SidebarIcons = {
  calendar: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="14" height="13" rx="2" />
      <line x1="3" y1="9" x2="17" y2="9" />
      <line x1="7" y1="3" x2="7" y2="7" />
      <line x1="13" y1="3" x2="13" y2="7" />
      <rect x="6" y="11.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" opacity="0.5" />
      <rect x="9" y="11.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" opacity="0.5" />
      <rect x="12" y="11.5" width="2" height="2" rx="0.5" fill="currentColor" stroke="none" opacity="0.5" />
    </svg>
  ),
  user: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="7" r="3" />
      <path d="M3.5 18c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
    </svg>
  ),
  venue: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2C6.7 2 4 4.7 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.3-2.7-6-6-6z" />
      <circle cx="10" cy="8" r="2" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.8 3.5c-.4 0-.8.3-.9.7-.2 2.3.3 4.8 1.8 7.1 1.5 2.3 3.5 3.9 5.6 4.7.4.2 1 0 1.3-.4l1.1-1.4c.2-.3.2-.7-.1-1l-2.1-1.4c-.3-.2-.7-.1-.9.1l-.7.7c-.2.2-.5.2-.7 0-1.1-.7-2-1.6-2.6-2.7-.1-.2-.1-.5.1-.6l.7-.7c.3-.3.3-.6.1-.9L4.8 4c-.2-.3-.6-.5-1-.5z" />
    </svg>
  ),
  instructor: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 3L1.5 7.5 10 12l8.5-4.5L10 3z" />
      <path d="M5 9.5v4c0 1.3 2.2 2.5 5 2.5s5-1.2 5-2.5v-4" />
      <line x1="17" y1="8" x2="17" y2="14.5" />
    </svg>
  ),
  request: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2H5.5A1.5 1.5 0 004 3.5v13A1.5 1.5 0 005.5 18h9a1.5 1.5 0 001.5-1.5V7L12 2z" />
      <polyline points="12 2 12 7 16 7" />
      <line x1="7" y1="10" x2="13" y2="10" />
      <line x1="7" y1="13" x2="11" y2="13" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="12" height="16" rx="2" />
      <line x1="4" y1="5" x2="16" y2="5" />
      <line x1="7" y1="8.5" x2="13" y2="8.5" />
      <line x1="7" y1="11.5" x2="12" y2="11.5" />
      <line x1="7" y1="14.5" x2="10" y2="14.5" />
    </svg>
  ),
  settings: (
    <svg viewBox="0 0 20 20" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="10" cy="10" r="2.5" />
      <path d="M8.5 2.5h3l.4 1.8c.3.1.6.3.9.5l1.7-.6 1.5 2.6-1.3 1.3c0 .3 0 .6 0 .9l1.3 1.3-1.5 2.6-1.7-.6c-.3.2-.6.4-.9.5l-.4 1.8h-3l-.4-1.8c-.3-.1-.6-.3-.9-.5l-1.7.6-1.5-2.6 1.3-1.3c0-.3 0-.6 0-.9L3.5 6.4 5 3.8l1.7.6c.3-.2.6-.4.9-.5l.4-1.4z" />
    </svg>
  ),
}

interface LayoutProps {
  user: User
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  children: ReactNode
}

export default function Layout({ user, activeTab, onTabChange, children }: LayoutProps) {
  const [pendingCount, setPendingCount] = useState(0)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const isNavyHQ = user.fleet === '해군본부' && user.role !== 'ADMIN'

  useEffect(() => {
    if (user.role !== 'ADMIN') return
    api.getUsers().then(users => {
      setPendingCount(users.filter(u => u.status === 'PENDING').length)
    }).catch(() => {})
  }, [user.role, activeTab])

  const layoutClass = [
    'layout-body',
    sidebarCollapsed ? 'sidebar-collapsed' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="layout">
      <header className="header">
        <h1>해군 교육 일정 요청 시스템</h1>
        {user.role === 'ADMIN' && pendingCount > 0 && (
          <button
            className="header-pending-btn"
            onClick={() => onTabChange('accounts')}
          >
            승인 대기 {pendingCount}건
          </button>
        )}
      </header>
      <div className="layout-toolbar">
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
        >
          {sidebarCollapsed ? '›' : '‹'}
        </button>
      </div>
      <div className={layoutClass}>
        <nav className="sidebar">
          <button
            className={`sidebar-tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => onTabChange('calendar')}
          >
            <span className="sidebar-icon">{SidebarIcons.calendar}</span>
            <span className="sidebar-text">일정 캘린더</span>
          </button>
          {user.role === 'ADMIN' && (
            <>
              <span className="sidebar-label">기반 관리</span>
              <button
                className={`sidebar-tab ${activeTab === 'accounts' ? 'active' : ''}`}
                onClick={() => onTabChange('accounts')}
              >
                <span className="sidebar-icon">{SidebarIcons.user}</span>
                <span className="sidebar-text">계정 관리</span>
                {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
              </button>
              <button
                className={`sidebar-tab ${activeTab === 'venues' ? 'active' : ''}`}
                onClick={() => onTabChange('venues')}
              >
                <span className="sidebar-icon">{SidebarIcons.venue}</span>
                <span className="sidebar-text">장소 관리</span>
              </button>
              <button
                className={`sidebar-tab ${activeTab === 'venueContacts' ? 'active' : ''}`}
                onClick={() => onTabChange('venueContacts')}
              >
                <span className="sidebar-icon">{SidebarIcons.phone}</span>
                <span className="sidebar-text">장소 담당자</span>
              </button>
              <button
                className={`sidebar-tab ${activeTab === 'instructors' ? 'active' : ''}`}
                onClick={() => onTabChange('instructors')}
              >
                <span className="sidebar-icon">{SidebarIcons.instructor}</span>
                <span className="sidebar-text">강사 관리</span>
              </button>
            </>
          )}
          {!isNavyHQ && (
            <>
              <span className="sidebar-label">교육 신청</span>
              <button
                className={`sidebar-tab ${activeTab === 'form' ? 'active' : ''}`}
                onClick={() => onTabChange('form')}
              >
                <span className="sidebar-icon">{SidebarIcons.request}</span>
                <span className="sidebar-text">교육 요청</span>
              </button>
            </>
          )}
          <button
            className={`sidebar-tab ${activeTab === 'list' ? 'active' : ''}`}
            onClick={() => onTabChange('list')}
          >
            <span className="sidebar-icon">{SidebarIcons.list}</span>
            <span className="sidebar-text">{isNavyHQ ? '전체 일정' : '내 요청 목록'}</span>
          </button>
          {user.role === 'ADMIN' && (
            <>
              <span className="sidebar-label">요청 처리</span>
              <button
                className={`sidebar-tab ${activeTab === 'admin' ? 'active' : ''}`}
                onClick={() => onTabChange('admin')}
              >
                <span className="sidebar-icon">{SidebarIcons.settings}</span>
                <span className="sidebar-text">요청 관리</span>
              </button>
            </>
          )}
        </nav>
        <main className="content">{children}</main>
      </div>
    </div>
  )
}
