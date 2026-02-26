import React, { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Venue, VenueCreate, VenueContact, VenueContactCreate, VenueRoom, VenueRoomCreate } from '../types'

const EMPTY_CONTACT: VenueContactCreate = {
  venueId: 0, name: '', role: '', phone: '', email: '', preferredContact: '', notes: ''
}

const EMPTY_ROOM: VenueRoomCreate = {
  venueId: 0, name: '', capacity: 0, hasProjector: false, hasMicrophone: false,
  hasWhiteboard: false, bannerSize: '', podiumSize: '', deskLayout: '', notes: ''
}

const EMPTY_FORM: VenueCreate = {
  name: '', address: '', building: '', roomNumber: '', capacity: 0,
  region: '', lectureCapacity: 0, accommodationCapacity: 0,
  mealCost: '', overallRating: '', notes: '',
  website: '', reservationContact: '', summary: '', lectureRooms: '',
  usageFee: '', bannerSize: '', deskLayout: '', roomStatus: '',
  roomAmenities: '', personalItems: '', convenienceFacilities: '',
  restaurantContact: '', reservationRules: '', importantTips: '',
  subFacilities: '', evaluation: '', surveyImages: ''
}

export default function VenueManagement() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<VenueCreate>(EMPTY_FORM)
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)

  // Venue contacts state
  const [venueContacts, setVenueContacts] = useState<VenueContact[]>([])
  const [contactLoading, setContactLoading] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [editingContactId, setEditingContactId] = useState<number | null>(null)
  const [contactForm, setContactForm] = useState<VenueContactCreate>(EMPTY_CONTACT)

  // Venue rooms state (detail panel)
  const [venueRooms, setVenueRooms] = useState<VenueRoom[]>([])
  const [roomLoading, setRoomLoading] = useState(false)
  const [showRoomForm, setShowRoomForm] = useState(false)
  const [editingRoomId, setEditingRoomId] = useState<number | null>(null)
  const [roomForm, setRoomForm] = useState<VenueRoomCreate>(EMPTY_ROOM)
  const [expandedRoomId, setExpandedRoomId] = useState<number | null>(null)

  // Inline room toggle in table
  const [toggledVenueId, setToggledVenueId] = useState<number | null>(null)
  const [toggledRooms, setToggledRooms] = useState<Record<number, VenueRoom[]>>({})
  const [toggledLoading, setToggledLoading] = useState<number | null>(null)

  const fetchVenues = () => {
    api.getVenues()
      .then(setVenues)
      .catch(() => setError('장소 목록을 불러오는데 실패했습니다.'))
  }

  useEffect(() => { fetchVenues() }, [])

  const loadContacts = (venueId: number) => {
    setContactLoading(true)
    api.getVenueContactsByVenue(venueId)
      .then(setVenueContacts)
      .catch(() => setVenueContacts([]))
      .finally(() => setContactLoading(false))
  }

  const loadRooms = (venueId: number) => {
    setRoomLoading(true)
    api.getVenueRoomsByVenue(venueId)
      .then(setVenueRooms)
      .catch(() => setVenueRooms([]))
      .finally(() => setRoomLoading(false))
  }

  const handleSelectVenue = (v: Venue) => {
    setSelectedVenue(v)
    loadContacts(v.id)
    loadRooms(v.id)
    setShowContactForm(false)
    setEditingContactId(null)
    setShowRoomForm(false)
    setEditingRoomId(null)
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactForm.name.trim() || !selectedVenue) return
    const data = { ...contactForm, venueId: selectedVenue.id }
    try {
      if (editingContactId) {
        await api.updateVenueContact(editingContactId, data)
        setSuccess('담당자 정보가 수정되었습니다.')
      } else {
        await api.createVenueContact(data)
        setSuccess('담당자가 등록되었습니다.')
      }
      setShowContactForm(false)
      setEditingContactId(null)
      setContactForm(EMPTY_CONTACT)
      loadContacts(selectedVenue.id)
    } catch {
      setError('담당자 저장에 실패했습니다.')
    }
  }

  const handleContactEdit = (c: VenueContact) => {
    setContactForm({
      venueId: c.venueId, name: c.name, role: c.role || '',
      phone: c.phone || '', email: c.email || '',
      preferredContact: c.preferredContact || '', notes: c.notes || ''
    })
    setEditingContactId(c.id)
    setShowContactForm(true)
  }

  const handleContactDelete = async (id: number) => {
    if (!confirm('담당자를 삭제하시겠습니까?')) return
    try {
      await api.deleteVenueContact(id)
      setSuccess('담당자가 삭제되었습니다.')
      if (selectedVenue) loadContacts(selectedVenue.id)
    } catch {
      setError('담당자 삭제에 실패했습니다.')
    }
  }

  const handleRoomSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!roomForm.name.trim() || !selectedVenue) return
    const data = { ...roomForm, venueId: selectedVenue.id }
    try {
      if (editingRoomId) {
        await api.updateVenueRoom(editingRoomId, data)
        setSuccess('강의실 정보가 수정되었습니다.')
      } else {
        await api.createVenueRoom(data)
        setSuccess('강의실이 등록되었습니다.')
      }
      setShowRoomForm(false)
      setEditingRoomId(null)
      setRoomForm(EMPTY_ROOM)
      loadRooms(selectedVenue.id)
    } catch {
      setError('강의실 저장에 실패했습니다.')
    }
  }

  const handleRoomEdit = (r: VenueRoom) => {
    setRoomForm({
      venueId: r.venueId, name: r.name, capacity: r.capacity || 0,
      hasProjector: r.hasProjector || false, hasMicrophone: r.hasMicrophone || false,
      hasWhiteboard: r.hasWhiteboard || false, bannerSize: r.bannerSize || '',
      podiumSize: r.podiumSize || '', deskLayout: r.deskLayout || '', notes: r.notes || ''
    })
    setEditingRoomId(r.id)
    setShowRoomForm(true)
  }

  const handleRoomDelete = async (id: number) => {
    if (!confirm('강의실을 삭제하시겠습니까?')) return
    try {
      await api.deleteVenueRoom(id)
      setSuccess('강의실이 삭제되었습니다.')
      if (selectedVenue) loadRooms(selectedVenue.id)
    } catch {
      setError('강의실 삭제에 실패했습니다.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      if (editingId) {
        await api.updateVenue(editingId, form)
        setSuccess('장소 정보가 수정되었습니다.')
      } else {
        await api.createVenue(form)
        setSuccess('새 장소가 등록되었습니다.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditingId(null)
      setSelectedVenue(null)
      fetchVenues()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    }
  }

  const handleEdit = (v: Venue) => {
    setForm({
      name: v.name, address: v.address || '', building: v.building || '',
      roomNumber: v.roomNumber || '', capacity: v.capacity || 0,
      region: v.region || '', lectureCapacity: v.lectureCapacity || 0,
      accommodationCapacity: v.accommodationCapacity || 0,
      mealCost: v.mealCost || '', overallRating: v.overallRating || '',
      notes: v.notes || '', website: v.website || '',
      reservationContact: v.reservationContact || '', summary: v.summary || '',
      lectureRooms: v.lectureRooms || '', usageFee: v.usageFee || '',
      bannerSize: v.bannerSize || '', deskLayout: v.deskLayout || '',
      roomStatus: v.roomStatus || '', roomAmenities: v.roomAmenities || '',
      personalItems: v.personalItems || '',
      convenienceFacilities: v.convenienceFacilities || '',
      restaurantContact: v.restaurantContact || '',
      reservationRules: v.reservationRules || '',
      importantTips: v.importantTips || '', subFacilities: v.subFacilities || '',
      evaluation: v.evaluation || '', surveyImages: v.surveyImages || ''
    })
    setEditingId(v.id)
    setShowForm(true)
    setSelectedVenue(null)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await api.deleteVenue(id)
      setSuccess('장소가 삭제되었습니다.')
      if (selectedVenue?.id === id) setSelectedVenue(null)
      fetchVenues()
    } catch {
      setError('삭제에 실패했습니다. 해당 장소의 교육 요청이 존재할 수 있습니다.')
    }
  }

  const handleToggleRooms = (venueId: number) => {
    if (toggledVenueId === venueId) {
      setToggledVenueId(null)
      return
    }
    setToggledVenueId(venueId)
    if (toggledRooms[venueId]) return // already cached
    setToggledLoading(venueId)
    api.getVenueRoomsByVenue(venueId)
      .then(rooms => setToggledRooms(prev => ({ ...prev, [venueId]: rooms })))
      .catch(() => setToggledRooms(prev => ({ ...prev, [venueId]: [] })))
      .finally(() => setToggledLoading(null))
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  const getRatingBadge = (rating: string) => {
    if (rating === '상') return 'rating-high'
    if (rating === '중상') return 'rating-mid-high'
    if (rating === '중') return 'rating-mid'
    return 'rating-low'
  }

  const renderPipeText = (text: string | null) => {
    if (!text) return '-'
    return text.split('|').map((s, i) => (
      <div key={i} className="pipe-line">{s.trim()}</div>
    ))
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <h2>장소 관리</h2>
        <div className="header-info">
          <span className="count-badge">총 {venues.length}곳</span>
          <button className="add-btn" onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); setSelectedVenue(null); }}>
            + 새 장소
          </button>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {/* Edit / Create Form */}
      {showForm && (
        <form className="management-form venue-form-expanded" onSubmit={handleSubmit}>
          <h3>{editingId ? '장소 수정' : '새 장소 등록'}</h3>

          <fieldset className="venue-fieldset">
            <legend>기본 정보</legend>
            <div className="form-grid">
              <div className="form-group"><label>시설명 *</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
              <div className="form-group"><label>지역</label>
                <input value={form.region || ''} onChange={e => setForm({...form, region: e.target.value})} /></div>
              <div className="form-group"><label>주소</label>
                <input value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} /></div>
              <div className="form-group"><label>시설유형</label>
                <input value={form.building || ''} onChange={e => setForm({...form, building: e.target.value})} /></div>
              <div className="form-group"><label>주 강의실</label>
                <input value={form.roomNumber || ''} onChange={e => setForm({...form, roomNumber: e.target.value})} /></div>
              <div className="form-group"><label>총 수용인원 *</label>
                <input type="number" required min="0" value={form.capacity}
                  onChange={e => setForm({...form, capacity: parseInt(e.target.value) || 0})} /></div>
              <div className="form-group"><label>강의장 수용</label>
                <input type="number" min="0" value={form.lectureCapacity || 0}
                  onChange={e => setForm({...form, lectureCapacity: parseInt(e.target.value) || 0})} /></div>
              <div className="form-group"><label>숙소 수용</label>
                <input type="number" min="0" value={form.accommodationCapacity || 0}
                  onChange={e => setForm({...form, accommodationCapacity: parseInt(e.target.value) || 0})} /></div>
              <div className="form-group"><label>웹사이트</label>
                <input value={form.website || ''} onChange={e => setForm({...form, website: e.target.value})} placeholder="https://" /></div>
              <div className="form-group"><label>예약문의</label>
                <input value={form.reservationContact || ''} onChange={e => setForm({...form, reservationContact: e.target.value})} /></div>
              <div className="form-group"><label>평가등급</label>
                <select value={form.overallRating || ''} onChange={e => setForm({...form, overallRating: e.target.value})}>
                  <option value="">선택</option>
                  <option value="상">상</option><option value="중상">중상</option>
                  <option value="보통">보통</option><option value="중">중</option><option value="하">하</option>
                </select></div>
            </div>
            <div className="form-group"><label>한줄요약</label>
              <input value={form.summary || ''} onChange={e => setForm({...form, summary: e.target.value})} /></div>
          </fieldset>

          <fieldset className="venue-fieldset">
            <legend>강의실 / 비용</legend>
            <div className="form-group"><label>강의실 정보</label>
              <textarea value={form.lectureRooms || ''} onChange={e => setForm({...form, lectureRooms: e.target.value})} rows={3} placeholder="강의실명: 수용인원, 사용료 | 구분은 | 로" /></div>
            <div className="form-group"><label>사용료 정보</label>
              <textarea value={form.usageFee || ''} onChange={e => setForm({...form, usageFee: e.target.value})} rows={3} placeholder="강의실/숙박/식사 비용 | 구분은 | 로" /></div>
            <div className="form-grid">
              <div className="form-group"><label>식비</label>
                <input value={form.mealCost || ''} onChange={e => setForm({...form, mealCost: e.target.value})} /></div>
              <div className="form-group"><label>현수막 사이즈</label>
                <input value={form.bannerSize || ''} onChange={e => setForm({...form, bannerSize: e.target.value})} /></div>
              <div className="form-group"><label>책상배치</label>
                <input value={form.deskLayout || ''} onChange={e => setForm({...form, deskLayout: e.target.value})} /></div>
            </div>
          </fieldset>

          <fieldset className="venue-fieldset">
            <legend>숙박 / 비품</legend>
            <div className="form-group"><label>객실 현황</label>
              <textarea value={form.roomStatus || ''} onChange={e => setForm({...form, roomStatus: e.target.value})} rows={2} /></div>
            <div className="form-group"><label>구비 비품</label>
              <textarea value={form.roomAmenities || ''} onChange={e => setForm({...form, roomAmenities: e.target.value})} rows={2} /></div>
            <div className="form-group"><label>개인 준비물</label>
              <textarea value={form.personalItems || ''} onChange={e => setForm({...form, personalItems: e.target.value})} rows={2} /></div>
          </fieldset>

          <fieldset className="venue-fieldset">
            <legend>편의시설 / 부대시설</legend>
            <div className="form-group"><label>편의시설</label>
              <textarea value={form.convenienceFacilities || ''} onChange={e => setForm({...form, convenienceFacilities: e.target.value})} rows={2} /></div>
            <div className="form-group"><label>부대시설 (체험/음주/흡연/주차 등)</label>
              <textarea value={form.subFacilities || ''} onChange={e => setForm({...form, subFacilities: e.target.value})} rows={3} placeholder="체험: ... | 음주: ... | 흡연: ... | 주차: ..." /></div>
            <div className="form-grid">
              <div className="form-group"><label>식당 연락처</label>
                <input value={form.restaurantContact || ''} onChange={e => setForm({...form, restaurantContact: e.target.value})} /></div>
            </div>
          </fieldset>

          <fieldset className="venue-fieldset">
            <legend>예약 / 팁 / 평가</legend>
            <div className="form-group"><label>예약 규정</label>
              <textarea value={form.reservationRules || ''} onChange={e => setForm({...form, reservationRules: e.target.value})} rows={2} /></div>
            <div className="form-group"><label>중요 팁</label>
              <textarea value={form.importantTips || ''} onChange={e => setForm({...form, importantTips: e.target.value})} rows={3} /></div>
            <div className="form-group"><label>종합평가 (장점/유의사항)</label>
              <textarea value={form.evaluation || ''} onChange={e => setForm({...form, evaluation: e.target.value})} rows={3} /></div>
            <div className="form-group"><label>답사 이미지 URL</label>
              <input value={form.surveyImages || ''} onChange={e => setForm({...form, surveyImages: e.target.value})} /></div>
            <div className="form-group"><label>비고</label>
              <textarea value={form.notes || ''} onChange={e => setForm({...form, notes: e.target.value})} rows={2} /></div>
          </fieldset>

          <div className="form-actions">
            <button type="submit" className="submit-btn">{editingId ? '수정' : '등록'}</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
          </div>
        </form>
      )}

      {/* Venue Detail Panel */}
      {selectedVenue && !showForm && (
        <div className="venue-detail-panel">
          <div className="venue-detail-header">
            <h3>{selectedVenue.name}
              {selectedVenue.overallRating && (
                <span className={`venue-rating ${getRatingBadge(selectedVenue.overallRating)}`}>
                  {selectedVenue.overallRating}
                </span>
              )}
            </h3>
            <div className="venue-detail-actions">
              <button className="action-btn edit" onClick={() => handleEdit(selectedVenue)}>수정</button>
              <button className="action-btn reject" onClick={() => handleDelete(selectedVenue.id)}>삭제</button>
              <button className="action-btn" onClick={() => setSelectedVenue(null)}>닫기</button>
            </div>
          </div>
          {selectedVenue.summary && <p className="venue-summary">{selectedVenue.summary}</p>}

          <div className="venue-detail-grid">
            <div className="venue-detail-section">
              <h4>기본 정보</h4>
              <dl>
                <dt>주소</dt><dd>{selectedVenue.address || '-'}</dd>
                <dt>지역</dt><dd>{selectedVenue.region || '-'}</dd>
                <dt>시설유형</dt><dd>{selectedVenue.building || '-'}</dd>
                <dt>주 강의실</dt><dd>{selectedVenue.roomNumber || '-'}</dd>
                <dt>총 수용</dt><dd>{selectedVenue.capacity}명</dd>
                <dt>강의장</dt><dd>{selectedVenue.lectureCapacity ? `${selectedVenue.lectureCapacity}명` : '-'}</dd>
                <dt>숙소</dt><dd>{selectedVenue.accommodationCapacity ? `${selectedVenue.accommodationCapacity}명` : '-'}</dd>
                {selectedVenue.website && <><dt>웹사이트</dt><dd><a href={selectedVenue.website} target="_blank" rel="noopener noreferrer">{selectedVenue.website}</a></dd></>}
                {selectedVenue.reservationContact && <><dt>예약문의</dt><dd>{selectedVenue.reservationContact}</dd></>}
                {selectedVenue.surveyImages && <><dt>답사 이미지</dt><dd><a href={selectedVenue.surveyImages} target="_blank" rel="noopener noreferrer">보기</a></dd></>}
              </dl>
            </div>

            <div className="venue-detail-section">
              <h4>강의실 정보</h4>
              <div className="detail-text">{renderPipeText(selectedVenue.lectureRooms)}</div>
              {selectedVenue.bannerSize && <><strong>현수막:</strong> {selectedVenue.bannerSize}<br/></>}
              {selectedVenue.deskLayout && <><strong>책상배치:</strong> {selectedVenue.deskLayout}</>}
            </div>

            <div className="venue-detail-section">
              <h4>사용료</h4>
              <div className="detail-text">{renderPipeText(selectedVenue.usageFee)}</div>
              {selectedVenue.mealCost && <><strong>식비 요약:</strong> {selectedVenue.mealCost}</>}
            </div>

            <div className="venue-detail-section">
              <h4>객실 / 비품</h4>
              <div className="detail-text">{renderPipeText(selectedVenue.roomStatus)}</div>
              {selectedVenue.roomAmenities && <><strong>구비 비품:</strong> {selectedVenue.roomAmenities}<br/></>}
              {selectedVenue.personalItems && <><strong>개인 준비물:</strong> {selectedVenue.personalItems}</>}
            </div>

            <div className="venue-detail-section">
              <h4>편의시설</h4>
              <div className="detail-text">{selectedVenue.convenienceFacilities || '-'}</div>
              {selectedVenue.restaurantContact && <><strong>식당 연락처:</strong> {selectedVenue.restaurantContact}</>}
            </div>

            <div className="venue-detail-section">
              <h4>부대시설</h4>
              <div className="detail-text">{renderPipeText(selectedVenue.subFacilities)}</div>
            </div>

            <div className="venue-detail-section">
              <h4>예약 규정</h4>
              <div className="detail-text">{renderPipeText(selectedVenue.reservationRules)}</div>
            </div>

            <div className="venue-detail-section venue-tips">
              <h4>중요 팁</h4>
              <div className="detail-text">{selectedVenue.importantTips || '-'}</div>
            </div>

            <div className="venue-detail-section venue-eval">
              <h4>종합평가</h4>
              <div className="detail-text">{renderPipeText(selectedVenue.evaluation)}</div>
            </div>
          </div>

          {selectedVenue.notes && (
            <div className="venue-detail-section">
              <h4>비고</h4>
              <div className="detail-text">{selectedVenue.notes}</div>
            </div>
          )}

          {/* Inline Venue Contacts */}
          <div className="venue-contacts-section">
            <div className="venue-contacts-header">
              <h4>담당자 정보</h4>
              <button className="add-btn small" onClick={() => {
                setContactForm({ ...EMPTY_CONTACT, venueId: selectedVenue.id })
                setEditingContactId(null)
                setShowContactForm(true)
              }}>+ 담당자 추가</button>
            </div>

            {showContactForm && (
              <form className="inline-contact-form" onSubmit={handleContactSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label>이름 *</label>
                    <input required value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} /></div>
                  <div className="form-group"><label>직책/역할</label>
                    <input value={contactForm.role || ''} onChange={e => setContactForm({...contactForm, role: e.target.value})} placeholder="예: 교육팀장" /></div>
                  <div className="form-group"><label>전화번호</label>
                    <input value={contactForm.phone || ''} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="055-123-4567" /></div>
                  <div className="form-group"><label>이메일</label>
                    <input type="email" value={contactForm.email || ''} onChange={e => setContactForm({...contactForm, email: e.target.value})} /></div>
                  <div className="form-group"><label>주 소통 방법</label>
                    <input value={contactForm.preferredContact || ''} onChange={e => setContactForm({...contactForm, preferredContact: e.target.value})} placeholder="전화, 카톡, 이메일 등" /></div>
                  <div className="form-group"><label>비고</label>
                    <input value={contactForm.notes || ''} onChange={e => setContactForm({...contactForm, notes: e.target.value})} /></div>
                </div>
                <div className="form-actions compact">
                  <button type="submit" className="submit-btn">{editingContactId ? '수정' : '추가'}</button>
                  <button type="button" className="cancel-btn" onClick={() => { setShowContactForm(false); setEditingContactId(null) }}>취소</button>
                </div>
              </form>
            )}

            {contactLoading ? (
              <p className="contact-loading">불러오는 중...</p>
            ) : venueContacts.length === 0 && !showContactForm ? (
              <p className="contact-empty">등록된 담당자가 없습니다.</p>
            ) : (
              <div className="inline-contacts-list">
                {venueContacts.map(c => (
                  <div key={c.id} className="inline-contact-card">
                    <div className="contact-card-main">
                      <strong className="contact-name">{c.name}</strong>
                      {c.role && <span className="contact-role">{c.role}</span>}
                      {c.preferredContact && <span className="vcg-preferred">{c.preferredContact}</span>}
                    </div>
                    <div className="contact-card-details">
                      {c.phone && <span>{c.phone}</span>}
                      {c.email && <span>{c.email}</span>}
                    </div>
                    {c.notes && <div className="contact-card-notes">{c.notes}</div>}
                    <div className="contact-card-actions">
                      <button className="action-btn edit" onClick={() => handleContactEdit(c)}>수정</button>
                      <button className="action-btn reject" onClick={() => handleContactDelete(c.id)}>삭제</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Inline Venue Rooms */}
          <div className="venue-rooms-section">
            <div className="venue-rooms-header">
              <h4>강의실 정보</h4>
              <button className="add-btn small" onClick={() => {
                setRoomForm({ ...EMPTY_ROOM, venueId: selectedVenue.id })
                setEditingRoomId(null)
                setShowRoomForm(true)
              }}>+ 강의실 추가</button>
            </div>

            {showRoomForm && (
              <form className="inline-room-form" onSubmit={handleRoomSubmit}>
                <div className="form-grid">
                  <div className="form-group"><label>강의실명 *</label>
                    <input required value={roomForm.name}
                      onChange={e => setRoomForm({...roomForm, name: e.target.value})} /></div>
                  <div className="form-group"><label>정원</label>
                    <input type="number" min="0" value={roomForm.capacity || 0}
                      onChange={e => setRoomForm({...roomForm, capacity: parseInt(e.target.value) || 0})} /></div>
                  <div className="form-group"><label>현수막 사이즈</label>
                    <input value={roomForm.bannerSize || ''}
                      onChange={e => setRoomForm({...roomForm, bannerSize: e.target.value})}
                      placeholder="예: 8m x 60cm" /></div>
                  <div className="form-group"><label>단상 사이즈</label>
                    <input value={roomForm.podiumSize || ''}
                      onChange={e => setRoomForm({...roomForm, podiumSize: e.target.value})}
                      placeholder="예: 50cm x 30cm" /></div>
                  <div className="form-group"><label>책상 배치</label>
                    <input value={roomForm.deskLayout || ''}
                      onChange={e => setRoomForm({...roomForm, deskLayout: e.target.value})}
                      placeholder="예: ㄷ자형, 극장식" /></div>
                </div>
                <div className="room-equipment-checks">
                  <label className="room-check">
                    <input type="checkbox" checked={roomForm.hasProjector || false}
                      onChange={e => setRoomForm({...roomForm, hasProjector: e.target.checked})} />
                    프로젝터
                  </label>
                  <label className="room-check">
                    <input type="checkbox" checked={roomForm.hasMicrophone || false}
                      onChange={e => setRoomForm({...roomForm, hasMicrophone: e.target.checked})} />
                    마이크
                  </label>
                  <label className="room-check">
                    <input type="checkbox" checked={roomForm.hasWhiteboard || false}
                      onChange={e => setRoomForm({...roomForm, hasWhiteboard: e.target.checked})} />
                    화이트보드
                  </label>
                </div>
                <div className="form-group"><label>비고</label>
                  <input value={roomForm.notes || ''}
                    onChange={e => setRoomForm({...roomForm, notes: e.target.value})} /></div>
                <div className="form-actions compact">
                  <button type="submit" className="submit-btn">{editingRoomId ? '수정' : '추가'}</button>
                  <button type="button" className="cancel-btn"
                    onClick={() => { setShowRoomForm(false); setEditingRoomId(null) }}>취소</button>
                </div>
              </form>
            )}

            {roomLoading ? (
              <p className="contact-loading">불러오는 중...</p>
            ) : venueRooms.length === 0 && !showRoomForm ? (
              <p className="contact-empty">등록된 강의실이 없습니다.</p>
            ) : (
              <div className="venue-rooms-list">
                {venueRooms.map(r => (
                  <div key={r.id} className={`venue-room-card ${expandedRoomId === r.id ? 'expanded' : ''}`}>
                    <div className="room-card-header" onClick={() => setExpandedRoomId(expandedRoomId === r.id ? null : r.id)}>
                      <div className="room-card-title">
                        <span className="room-arrow">{expandedRoomId === r.id ? '\u25BC' : '\u25B6'}</span>
                        <strong>{r.name}</strong>
                        <span className="room-capacity">{r.capacity || 0}명</span>
                        {r.hasProjector && <span className="room-equip-badge">프로젝터</span>}
                        {r.hasMicrophone && <span className="room-equip-badge">마이크</span>}
                        {r.hasWhiteboard && <span className="room-equip-badge">화이트보드</span>}
                      </div>
                      <div className="room-card-actions" onClick={e => e.stopPropagation()}>
                        <button className="action-btn edit" onClick={() => handleRoomEdit(r)}>수정</button>
                        <button className="action-btn reject" onClick={() => handleRoomDelete(r.id)}>삭제</button>
                      </div>
                    </div>
                    {expandedRoomId === r.id && (
                      <div className="room-card-detail">
                        <dl>
                          <dt>정원</dt><dd>{r.capacity || 0}명</dd>
                          <dt>현수막</dt><dd>{r.bannerSize || '-'}</dd>
                          <dt>단상</dt><dd>{r.podiumSize || '-'}</dd>
                          <dt>책상배치</dt><dd>{r.deskLayout || '-'}</dd>
                          <dt>프로젝터</dt><dd>{r.hasProjector ? '있음' : '없음'}</dd>
                          <dt>마이크</dt><dd>{r.hasMicrophone ? '있음' : '없음'}</dd>
                          <dt>화이트보드</dt><dd>{r.hasWhiteboard ? '있음' : '없음'}</dd>
                        </dl>
                        {r.notes && <div className="room-card-notes">{r.notes}</div>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Venue List Table */}
      {!showForm && !selectedVenue && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th></th>
                <th>시설명</th>
                <th>지역</th>
                <th>강의장</th>
                <th>숙소</th>
                <th>식비</th>
                <th>평가</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {venues.map(v => {
                const isOpen = toggledVenueId === v.id
                const rooms = toggledRooms[v.id] || []
                const loading = toggledLoading === v.id
                return (
                  <React.Fragment key={v.id}>
                    <tr className={`venue-row ${isOpen ? 'venue-row-open' : ''}`}>
                      <td className="venue-toggle-cell">
                        <button className="venue-toggle-btn" onClick={() => handleToggleRooms(v.id)}
                          title="강의실 보기">
                          {isOpen ? '\u25BC' : '\u25B6'}
                        </button>
                      </td>
                      <td><strong>{v.name}</strong></td>
                      <td>{v.region || '-'}</td>
                      <td>{v.lectureCapacity ? `${v.lectureCapacity}명` : '-'}</td>
                      <td>{v.accommodationCapacity ? `${v.accommodationCapacity}명` : '-'}</td>
                      <td>{v.mealCost || '-'}</td>
                      <td>
                        {v.overallRating ? (
                          <span className={`venue-rating ${getRatingBadge(v.overallRating)}`}>
                            {v.overallRating}
                          </span>
                        ) : '-'}
                      </td>
                      <td className="actions">
                        <button className="action-btn" onClick={() => handleSelectVenue(v)}>상세</button>
                        <button className="action-btn edit" onClick={() => handleEdit(v)}>수정</button>
                        <button className="action-btn reject" onClick={() => handleDelete(v.id)}>삭제</button>
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="venue-rooms-row">
                        <td colSpan={8}>
                          <div className="venue-rooms-inline">
                            {loading ? (
                              <span className="rooms-inline-loading">강의실 불러오는 중...</span>
                            ) : rooms.length === 0 ? (
                              <span className="rooms-inline-empty">등록된 강의실이 없습니다.</span>
                            ) : (
                              <div className="rooms-inline-grid">
                                {rooms.map(r => (
                                  <div key={r.id} className="rooms-inline-card">
                                    <div className="rooms-inline-card-header">
                                      <strong>{r.name}</strong>
                                      <span className="room-capacity">{r.capacity || 0}명</span>
                                      {r.hasProjector && <span className="room-equip-badge">프로젝터</span>}
                                      {r.hasMicrophone && <span className="room-equip-badge">마이크</span>}
                                      {r.hasWhiteboard && <span className="room-equip-badge">화이트보드</span>}
                                    </div>
                                    <dl className="rooms-inline-card-detail">
                                      {r.bannerSize && <><dt>현수막</dt><dd>{r.bannerSize}</dd></>}
                                      {r.podiumSize && <><dt>단상</dt><dd>{r.podiumSize}</dd></>}
                                      {r.deskLayout && <><dt>책상배치</dt><dd>{r.deskLayout}</dd></>}
                                      {r.notes && <><dt>비고</dt><dd>{r.notes}</dd></>}
                                    </dl>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
