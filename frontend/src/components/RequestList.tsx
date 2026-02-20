import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { TrainingRequest } from '../types'

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중',
  APPROVED: '승인',
  REJECTED: '반려',
  CANCELLED: '취소',
}

interface RequestListProps {
  userId: number
  refreshKey: number
}

export default function RequestList({ userId, refreshKey }: RequestListProps) {
  const [requests, setRequests] = useState<TrainingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    api
      .getRequests(userId)
      .then(setRequests)
      .catch(() => setError('요청 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [userId, refreshKey])

  if (loading) return <div className="loading">불러오는 중...</div>
  if (error) return <div className="message error">{error}</div>

  return (
    <div className="request-list">
      <h2>내 요청 목록</h2>
      {requests.length === 0 ? (
        <p className="empty">등록된 요청이 없습니다.</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>번호</th>
                <th>장소</th>
                <th>교육형태</th>
                <th>소속</th>
                <th>교육 일시</th>
                <th>상태</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td>{req.id}</td>
                  <td>
                    {req.venueName} ({req.venueRoomNumber})
                    {req.secondVenueName && (
                      <><br /><small>보조: {req.secondVenueName} ({req.secondVenueRoomNumber})</small></>
                    )}
                  </td>
                  <td>{req.trainingType}</td>
                  <td>{req.fleet}</td>
                  <td>
                    {req.requestDate}
                    {req.requestEndDate && <> ~ {req.requestEndDate}</>}
                    {req.startTime && <><br /><small>{req.startTime}</small></>}
                  </td>
                  <td>
                    <span className={`status ${req.status.toLowerCase()}`}>
                      {STATUS_LABELS[req.status] || req.status}
                    </span>
                  </td>
                  <td>{req.notes || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
