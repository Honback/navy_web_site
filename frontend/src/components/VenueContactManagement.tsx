import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import type { VenueContact, VenueContactCreate, Venue } from '../types'

const EMPTY_FORM: VenueContactCreate = {
  venueId: 0, name: '', role: '', phone: '', email: '', preferredContact: '', notes: ''
}

export default function VenueContactManagement() {
  const [contacts, setContacts] = useState<VenueContact[]>([])
  const [venues, setVenues] = useState<Venue[]>([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<VenueContactCreate>(EMPTY_FORM)
  const [filterVenue, setFilterVenue] = useState<string>('')
  const [collapsedVenues, setCollapsedVenues] = useState<Set<number>>(new Set())

  const loadData = () => {
    Promise.all([api.getVenueContacts(), api.getVenues()])
      .then(([c, v]) => { setContacts(c); setVenues(v) })
      .catch(() => setError('데이터를 불러오는데 실패했습니다.'))
  }

  useEffect(() => { loadData() }, [])

  useEffect(() => {
    if (success) { const t = setTimeout(() => setSuccess(''), 3000); return () => clearTimeout(t) }
  }, [success])

  const venueMap = useMemo(() => {
    const m = new Map<number, Venue>()
    venues.forEach(v => m.set(v.id, v))
    return m
  }, [venues])

  // Group contacts by venue
  const grouped = useMemo(() => {
    const filtered = filterVenue ? contacts.filter(c => c.venueId === Number(filterVenue)) : contacts
    const map = new Map<number, VenueContact[]>()
    for (const c of filtered) {
      if (!map.has(c.venueId)) map.set(c.venueId, [])
      map.get(c.venueId)!.push(c)
    }
    // Sort by venue name
    return [...map.entries()].sort((a, b) => {
      const na = venueMap.get(a[0])?.name || ''
      const nb = venueMap.get(b[0])?.name || ''
      return na.localeCompare(nb)
    })
  }, [contacts, filterVenue, venueMap])

  const toggleCollapse = (venueId: number) => {
    setCollapsedVenues(prev => {
      const next = new Set(prev)
      if (next.has(venueId)) next.delete(venueId)
      else next.add(venueId)
      return next
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.venueId) {
      setError('담당자 이름과 교육장을 입력해 주세요.')
      return
    }
    setError('')
    try {
      if (editingId) {
        await api.updateVenueContact(editingId, form)
        setSuccess('담당자 정보가 수정되었습니다.')
      } else {
        await api.createVenueContact(form)
        setSuccess('담당자가 등록되었습니다.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditingId(null)
      loadData()
    } catch {
      setError('저장에 실패했습니다.')
    }
  }

  const handleEdit = (c: VenueContact) => {
    setForm({
      venueId: c.venueId,
      name: c.name,
      role: c.role || '',
      phone: c.phone || '',
      email: c.email || '',
      preferredContact: c.preferredContact || '',
      notes: c.notes || '',
    })
    setEditingId(c.id)
    setShowForm(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await api.deleteVenueContact(id)
      setSuccess('삭제되었습니다.')
      loadData()
    } catch {
      setError('삭제에 실패했습니다.')
    }
  }

  const handleAddForVenue = (venueId: number) => {
    setForm({ ...EMPTY_FORM, venueId })
    setEditingId(null)
    setShowForm(true)
  }

  return (
    <div className="management-page">
      <div className="management-header">
        <h2>장소 담당자 관리</h2>
        <div className="header-info">
          <span className="count-badge">총 {contacts.length}명 / {new Set(contacts.map(c => c.venueId)).size}곳</span>
          <select className="filter-select" value={filterVenue} onChange={e => setFilterVenue(e.target.value)}>
            <option value="">전체 교육장</option>
            {venues.map(v => (
              <option key={v.id} value={v.id}>{v.name} ({contacts.filter(c => c.venueId === v.id).length}명)</option>
            ))}
          </select>
          <button className="add-btn" onClick={() => { setForm(EMPTY_FORM); setEditingId(null); setShowForm(true) }}>
            + 담당자 등록
          </button>
        </div>
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {showForm && (
        <form className="vc-register-form" onSubmit={handleSubmit}>
          <div className="vc-register-header">
            <h3>{editingId ? '담당자 수정' : '담당자 등록'}</h3>
            <button type="button" className="modal-close" onClick={() => { setShowForm(false); setEditingId(null) }}>&times;</button>
          </div>
          <div className="vc-register-body">
            <div className="vc-register-grid">
              <div className="form-group">
                <label>교육장 *</label>
                <select value={form.venueId || ''} onChange={e => setForm({ ...form, venueId: Number(e.target.value) })} required>
                  <option value="">교육장 선택</option>
                  {venues.map(v => <option key={v.id} value={v.id}>{v.name} ({v.region})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>담당자 이름 *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="form-group">
                <label>직책/역할</label>
                <input value={form.role || ''} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="교육팀장, 예약담당" />
              </div>
              <div className="form-group">
                <label>전화번호</label>
                <input value={form.phone || ''} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="055-123-4567" />
              </div>
              <div className="form-group">
                <label>이메일</label>
                <input type="email" value={form.email || ''} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="form-group">
                <label>주 소통 방법</label>
                <input value={form.preferredContact || ''} onChange={e => setForm({ ...form, preferredContact: e.target.value })} placeholder="전화, 카톡, 이메일" />
              </div>
            </div>
            <div className="form-group">
              <label>비고</label>
              <input value={form.notes || ''} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="메모사항" />
            </div>
          </div>
          <div className="vc-register-actions">
            <button type="button" className="cancel-btn" onClick={() => { setShowForm(false); setEditingId(null) }}>취소</button>
            <button type="submit" className="submit-btn">{editingId ? '수정' : '등록'}</button>
          </div>
        </form>
      )}

      {/* Grouped by venue */}
      <div className="vcg-list">
        {grouped.length === 0 ? (
          <div className="contact-empty">등록된 담당자가 없습니다.</div>
        ) : (
          grouped.map(([venueId, venueContacts]) => {
            const venue = venueMap.get(venueId)
            const collapsed = collapsedVenues.has(venueId)
            return (
              <div key={venueId} className="vcg-group">
                <div className="vcg-group-header" onClick={() => toggleCollapse(venueId)}>
                  <div className="vcg-group-title">
                    <span className="vcg-arrow">{collapsed ? '▶' : '▼'}</span>
                    <strong>{venue?.name || `#${venueId}`}</strong>
                    {venue?.region && <span className="vcg-region">{venue.region}</span>}
                    <span className="vcg-count">{venueContacts.length}명</span>
                  </div>
                  <button className="add-btn small" onClick={e => { e.stopPropagation(); handleAddForVenue(venueId) }}>+ 추가</button>
                </div>

                {!collapsed && (
                  <div className="vcg-cards">
                    {venueContacts.map(c => (
                      <div key={c.id} className="vcg-card">
                        <div className="vcg-card-top">
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
                          <button className="action-btn edit" onClick={() => handleEdit(c)}>수정</button>
                          <button className="action-btn reject" onClick={() => handleDelete(c.id)}>삭제</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
