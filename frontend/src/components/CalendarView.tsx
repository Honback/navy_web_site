import { useState, useEffect, useMemo, useCallback } from 'react'
import { api } from '../services/api'
import type { TrainingRequest, RequestStatus, User } from '../types'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '요청',
  VENUE_CHECK: '교육장확인',
  INSTRUCTOR_CHECK: '강사확인',
  CONFIRMED: '확정',
  REJECTED: '반려',
  CANCELLED: '취소',
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: '#f59e0b',
  VENUE_CHECK: '#3b82f6',
  INSTRUCTOR_CHECK: '#8b5cf6',
  CONFIRMED: '#10b981',
  REJECTED: '#ef4444',
  CANCELLED: '#6b7280',
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

interface CalendarViewProps {
  user?: User
  onSelectRequest?: (req: TrainingRequest) => void
}

export default function CalendarView({ user, onSelectRequest }: CalendarViewProps) {
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  })
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'ALL'>('ALL')
  const [loading, setLoading] = useState(true)
  const [popupRequest, setPopupRequest] = useState<TrainingRequest | null>(null)

  const handleEventClick = useCallback((ev: TrainingRequest, e: React.MouseEvent) => {
    e.stopPropagation()
    setPopupRequest(ev)
  }, [])

  useEffect(() => {
    setLoading(true)
    api.getRequests()
      .then(setRequests)
      .catch(() => setRequests([]))
      .finally(() => setLoading(false))
  }, [])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const goToday = () => {
    const now = new Date()
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1))
  }

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: { date: string; day: number; isCurrentMonth: boolean }[] = []

    // Previous month padding
    const prevDays = new Date(year, month, 0).getDate()
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = prevDays - i
      const m = month === 0 ? 12 : month
      const y = month === 0 ? year - 1 : year
      days.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: false })
    }

    // Current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
        day: d,
        isCurrentMonth: true,
      })
    }

    // Next month padding
    const remaining = 42 - days.length
    for (let d = 1; d <= remaining; d++) {
      const m = month + 2 > 12 ? 1 : month + 2
      const y = month + 2 > 12 ? year + 1 : year
      days.push({ date: `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, day: d, isCurrentMonth: false })
    }

    return days
  }, [year, month])

  // Map requests by date
  const requestsByDate = useMemo(() => {
    const map: Record<string, TrainingRequest[]> = {}
    const filtered = statusFilter === 'ALL' ? requests : requests.filter(r => r.status === statusFilter)
    for (const req of filtered) {
      const startDate = req.requestDate
      const endDate = req.requestEndDate || req.requestDate

      // Add request to all dates in its range
      const start = new Date(startDate)
      const end = new Date(endDate)
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const key = d.toISOString().split('T')[0]
        if (!map[key]) map[key] = []
        map[key].push(req)
      }
    }
    return map
  }, [requests, statusFilter])

  // Count by status
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { PENDING: 0, VENUE_CHECK: 0, INSTRUCTOR_CHECK: 0, CONFIRMED: 0, REJECTED: 0, CANCELLED: 0 }
    for (const req of requests) {
      counts[req.status] = (counts[req.status] || 0) + 1
    }
    return counts
  }, [requests])

  const today = new Date().toISOString().split('T')[0]

  const selectedRequests = selectedDay ? (requestsByDate[selectedDay] || []) : []

  return (
    <div className="cal-container">
      {/* Header */}
      <div className="cal-header">
        <div className="cal-header-left">
          <h2 className="cal-title">교육 일정 캘린더</h2>
          <div className="cal-summary">
            {(['PENDING', 'VENUE_CHECK', 'INSTRUCTOR_CHECK', 'CONFIRMED', 'REJECTED', 'CANCELLED'] as RequestStatus[]).map(s => (
              <button
                key={s}
                className={`cal-summary-badge ${statusFilter === s ? 'active' : ''}`}
                style={{ '--badge-color': STATUS_COLORS[s] } as React.CSSProperties}
                onClick={() => setStatusFilter(prev => prev === s ? 'ALL' : s)}
              >
                <span className="cal-badge-dot" style={{ background: STATUS_COLORS[s] }} />
                {STATUS_LABELS[s]} {statusCounts[s]}
              </button>
            ))}
          </div>
        </div>
        <div className="cal-nav">
          <button className="cal-nav-btn" onClick={prevMonth}>&lsaquo;</button>
          <button className="cal-nav-today" onClick={goToday}>오늘</button>
          <span className="cal-nav-label">{year}년 {month + 1}월</span>
          <button className="cal-nav-btn" onClick={nextMonth}>&rsaquo;</button>
        </div>
      </div>

      {loading ? (
        <div className="cal-loading">일정을 불러오는 중...</div>
      ) : (
        <div className="cal-body">
          {/* Calendar Grid */}
          <div className="cal-grid-wrap">
            <div className="cal-weekdays">
              {WEEKDAYS.map((d, i) => (
                <div key={d} className={`cal-weekday ${i === 0 ? 'cal-sun' : i === 6 ? 'cal-sat' : ''}`}>{d}</div>
              ))}
            </div>
            <div className="cal-grid">
              {calendarDays.map((cell, idx) => {
                const events = requestsByDate[cell.date] || []
                const isToday = cell.date === today
                const isSelected = cell.date === selectedDay
                const dayOfWeek = idx % 7
                return (
                  <div
                    key={cell.date + idx}
                    className={[
                      'cal-cell',
                      cell.isCurrentMonth ? '' : 'cal-cell-dim',
                      isToday ? 'cal-cell-today' : '',
                      isSelected ? 'cal-cell-selected' : '',
                      events.length > 0 ? 'cal-cell-has-events' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setSelectedDay(cell.date === selectedDay ? null : cell.date)}
                  >
                    <span className={`cal-day-num ${dayOfWeek === 0 ? 'cal-sun' : dayOfWeek === 6 ? 'cal-sat' : ''}`}>
                      {cell.day}
                    </span>
                    {events.length > 0 && (
                      <div className="cal-events">
                        {events.slice(0, 3).map((ev, i) => (
                          <div
                            key={ev.id + '-' + i}
                            className="cal-event"
                            style={{ borderLeftColor: STATUS_COLORS[ev.status] }}
                            onClick={(e) => handleEventClick(ev, e)}
                          >
                            <span className="cal-event-fleet">{ev.fleet}{ev.ship ? ` ${ev.ship}` : ''}</span>
                            {ev.participantCount && <span className="cal-event-count">{ev.participantCount}명</span>}
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="cal-event-more">+{events.length - 3}건</div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Day Detail */}
          {selectedDay && (
            <div className="cal-detail">
              <div className="cal-detail-header">
                <h3>{selectedDay.replace(/-/g, '.')} 일정</h3>
                <button className="cal-detail-close" onClick={() => setSelectedDay(null)}>&times;</button>
              </div>
              {selectedRequests.length === 0 ? (
                <p className="cal-detail-empty">해당 날짜에 일정이 없습니다.</p>
              ) : (
                <div className="cal-detail-list">
                  {selectedRequests.map(req => (
                    <div
                      key={req.id}
                      className="cal-detail-card"
                      style={{ borderLeftColor: STATUS_COLORS[req.status] }}
                      onClick={() => setPopupRequest(req)}
                    >
                      <div className="cal-detail-card-top">
                        <span className="cal-detail-status" style={{ color: STATUS_COLORS[req.status] }}>
                          {STATUS_LABELS[req.status]}
                        </span>
                        <span className="cal-detail-id">#{req.id}</span>
                      </div>
                      <div className="cal-detail-card-main">
                        <strong>{req.fleet}{req.ship && ` / ${req.ship}`}</strong>
                        <span>{req.trainingType}</span>
                      </div>
                      <div className="cal-detail-card-meta">
                        <span>{req.venueName}</span>
                        {req.participantCount && <span>{req.participantCount}명</span>}
                        <span>{req.userName}</span>
                      </div>
                      {req.requestEndDate && req.requestEndDate !== req.requestDate && (
                        <div className="cal-detail-card-range">
                          {req.requestDate} ~ {req.requestEndDate}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
      {/* Event Popup Modal */}
      {popupRequest && (
        <div className="cal-popup-overlay" onClick={() => setPopupRequest(null)}>
          <div className="cal-popup" onClick={e => e.stopPropagation()}>
            <div className="cal-popup-header">
              <span className="cal-popup-status" style={{ background: STATUS_COLORS[popupRequest.status] }}>
                {STATUS_LABELS[popupRequest.status]}
              </span>
              <span className="cal-popup-id">#{popupRequest.id}</span>
              <button className="cal-popup-close" onClick={() => setPopupRequest(null)}>&times;</button>
            </div>
            <div className="cal-popup-body">
              <h3 className="cal-popup-fleet">{popupRequest.fleet}{popupRequest.ship && ` / ${popupRequest.ship}`}</h3>
              <dl className="cal-popup-info">
                <dt>교육 유형</dt>
                <dd>{popupRequest.trainingType}</dd>
                <dt>일정</dt>
                <dd>
                  {popupRequest.requestDate}
                  {popupRequest.requestEndDate && popupRequest.requestEndDate !== popupRequest.requestDate && ` ~ ${popupRequest.requestEndDate}`}
                  {popupRequest.startTime && ` (${popupRequest.startTime})`}
                </dd>
                {popupRequest.participantCount && (
                  <><dt>인원</dt><dd>{popupRequest.participantCount}명</dd></>
                )}
                <dt>장소</dt>
                <dd>
                  {popupRequest.venueName}
                  {popupRequest.venueRoomNumber && ` / ${popupRequest.venueRoomNumber}`}
                  {popupRequest.secondVenueName && (
                    <><br />{popupRequest.secondVenueName}{popupRequest.secondVenueRoomNumber && ` / ${popupRequest.secondVenueRoomNumber}`}</>
                  )}
                </dd>
                <dt>요청자</dt>
                <dd>{popupRequest.userName}</dd>
                {popupRequest.identityInstructorName && (
                  <><dt>정훈교관</dt><dd>{popupRequest.identityInstructorName}{popupRequest.identityInstructorRank && ` (${popupRequest.identityInstructorRank})`}</dd></>
                )}
                {popupRequest.securityInstructorName && (
                  <><dt>보안교관</dt><dd>{popupRequest.securityInstructorName}{popupRequest.securityInstructorRank && ` (${popupRequest.securityInstructorRank})`}</dd></>
                )}
                {popupRequest.communicationInstructorName && (
                  <><dt>통신교관</dt><dd>{popupRequest.communicationInstructorName}{popupRequest.communicationInstructorRank && ` (${popupRequest.communicationInstructorRank})`}</dd></>
                )}
                {popupRequest.notes && (
                  <><dt>비고</dt><dd>{popupRequest.notes}</dd></>
                )}
              </dl>
            </div>
            {user?.role === 'ADMIN' && onSelectRequest && (
              <div className="cal-popup-footer">
                <button className="cal-popup-detail-btn" onClick={() => { setPopupRequest(null); onSelectRequest(popupRequest) }}>
                  상세 보기
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
