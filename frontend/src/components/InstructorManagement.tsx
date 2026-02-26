import { useState, useEffect, useMemo, useRef } from 'react'
import { api } from '../services/api'
import type { Instructor, InstructorCreate, InstructorSchedule } from '../types'
import { PHOTO_MAP } from './InstructorInfo'

const EMPTY_FORM: InstructorCreate = {
  name: '', rank: '', specialty: '', phone: '', email: '',
  affiliation: '', educationTopic: '', availableRegion: '',
  rating: 0, recommendation: '추천', category: '해군정체성', notes: '',
  career: '', oneLineReview: '', conditions: '',
  deliveryScore: 0, expertiseScore: 0, interactionScore: 0, timeManagementScore: 0,
  strengths: '', weaknesses: ''
}

const CATEGORY_LABELS: Record<string, string> = {
  '해군정체성': '해군정체성',
  '안보': '안보(군인정신)',
  '소통': '소통',
}

const CATEGORY_KEYS: Record<string, string> = {
  '해군정체성': 'identity',
  '안보': 'security',
  '소통': 'communication',
}

export default function InstructorManagement() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<InstructorCreate>(EMPTY_FORM)
  const [filterCategory, setFilterCategory] = useState<string>('')

  // Detail panel
  const [selectedDetail, setSelectedDetail] = useState<Instructor | null>(null)

  // Calendar state
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null)
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date()
    return { year: d.getFullYear(), month: d.getMonth() }
  })
  const [schedules, setSchedules] = useState<InstructorSchedule[]>([])
  const [schedulesLoading, setSchedulesLoading] = useState(false)

  // Schedule add form
  const [showScheduleForm, setShowScheduleForm] = useState(false)
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleEndDate, setScheduleEndDate] = useState('')
  const [scheduleDesc, setScheduleDesc] = useState('')

  // Photo upload
  const photoInputRef = useRef<HTMLInputElement>(null)
  const [photoUploading, setPhotoUploading] = useState(false)

  const handlePhotoUpload = async (file: File) => {
    if (!selectedDetail) return
    setPhotoUploading(true)
    setError('')
    try {
      const updated = await api.uploadInstructorPhoto(selectedDetail.id, file)
      setSelectedDetail(updated)
      fetchInstructors()
      setSuccess('사진이 업로드되었습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '사진 업로드에 실패했습니다.')
    } finally {
      setPhotoUploading(false)
    }
  }

  const handlePhotoDelete = async () => {
    if (!selectedDetail || !confirm('사진을 삭제하시겠습니까?')) return
    setError('')
    try {
      const updated = await api.deleteInstructorPhoto(selectedDetail.id)
      setSelectedDetail(updated)
      fetchInstructors()
      setSuccess('사진이 삭제되었습니다.')
    } catch (err) {
      setError(err instanceof Error ? err.message : '사진 삭제에 실패했습니다.')
    }
  }

  const fetchInstructors = () => {
    api.getInstructors()
      .then(setInstructors)
      .catch(() => setError('강사 목록을 불러오는데 실패했습니다.'))
  }

  useEffect(() => { fetchInstructors() }, [])

  const filteredInstructors = useMemo(() => {
    if (!filterCategory) return instructors
    return instructors.filter(i => i.category === filterCategory)
  }, [instructors, filterCategory])

  // Fetch schedules when instructor or month changes
  useEffect(() => {
    if (!selectedInstructor) return
    const { year, month } = calendarMonth
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0)
    const startStr = start.toISOString().split('T')[0]
    const endStr = end.toISOString().split('T')[0]

    setSchedulesLoading(true)
    api.getSchedulesByInstructor(selectedInstructor.id, startStr, endStr)
      .then(setSchedules)
      .catch(() => setSchedules([]))
      .finally(() => setSchedulesLoading(false))
  }, [selectedInstructor, calendarMonth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      if (editingId) {
        await api.updateInstructor(editingId, form)
        setSuccess('강사 정보가 수정되었습니다.')
      } else {
        await api.createInstructor(form)
        setSuccess('새 강사가 등록되었습니다.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditingId(null)
      fetchInstructors()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    }
  }

  const handleEdit = (inst: Instructor) => {
    setForm({
      name: inst.name, rank: inst.rank, specialty: inst.specialty,
      phone: inst.phone || '', email: inst.email || '',
      affiliation: inst.affiliation || '', educationTopic: inst.educationTopic || '',
      availableRegion: inst.availableRegion || '', rating: inst.rating || 0,
      recommendation: inst.recommendation || '추천', category: inst.category || '해군정체성',
      notes: inst.notes || '',
      career: inst.career || '', oneLineReview: inst.oneLineReview || '',
      conditions: inst.conditions || '',
      deliveryScore: inst.deliveryScore || 0, expertiseScore: inst.expertiseScore || 0,
      interactionScore: inst.interactionScore || 0, timeManagementScore: inst.timeManagementScore || 0,
      strengths: inst.strengths || '', weaknesses: inst.weaknesses || ''
    })
    setEditingId(inst.id)
    setShowForm(true)
    setShowCalendar(false)
    setSelectedDetail(null)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await api.deleteInstructor(id)
      setSuccess('강사가 삭제되었습니다.')
      fetchInstructors()
    } catch {
      setError('삭제에 실패했습니다. 해당 강사의 교육 요청이 존재할 수 있습니다.')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const openCalendar = (inst: Instructor) => {
    setSelectedInstructor(inst)
    setShowCalendar(true)
    setShowForm(false)
    setSelectedDetail(null)
    setShowScheduleForm(false)
    setError('')
    setSuccess('')
  }

  const openDetail = (inst: Instructor) => {
    setSelectedDetail(inst)
    setShowCalendar(false)
    setShowForm(false)
    setError('')
    setSuccess('')
  }

  const renderPipeText = (text: string | null) => {
    if (!text) return <span className="text-muted">-</span>
    return text.split('|').map((line, i) => (
      <div key={i} className="pipe-line">{line.trim()}</div>
    ))
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return '#94a3b8'
    if (score >= 4) return '#16a34a'
    if (score >= 3) return '#ca8a04'
    return '#dc2626'
  }

  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInstructor || !scheduleDate || !scheduleDesc) return
    setError('')
    try {
      await api.createSchedule({
        instructorId: selectedInstructor.id,
        scheduleDate,
        endDate: scheduleEndDate || undefined,
        description: scheduleDesc,
      })
      setSuccess('일정이 추가되었습니다.')
      setShowScheduleForm(false)
      setScheduleDate('')
      setScheduleEndDate('')
      setScheduleDesc('')
      // Refresh schedules
      const { year, month } = calendarMonth
      const start = new Date(year, month, 1).toISOString().split('T')[0]
      const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
      api.getSchedulesByInstructor(selectedInstructor.id, start, end).then(setSchedules)
    } catch {
      setError('일정 추가에 실패했습니다.')
    }
  }

  const handleDeleteSchedule = async (scheduleId: number) => {
    if (!confirm('이 일정을 삭제하시겠습니까?')) return
    try {
      await api.deleteSchedule(scheduleId)
      setSuccess('일정이 삭제되었습니다.')
      if (selectedInstructor) {
        const { year, month } = calendarMonth
        const start = new Date(year, month, 1).toISOString().split('T')[0]
        const end = new Date(year, month + 1, 0).toISOString().split('T')[0]
        api.getSchedulesByInstructor(selectedInstructor.id, start, end).then(setSchedules)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '일정 삭제에 실패했습니다.')
    }
  }

  const prevMonth = () => {
    setCalendarMonth(prev => {
      if (prev.month === 0) return { year: prev.year - 1, month: 11 }
      return { ...prev, month: prev.month - 1 }
    })
  }

  const nextMonth = () => {
    setCalendarMonth(prev => {
      if (prev.month === 11) return { year: prev.year + 1, month: 0 }
      return { ...prev, month: prev.month + 1 }
    })
  }

  // Build calendar grid
  const calendarDays = useMemo(() => {
    const { year, month } = calendarMonth
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days: (number | null)[] = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let d = 1; d <= daysInMonth; d++) days.push(d)
    return days
  }, [calendarMonth])

  // Map schedules to days
  const scheduledDays = useMemo(() => {
    const map = new Map<number, InstructorSchedule[]>()
    const { year, month } = calendarMonth
    for (const s of schedules) {
      const start = new Date(s.scheduleDate)
      const end = s.endDate ? new Date(s.endDate) : start
      const d = new Date(start)
      while (d <= end) {
        if (d.getFullYear() === year && d.getMonth() === month) {
          const day = d.getDate()
          if (!map.has(day)) map.set(day, [])
          map.get(day)!.push(s)
        }
        d.setDate(d.getDate() + 1)
      }
    }
    return map
  }, [schedules, calendarMonth])

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return '#16a34a'
    if (rating >= 3) return '#ca8a04'
    return '#dc2626'
  }

  const getRecBadge = (rec: string) => {
    if (rec === '추천') return 'rec-good'
    if (rec === '비추천') return 'rec-bad'
    return 'rec-neutral'
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <h2>강사 관리</h2>
        <div className="header-info">
          <div className="category-tags">
            <button
              className={`cat-tag${filterCategory === '' ? ' active' : ''}`}
              onClick={() => setFilterCategory('')}
            >
              전체 <span className="cat-tag-count">{instructors.length}</span>
            </button>
            {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
              const count = instructors.filter(i => i.category === key).length
              return (
                <button
                  key={key}
                  className={`cat-tag cat-tag-${CATEGORY_KEYS[key]}${filterCategory === key ? ' active' : ''}`}
                  onClick={() => setFilterCategory(filterCategory === key ? '' : key)}
                >
                  {label} <span className="cat-tag-count">{count}</span>
                </button>
              )
            })}
          </div>
          <button className="add-btn" onClick={() => { setShowForm(true); setShowCalendar(false); setEditingId(null); setForm(EMPTY_FORM); }}>
            + 새 강사
          </button>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {/* Instructor Form */}
      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <h3>{editingId ? '강사 수정' : '새 강사 등록'}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>이름 *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label>직위/계급 *</label>
              <input required value={form.rank} onChange={e => setForm({...form, rank: e.target.value})} />
            </div>
            <div className="form-group">
              <label>교육 분야 *</label>
              <select required value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option value="해군정체성">해군정체성</option>
                <option value="안보">안보(군인정신)</option>
                <option value="소통">소통</option>
              </select>
            </div>
            <div className="form-group">
              <label>전문분야 *</label>
              <input required value={form.specialty} onChange={e => setForm({...form, specialty: e.target.value})} />
            </div>
            <div className="form-group">
              <label>소속</label>
              <input value={form.affiliation || ''} onChange={e => setForm({...form, affiliation: e.target.value})} />
            </div>
            <div className="form-group">
              <label>교육주제</label>
              <input value={form.educationTopic || ''} onChange={e => setForm({...form, educationTopic: e.target.value})} />
            </div>
            <div className="form-group">
              <label>가용지역</label>
              <input value={form.availableRegion || ''} onChange={e => setForm({...form, availableRegion: e.target.value})} />
            </div>
            <div className="form-group">
              <label>연락처</label>
              <input value={form.phone || ''} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div className="form-group">
              <label>이메일</label>
              <input value={form.email || ''} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group">
              <label>평점 (0~5)</label>
              <input type="number" min="0" max="5" step="0.25" value={form.rating || 0}
                onChange={e => setForm({...form, rating: parseFloat(e.target.value)})} />
            </div>
            <div className="form-group">
              <label>추천여부</label>
              <select value={form.recommendation || '추천'} onChange={e => setForm({...form, recommendation: e.target.value})}>
                <option value="추천">추천</option>
                <option value="보통">보통</option>
                <option value="비추천">비추천</option>
              </select>
            </div>
          </div>

          <fieldset className="venue-fieldset">
            <legend>경력/조건</legend>
            <div className="form-group">
              <label>경력</label>
              <textarea value={form.career || ''} onChange={e => setForm({...form, career: e.target.value})} rows={2} placeholder="| 로 구분하여 입력" />
            </div>
            <div className="form-group">
              <label>한줄평</label>
              <input value={form.oneLineReview || ''} onChange={e => setForm({...form, oneLineReview: e.target.value})} />
            </div>
            <div className="form-group">
              <label>강의조건</label>
              <textarea value={form.conditions || ''} onChange={e => setForm({...form, conditions: e.target.value})} rows={2} placeholder="| 로 구분하여 입력" />
            </div>
          </fieldset>

          <fieldset className="venue-fieldset">
            <legend>평가 점수</legend>
            <div className="form-grid">
              <div className="form-group">
                <label>전달력 (0~5)</label>
                <input type="number" min="0" max="5" step="0.25" value={form.deliveryScore || 0}
                  onChange={e => setForm({...form, deliveryScore: parseFloat(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>전문성 (0~5)</label>
                <input type="number" min="0" max="5" step="0.25" value={form.expertiseScore || 0}
                  onChange={e => setForm({...form, expertiseScore: parseFloat(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>상호작용 (0~5)</label>
                <input type="number" min="0" max="5" step="0.25" value={form.interactionScore || 0}
                  onChange={e => setForm({...form, interactionScore: parseFloat(e.target.value)})} />
              </div>
              <div className="form-group">
                <label>시간관리 (0~5)</label>
                <input type="number" min="0" max="5" step="0.25" value={form.timeManagementScore || 0}
                  onChange={e => setForm({...form, timeManagementScore: parseFloat(e.target.value)})} />
              </div>
            </div>
          </fieldset>

          <fieldset className="venue-fieldset">
            <legend>강점/약점</legend>
            <div className="form-group">
              <label>강점</label>
              <textarea value={form.strengths || ''} onChange={e => setForm({...form, strengths: e.target.value})} rows={2} placeholder="| 로 구분하여 입력" />
            </div>
            <div className="form-group">
              <label>약점</label>
              <textarea value={form.weaknesses || ''} onChange={e => setForm({...form, weaknesses: e.target.value})} rows={2} placeholder="| 로 구분하여 입력" />
            </div>
          </fieldset>

          <div className="form-group">
            <label>비고</label>
            <textarea value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} rows={2} />
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editingId ? '수정' : '등록'}</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
          </div>
        </form>
      )}

      {/* Instructor Detail Panel */}
      {selectedDetail && !showForm && !showCalendar && (
        <div className="venue-detail-panel">
          <div className="venue-detail-header">
            <h3>
              <span className={`cat-badge cat-${CATEGORY_KEYS[selectedDetail.category] || 'identity'}`}>
                {CATEGORY_LABELS[selectedDetail.category] || selectedDetail.category}
              </span>
              {selectedDetail.rank} {selectedDetail.name}
            </h3>
            <div className="venue-detail-actions">
              <button className="action-btn edit" onClick={() => openCalendar(selectedDetail)}>일정</button>
              <button className="action-btn edit" onClick={() => handleEdit(selectedDetail)}>수정</button>
              <button className="cancel-btn" onClick={() => setSelectedDetail(null)}>닫기</button>
            </div>
          </div>

          {/* Photo Section */}
          <div className="inst-photo-section">
            <div className="inst-photo-preview">
              {selectedDetail.photoUrl ? (
                <img src={`/api/instructors/${selectedDetail.id}/photo`} alt={selectedDetail.name} />
              ) : PHOTO_MAP[selectedDetail.name] ? (
                <img src={PHOTO_MAP[selectedDetail.name]} alt={selectedDetail.name} />
              ) : (
                <div className="inst-photo-empty">
                  <span>{selectedDetail.name.charAt(selectedDetail.name.length - 2)}{selectedDetail.name.charAt(selectedDetail.name.length - 1)}</span>
                </div>
              )}
            </div>
            <div className="inst-photo-actions">
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handlePhotoUpload(file)
                  e.target.value = ''
                }}
              />
              <button
                className="action-btn edit"
                disabled={photoUploading}
                onClick={() => photoInputRef.current?.click()}
              >
                {photoUploading ? '업로드 중...' : '사진 업로드'}
              </button>
              {selectedDetail.photoUrl && (
                <button className="action-btn reject" onClick={handlePhotoDelete}>사진 삭제</button>
              )}
            </div>
          </div>

          {selectedDetail.oneLineReview && (
            <div className="venue-summary">{selectedDetail.oneLineReview}</div>
          )}

          <div className="venue-detail-grid">
            {/* 기본 정보 */}
            <div className="venue-detail-section">
              <h4>기본 정보</h4>
              <dl>
                <dt>소속</dt><dd>{selectedDetail.affiliation || '-'}</dd>
                <dt>전문분야</dt><dd>{selectedDetail.specialty}</dd>
                <dt>교육주제</dt><dd>{selectedDetail.educationTopic || '-'}</dd>
                <dt>가용지역</dt><dd>{selectedDetail.availableRegion || '-'}</dd>
                <dt>연락처</dt><dd>{selectedDetail.phone || '-'}</dd>
                <dt>이메일</dt><dd>{selectedDetail.email || '-'}</dd>
                <dt>추천여부</dt><dd><span className={`rec-badge ${getRecBadge(selectedDetail.recommendation || '')}`}>{selectedDetail.recommendation || '-'}</span></dd>
              </dl>
            </div>

            {/* 평가 점수 */}
            <div className="venue-detail-section">
              <h4>평가 점수</h4>
              <dl>
                <dt>종합평점</dt>
                <dd>
                  <span className="rating-badge" style={{ color: getRatingColor(selectedDetail.rating || 0) }}>
                    {selectedDetail.rating ? selectedDetail.rating.toFixed(2) : '-'}
                  </span>
                </dd>
                <dt>전달력</dt>
                <dd>
                  <span style={{ color: getScoreColor(selectedDetail.deliveryScore), fontWeight: 600 }}>
                    {selectedDetail.deliveryScore ? selectedDetail.deliveryScore.toFixed(2) : '-'}
                  </span>
                </dd>
                <dt>전문성</dt>
                <dd>
                  <span style={{ color: getScoreColor(selectedDetail.expertiseScore), fontWeight: 600 }}>
                    {selectedDetail.expertiseScore ? selectedDetail.expertiseScore.toFixed(2) : '-'}
                  </span>
                </dd>
                <dt>상호작용</dt>
                <dd>
                  <span style={{ color: getScoreColor(selectedDetail.interactionScore), fontWeight: 600 }}>
                    {selectedDetail.interactionScore ? selectedDetail.interactionScore.toFixed(2) : '-'}
                  </span>
                </dd>
                <dt>시간관리</dt>
                <dd>
                  <span style={{ color: getScoreColor(selectedDetail.timeManagementScore), fontWeight: 600 }}>
                    {selectedDetail.timeManagementScore ? selectedDetail.timeManagementScore.toFixed(2) : '-'}
                  </span>
                </dd>
              </dl>
            </div>

            {/* 경력 */}
            <div className="venue-detail-section">
              <h4>경력</h4>
              <div className="detail-text">{renderPipeText(selectedDetail.career)}</div>
            </div>

            {/* 강의조건 */}
            <div className="venue-detail-section">
              <h4>강의조건</h4>
              <div className="detail-text">{renderPipeText(selectedDetail.conditions)}</div>
            </div>

            {/* 강점 */}
            <div className="venue-detail-section">
              <h4>강점</h4>
              <div className="detail-text">{renderPipeText(selectedDetail.strengths)}</div>
            </div>

            {/* 약점 */}
            <div className="venue-detail-section">
              <h4>약점</h4>
              <div className="detail-text">{renderPipeText(selectedDetail.weaknesses)}</div>
            </div>
          </div>

          {selectedDetail.notes && (
            <div className="venue-summary" style={{ marginTop: 16, borderLeftColor: '#64748b' }}>
              <strong>비고:</strong> {selectedDetail.notes}
            </div>
          )}
        </div>
      )}

      {/* Calendar View */}
      {showCalendar && selectedInstructor && (
        <div className="calendar-panel">
          <div className="calendar-header-bar">
            <h3>
              <span className={`cat-badge cat-${CATEGORY_KEYS[selectedInstructor.category] || 'identity'}`}>
                {CATEGORY_LABELS[selectedInstructor.category] || selectedInstructor.category}
              </span>
              {selectedInstructor.rank} {selectedInstructor.name} 일정
            </h3>
            <div className="calendar-actions">
              <button className="add-btn" onClick={() => setShowScheduleForm(!showScheduleForm)}>
                + 일정 추가
              </button>
              <button className="cancel-btn" onClick={() => { setShowCalendar(false); setSelectedInstructor(null); }}>
                닫기
              </button>
            </div>
          </div>

          {/* Schedule Add Form */}
          {showScheduleForm && (
            <form className="schedule-add-form" onSubmit={handleAddSchedule}>
              <div className="form-row">
                <div className="form-group form-group-flex">
                  <label>시작일 *</label>
                  <input type="date" required value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                </div>
                <div className="form-group form-group-flex">
                  <label>종료일</label>
                  <input type="date" value={scheduleEndDate} min={scheduleDate} onChange={e => setScheduleEndDate(e.target.value)} />
                </div>
                <div className="form-group form-group-flex">
                  <label>설명 *</label>
                  <input required value={scheduleDesc} onChange={e => setScheduleDesc(e.target.value)} placeholder="일정 내용" />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-btn">추가</button>
                <button type="button" className="cancel-btn" onClick={() => setShowScheduleForm(false)}>취소</button>
              </div>
            </form>
          )}

          {/* Calendar */}
          <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={prevMonth}>&lt;</button>
            <span className="cal-month-label">
              {calendarMonth.year}년 {calendarMonth.month + 1}월
            </span>
            <button className="cal-nav-btn" onClick={nextMonth}>&gt;</button>
          </div>

          {schedulesLoading ? (
            <div className="loading">일정 불러오는 중...</div>
          ) : (
            <div className="calendar-grid">
              {['일', '월', '화', '수', '목', '금', '토'].map(d => (
                <div key={d} className="cal-header-cell">{d}</div>
              ))}
              {calendarDays.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} className="cal-cell empty" />
                const daySchedules = scheduledDays.get(day) || []
                const hasSchedule = daySchedules.length > 0
                const today = new Date()
                const isToday = today.getFullYear() === calendarMonth.year
                  && today.getMonth() === calendarMonth.month
                  && today.getDate() === day

                return (
                  <div key={day} className={`cal-cell${hasSchedule ? ' has-schedule' : ''}${isToday ? ' today' : ''}`}>
                    <div className="cal-day-number">{day}</div>
                    {daySchedules.map((s, si) => (
                      <div
                        key={`${s.id}-${si}`}
                        className={`cal-event ${s.source === 'REQUEST' ? 'cal-event-request' : 'cal-event-manual'}`}
                        title={`${s.description} (${s.source === 'REQUEST' ? '요청' : '수동'})`}
                      >
                        {s.description.length > 8 ? s.description.slice(0, 8) + '…' : s.description}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          )}

          {/* Schedule List */}
          {schedules.length > 0 && (
            <div className="schedule-list">
              <h4>{calendarMonth.year}년 {calendarMonth.month + 1}월 일정 목록</h4>
              <table>
                <thead>
                  <tr>
                    <th>날짜</th>
                    <th>설명</th>
                    <th>유형</th>
                    <th>관리</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map(s => (
                    <tr key={s.id}>
                      <td>
                        {s.scheduleDate}
                        {s.endDate && <> ~ {s.endDate}</>}
                      </td>
                      <td>{s.description}</td>
                      <td>
                        <span className={`source-badge ${s.source === 'REQUEST' ? 'source-request' : 'source-manual'}`}>
                          {s.source === 'REQUEST' ? '교육요청' : '수동입력'}
                        </span>
                      </td>
                      <td className="actions">
                        {s.source === 'MANUAL' ? (
                          <button className="action-btn reject" onClick={() => handleDeleteSchedule(s.id)}>삭제</button>
                        ) : (
                          <span className="text-muted">요청관리에서 처리</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Instructor Table */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>분야</th>
              <th>이름</th>
              <th>직위</th>
              <th>소속</th>
              <th>전문분야</th>
              <th>평점</th>
              <th>추천</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {filteredInstructors.map(inst => (
              <tr key={inst.id} className="venue-row-clickable" onClick={() => openDetail(inst)}>
                <td>
                  <span className={`cat-badge cat-${CATEGORY_KEYS[inst.category] || 'identity'}`}>
                    {CATEGORY_LABELS[inst.category] || inst.category}
                  </span>
                </td>
                <td><strong>{inst.name}</strong></td>
                <td>{inst.rank}</td>
                <td>{inst.affiliation || '-'}</td>
                <td>{inst.specialty}</td>
                <td>
                  <span className="rating-badge" style={{ color: getRatingColor(inst.rating || 0) }}>
                    {inst.rating ? inst.rating.toFixed(2) : '-'}
                  </span>
                </td>
                <td>
                  <span className={`rec-badge ${getRecBadge(inst.recommendation || '')}`}>
                    {inst.recommendation || '-'}
                  </span>
                </td>
                <td className="actions">
                  <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); openCalendar(inst); }}>일정</button>
                  <button className="action-btn edit" onClick={(e) => { e.stopPropagation(); handleEdit(inst); }}>수정</button>
                  <button className="action-btn reject" onClick={(e) => { e.stopPropagation(); handleDelete(inst.id); }}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
