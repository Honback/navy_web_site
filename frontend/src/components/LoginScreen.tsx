import { useState } from 'react'
import { api } from '../services/api'
import type { User } from '../types'

interface LoginScreenProps {
  onLogin: (user: User) => void
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [affiliation, setAffiliation] = useState('')
  const [phone, setPhone] = useState('')
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

    if (!email.trim() || !name.trim() || !affiliation.trim() || !phone.trim()) {
      setError('모든 항목을 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      await api.register({ email: email.trim(), name: name.trim(), affiliation: affiliation.trim(), phone: phone.trim() })
      setSuccess('계정 등록 요청이 완료되었습니다. 관리자 승인 후 로그인 가능합니다.')
      setEmail('')
      setName('')
      setAffiliation('')
      setPhone('')
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
    setAffiliation('')
    setPhone('')
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
              <label htmlFor="reg-affiliation">소속</label>
              <input
                id="reg-affiliation"
                value={affiliation}
                onChange={(e) => setAffiliation(e.target.value)}
                placeholder="소속을 입력하세요"
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
