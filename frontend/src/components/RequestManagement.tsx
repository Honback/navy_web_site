import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import type { TrainingRequest, RequestStatus, Instructor } from '../types'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  APPROVED: '승인',
  REJECTED: '반려',
  CANCELLED: '취소',
}

const CATEGORIES = [
  { key: 'identity', label: '해군정체성', category: '해군정체성' },
  { key: 'security', label: '안보(군인정신)', category: '안보' },
  { key: 'communication', label: '소통', category: '소통' },
] as const

export default function RequestManagement() {
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')

  // Instructor assignment state per request
  const [assignState, setAssignState] = useState<Record<number, {
    identity: string, security: string, communication: string
  }>>({})
  const [assignLoading, setAssignLoading] = useState<number | null>(null)
  const [assignMsg, setAssignMsg] = useState<Record<number, { type: 'success' | 'error', text: string }>>({})

  // SMS modal state
  const [smsModal, setSmsModal] = useState<TrainingRequest | null>(null)
  const [smsCopied, setSmsCopied] = useState<string>('')

  // Plan modal state
  const [planModal, setPlanModal] = useState<TrainingRequest | null>(null)
  const [planText, setPlanText] = useState('')
  const [planLoading, setPlanLoading] = useState(false)
  const [planMsg, setPlanMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const instructorsByCategory = useMemo(() => {
    const map: Record<string, Instructor[]> = {}
    for (const cat of CATEGORIES) {
      map[cat.category] = instructors.filter(i => i.category === cat.category)
    }
    return map
  }, [instructors])

  const instructorMap = useMemo(() => {
    const map: Record<number, Instructor> = {}
    instructors.forEach(i => { map[i.id] = i })
    return map
  }, [instructors])

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

  // Initialize assign state when expanding a card
  const initAssignState = (req: TrainingRequest) => {
    setAssignState(prev => ({
      ...prev,
      [req.id]: {
        identity: req.identityInstructorId ? String(req.identityInstructorId) : '',
        security: req.securityInstructorId ? String(req.securityInstructorId) : '',
        communication: req.communicationInstructorId ? String(req.communicationInstructorId) : '',
      }
    }))
  }

  const filteredRequests = useMemo(() => {
    if (!filterStatus) return requests
    return requests.filter(r => r.status === filterStatus)
  }, [requests, filterStatus])

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { PENDING: 0, APPROVED: 0, REJECTED: 0, CANCELLED: 0 }
    requests.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1 })
    return counts
  }, [requests])

  const handleStatusUpdate = async (requestId: number, status: RequestStatus) => {
    try {
      await api.updateRequestStatus(requestId, status)
      fetchRequests()
    } catch {
      setError('상태 변경에 실패했습니다.')
    }
  }

  const handleAssignInstructors = async (requestId: number) => {
    const state = assignState[requestId]
    if (!state) return

    setAssignLoading(requestId)
    setAssignMsg(prev => {
      const next = { ...prev }
      delete next[requestId]
      return next
    })
    try {
      await api.assignInstructors(requestId, {
        identityInstructorId: state.identity ? Number(state.identity) : null,
        securityInstructorId: state.security ? Number(state.security) : null,
        communicationInstructorId: state.communication ? Number(state.communication) : null,
      })
      setAssignMsg(prev => ({ ...prev, [requestId]: { type: 'success', text: '강사가 배정되었습니다.' } }))
      fetchRequests()
    } catch {
      setAssignMsg(prev => ({ ...prev, [requestId]: { type: 'error', text: '강사 배정에 실패했습니다.' } }))
    } finally {
      setAssignLoading(null)
    }
  }

  const updateAssign = (reqId: number, field: string, value: string) => {
    setAssignState(prev => ({
      ...prev,
      [reqId]: { ...prev[reqId], [field]: value }
    }))
  }

  const toggleExpand = (id: number, req: TrainingRequest) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
      initAssignState(req)
    }
  }

  const hasInstructors = (req: TrainingRequest) =>
    req.identityInstructorId && req.securityInstructorId && req.communicationInstructorId

  // SMS helpers
  const getAssignedInstructors = (req: TrainingRequest) => {
    const result: { category: string, catKey: string, name: string, rank: string, phone: string }[] = []
    if (req.identityInstructorId) {
      const inst = instructorMap[req.identityInstructorId]
      if (inst) result.push({ category: '해군정체성', catKey: 'identity', name: inst.name, rank: inst.rank, phone: inst.phone || '' })
    }
    if (req.securityInstructorId) {
      const inst = instructorMap[req.securityInstructorId]
      if (inst) result.push({ category: '안보(군인정신)', catKey: 'security', name: inst.name, rank: inst.rank, phone: inst.phone || '' })
    }
    if (req.communicationInstructorId) {
      const inst = instructorMap[req.communicationInstructorId]
      if (inst) result.push({ category: '소통', catKey: 'communication', name: inst.name, rank: inst.rank, phone: inst.phone || '' })
    }
    return result
  }

  const buildSmsMessage = (req: TrainingRequest, inst: { category: string, name: string, rank: string }) => {
    const dateStr = req.requestDate + (req.requestEndDate ? ` ~ ${req.requestEndDate}` : '')
    return `[필승해군캠프 강사 안내]\n\n안녕하세요, ${inst.rank} ${inst.name}님.\n\n${req.fleet} 대상 필승해군캠프 교육이 예정되어 있어 안내드립니다.\n\n- 교육일: ${dateStr}\n- 교육장소: ${req.venueName}\n- 교육형태: ${req.trainingType}\n- 담당분야: ${inst.category}\n\n자세한 사항은 추후 안내드리겠습니다.\n감사합니다.`
  }

  const handleCopySms = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSmsCopied(key)
      setTimeout(() => setSmsCopied(''), 2000)
    })
  }

  // Plan helpers
  const generatePlanTemplate = (req: TrainingRequest) => {
    const dateStr = req.requestDate + (req.requestEndDate ? ` ~ ${req.requestEndDate}` : '')
    const identity = req.identityInstructorName ? `${req.identityInstructorRank} ${req.identityInstructorName}` : '미배정'
    const security = req.securityInstructorName ? `${req.securityInstructorRank} ${req.securityInstructorName}` : '미배정'
    const communication = req.communicationInstructorName ? `${req.communicationInstructorRank} ${req.communicationInstructorName}` : '미배정'
    const venue = req.venueName + (req.secondVenueName ? ` / 보조: ${req.secondVenueName}` : '')

    if (req.trainingType === '1박2일합숙형') {
      return `[필승해군캠프 교육 계획표]

1. 교육 개요
   - 교육일시: ${dateStr}
   - 교육장소: ${venue}
   - 대상: ${req.fleet}
   - 교육형태: ${req.trainingType}

2. 강사진
   - 해군정체성: ${identity}
   - 안보(군인정신): ${security}
   - 소통: ${communication}

3. 시간별 세부 일정

[1일차 - ${req.requestDate}]
   09:00 ~ 09:30  등록 및 입소
   09:30 ~ 10:00  개회식
   10:00 ~ 12:00  해군정체성 교육
   12:00 ~ 13:00  중식
   13:00 ~ 15:00  안보(군인정신) 교육
   15:00 ~ 15:20  휴식
   15:20 ~ 17:00  소통 교육
   17:00 ~ 18:00  석식
   18:00 ~        자유시간

[2일차 - ${req.requestEndDate}]
   07:00 ~ 08:00  조식
   08:00 ~ 10:00  팀빌딩 활동
   10:00 ~ 11:30  종합 토론
   11:30 ~ 12:00  설문 및 폐회

4. 준비사항
   -
   -

5. 기타
   - `
    }

    return `[필승해군캠프 교육 계획표]

1. 교육 개요
   - 교육일시: ${dateStr}${req.startTime ? ` (${req.startTime} 시작)` : ''}
   - 교육장소: ${venue}
   - 대상: ${req.fleet}
   - 교육형태: ${req.trainingType}

2. 강사진
   - 해군정체성: ${identity}
   - 안보(군인정신): ${security}
   - 소통: ${communication}

3. 시간별 세부 일정
   09:00 ~ 09:30  등록 및 입소
   09:30 ~ 10:00  개회식
   10:00 ~ 12:00  해군정체성 교육
   12:00 ~ 13:00  중식
   13:00 ~ 15:00  안보(군인정신) 교육
   15:00 ~ 15:20  휴식
   15:20 ~ 17:00  소통 교육
   17:00 ~ 17:30  설문 및 폐회

4. 준비사항
   -
   -

5. 기타
   - `
  }

  const openPlanModal = (req: TrainingRequest) => {
    setPlanModal(req)
    setPlanText(req.plan || generatePlanTemplate(req))
    setPlanMsg(null)
  }

  const handleSavePlan = async () => {
    if (!planModal) return
    setPlanLoading(true)
    setPlanMsg(null)
    try {
      await api.updatePlan(planModal.id, planText)
      setPlanMsg({ type: 'success', text: '계획표가 저장되었습니다.' })
      fetchRequests()
    } catch {
      setPlanMsg({ type: 'error', text: '계획표 저장에 실패했습니다.' })
    } finally {
      setPlanLoading(false)
    }
  }

  if (loading) return <div className="loading">불러오는 중...</div>
  if (error) return <div className="message error">{error}</div>

  return (
    <div className="management-page">
      <div className="management-header">
        <h2>요청 관리</h2>
        <div className="header-info">
          <div className="status-summary">
            <span
              className={`status-chip pending ${filterStatus === 'PENDING' ? 'active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === 'PENDING' ? '' : 'PENDING')}
            >
              대기 {statusCounts.PENDING}
            </span>
            <span
              className={`status-chip approved ${filterStatus === 'APPROVED' ? 'active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === 'APPROVED' ? '' : 'APPROVED')}
            >
              승인 {statusCounts.APPROVED}
            </span>
            <span
              className={`status-chip rejected ${filterStatus === 'REJECTED' ? 'active' : ''}`}
              onClick={() => setFilterStatus(filterStatus === 'REJECTED' ? '' : 'REJECTED')}
            >
              반려 {statusCounts.REJECTED}
            </span>
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
        <div className="req-card-list">
          {filteredRequests.map(req => (
            <div
              key={req.id}
              className={`req-card req-card-${req.status.toLowerCase()}`}
              onClick={() => toggleExpand(req.id, req)}
            >
              {/* Card Header */}
              <div className="req-card-header">
                <div className="req-card-left">
                  <span className={`status ${req.status.toLowerCase()}`}>
                    {STATUS_LABELS[req.status]}
                  </span>
                  <span className="req-card-id">#{req.id}</span>
                  <strong className="req-card-user">{req.userName}</strong>
                  <span className="req-card-fleet">{req.fleet}</span>
                </div>
                <div className="req-card-right">
                  <span className="req-card-date">
                    {req.requestDate}
                    {req.requestEndDate && ` ~ ${req.requestEndDate}`}
                  </span>
                  <span className="req-card-type">{req.trainingType}</span>
                  <span className={`req-card-chevron ${expandedId === req.id ? 'expanded' : ''}`}>
                    &#9662;
                  </span>
                </div>
              </div>

              {/* Card Summary */}
              <div className="req-card-summary">
                <span className="req-tag-venue">{req.venueName}</span>
                {req.secondVenueName && (
                  <>
                    <span className="req-card-sep">|</span>
                    <span className="req-tag-venue">보조: {req.secondVenueName}</span>
                  </>
                )}
                {hasInstructors(req) ? (
                  <>
                    <span className="req-card-sep">|</span>
                    <span className="cat-badge cat-identity small">정체성</span>
                    <span className="req-tag-name">{req.identityInstructorName}</span>
                    <span className="req-card-sep">|</span>
                    <span className="cat-badge cat-security small">안보</span>
                    <span className="req-tag-name">{req.securityInstructorName}</span>
                    <span className="req-card-sep">|</span>
                    <span className="cat-badge cat-communication small">소통</span>
                    <span className="req-tag-name">{req.communicationInstructorName}</span>
                  </>
                ) : (
                  <>
                    <span className="req-card-sep">|</span>
                    <span className="assign-pending-badge">강사 미배정</span>
                  </>
                )}
              </div>

              {/* Expanded Detail */}
              {expandedId === req.id && (
                <div className="req-card-detail" onClick={e => e.stopPropagation()}>
                  <div className="req-detail-grid">
                    <div className="req-detail-section">
                      <h4>요청자 정보</h4>
                      <dl>
                        <dt>이름</dt><dd>{req.userName}</dd>
                        <dt>이메일</dt><dd>{req.userEmail}</dd>
                        <dt>소속</dt><dd>{req.fleet}</dd>
                      </dl>
                    </div>
                    <div className="req-detail-section">
                      <h4>교육 일정</h4>
                      <dl>
                        <dt>교육형태</dt><dd>{req.trainingType}</dd>
                        <dt>교육일</dt><dd>{req.requestDate}{req.requestEndDate && ` ~ ${req.requestEndDate}`}</dd>
                        {req.startTime && <><dt>시작시간</dt><dd>{req.startTime}</dd></>}
                        <dt>요청일시</dt><dd>{req.createdAt?.split('T')[0]}</dd>
                      </dl>
                    </div>
                    <div className="req-detail-section">
                      <h4>교육장</h4>
                      <dl>
                        <dt>주 교육장</dt><dd>{req.venueName} ({req.venueRoomNumber})</dd>
                        {req.secondVenueName && (
                          <><dt>보조 교육장</dt><dd>{req.secondVenueName} ({req.secondVenueRoomNumber})</dd></>
                        )}
                      </dl>
                    </div>
                  </div>

                  {/* Instructor Assignment Section */}
                  <div className="req-assign-section">
                    <h4>강사 배정</h4>
                    {assignMsg[req.id] && (
                      <div className={`message ${assignMsg[req.id].type} small`}>{assignMsg[req.id].text}</div>
                    )}
                    <div className="req-assign-grid">
                      {CATEGORIES.map(cat => {
                        const fieldKey = cat.key as 'identity' | 'security' | 'communication'
                        return (
                          <div className="req-assign-item" key={cat.key}>
                            <label>
                              <span className={`cat-badge cat-${cat.key} small`}>{cat.label}</span>
                            </label>
                            <select
                              value={assignState[req.id]?.[fieldKey] || ''}
                              onChange={e => updateAssign(req.id, fieldKey, e.target.value)}
                            >
                              <option value="">-- 미배정 --</option>
                              {(instructorsByCategory[cat.category] || []).map(inst => (
                                <option key={inst.id} value={inst.id}>
                                  {inst.rank} {inst.name} ({inst.affiliation || inst.specialty})
                                </option>
                              ))}
                            </select>
                          </div>
                        )
                      })}
                    </div>
                    <div className="req-assign-actions">
                      <button
                        className="action-btn approve"
                        onClick={() => handleAssignInstructors(req.id)}
                        disabled={assignLoading === req.id}
                      >
                        {assignLoading === req.id ? '저장 중...' : '강사 배정 저장'}
                      </button>
                      {hasInstructors(req) && (
                        <button
                          className="action-btn sms-btn"
                          onClick={() => setSmsModal(req)}
                        >
                          문자 안내
                        </button>
                      )}
                    </div>
                  </div>

                  {req.notes && (
                    <div className="req-detail-notes">
                      <strong>비고:</strong> {req.notes}
                    </div>
                  )}

                  <div className="req-card-actions">
                    <button
                      className="action-btn plan-btn"
                      onClick={() => openPlanModal(req)}
                    >
                      {req.plan ? '계획표 보기' : '계획표 작성'}
                    </button>
                    {req.status === 'PENDING' && (
                      <>
                        <button className="action-btn approve" onClick={() => handleStatusUpdate(req.id, 'APPROVED')}>
                          승인
                        </button>
                        <button className="action-btn reject" onClick={() => handleStatusUpdate(req.id, 'REJECTED')}>
                          반려
                        </button>
                      </>
                    )}
                    {req.status !== 'PENDING' && req.status !== 'CANCELLED' && (
                      <button className="action-btn cancel" onClick={() => handleStatusUpdate(req.id, 'CANCELLED')}>
                        취소
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* SMS Modal */}
      {smsModal && (
        <div className="modal-overlay" onClick={() => setSmsModal(null)}>
          <div className="modal-content sms-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>강사 문자 안내</h3>
              <button className="modal-close" onClick={() => setSmsModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-bar">
                <span>#{smsModal.id}</span>
                <span>{smsModal.fleet}</span>
                <span>{smsModal.requestDate}{smsModal.requestEndDate && ` ~ ${smsModal.requestEndDate}`}</span>
                <span>{smsModal.venueName}</span>
              </div>
              {getAssignedInstructors(smsModal).map((inst, idx) => {
                const msg = buildSmsMessage(smsModal, inst)
                const key = `${inst.catKey}-${idx}`
                return (
                  <div className="sms-instructor-card" key={key}>
                    <div className="sms-instructor-header">
                      <span className={`cat-badge cat-${inst.catKey} small`}>
                        {inst.category}
                      </span>
                      <strong>{inst.rank} {inst.name}</strong>
                      <span className="sms-phone">{inst.phone || '전화번호 없음'}</span>
                    </div>
                    <textarea className="sms-message" readOnly value={msg} rows={10} />
                    <div className="sms-btn-row">
                      {inst.phone && (
                        <a
                          className="action-btn sms-btn"
                          href={`sms:${inst.phone}?body=${encodeURIComponent(msg)}`}
                        >
                          문자 보내기
                        </a>
                      )}
                      <button
                        className="action-btn approve"
                        onClick={() => handleCopySms(msg, key)}
                      >
                        {smsCopied === key ? '복사됨!' : '메시지 복사'}
                      </button>
                      {inst.phone && (
                        <a
                          className="action-btn"
                          href={`tel:${inst.phone}`}
                          style={{ textDecoration: 'none' }}
                        >
                          전화걸기
                        </a>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Plan Modal */}
      {planModal && (
        <div className="modal-overlay" onClick={() => setPlanModal(null)}>
          <div className="modal-content plan-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>교육 계획표 #{planModal.id}</h3>
              <button className="modal-close" onClick={() => setPlanModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="modal-info-bar">
                <span>{planModal.fleet}</span>
                <span>{planModal.requestDate}{planModal.requestEndDate && ` ~ ${planModal.requestEndDate}`}</span>
                <span>{planModal.venueName}</span>
                <span>{planModal.trainingType}</span>
              </div>
              {planMsg && (
                <div className={`message ${planMsg.type} small`}>{planMsg.text}</div>
              )}
              <textarea
                className="plan-textarea"
                value={planText}
                onChange={e => setPlanText(e.target.value)}
                rows={24}
              />
              <div className="plan-btn-row">
                <button
                  className="action-btn approve"
                  onClick={handleSavePlan}
                  disabled={planLoading}
                >
                  {planLoading ? '저장 중...' : '계획표 저장'}
                </button>
                <button
                  className="action-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(planText)
                    setPlanMsg({ type: 'success', text: '클립보드에 복사되었습니다.' })
                    setTimeout(() => setPlanMsg(null), 2000)
                  }}
                >
                  복사
                </button>
                <button
                  className="action-btn cancel"
                  onClick={() => setPlanModal(null)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
