import { useState } from 'react'
import { api } from '../services/api'
import type { User } from '../types'
import RequestList from './RequestList'

interface MyPageProps {
  user: User
  refreshKey: number
  onBack: () => void
  onUserUpdate: (u: User) => void
}

export default function MyPage({ user, refreshKey, onBack, onUserUpdate }: MyPageProps) {
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const startEdit = () => {
    setName(user.name)
    setPhone(user.phone || '')
    setEditing(true)
    setError('')
    setSuccess('')
  }

  const cancelEdit = () => {
    setEditing(false)
    setError('')
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { setError('이름을 입력해주세요.'); return }
    setSaving(true)
    setError('')
    try {
      const updated = await api.updateUser(user.id, {
        email: user.email,
        name: name.trim(),
        phone: phone.trim(),
        role: user.role,
        fleet: user.fleet || undefined,
        ship: user.ship || undefined,
      })
      onUserUpdate(updated)
      setEditing(false)
      setSuccess('개인정보가 수정되었습니다.')
    } catch {
      setError('저장에 실패했습니다.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mp-wrap">
      <button className="mp-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
        돌아가기
      </button>

      <div className="mp-header">
        <h2 className="mp-title">My Page</h2>

        {success && <div className="message success" style={{ marginBottom: 16 }}>{success}</div>}
        {error && <div className="message error" style={{ marginBottom: 16 }}>{error}</div>}

        {editing ? (
          <form className="mp-edit-form" onSubmit={handleSave}>
            <div className="mp-edit-row">
              <label className="mp-edit-label">이메일</label>
              <input className="mp-edit-input" value={user.email} disabled />
            </div>
            <div className="mp-edit-row">
              <label className="mp-edit-label">이름 *</label>
              <input className="mp-edit-input" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mp-edit-row">
              <label className="mp-edit-label">연락처</label>
              <input className="mp-edit-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="010-0000-0000" />
            </div>
            <div className="mp-edit-actions">
              <button type="submit" className="submit-btn" disabled={saving}>{saving ? '저장 중...' : '저장'}</button>
              <button type="button" className="cancel-btn" onClick={cancelEdit}>취소</button>
            </div>
          </form>
        ) : (
          <div className="mp-user-info">
            <div className="mp-info-row">
              <span className="mp-label">이름</span>
              <span className="mp-value">{user.name}</span>
            </div>
            <div className="mp-info-row">
              <span className="mp-label">이메일</span>
              <span className="mp-value">{user.email}</span>
            </div>
            {user.fleet && (
              <div className="mp-info-row">
                <span className="mp-label">함대/함정</span>
                <span className="mp-value">{user.fleet}{user.ship ? ` / ${user.ship}` : ' 본부'}</span>
              </div>
            )}
            {user.phone && (
              <div className="mp-info-row">
                <span className="mp-label">연락처</span>
                <span className="mp-value">{user.phone}</span>
              </div>
            )}
            <button className="mp-edit-btn" onClick={startEdit}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              정보 수정
            </button>
          </div>
        )}
      </div>

      <div className="mp-requests">
        <RequestList userId={user.id} user={user} refreshKey={refreshKey} />
      </div>
    </div>
  )
}
