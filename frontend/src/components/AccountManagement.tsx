import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import type { User, UserCreate } from '../types'

const EMPTY_FORM: UserCreate = { email: '', name: '', affiliation: '', phone: '', role: 'USER' }

const STATUS_LABELS: Record<string, string> = {
  PENDING: '승인 대기',
  ACTIVE: '활성',
  REJECTED: '반려',
}

export default function AccountManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<UserCreate>(EMPTY_FORM)

  const fetchUsers = () => {
    setLoading(true)
    api.getUsers()
      .then(setUsers)
      .catch(() => setError('사용자 목록을 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers() }, [])

  const pendingUsers = useMemo(() => users.filter(u => u.status === 'PENDING'), [users])
  const activeUsers = useMemo(() => users.filter(u => u.status === 'ACTIVE'), [users])
  const rejectedUsers = useMemo(() => users.filter(u => u.status === 'REJECTED'), [users])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      if (editingId) {
        await api.updateUser(editingId, form)
        setSuccess('사용자 정보가 수정되었습니다.')
      } else {
        await api.createUser(form)
        setSuccess('새 사용자가 등록되었습니다.')
      }
      setForm(EMPTY_FORM)
      setShowForm(false)
      setEditingId(null)
      fetchUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : '저장에 실패했습니다.')
    }
  }

  const handleEdit = (user: User) => {
    setForm({ email: user.email, name: user.name, affiliation: user.affiliation || '', phone: user.phone || '', role: user.role })
    setEditingId(user.id)
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try {
      await api.deleteUser(id)
      setSuccess('사용자가 삭제되었습니다.')
      fetchUsers()
    } catch {
      setError('삭제에 실패했습니다. 해당 사용자의 요청이 존재할 수 있습니다.')
    }
  }

  const handleApprove = async (id: number) => {
    setError('')
    try {
      await api.approveUser(id)
      setSuccess('계정이 승인되었습니다.')
      fetchUsers()
    } catch {
      setError('승인에 실패했습니다.')
    }
  }

  const handleReject = async (id: number) => {
    setError('')
    try {
      await api.rejectUser(id)
      setSuccess('계정이 반려되었습니다.')
      fetchUsers()
    } catch {
      setError('반려에 실패했습니다.')
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingId(null)
    setForm(EMPTY_FORM)
  }

  if (loading) return <div className="loading">불러오는 중...</div>

  return (
    <div className="management-page">
      <div className="management-header">
        <h2>계정 관리</h2>
        <button className="add-btn" onClick={() => { setShowForm(true); setEditingId(null); setForm(EMPTY_FORM); }}>
          + 새 사용자
        </button>
      </div>

      {error && <div className="message error">{error}</div>}
      {success && <div className="message success">{success}</div>}

      {showForm && (
        <form className="management-form" onSubmit={handleSubmit}>
          <h3>{editingId ? '사용자 수정' : '새 사용자 등록'}</h3>
          <div className="form-row">
            <div className="form-group-flex">
              <label>이메일 *</label>
              <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div className="form-group-flex">
              <label>이름 *</label>
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group-flex">
              <label>소속</label>
              <input value={form.affiliation} onChange={e => setForm({...form, affiliation: e.target.value})} placeholder="소속" />
            </div>
            <div className="form-group-flex">
              <label>전화번호</label>
              <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} placeholder="전화번호" />
            </div>
            <div className="form-group-flex">
              <label>권한 *</label>
              <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
                <option value="USER">일반 사용자</option>
                <option value="ADMIN">관리자</option>
              </select>
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">{editingId ? '수정' : '등록'}</button>
            <button type="button" className="cancel-btn" onClick={handleCancel}>취소</button>
          </div>
        </form>
      )}

      {/* Pending Users Section */}
      {pendingUsers.length > 0 && (
        <div className="pending-section">
          <h3 className="section-title pending-title">
            승인 대기 ({pendingUsers.length}건)
          </h3>
          <div className="pending-cards">
            {pendingUsers.map(u => (
              <div key={u.id} className="pending-card">
                <div className="pending-card-info">
                  <div className="pending-card-name">{u.name}</div>
                  <div className="pending-card-email">{u.email}</div>
                  {u.affiliation && <div className="pending-card-detail">{u.affiliation}</div>}
                  {u.phone && <div className="pending-card-detail">{u.phone}</div>}
                </div>
                <div className="pending-card-actions">
                  <button className="action-btn approve" onClick={() => handleApprove(u.id)}>승인</button>
                  <button className="action-btn reject" onClick={() => handleReject(u.id)}>반려</button>
                  <button className="action-btn cancel" onClick={() => handleDelete(u.id)}>삭제</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Users Table */}
      <h3 className="section-title" style={{ marginTop: 20 }}>활성 계정 ({activeUsers.length}명)</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이메일</th>
              <th>이름</th>
              <th>소속</th>
              <th>전화번호</th>
              <th>권한</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {activeUsers.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.email}</td>
                <td>{u.name}</td>
                <td>{u.affiliation || '-'}</td>
                <td>{u.phone || '-'}</td>
                <td>
                  <span className={`role-badge ${u.role.toLowerCase()}`}>
                    {u.role === 'ADMIN' ? '관리자' : '사용자'}
                  </span>
                </td>
                <td className="actions">
                  <button className="action-btn edit" onClick={() => handleEdit(u)}>수정</button>
                  <button className="action-btn reject" onClick={() => handleDelete(u.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Rejected Users */}
      {rejectedUsers.length > 0 && (
        <>
          <h3 className="section-title" style={{ marginTop: 20, color: '#991b1b' }}>반려된 계정 ({rejectedUsers.length}명)</h3>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>이메일</th>
                  <th>이름</th>
                  <th>소속</th>
                  <th>전화번호</th>
                  <th>상태</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {rejectedUsers.map(u => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>{u.email}</td>
                    <td>{u.name}</td>
                    <td>{u.affiliation || '-'}</td>
                    <td>{u.phone || '-'}</td>
                    <td><span className="status rejected">{STATUS_LABELS[u.status]}</span></td>
                    <td className="actions">
                      <button className="action-btn approve" onClick={() => handleApprove(u.id)}>승인</button>
                      <button className="action-btn reject" onClick={() => handleDelete(u.id)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
