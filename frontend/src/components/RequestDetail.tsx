import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import type { TrainingRequest, RequestStatus, Instructor, VenueContact } from '../types'

type DetailTab = 'info' | 'venue' | 'instructor' | 'plan'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '요청',
  VENUE_CHECK: '교육장확인',
  INSTRUCTOR_CHECK: '강사확인',
  CONFIRMED: '확정',
  REJECTED: '반려',
  CANCELLED: '취소',
}

const STATUS_STEPS = [
  { key: 'PENDING', label: '요청' },
  { key: 'VENUE_CHECK', label: '교육장확인' },
  { key: 'INSTRUCTOR_CHECK', label: '강사확인' },
  { key: 'CONFIRMED', label: '확정' },
]

const NEXT_STATUS: Record<string, string> = {
  PENDING: 'VENUE_CHECK',
  VENUE_CHECK: 'INSTRUCTOR_CHECK',
  INSTRUCTOR_CHECK: 'CONFIRMED',
}

const NEXT_LABEL: Record<string, string> = {
  PENDING: '교육장확인으로 진행',
  VENUE_CHECK: '강사확인으로 진행',
  INSTRUCTOR_CHECK: '확정',
}

const PREV_STATUS: Record<string, string> = {
  VENUE_CHECK: 'PENDING',
  INSTRUCTOR_CHECK: 'VENUE_CHECK',
  CONFIRMED: 'INSTRUCTOR_CHECK',
}

const PREV_LABEL: Record<string, string> = {
  VENUE_CHECK: '요청으로 되돌리기',
  INSTRUCTOR_CHECK: '교육장확인으로 되돌리기',
  CONFIRMED: '강사확인으로 되돌리기',
}

/** Map status to the most relevant detail tab */
const STATUS_DEFAULT_TAB: Record<string, DetailTab> = {
  PENDING: 'info',
  VENUE_CHECK: 'venue',
  INSTRUCTOR_CHECK: 'instructor',
  CONFIRMED: 'plan',
}

const CATEGORIES = [
  { key: 'identity', label: '해군정체성', category: '해군정체성' },
  { key: 'security', label: '안보(군인정신)', category: '안보' },
  { key: 'communication', label: '소통', category: '소통' },
] as const

interface RequestDetailProps {
  request: TrainingRequest
  instructors: Instructor[]
  onStatusUpdate: (requestId: number, status: RequestStatus, reason?: string) => Promise<void>
  onAssignInstructors: (requestId: number, data: { identity: string, security: string, communication: string }) => Promise<void>
  onPlanSave: (requestId: number, plan: string) => Promise<void>
  onClose: () => void
}

