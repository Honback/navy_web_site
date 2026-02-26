import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { User, Venue } from '../types'

const FLEETS = ['1함대', '2함대', '3함대', '작전사', '진기사', '교육사']

interface RequestFormProps {
  userId: number
  user?: User
  onSubmitSuccess: () => void
}

export default function RequestForm({ userId, user, onSubmitSuccess }: RequestFormProps) {
  const [venues, setVenues] = useState<Venue[]>([])
  const [trainingType, setTrainingType] = useState('1일집중형')
  const [fleet, setFleet] = useState(user?.fleet || '')
  const [ship, setShip] = useState(user?.ship || '')
  const [requestDate, setRequestDate] = useState('')
  const [requestEndDate, setRequestEndDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [venueId, setVenueId] = useState('')
  const [secondVenueId, setSecondVenueId] = useState('')
  const [participantCount, setParticipantCount] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [bookedVenueIds, setBookedVenueIds] = useState<number[]>([])
  const [availabilityLoading, setAvailabilityLoading] = useState(false)

  const is2Day = trainingType === '1박2일합숙형'

  useEffect(() => {
    api.getVenues()
      .then(setVenues)
      .catch(() => setError('데이터를 불러오는데 실패했습니다.'))
  }, [])

  useEffect(() => {
    if (!is2Day) setRequestEndDate('')
  }, [is2Day])

  useEffect(() => {
    if (is2Day && requestDate) {
      const next = new Date(requestDate)
      next.setDate(next.getDate() + 1)
      setRequestEndDate(next.toISOString().split('T')[0])
    }
  }, [requestDate, is2Day])

  useEffect(() => {
    if (!requestDate) {
      setBookedVenueIds([])
      return
    }
    setAvailabilityLoading(true)
    api.getAvailability(requestDate)
      .then((data) => {
        setBookedVenueIds(data.bookedVenueIds)
      })
      .catch(() => { /* ignore */ })
      .finally(() => setAvailabilityLoading(false))
  }, [requestDate])

  useEffect(() => {
    if (bookedVenueIds.includes(Number(venueId))) setVenueId('')
    if (bookedVenueIds.includes(Number(secondVenueId))) setSecondVenueId('')
  }, [bookedVenueIds])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!venueId || !requestDate || !fleet) {
      setError('교육 날짜, 장소, 소속 함대는 필수입니다.')
      return
    }

    if (is2Day && !requestEndDate) {
      setError('1박2일 합숙형은 종료일을 선택해야 합니다.')
      return
    }

    setLoading(true)
    try {
      await api.createRequest({
        userId,
        venueId: Number(venueId),
        secondVenueId: secondVenueId ? Number(secondVenueId) : undefined,
        trainingType,
        fleet,
        ship: ship || undefined,
        requestDate,
        requestEndDate: is2Day ? requestEndDate : undefined,
        startTime: startTime || undefined,
        participantCount: participantCount ? Number(participantCount) : undefined,
        notes: notes || undefined,
      })
      setSuccess('교육 요청이 성공적으로 등록되었습니다.')
      setTrainingType('1일집중형')
      setFleet(user?.fleet || '')
      setShip(user?.ship || '')
      setRequestDate('')
      setRequestEndDate('')
      setStartTime('')
      setParticipantCount('')
      setVenueId('')
      setSecondVenueId('')
      setNotes('')
      onSubmitSuccess()
    } catch {
      setError('요청 등록에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const dateSelected = requestDate.length > 0

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <h2>교육 일정 요청</h2>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {/* 교육 정보 */}
      <div className="form-section">
        <div className="form-section-title">교육 정보</div>
        <div className="form-group">
          <label htmlFor="trainingType">교육형태 *</label>
          <select id="trainingType" value={trainingType} onChange={(e) => setTrainingType(e.target.value)}>
            <option value="1일집중형">1일 집중형</option>
            <option value="1박2일합숙형">1박2일 합숙형</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="fleet">소속 함대 *</label>
          <select id="fleet" value={fleet} onChange={(e) => { setFleet(e.target.value); setShip('') }}>
            <option value="">-- 소속 함대를 선택하세요 --</option>
            {FLEETS.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
        </div>
        {fleet && (
          <div className="form-group">
            <label htmlFor="ship">소속 함정</label>
            <input id="ship" value={ship} onChange={(e) => setShip(e.target.value)} placeholder="함정명 (본부는 비워두세요)" />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="participantCount">참여 인원</label>
          <input
            type="number"
            id="participantCount"
            value={participantCount}
            onChange={(e) => setParticipantCount(e.target.value)}
            placeholder="예: 80"
            min="1"
            max="9999"
          />
          <span className="form-hint">행사 시작 2주 전까지 참여 인원 확정이 필요합니다.</span>
        </div>
      </div>

      {/* 교육 일시 */}
      <div className="form-section">
        <div className="form-section-title">교육 일시</div>
        <div className="form-row">
          <div className="form-group form-group-flex">
            <label htmlFor="date">{is2Day ? '시작일 *' : '교육 날짜 *'}</label>
            <input type="date" id="date" value={requestDate} onChange={(e) => setRequestDate(e.target.value)} />
          </div>
          {is2Day && (
            <div className="form-group form-group-flex">
              <label htmlFor="endDate">종료일 *</label>
              <input type="date" id="endDate" value={requestEndDate} min={requestDate} onChange={(e) => setRequestEndDate(e.target.value)} />
            </div>
          )}
          <div className="form-group form-group-flex">
            <label htmlFor="startTime">시작 시간</label>
            <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
        </div>
        {availabilityLoading && <span className="availability-hint loading">일정 확인 중...</span>}
        {dateSelected && !availabilityLoading && bookedVenueIds.length > 0 && (
          <span className="availability-hint">해당 날짜에 예약된 장소가 있습니다.</span>
        )}
      </div>

      {/* 장소 선택 */}
      <div className="form-section">
        <div className="form-section-title">장소 선택</div>

        <div className="form-group">
          <label htmlFor="venue">
            <span className="choice-label">주 교육장</span>장소 *
          </label>
          <select id="venue" value={venueId} onChange={(e) => setVenueId(e.target.value)} disabled={!dateSelected}>
            <option value="">{dateSelected ? '-- 장소를 선택하세요 --' : '-- 먼저 날짜를 선택하세요 --'}</option>
            {venues.map((v) => {
              const isBooked = bookedVenueIds.includes(v.id)
              const isSecond = v.id === Number(secondVenueId)
              return (
                <option key={v.id} value={v.id} disabled={isBooked || isSecond}>
                  {v.name} ({v.building} {v.roomNumber}, {v.capacity}명){isBooked ? ' [예약됨]' : ''}
                </option>
              )
            })}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="secondVenue">
            <span className="choice-label second">보조 교육장</span>장소 (선택)
          </label>
          <select id="secondVenue" value={secondVenueId} onChange={(e) => setSecondVenueId(e.target.value)} disabled={!dateSelected}>
            <option value="">-- 선택 안 함 --</option>
            {venues.map((v) => {
              const isBooked = bookedVenueIds.includes(v.id)
              const isFirst = v.id === Number(venueId)
              return (
                <option key={v.id} value={v.id} disabled={isBooked || isFirst}>
                  {v.name} ({v.building} {v.roomNumber}, {v.capacity}명){isBooked ? ' [예약됨]' : ''}
                </option>
              )
            })}
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">비고</label>
        <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="추가 요청사항을 입력하세요" rows={3} />
      </div>

      <button type="submit" className="submit-btn" disabled={loading}>
        {loading ? '처리 중...' : '요청 제출'}
      </button>
    </form>
  )
}
