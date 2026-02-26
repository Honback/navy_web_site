import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import type { TrainingRequest, RequestStatus, Instructor } from '../types'
import RequestDetail from './RequestDetail'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '요청',
  VENUE_CHECK: '교육장확인',
  INSTRUCTOR_CHECK: '강사확인',
  CONFIRMED: '확정',
  REJECTED: '반려',
  CANCELLED: '취소',
}

export default function RequestManagement() {
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [listCollapsed, setListCollapsed] = useState(false)

  const fetchRequests = () => {
    api
      .getRequests()
      .then(setRequests)
      .catch(() => setError('요청 목록을 불러오는데 실패했습니다.'))
  }

  useEffect(() => {
    Promise.all([api.getRequests(), api.getInstructors()])
      .then(([reqs, insts]) => {
        setRequests(reqs)
        setInstructors(insts)
      })
      .catch(() => setError('데이터를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredRequests = useMemo(() => {
    if (!filterStatus) return requests
    return requests.filter(r => r.status === filterStatus)
  }, [requests, filterStatus])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { PENDING: 0, VENUE_CHECK: 0, INSTRUCTOR_CHECK: 0, CONFIRMED: 0, REJECTED: 0, CANCELLED: 0 }
    requests.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1 })
    return counts
  }, [requests])

  const selectedRequest = useMemo(() => {
    if (selectedId === null) return null
    return requests.find(r => r.id === selectedId) || null
  }, [requests, selectedId])

  const hasInstructors = (req: TrainingRequest) =>
    req.identityInstructorId && req.securityInstructorId && req.communicationInstructorId

  const handleStatusUpdate = async (requestId: number, status: RequestStatus, reason?: string) => {
    try {
      await api.updateRequestStatus(requestId, status, reason)
      fetchRequests()
    } catch {
      setError('상태 변경에 실패했습니다.')
    }
  }

  const handleAssignInstructors = async (requestId: number, state: { identity: string, security: string, communication: string }) => {
    await api.assignInstructors(requestId, {
      identityInstructorId: state.identity ? Number(state.identity) : null,
      securityInstructorId: state.security ? Number(state.security) : null,
      communicationInstructorId: state.communication ? Number(state.communication) : null,
    })
    fetchRequests()
  }

  const handlePlanSave = async (requestId: number, plan: string) => {
    await api.updatePlan(requestId, plan)
    fetchRequests()
  }

  const handleSelectRequest = (id: number) => {
    setSelectedId(selectedId === id ? null : id)
  }

  // Mobile: go back to list
  const handleBackToList = () => {
    setSelectedId(null)
  }

  if (loading) return <div className="loading">불러오는 중...</div>
  if (error) return <div className="message error">{error}</div>

  const splitClass = [
    'rm-split',
    selectedRequest ? 'rm-split-active' : '',
    listCollapsed ? 'rm-list-collapsed' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className="management-page">
      <div className="management-header">
        <h2>요청 관리</h2>
        <div className="header-info">
          <div className="status-summary">
            {(['PENDING', 'VENUE_CHECK', 'INSTRUCTOR_CHECK', 'CONFIRMED', 'REJECTED'] as const).map(s => (
              <span
                key={s}
                className={`status-chip ${s.toLowerCase().replace('_', '-')} ${filterStatus === s ? 'active' : ''}`}
                onClick={() => setFilterStatus(filterStatus === s ? '' : s)}
              >
                {STATUS_LABELS[s]} {statusCounts[s]}
              </span>
            ))}
          </div>
          {filterStatus && (
            <button className="cancel-btn" style={{ padding: '4px 10px', fontSize: '0.78rem' }} onClick={() => setFilterStatus('')}>
              전체 보기
            </button>
          )}
        </div>
      </div>

      {filteredRequests.length === 0 ? (
        <p className="empty">
          {filterStatus ? `${STATUS_LABELS[filterStatus]} 상태의 요청이 없습니다.` : '등록된 요청이 없습니다.'}
        </p>
      ) : (
        <div className={splitClass}>
          {/* List collapse toggle (desktop only) */}
          {selectedRequest && (
            <button
              className="rm-collapse-btn"
              onClick={() => setListCollapsed(!listCollapsed)}
              title={listCollapsed ? '목록 펼치기' : '목록 접기'}
            >
              {listCollapsed ? '▶' : '◀'}
            </button>
          )}

          {/* Mobile back button */}
          {selectedRequest && (
            <button className="rm-back-btn" onClick={handleBackToList}>
              ← 목록으로
            </button>
          )}

          {/* Left: Request List */}
          <div className="rm-list">
            {filteredRequests.map(req => (
              <div
                key={req.id}
                className={`rm-item rm-item-${req.status.toLowerCase()}${selectedId === req.id ? ' rm-item-selected' : ''}`}
                onClick={() => handleSelectRequest(req.id)}
              >
                <div className="rm-item-top">
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {STATUS_LABELS[req.status]}
                  </span>
                  <span className="rm-item-id">#{req.id}</span>
                  <strong className="rm-item-user">{req.userName}</strong>
                  <span className="rm-item-fleet">{req.fleet}{req.ship && ` / ${req.ship}`}</span>
                </div>
                <div className="rm-item-bottom">
                  <span className="rm-item-date">
                    {req.requestDate}{req.requestEndDate && ` ~ ${req.requestEndDate}`}
                  </span>
                  <span className="rm-item-type">{req.trainingType}</span>
                </div>
                <div className="rm-item-tags">
                  <span className="rm-tag-venue">{req.venueName}</span>
                  {hasInstructors(req) ? (
                    <span className="rm-tag-assigned">강사 배정완료</span>
                  ) : (
                    <span className="rm-tag-unassigned">강사 미배정</span>
                  )}
                  {req.plan && <span className="rm-tag-plan">계획표</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Detail Panel */}
          {selectedRequest && (
            <RequestDetail
              request={selectedRequest}
              instructors={instructors}
              onStatusUpdate={handleStatusUpdate}
              onAssignInstructors={handleAssignInstructors}
              onPlanSave={handlePlanSave}
              onClose={() => setSelectedId(null)}
            />
          )}

          {/* Empty state when no request selected */}
          {!selectedRequest && (
            <div className="rm-empty-detail">
              <div className="rm-empty-icon">&#9776;</div>
              <p>요청을 선택하면 상세 정보가 표시됩니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