export default function RequestDetail({
  request: req,
  instructors,
  onStatusUpdate,
  onAssignInstructors,
  onPlanSave,
  onClose,
}: RequestDetailProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>(STATUS_DEFAULT_TAB[req.status] || 'info')

  // Assign state
  const [assignState, setAssignState] = useState({
    identity: req.identityInstructorId ? String(req.identityInstructorId) : '',
    security: req.securityInstructorId ? String(req.securityInstructorId) : '',
    communication: req.communicationInstructorId ? String(req.communicationInstructorId) : '',
  })
  const [assignLoading, setAssignLoading] = useState(false)
  const [assignMsg, setAssignMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Contact state
  const [venueContacts, setVenueContacts] = useState<VenueContact[]>([])
  const [venueContactsLoading, setVenueContactsLoading] = useState(false)
  const [smsCopied, setSmsCopied] = useState('')

  // Plan state
  const [planText, setPlanText] = useState(req.plan || '')
  const [planLoading, setPlanLoading] = useState(false)
  const [planMsg, setPlanMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Reason modal state
  const [reasonModal, setReasonModal] = useState<{ action: 'REJECTED' | 'CANCELLED' } | null>(null)
  const [reasonText, setReasonText] = useState('')

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

  // Reset state when request changes
  useEffect(() => {
    setAssignState({
      identity: req.identityInstructorId ? String(req.identityInstructorId) : '',
      security: req.securityInstructorId ? String(req.securityInstructorId) : '',
      communication: req.communicationInstructorId ? String(req.communicationInstructorId) : '',
    })
    setPlanText(req.plan || '')
    setAssignMsg(null)
    setPlanMsg(null)
  }, [req.id, req.identityInstructorId, req.securityInstructorId, req.communicationInstructorId, req.plan])

  // Auto-select tab based on status when request changes
  useEffect(() => {
    setActiveTab(STATUS_DEFAULT_TAB[req.status] || 'info')
  }, [req.id, req.status])

  // Load venue contacts when venue tab opens
  useEffect(() => {
    if (activeTab !== 'venue') return
    setVenueContactsLoading(true)
    const venueIds = [req.venueId]
    if (req.secondVenueId) venueIds.push(req.secondVenueId)
    Promise.all(venueIds.map(id => api.getVenueContactsByVenue(id)))
      .then(results => setVenueContacts(results.flat()))
      .catch(() => setVenueContacts([]))
      .finally(() => setVenueContactsLoading(false))
  }, [activeTab, req.venueId, req.secondVenueId])

  const handleAssign = async () => {
    setAssignLoading(true)
    setAssignMsg(null)
    try {
      await onAssignInstructors(req.id, assignState)
      setAssignMsg({ type: 'success', text: '강사가 배정되었습니다.' })
    } catch {
      setAssignMsg({ type: 'error', text: '강사 배정에 실패했습니다.' })
    } finally {
      setAssignLoading(false)
    }
  }

  const handleSavePlan = async () => {
    setPlanLoading(true)
    setPlanMsg(null)
    try {
      await onPlanSave(req.id, planText)
      setPlanMsg({ type: 'success', text: '계획표가 저장되었습니다.' })
    } catch {
      setPlanMsg({ type: 'error', text: '계획표 저장에 실패했습니다.' })
    } finally {
      setPlanLoading(false)
    }
  }

  const openReasonModal = (action: 'REJECTED' | 'CANCELLED') => {
    setReasonModal({ action })
    setReasonText('')
  }

  const submitReason = async () => {
    if (!reasonModal || !reasonText.trim()) return
    await onStatusUpdate(req.id, reasonModal.action, reasonText.trim())
    setReasonModal(null)
    setReasonText('')
  }

  // SMS helpers
  const getAssignedInstructors = () => {
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

  const buildSmsMessage = (inst: { category: string, name: string, rank: string }) => {
    const dateStr = req.requestDate + (req.requestEndDate ? ` ~ ${req.requestEndDate}` : '')
    const participantInfo = req.participantCount ? `${req.participantCount}명` : '약 00명'
    return `[필승해군캠프 강사 안내]\n\n안녕하세요, ${inst.rank} ${inst.name}님.\n\n${req.fleet} 대상 필승해군캠프 교육이 예정되어 있어 안내드립니다.\n\n- 교육일: ${dateStr}\n- 교육장소: ${req.venueName}\n- 교육형태: ${req.trainingType}\n- 참여인원: ${participantInfo}\n- 담당분야: ${inst.category}\n\n자세한 사항은 추후 안내드리겠습니다.\n감사합니다.`
  }

  const buildVenueSmsMessage = (contact: VenueContact) => {
    const dateStr = req.requestDate + (req.requestEndDate ? ` ~ ${req.requestEndDate}` : '')
    const participantInfo = req.participantCount ? `${req.participantCount}명` : '약 00명'
    return `[필승해군캠프 대관 안내]\n\n안녕하세요, ${contact.name}${contact.role ? ` ${contact.role}` : ''}님.\n\n${req.fleet} 대상 필승해군캠프 교육이 예정되어 있어 대관 관련 안내드립니다.\n\n- 교육일: ${dateStr}\n- 교육장소: ${req.venueName}\n- 교육형태: ${req.trainingType}\n- 예상인원: ${participantInfo}\n\n대관 예약 관련 세부 사항은 별도 협의 부탁드립니다.\n감사합니다.`
  }

  const handleCopySms = (text: string, key: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSmsCopied(key)
      setTimeout(() => setSmsCopied(''), 2000)
    })
  }

  const generatePlanTemplate = () => {
    const dateStr = req.requestDate + (req.requestEndDate ? ` ~ ${req.requestEndDate}` : '')
    const venue = req.venueName + (req.venueRoomNumber ? ` (${req.venueRoomNumber})` : '')
    const secondVenue = req.secondVenueName ? `\n ・보조 교육장: ${req.secondVenueName}${req.secondVenueRoomNumber ? ` (${req.secondVenueRoomNumber})` : ''}` : ''

    // Build instructor profile sections
    const buildInstructorProfile = (id: number | null, category: string) => {
      if (!id) return `  ・미배정`
      const inst = instructorMap[id]
      if (!inst) return `  ・미배정`
      const lines = [`${category}_${inst.rank} ${inst.name}`]
      lines.push(`  ・이름: ${inst.name}`)
      lines.push(`  ・소속: ${inst.affiliation || '(소속 미등록)'}`)
      if (inst.career) lines.push(`  ・이력: ${inst.career}`)
      if (inst.educationTopic) lines.push(`  ・교육 주제: ${inst.educationTopic}`)
      return lines.join('\n')
    }

    const identityProfile = buildInstructorProfile(req.identityInstructorId, '해군 정체성 초빙강연')
    const securityProfile = buildInstructorProfile(req.securityInstructorId, '군인정신 초빙강연')
    const communicationProfile = buildInstructorProfile(req.communicationInstructorId, '정신전력 강화 프로그램')

    // Date code for title (YYMMDD format)
    const dateCode = req.requestDate.replace(/-/g, '').slice(2)
    const endCode = req.requestEndDate ? '-' + req.requestEndDate.replace(/-/g, '').slice(4) : ''

    if (req.trainingType === '1박2일합숙형') {
      return `${dateCode}${endCode} ${req.fleet} 필승해군캠프 운영계획

■ 개요
 ・일시: ${dateStr}
 ・장소: ${venue}${secondVenue}
 ・대상: ${req.fleet} 장병 ${req.participantCount ? req.participantCount + '명' : '약 00명'}
 ・내용: 해군 정체성 교육, 군인정신 함양, 정신전력 강화 프로그램

■ 일정표

[1일차 - ${req.requestDate}]
 (10:00~11:00) 교육장 이동 및 도착
 (11:00~12:00) 입교식 및 교육안내
 (12:00~13:00) 중식
 (13:00~14:50) 해군 정체성 초빙강연
 (14:50~15:00) 휴식시간
 (15:00~17:00) 정신전력 강화 프로그램
 (17:00~18:00) 행정시간
 (18:00~18:50) 석식

[2일차 - ${req.requestEndDate}]
 (07:00~08:00) 조식
 (08:00~09:00) 행정 시간 (체크아웃)
 (09:00~11:00) 군인정신 초빙강연
 (11:00~11:50) 퇴소식 / 교육 설문조사
 (12:00~12:50) 중식
 (13:00~) 부대 복귀

■ 교육 프로그램

1. ${identityProfile}

2. ${securityProfile}

3. ${communicationProfile}

■ 교육장 정보
 ・장소명: ${req.venueName}
 ・위치: (주소 입력)
 ・교육장: ${req.venueRoomNumber || '(호실 정보 입력)'}
 ・식당: (식당 정보 입력)
 ・참가자 준비물: 필기구, 세면도구, 운동복(필요시)

■ 기타사항
 ・운영담당자: (담당자 이름 및 연락처)
 ・교육 일정 변경은 최소 4주 전에 운영사무국에 통보`
    }

    return `${dateCode} ${req.fleet} 필승해군캠프 운영계획

■ 개요
 ・일시: ${dateStr}${req.startTime ? ` (${req.startTime} 시작)` : ''}
 ・장소: ${venue}${secondVenue}
 ・대상: ${req.fleet} 장병 ${req.participantCount ? req.participantCount + '명' : '약 00명'}
 ・내용: 해군 정체성 교육, 군인정신 함양, 정신전력 강화 프로그램

■ 일정표

 (09:00~09:30) 교육장 이동
 (09:30~10:00) 입교식 및 교육안내
 (10:00~11:50) 해군 정체성 초빙강연
 (11:50~13:20) 중식
 (13:20~13:30) 휴식 시간
 (13:30~15:00) 군인정신 초빙강연
 (15:00~15:20) 행정 시간
 (15:20~17:00) 정신전력 강화 프로그램
 (17:00~17:30) 부대 복귀

■ 교육 프로그램

1. ${identityProfile}

2. ${securityProfile}

3. ${communicationProfile}

■ 교육장 정보
 ・장소명: ${req.venueName}
 ・위치: (주소 입력)
 ・교육장: ${req.venueRoomNumber || '(호실 정보 입력)'}
 ・참가자 준비물: 필기구, 운동복(필요시)

■ 기타사항
 ・운영담당자: (담당자 이름 및 연락처)
 ・교육 일정 변경은 최소 4주 전에 운영사무국에 통보`
  }

  const tabs: { key: DetailTab, label: string }[] = [
    { key: 'info', label: '정보' },
    { key: 'venue', label: '교육장' },
    { key: 'instructor', label: '강사' },
    { key: 'plan', label: '계획' },
  ]

  const assignedInstructors = getAssignedInstructors()

  return (
    <div className="rd-panel">
      {/* Header */}
      <div className="rd-header">
        <div className="rd-header-top">
          <div className="rd-header-left">
            <span className={`status ${req.status.toLowerCase()}`}>
              {STATUS_LABELS[req.status]}
            </span>
            <span className="rd-id">#{req.id}</span>
            <strong className="rd-user">{req.userName}</strong>
          </div>
          <button className="rd-close" onClick={onClose}>&times;</button>
        </div>
        <div className="rd-header-meta">
          <span className="rd-fleet">{req.fleet}{req.ship && ` / ${req.ship}`}</span>
          <span className="rd-type">{req.trainingType}</span>
          <span className="rd-date">
            {req.requestDate}{req.requestEndDate && ` ~ ${req.requestEndDate}`}
          </span>
          {req.createdAt && (
            <span className="rd-created">접수 {req.createdAt.replace('T', ' ').slice(0, 16)}</span>
          )}
        </div>

        {/* Status Progress */}
        {req.status !== 'REJECTED' && req.status !== 'CANCELLED' && (
          <div className="rd-progress">
            {STATUS_STEPS.map((step, idx) => {
              const currentIdx = STATUS_STEPS.findIndex(s => s.key === req.status)
              const isDone = idx <= currentIdx
              const isCurrent = idx === currentIdx
              return (
                <div key={step.key} className={`rd-step${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`}>
                  <div className="rd-step-dot">{isDone ? (idx < currentIdx ? '✓' : (idx + 1)) : (idx + 1)}</div>
                  <span className="rd-step-label">{step.label}</span>
                  {idx < STATUS_STEPS.length - 1 && <div className={`rd-step-line${isDone && idx < currentIdx ? ' done' : ''}`} />}
                </div>
              )
            })}
          </div>
        )}

        {/* Status Actions */}
        <div className="rd-status-actions">
          {PREV_STATUS[req.status] && (
            <button className="action-btn rd-prev-btn" onClick={() => onStatusUpdate(req.id, PREV_STATUS[req.status] as RequestStatus)}>
              ← {PREV_LABEL[req.status]}
            </button>
          )}
          {NEXT_STATUS[req.status] && (
            <button className="action-btn approve" onClick={() => onStatusUpdate(req.id, NEXT_STATUS[req.status] as RequestStatus)}>
              {NEXT_LABEL[req.status]} →
            </button>
          )}
          {req.status !== 'CONFIRMED' && req.status !== 'CANCELLED' && req.status !== 'REJECTED' && (
            <button className="action-btn reject" onClick={() => openReasonModal('REJECTED')}>반려</button>
          )}
          {req.status !== 'CANCELLED' && req.status !== 'REJECTED' && req.status !== 'PENDING' && (
            <button className="action-btn cancel" onClick={() => openReasonModal('CANCELLED')}>취소</button>
          )}
        </div>

        {req.rejectionReason && (req.status === 'REJECTED' || req.status === 'CANCELLED') && (
          <div className={`rd-reason rd-reason-${req.status.toLowerCase()}`}>
            <strong>{req.status === 'REJECTED' ? '반려 사유' : '취소 사유'}:</strong> {req.rejectionReason}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="rd-tabs">
        {tabs.map(tab => (
          <button
            key={tab.key}
            className={`rd-tab${activeTab === tab.key ? ' active' : ''}`}
            data-tab={tab.key}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="rd-content">
        {/* === 정보 Tab === */}
        {activeTab === 'info' && (
          <div className="rd-info">
            <div className="rd-info-section">
              <h4>요청자 정보</h4>
              <dl>
                <dt>이름</dt><dd>{req.userName}</dd>
                <dt>이메일</dt><dd>{req.userEmail}</dd>
                <dt>소속</dt><dd>{req.fleet}{req.ship && ` / ${req.ship}`}</dd>
              </dl>
            </div>
            <div className="rd-info-section">
              <h4>교육 일정</h4>
              <dl>
                <dt>교육형태</dt><dd>{req.trainingType}</dd>
                <dt>교육일</dt><dd>{req.requestDate}{req.requestEndDate && ` ~ ${req.requestEndDate}`}</dd>
                {req.startTime && <><dt>시작시간</dt><dd>{req.startTime}</dd></>}
                <dt>참여 인원</dt>
                <dd>
                  {req.participantCount ? `${req.participantCount}명` : <span className="rd-unassigned">미정</span>}
                </dd>
                <dt>접수일시</dt><dd>{req.createdAt?.replace('T', ' ').slice(0, 16)}</dd>
              </dl>
            </div>
            <div className="rd-info-section">
              <h4>교육장</h4>
              <dl>
                <dt>주 교육장</dt><dd>{req.venueName} ({req.venueRoomNumber})</dd>
                {req.secondVenueName && (
                  <><dt>보조 교육장</dt><dd>{req.secondVenueName} ({req.secondVenueRoomNumber})</dd></>
                )}
              </dl>
            </div>
            <div className="rd-info-section">
              <h4>배정 현황</h4>
              <dl>
                <dt>해군정체성</dt>
                <dd>
                  {req.identityInstructorName
                    ? `${req.identityInstructorRank} ${req.identityInstructorName}`
                    : <span className="rd-unassigned">미배정</span>}
                </dd>
                <dt>안보(군인정신)</dt>
                <dd>
                  {req.securityInstructorName
                    ? `${req.securityInstructorRank} ${req.securityInstructorName}`
                    : <span className="rd-unassigned">미배정</span>}
                </dd>
                <dt>소통</dt>
                <dd>
                  {req.communicationInstructorName
                    ? `${req.communicationInstructorRank} ${req.communicationInstructorName}`
                    : <span className="rd-unassigned">미배정</span>}
                </dd>
              </dl>
            </div>
            {req.notes && (
              <div className="rd-info-section">
                <h4>비고</h4>
                <p className="rd-notes-text">{req.notes}</p>
              </div>
            )}
          </div>
        )}

        {/* === 교육장 Tab === */}
        {activeTab === 'venue' && (
          <div className="rd-venue-tab">
            {/* Venue Info */}
            <div className="rd-info-section">
              <h4>교육장 정보</h4>
              <dl>
                <dt>주 교육장</dt><dd>{req.venueName} ({req.venueRoomNumber})</dd>
                {req.secondVenueName && (
                  <><dt>보조 교육장</dt><dd>{req.secondVenueName} ({req.secondVenueRoomNumber})</dd></>
                )}
                <dt>교육형태</dt><dd>{req.trainingType}</dd>
                <dt>교육일</dt><dd>{req.requestDate}{req.requestEndDate && ` ~ ${req.requestEndDate}`}</dd>
                {req.startTime && <><dt>시작시간</dt><dd>{req.startTime}</dd></>}
                <dt>참여 인원</dt>
                <dd>{req.participantCount ? `${req.participantCount}명` : <span className="rd-unassigned">미정</span>}</dd>
              </dl>
            </div>

            {/* Venue Contacts */}
            <div className="rd-info-section">
              <h4>대관 담당자</h4>
              {venueContactsLoading ? (
                <p className="rd-empty">불러오는 중...</p>
              ) : venueContacts.length === 0 ? (
                <p className="rd-empty">등록된 대관 담당자가 없습니다.</p>
              ) : (
                <div className="rd-contact-list">
                  {venueContacts.map((vc, idx) => {
                    const msg = buildVenueSmsMessage(vc)
                    const key = `vc-${vc.id}-${idx}`
                    return (
                      <div className="rd-contact-card" key={key}>
                        <div className="rd-contact-card-header">
                          <div className="rd-contact-info">
                            <span className="vcg-preferred">{vc.role || '담당자'}</span>
                            <strong>{vc.name}</strong>
                            {vc.preferredContact && <span className="rd-preferred-tag">{vc.preferredContact}</span>}
                          </div>
                          {vc.phone && <a className="rd-phone-link" href={`tel:${vc.phone}`}>{vc.phone}</a>}
                        </div>
                        <textarea className="rd-sms-text" readOnly value={msg} rows={7} />
                        <div className="rd-contact-actions">
                          {vc.phone && (
                            <a className="rd-contact-btn rd-sms-send" href={`sms:${vc.phone}?body=${encodeURIComponent(msg)}`}>
                              문자 보내기
                            </a>
                          )}
                          <button className="rd-contact-btn rd-sms-copy" onClick={() => handleCopySms(msg, key)}>
                            {smsCopied === key ? '복사 완료' : '복사'}
                          </button>
                          {vc.phone && (
                            <a className="rd-contact-btn rd-sms-call" href={`tel:${vc.phone}`}>전화</a>
                          )}
                          {vc.email && (
                            <a className="rd-contact-btn rd-sms-email" href={`mailto:${vc.email}`}>메일</a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* === 강사 Tab === */}
        {activeTab === 'instructor' && (
          <div className="rd-instructor-tab">
            {/* Instructor Assignment */}
            <div className="rd-info-section">
              <h4>강사 배정</h4>
              {assignMsg && (
                <div className={`message ${assignMsg.type} small`}>{assignMsg.text}</div>
              )}
              <div className="rd-assign-grid">
                {CATEGORIES.map(cat => {
                  const fieldKey = cat.key as 'identity' | 'security' | 'communication'
                  return (
                    <div className="rd-assign-item" key={cat.key}>
                      <label>
                        <span className={`cat-badge cat-${cat.key} small`}>{cat.label}</span>
                      </label>
                      <select
                        value={assignState[fieldKey]}
                        onChange={e => setAssignState(prev => ({ ...prev, [fieldKey]: e.target.value }))}
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
              <div className="rd-assign-actions">
                <button
                  className="action-btn approve"
                  onClick={handleAssign}
                  disabled={assignLoading}
                >
                  {assignLoading ? '저장 중...' : '강사 배정 저장'}
                </button>
              </div>
            </div>

            {/* Instructor Contacts */}
            <div className="rd-info-section">
              <h4>강사 연락</h4>
              {assignedInstructors.length === 0 ? (
                <p className="rd-empty">배정된 강사가 없습니다. 위에서 강사를 먼저 배정해주세요.</p>
              ) : (
                <div className="rd-contact-list">
                  {assignedInstructors.map((inst, idx) => {
                    const msg = buildSmsMessage(inst)
                    const key = `inst-${inst.catKey}-${idx}`
                    return (
                      <div className="rd-contact-card" key={key}>
                        <div className="rd-contact-card-header">
                          <div className="rd-contact-info">
                            <span className={`cat-badge cat-${inst.catKey} small`}>{inst.category}</span>
                            <strong>{inst.rank} {inst.name}</strong>
                          </div>
                          {inst.phone && <a className="rd-phone-link" href={`tel:${inst.phone}`}>{inst.phone}</a>}
                        </div>
                        <textarea className="rd-sms-text" readOnly value={msg} rows={7} />
                        <div className="rd-contact-actions">
                          {inst.phone && (
                            <a className="rd-contact-btn rd-sms-send" href={`sms:${inst.phone}?body=${encodeURIComponent(msg)}`}>
                              문자 보내기
                            </a>
                          )}
                          <button className="rd-contact-btn rd-sms-copy" onClick={() => handleCopySms(msg, key)}>
                            {smsCopied === key ? '복사 완료' : '복사'}
                          </button>
                          {inst.phone && (
                            <a className="rd-contact-btn rd-sms-call" href={`tel:${inst.phone}`}>전화</a>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* === 계획 Tab === */}
        {activeTab === 'plan' && (
          <div className="rd-plan">
            {planMsg && (
              <div className={`message ${planMsg.type} small`}>{planMsg.text}</div>
            )}
            {!planText && (
              <button
                className="rd-plan-gen-btn"
                onClick={() => setPlanText(generatePlanTemplate())}
              >
                계획표 템플릿 생성
              </button>
            )}
            <textarea
              className="rd-plan-textarea"
              value={planText}
              onChange={e => setPlanText(e.target.value)}
              rows={22}
              placeholder="교육 계획표를 작성하세요..."
            />
            <div className="rd-plan-actions">
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
            </div>
          </div>
        )}
      </div>

      {/* Reason Modal */}
      {reasonModal && (
        <div className="rd-modal-overlay" onClick={() => setReasonModal(null)}>
          <div className="rd-reason-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{reasonModal.action === 'REJECTED' ? '반려 사유 입력' : '취소 사유 입력'}</h3>
              <button className="modal-close" onClick={() => setReasonModal(null)}>&times;</button>
            </div>
            <div className="rd-reason-body">
              <p className="reason-modal-desc">
                {reasonModal.action === 'REJECTED'
                  ? '반려 사유를 입력해주세요. 요청자에게 표시됩니다.'
                  : '취소 사유를 입력해주세요. 요청자에게 표시됩니다.'}
              </p>
              <textarea
                className="reason-textarea"
                rows={4}
                value={reasonText}
                onChange={e => setReasonText(e.target.value)}
                placeholder="사유를 입력하세요..."
                autoFocus
              />
              <div className="reason-modal-actions">
                <button
                  className={`action-btn ${reasonModal.action === 'REJECTED' ? 'reject' : 'cancel'}`}
                  onClick={submitReason}
                  disabled={!reasonText.trim()}
                >
                  {reasonModal.action === 'REJECTED' ? '반려 확인' : '취소 확인'}
                </button>
                <button className="action-btn" onClick={() => setReasonModal(null)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
