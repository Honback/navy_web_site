import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { TrainingRequest, User } from '../types'

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

const STEPS = ['PENDING', 'VENUE_CHECK', 'INSTRUCTOR_CHECK', 'CONFIRMED'] as const
const STEP_LABELS = ['요청', '교육장확인', '강사확인', '확정']

function StatusStepper({ status }: { status: string }) {
  const isRejected = status === 'REJECTED'
  const isCancelled = status === 'CANCELLED'
  const currentIdx = STEPS.indexOf(status as typeof STEPS[number])

  if (isRejected || isCancelled) {
    const reachedIdx = isRejected ? 1 : currentIdx
    return (
      <div className="rl-stepper">
        {STEPS.map((_, i) => (
          <div key={i} className={`rl-step ${i < reachedIdx ? 'done' : ''} ${i === reachedIdx ? (isRejected ? 'rejected' : 'cancelled') : ''}`}>
            <span className="rl-step-dot">
              {i < reachedIdx ? '✓' : i === reachedIdx ? '✕' : (i + 1)}
            </span>
            <span className="rl-step-label">{STEP_LABELS[i]}</span>
            {i < STEPS.length - 1 && <span className="rl-step-line" />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rl-stepper">
      {STEPS.map((_, i) => (
        <div key={i} className={`rl-step ${i <= currentIdx ? 'done' : ''} ${i === currentIdx ? 'current' : ''}`}>
          <span className="rl-step-dot">
            {i < currentIdx ? '✓' : (i + 1)}
          </span>
          <span className="rl-step-label">{STEP_LABELS[i]}</span>
          {i < STEPS.length - 1 && <span className="rl-step-line" />}
        </div>
      ))}
    </div>
  )
}

interface RequestListProps {
  userId: number
  user?: User
  refreshKey: number
}

/** Parse plan text into structured sections for rendering */
function parsePlanSections(plan: string) {
  const sections: { title: string, content: string }[] = []
  const lines = plan.split('\n')
  let currentTitle = ''
  let currentLines: string[] = []

  // First line is the plan title
  let planTitle = ''

  for (const line of lines) {
    if (!planTitle && line.trim()) {
      planTitle = line.trim()
      continue
    }
    if (line.startsWith('■ ')) {
      if (currentTitle || currentLines.length > 0) {
        sections.push({ title: currentTitle, content: currentLines.join('\n').trim() })
      }
      currentTitle = line.replace('■ ', '').trim()
      currentLines = []
    } else {
      currentLines.push(line)
    }
  }
  if (currentTitle || currentLines.length > 0) {
    sections.push({ title: currentTitle, content: currentLines.join('\n').trim() })
  }

  return { planTitle, sections }
}

export default function RequestList({ userId, user, refreshKey }: RequestListProps) {
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [planView, setPlanView] = useState<TrainingRequest | null>(null)
  const [detailView, setDetailView] = useState<TrainingRequest | null>(null)

  // Navy HQ sees all; Fleet HQ (ship is null) sees all fleet requests; ship user sees own only
  const isNavyHQ = user?.fleet === '해군본부'
  const isFleetHQ = !isNavyHQ && user?.fleet && !user?.ship

  useEffect(() => {
    setLoading(true)
    const promise = isNavyHQ
      ? api.getRequests()
      : isFleetHQ
        ? api.getRequestsByFleet(user!.fleet!)
        : api.getRequests(userId)
    promise
      .then(setRequests)
      .catch(() => setError('요청 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [userId, refreshKey, isNavyHQ, isFleetHQ, user?.fleet])

  if (loading) return <div className="loading">불러오는 중...</div>
  if (error) return <div className="message error">{error}</div>

  return (
    <div className="request-list">
      <h2>{isNavyHQ ? '전체 일정 목록' : isFleetHQ ? `${user!.fleet} 요청 목록` : '내 요청 목록'}</h2>
      {requests.length === 0 ? (
        <p className="empty">등록된 요청이 없습니다.</p>
      ) : (
        <div className="rl-cards">
          {requests.map((req) => (
            <div key={req.id} className="rl-card" onClick={() => setDetailView(req)}>
              <div className="rl-card-top">
                <span className="rl-card-id">#{req.id}</span>
                <span className="rl-card-type">{req.trainingType}</span>
                <span className="rl-card-fleet">{req.fleet}{req.ship && ` / ${req.ship}`}</span>
                <span className="rl-card-date">
                  {req.requestDate}{req.requestEndDate && req.requestEndDate !== req.requestDate && ` ~ ${req.requestEndDate}`}
                </span>
              </div>
              <div className="rl-card-venue">
                {req.venueName}{req.venueRoomNumber && ` / ${req.venueRoomNumber}`}
              </div>
              <StatusStepper status={req.status} />
              {req.status === 'CONFIRMED' && req.plan && (
                <button className="rl-plan-btn" onClick={(e) => { e.stopPropagation(); setPlanView(req) }}>
                  계획표 보기
                </button>
              )}
              {req.rejectionReason && (req.status === 'REJECTED' || req.status === 'CANCELLED') && (
                <div className={`rl-card-reason ${req.status.toLowerCase()}`}>{req.rejectionReason}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Detail Popup Modal */}
      {detailView && (
        <div className="cal-popup-overlay" onClick={() => setDetailView(null)}>
          <div className="cal-popup" onClick={e => e.stopPropagation()}>
            <div className="cal-popup-header">
              <span className="cal-popup-status" style={{ background: STATUS_COLORS[detailView.status] }}>
                {STATUS_LABELS[detailView.status]}
              </span>
              <span className="cal-popup-id">#{detailView.id}</span>
              <button className="cal-popup-close" onClick={() => setDetailView(null)}>&times;</button>
            </div>
            <div className="cal-popup-body">
              <h3 className="cal-popup-fleet">{detailView.fleet}{detailView.ship && ` / ${detailView.ship}`}</h3>
              <dl className="cal-popup-info">
                <dt>교육 유형</dt>
                <dd>{detailView.trainingType}</dd>
                <dt>일정</dt>
                <dd>
                  {detailView.requestDate}
                  {detailView.requestEndDate && detailView.requestEndDate !== detailView.requestDate && ` ~ ${detailView.requestEndDate}`}
                  {detailView.startTime && ` (${detailView.startTime})`}
                </dd>
                {detailView.participantCount && (
                  <><dt>인원</dt><dd>{detailView.participantCount}명</dd></>
                )}
                <dt>장소</dt>
                <dd>
                  {detailView.venueName}
                  {detailView.venueRoomNumber && ` / ${detailView.venueRoomNumber}`}
                  {detailView.secondVenueName && (
                    <><br />{detailView.secondVenueName}{detailView.secondVenueRoomNumber && ` / ${detailView.secondVenueRoomNumber}`}</>
                  )}
                </dd>
                <dt>요청자</dt>
                <dd>{detailView.userName}</dd>
                {detailView.identityInstructorName && (
                  <><dt>정훈교관</dt><dd>{detailView.identityInstructorName}{detailView.identityInstructorRank && ` (${detailView.identityInstructorRank})`}</dd></>
                )}
                {detailView.securityInstructorName && (
                  <><dt>보안교관</dt><dd>{detailView.securityInstructorName}{detailView.securityInstructorRank && ` (${detailView.securityInstructorRank})`}</dd></>
                )}
                {detailView.communicationInstructorName && (
                  <><dt>통신교관</dt><dd>{detailView.communicationInstructorName}{detailView.communicationInstructorRank && ` (${detailView.communicationInstructorRank})`}</dd></>
                )}
                {detailView.notes && (
                  <><dt>비고</dt><dd>{detailView.notes}</dd></>
                )}
                {detailView.rejectionReason && (
                  <><dt>{detailView.status === 'REJECTED' ? '반려 사유' : '취소 사유'}</dt><dd>{detailView.rejectionReason}</dd></>
                )}
              </dl>
            </div>
            {detailView.status === 'CONFIRMED' && detailView.plan && (
              <div className="cal-popup-footer">
                <button className="cal-popup-detail-btn" onClick={() => { setDetailView(null); setPlanView(detailView) }}>
                  계획표 보기
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Plan View Modal */}
      {planView && planView.plan && (
        <div className="pv-overlay" onClick={() => setPlanView(null)}>
          <div className="pv-modal" onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="pv-header">
              <div className="pv-header-left">
                <span className="pv-badge">운영계획</span>
                <span className="pv-req-id">#{planView.id}</span>
              </div>
              <button className="pv-close" onClick={() => setPlanView(null)}>&times;</button>
            </div>

            {/* Plan Content */}
            <div className="pv-body">
              {(() => {
                const { planTitle, sections } = parsePlanSections(planView.plan!)
                return (
                  <>
                    {planTitle && <h2 className="pv-title">{planTitle}</h2>}

                    {/* Quick info bar */}
                    <div className="pv-info-bar">
                      <div className="pv-info-item">
                        <span className="pv-info-label">소속</span>
                        <span className="pv-info-value">{planView.fleet}</span>
                      </div>
                      <div className="pv-info-item">
                        <span className="pv-info-label">교육형태</span>
                        <span className="pv-info-value">{planView.trainingType}</span>
                      </div>
                      <div className="pv-info-item">
                        <span className="pv-info-label">교육장</span>
                        <span className="pv-info-value">{planView.venueName}</span>
                      </div>
                      <div className="pv-info-item">
                        <span className="pv-info-label">교육일</span>
                        <span className="pv-info-value">
                          {planView.requestDate}
                          {planView.requestEndDate && ` ~ ${planView.requestEndDate}`}
                        </span>
                      </div>
                    </div>

                    {/* Sections */}
                    {sections.map((section, idx) => (
                      <div className="pv-section" key={idx}>
                        {section.title && <h3 className="pv-section-title">{section.title}</h3>}
                        <pre className="pv-section-content">{section.content}</pre>
                      </div>
                    ))}

                    {/* Instructor Summary */}
                    {(planView.identityInstructorName || planView.securityInstructorName || planView.communicationInstructorName) && (
                      <div className="pv-instructors">
                        <h3 className="pv-section-title">배정 강사진</h3>
                        <div className="pv-instructor-cards">
                          {planView.securityInstructorName && (
                            <div className="pv-inst-card">
                              <span className="cat-badge cat-security small">안보(군인정신)</span>
                              <strong>{planView.securityInstructorRank} {planView.securityInstructorName}</strong>
                            </div>
                          )}
                          {planView.communicationInstructorName && (
                            <div className="pv-inst-card">
                              <span className="cat-badge cat-communication small">소통</span>
                              <strong>{planView.communicationInstructorRank} {planView.communicationInstructorName}</strong>
                            </div>
                          )}
                          {planView.identityInstructorName && (
                            <div className="pv-inst-card">
                              <span className="cat-badge cat-identity small">해군정체성</span>
                              <strong>{planView.identityInstructorRank} {planView.identityInstructorName}</strong>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>

            {/* Footer */}
            <div className="pv-footer">
              <button
                className="pv-copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(planView.plan!)
                }}
              >
                전체 복사
              </button>
              <button className="pv-close-btn" onClick={() => setPlanView(null)}>닫기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
