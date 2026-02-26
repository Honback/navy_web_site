import { useState } from 'react'
import { api } from '../services/api'
import type { User } from '../types'

const FLEETS = ['해군본부', '1함대', '2함대', '3함대', '작전사', '진기사', '교육사']

interface LoginScreenProps {
  onLogin: (user: User) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [fleet, setFleet] = useState('')
  const [ship, setShip] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('이메일을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      const user = await api.login(email.trim())
      onLogin(user)
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('승인 대기')) {
        setError('계정 승인 대기 중입니다. 관리자 승인 후 로그인 가능합니다.')
      } else if (msg.includes('반려')) {
        setError('계정 등록이 반려되었습니다. 관리자에게 문의하세요.')
      } else {
        setError('등록되지 않은 이메일입니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim() || !name.trim() || !phone.trim() || !fleet) {
      setError('이름, 이메일, 전화번호, 소속 함대는 필수입니다.')
      return
    }

    setLoading(true)
    try {
      await api.register({
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        fleet,
        ship: ship.trim() || undefined,
      })
      setSuccess('계정 등록 요청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.')
      setEmail('')
      setName('')
      setPhone('')
      setFleet('')
      setShip('')
    } catch (err) {
      const msg = err instanceof Error ? err.message : ''
      if (msg.includes('이미 등록')) {
        setError('이미 등록된 이메일입니다.')
      } else {
        setError('등록 요청에 실패했습니다.')
      }
    } finally {
      setLoading(false)
    }
  }

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode)
    setError('')
    setSuccess('')
    setEmail('')
    setName('')
    setPhone('')
    setFleet('')
    setShip('')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>해군 교육 일정 요청 시스템</h1>
          <p>Navy Training Schedule Request System</p>
        </div>

        {mode === 'login' ? (
          <form className="login-form" onSubmit={handleLogin}>
            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="등록된 이메일을 입력하세요"
                autoFocus
              />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '확인 중...' : '로그인'}
            </button>
            <button
              type="button"
              className="login-switch-btn"
              onClick={() => switchMode('register')}
            >
              계정이 없으신가요? 등록 요청
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleRegister}>
            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
            <div className="form-group">
              <label htmlFor="reg-name">이름</label>
              <input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="이름을 입력하세요"
                autoFocus
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-email">이메일</label>
              <input
                type="email"
                id="reg-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-phone">전화번호</label>
              <input
                type="tel"
                id="reg-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="전화번호를 입력하세요"
              />
            </div>
            <div className="form-group">
              <label htmlFor="reg-fleet">소속 함대 *</label>
              <select
                id="reg-fleet"
                value={fleet}
                onChange={(e) => { setFleet(e.target.value); setShip('') }}
              >
                <option value="">-- 소속 함대 선택 --</option>
                {FLEETS.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
            {fleet && (
              <div className="form-group">
                <label htmlFor="reg-ship">소속 함정</label>
                <input
                  id="reg-ship"
                  value={ship}
                  onChange={(e) => setShip(e.target.value)}
                  placeholder="함정명을 입력하세요 (본부 소속은 비워두세요)"
                />
              </div>
            )}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '요청 중...' : '계정 등록 요청'}
            </button>
            <button
              type="button"
              className="login-switch-btn"
              onClick={() => switchMode('login')}
            >
              이미 계정이 있으신가요? 로그인
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
