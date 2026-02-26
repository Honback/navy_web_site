import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { User, NoticeItem, NoticeCreate, BoardPost, BoardPostCreate } from '../types'

interface BoardProps {
  user: User | null
  initialTab?: 'notice' | 'posts'
}

const EMPTY_NOTICE: NoticeCreate = { title: '', content: '', author: '', important: false }
const EMPTY_POST: BoardPostCreate = { title: '', content: '', summary: '', author: '', tags: '' }

export default function Board({ user, initialTab = 'notice' }: BoardProps) {
  const [activeTab, setActiveTab] = useState<'notice' | 'posts'>(initialTab)
  const [notices, setNotices] = useState<NoticeItem[]>([])
  const [posts, setPosts] = useState<BoardPost[]>([])
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null)
  const [selectedPost, setSelectedPost] = useState<BoardPost | null>(null)
  const [lightboxImg, setLightboxImg] = useState<string | null>(null)

  // Admin form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [noticeForm, setNoticeForm] = useState<NoticeCreate>(EMPTY_NOTICE)
  const [postForm, setPostForm] = useState<BoardPostCreate>(EMPTY_POST)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const isAdmin = user?.role === 'ADMIN'

  useEffect(() => { setActiveTab(initialTab) }, [initialTab])

  useEffect(() => {
    api.getNotices().then(setNotices).catch(() => {})
    api.getBoardPosts().then(setPosts).catch(() => {})
  }, [])

  const refreshData = () => {
    api.getNotices().then(setNotices)
    api.getBoardPosts().then(setPosts)
  }

  // ── Notice CRUD ──
  const handleNoticeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.updateNotice(editingId, noticeForm)
        setSuccess('공지사항이 수정되었습니다.')
      } else {
        await api.createNotice(noticeForm)
        setSuccess('공지사항이 등록되었습니다.')
      }
      setShowForm(false)
      setEditingId(null)
      setNoticeForm(EMPTY_NOTICE)
      refreshData()
    } catch { setError('저장에 실패했습니다.') }
  }

  const editNotice = (n: NoticeItem) => {
    setNoticeForm({ title: n.title, content: n.content, author: n.author, important: n.important })
    setEditingId(n.id)
    setShowForm(true)
    setSelectedNotice(null)
  }

  const deleteNotice = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try { await api.deleteNotice(id); refreshData(); setSelectedNotice(null); setSuccess('삭제되었습니다.') }
    catch { setError('삭제에 실패했습니다.') }
  }

  // ── Post CRUD ──
  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        await api.updateBoardPost(editingId, postForm)
        setSuccess('게시글이 수정되었습니다.')
      } else {
        await api.createBoardPost(postForm)
        setSuccess('게시글이 등록되었습니다.')
      }
      setShowForm(false)
      setEditingId(null)
      setPostForm(EMPTY_POST)
      refreshData()
    } catch { setError('저장에 실패했습니다.') }
  }

  const editPost = (p: BoardPost) => {
    setPostForm({ title: p.title, content: p.content, summary: p.summary || '', author: p.author, tags: p.tags || '', images: p.images || '' })
    setEditingId(p.id)
    setShowForm(true)
    setSelectedPost(null)
  }

  const deletePost = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return
    try { await api.deleteBoardPost(id); refreshData(); setSelectedPost(null); setSuccess('삭제되었습니다.') }
    catch { setError('삭제에 실패했습니다.') }
  }

  const cancelForm = () => {
    setShowForm(false)
    setEditingId(null)
    setNoticeForm(EMPTY_NOTICE)
    setPostForm(EMPTY_POST)
    setError('')
  }

  const openNewForm = () => {
    setEditingId(null)
    if (activeTab === 'notice') setNoticeForm({ ...EMPTY_NOTICE, author: user?.name || '' })
    else setPostForm({ ...EMPTY_POST, author: user?.name || '' })
    setShowForm(true)
    setError('')
    setSuccess('')
  }

  const renderContent = (text: string) =>
    text.split('\n').map((line, i) => {
      if (!line.trim()) return <br key={i} />
      if (line.startsWith('■')) return <h3 key={i} className="board-section-title">{line}</h3>
      if (line.startsWith('•') || /^\d+\./.test(line)) return <p key={i} className="board-bullet">{line}</p>
      return <p key={i}>{line}</p>
    })

  const parseImages = (json: string | null): { url: string; caption: string }[] => {
    if (!json) return []
    try { return JSON.parse(json) } catch { return [] }
  }

  // ── Notice Detail ──
  if (selectedNotice) {
    return (
      <div className="board-wrap">
        <button className="board-back" onClick={() => setSelectedNotice(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          목록으로
        </button>
        <article className="board-article">
          <header className="board-article-header">
            <div className="board-article-tags">
              {selectedNotice.important && <span className="board-tag notice-tag-important">중요</span>}
            </div>
            <h1 className="board-article-title">{selectedNotice.title}</h1>
            <div className="board-article-meta">
              <span>{selectedNotice.author}</span>
              <span className="board-meta-sep">|</span>
              <span>{selectedNotice.createdAt?.split('T')[0]}</span>
              {isAdmin && (
                <>
                  <button className="board-admin-btn board-admin-edit" onClick={() => editNotice(selectedNotice)}>수정</button>
                  <button className="board-admin-btn board-admin-delete" onClick={() => deleteNotice(selectedNotice.id)}>삭제</button>
                </>
              )}
            </div>
          </header>
          <div className="board-article-body">{renderContent(selectedNotice.content)}</div>
        </article>
      </div>
    )
  }

  // ── Post Detail ──
  if (selectedPost) {
    const images = parseImages(selectedPost.images)
    const tags = selectedPost.tags ? selectedPost.tags.split(',').map(t => t.trim()).filter(Boolean) : []
    return (
      <div className="board-wrap">
        <button className="board-back" onClick={() => setSelectedPost(null)}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          목록으로
        </button>
        <article className="board-article">
          <header className="board-article-header">
            {tags.length > 0 && (
              <div className="board-article-tags">
                {tags.map(tag => <span key={tag} className="board-tag">{tag}</span>)}
              </div>
            )}
            <h1 className="board-article-title">{selectedPost.title}</h1>
            <div className="board-article-meta">
              <span>{selectedPost.author}</span>
              <span className="board-meta-sep">|</span>
              <span>{selectedPost.createdAt?.split('T')[0]}</span>
              {isAdmin && (
                <>
                  <button className="board-admin-btn board-admin-edit" onClick={() => editPost(selectedPost)}>수정</button>
                  <button className="board-admin-btn board-admin-delete" onClick={() => deletePost(selectedPost.id)}>삭제</button>
                </>
              )}
            </div>
          </header>
          <div className="board-article-body">{renderContent(selectedPost.content)}</div>
          {images.length > 0 && (
            <div className="board-gallery">
              <h3 className="board-gallery-title">교육 사진</h3>
              <div className="board-gallery-grid">
                {images.map((img, i) => (
                  <figure key={i} className="board-gallery-item" onClick={() => setLightboxImg(img.url)}>
                    <img src={img.url} alt={img.caption} />
                    <figcaption>{img.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}
        </article>
        {lightboxImg && (
          <div className="board-lightbox" onClick={() => setLightboxImg(null)}>
            <img src={lightboxImg} alt="" onClick={e => e.stopPropagation()} />
            <button className="board-lightbox-close" onClick={() => setLightboxImg(null)}>×</button>
          </div>
        )}
      </div>
    )
  }

  // ── Admin Form ──
  if (showForm && isAdmin) {
    return (
      <div className="board-wrap">
        <button className="board-back" onClick={cancelForm}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          취소
        </button>
        {activeTab === 'notice' ? (
          <form className="board-form" onSubmit={handleNoticeSubmit}>
            <h3>{editingId ? '공지사항 수정' : '새 공지사항 작성'}</h3>
            {error && <div className="message error">{error}</div>}
            <div className="form-group">
              <label>제목 *</label>
              <input required value={noticeForm.title} onChange={e => setNoticeForm({ ...noticeForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>작성자 *</label>
              <input required value={noticeForm.author} onChange={e => setNoticeForm({ ...noticeForm, author: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="board-checkbox-label">
                <input type="checkbox" checked={noticeForm.important} onChange={e => setNoticeForm({ ...noticeForm, important: e.target.checked })} />
                중요 공지
              </label>
            </div>
            <div className="form-group">
              <label>내용 *</label>
              <textarea required rows={12} value={noticeForm.content} onChange={e => setNoticeForm({ ...noticeForm, content: e.target.value })} placeholder="■ 섹션 제목&#10;• 항목 내용" />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">{editingId ? '수정' : '등록'}</button>
              <button type="button" className="cancel-btn" onClick={cancelForm}>취소</button>
            </div>
          </form>
        ) : (
          <form className="board-form" onSubmit={handlePostSubmit}>
            <h3>{editingId ? '게시글 수정' : '새 게시글 작성'}</h3>
            {error && <div className="message error">{error}</div>}
            <div className="form-group">
              <label>제목 *</label>
              <input required value={postForm.title} onChange={e => setPostForm({ ...postForm, title: e.target.value })} />
            </div>
            <div className="form-group">
              <label>작성자 *</label>
              <input required value={postForm.author} onChange={e => setPostForm({ ...postForm, author: e.target.value })} />
            </div>
            <div className="form-group">
              <label>요약</label>
              <textarea rows={2} value={postForm.summary || ''} onChange={e => setPostForm({ ...postForm, summary: e.target.value })} placeholder="목록에 표시될 요약문" />
            </div>
            <div className="form-group">
              <label>태그</label>
              <input value={postForm.tags || ''} onChange={e => setPostForm({ ...postForm, tags: e.target.value })} placeholder="쉼표로 구분 (예: 필승해군캠프,1분기)" />
            </div>
            <div className="form-group">
              <label>내용 *</label>
              <textarea required rows={12} value={postForm.content} onChange={e => setPostForm({ ...postForm, content: e.target.value })} placeholder="■ 섹션 제목&#10;• 항목 내용" />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">{editingId ? '수정' : '등록'}</button>
              <button type="button" className="cancel-btn" onClick={cancelForm}>취소</button>
            </div>
          </form>
        )}
      </div>
    )
  }

  // ── List View ──
  return (
    <div className="board-wrap">
      <div className="board-header">
        <h2 className="board-title">게시판</h2>
        <div className="board-tab-bar">
          <button className={`board-tab-btn${activeTab === 'notice' ? ' active' : ''}`} onClick={() => { setActiveTab('notice'); setSuccess('') }}>
            공지사항 <span className="board-tab-count">{notices.length}</span>
          </button>
          <button className={`board-tab-btn${activeTab === 'posts' ? ' active' : ''}`} onClick={() => { setActiveTab('posts'); setSuccess('') }}>
            교육활동소식 <span className="board-tab-count">{posts.length}</span>
          </button>
          {isAdmin && (
            <button className="add-btn board-add-btn" onClick={openNewForm}>
              + 새 글 작성
            </button>
          )}
        </div>
      </div>

      {success && <div className="message success">{success}</div>}

      {activeTab === 'notice' ? (
        <div className="notice-list">
          <table className="notice-table">
            <thead>
              <tr>
                <th className="notice-th-no">번호</th>
                <th className="notice-th-title">제목</th>
                <th className="notice-th-author">작성자</th>
                <th className="notice-th-date">등록일</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((notice, idx) => (
                <tr
                  key={notice.id}
                  className={`notice-row${notice.important ? ' notice-row-important' : ''}`}
                  onClick={() => setSelectedNotice(notice)}
                >
                  <td className="notice-no">
                    {notice.important ? (
                      <span className="notice-pin">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 12V4h1V2H7v2h1v8l-2 2v2h5.2v6h1.6v-6H18v-2l-2-2z" /></svg>
                      </span>
                    ) : (
                      notices.length - idx
                    )}
                  </td>
                  <td className="notice-title-cell">
                    {notice.important && <span className="notice-badge-important">중요</span>}
                    {notice.title}
                  </td>
                  <td className="notice-author">{notice.author}</td>
                  <td className="notice-date">{notice.createdAt?.split('T')[0]}</td>
                </tr>
              ))}
              {notices.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: '#64748b' }}>등록된 공지사항이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="board-list">
          {posts.map(post => {
            const tags = post.tags ? post.tags.split(',').map(t => t.trim()).filter(Boolean) : []
            const images = parseImages(post.images)
            return (
              <div key={post.id} className="board-card" onClick={() => setSelectedPost(post)}>
                {images.length > 0 && (
                  <div className="board-card-thumb">
                    <img src={images[0].url} alt="" />
                  </div>
                )}
                <div className="board-card-body">
                  {tags.length > 0 && (
                    <div className="board-card-tags">
                      {tags.map(tag => <span key={tag} className="board-tag">{tag}</span>)}
                    </div>
                  )}
                  <h3 className="board-card-title">{post.title}</h3>
                  {post.summary && <p className="board-card-summary">{post.summary}</p>}
                  <div className="board-card-meta">
                    <span>{post.author}</span>
                    <span className="board-meta-sep">|</span>
                    <span>{post.createdAt?.split('T')[0]}</span>
                  </div>
                </div>
              </div>
            )
          })}
          {posts.length === 0 && (
            <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>등록된 게시글이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  )
}
