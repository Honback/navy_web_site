import { useState, useEffect, useCallback } from 'react'

interface HeroPageProps {
  onEnter: () => void
}

/* ── counter hook ── */
function useCountUp(target: number, duration = 2000, trigger = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const id = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(id)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(id)
  }, [target, duration, trigger])
  return count
}

const SLIDE_COUNT = 3
const AUTO_INTERVAL = 6000

export default function HeroPage({ onEnter }: HeroPageProps) {
  const [slide, setSlide] = useState(0)
  const [animating, setAnimating] = useState(false)
  const [statsTriggered, setStatsTriggered] = useState(false)

  /* counters — trigger when slide 1 is active */
  const courses = useCountUp(12, 1800, statsTriggered)
  const graduates = useCountUp(4800, 2200, statsTriggered)
  const instructors = useCountUp(23, 1400, statsTriggered)
  const venues = useCountUp(13, 1200, statsTriggered)

  useEffect(() => {
    if (slide === 1 && !statsTriggered) setStatsTriggered(true)
  }, [slide, statsTriggered])

  const goTo = useCallback((idx: number) => {
    if (animating) return
    setAnimating(true)
    setSlide(idx)
    setTimeout(() => setAnimating(false), 700)
  }, [animating])

  const next = useCallback(() => goTo((slide + 1) % SLIDE_COUNT), [slide, goTo])
  const prev = useCallback(() => goTo((slide - 1 + SLIDE_COUNT) % SLIDE_COUNT), [slide, goTo])

  /* auto-play */
  useEffect(() => {
    const id = setInterval(next, AUTO_INTERVAL)
    return () => clearInterval(id)
  }, [next])

  /* keyboard */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next()
      else if (e.key === 'ArrowLeft') prev()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev])

  /* wheel (full-page snap) */
  useEffect(() => {
    let cooldown = false
    const handler = (e: WheelEvent) => {
      if (cooldown) return
      cooldown = true
      setTimeout(() => { cooldown = false }, 1000)
      if (e.deltaY > 30) next()
      else if (e.deltaY < -30) prev()
    }
    window.addEventListener('wheel', handler, { passive: true })
    return () => window.removeEventListener('wheel', handler)
  }, [next, prev])

  return (
    <div className="hp-slider">
      {/* ── Slide Track ── */}
      <div
        className="hp-track"
        style={{ transform: `translateY(-${slide * 100}vh)` }}
      >
        {/* ─── Slide 1: Main Hero ─── */}
        <section className="hp-slide hp-slide-main">
          <div className="hp-particles" aria-hidden="true">
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="hp-particle"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 6}s`,
                  animationDuration: `${6 + Math.random() * 8}s`,
                  opacity: 0.15 + Math.random() * 0.25,
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                }}
              />
            ))}
          </div>
          <div className={`hp-slide-content ${slide === 0 ? 'hp-active' : ''}`}>
            <p className="hp-sub">REPUBLIC OF KOREA NAVY</p>
            <h1 className="hp-title">
              <span className="hp-title-line">해군 통신</span>
              <span className="hp-title-line hp-title-accent">교육훈련체계</span>
            </h1>
            <p className="hp-desc">
              체계적인 교육과정 관리와 효율적인 일정 조율로<br />
              대한민국 해군의 통신 역량을 강화합니다
            </p>
            <button className="hp-cta" onClick={onEnter}>
              시스템 접속
              <span className="hp-cta-arrow">→</span>
            </button>
          </div>
        </section>

        {/* ─── Slide 2: Stats Counter ─── */}
        <section className="hp-slide hp-slide-stats">
          <div className={`hp-slide-content ${slide === 1 ? 'hp-active' : ''}`}>
            <h2 className="hp-stats-title">교육 운영 현황</h2>
            <p className="hp-stats-sub">
              대한민국 해군 통신 교육의 핵심 지표
            </p>
            <div className="hp-stats-grid">
              {[
                { value: courses, unit: '개', label: '교육 과정', icon: '📋' },
                { value: graduates, unit: '명+', label: '누적 수료 인원', icon: '🎓' },
                { value: instructors, unit: '명', label: '전문 교관', icon: '👨‍✈️' },
                { value: venues, unit: '개소', label: '교육장', icon: '🏛️' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className={`hp-stat-card ${slide === 1 ? 'hp-active' : ''}`}
                  style={{ transitionDelay: `${i * 150}ms` }}
                >
                  <span className="hp-stat-icon">{stat.icon}</span>
                  <span className="hp-stat-value">
                    {stat.value.toLocaleString()}
                    <span className="hp-stat-unit">{stat.unit}</span>
                  </span>
                  <span className="hp-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Slide 3: Program Highlights ─── */}
        <section className="hp-slide hp-slide-programs">
          <div className={`hp-slide-content ${slide === 2 ? 'hp-active' : ''}`}>
            <h2 className="hp-programs-title">주요 교육 프로그램</h2>
            <p className="hp-programs-sub">
              해군 통신 분야 전문 인력 양성을 위한 핵심 교육과정
            </p>
            <div className="hp-programs-grid">
              {[
                {
                  tag: '정체성',
                  tagClass: 'hp-tag-identity',
                  title: '통신 보안 교육',
                  desc: '해군 통신 보안 체계의 이해와 실무 적용 능력을 배양하는 핵심 과정',
                  features: ['암호 운용 실습', '보안 장비 관리', '위협 대응 훈련'],
                },
                {
                  tag: '보안',
                  tagClass: 'hp-tag-security',
                  title: '전술 데이터링크',
                  desc: 'Link-16 등 전술 데이터링크 운용 및 유지보수 전문 교육',
                  features: ['TADIL 운용', '네트워크 설계', '연합작전 통신'],
                },
                {
                  tag: '통신',
                  tagClass: 'hp-tag-comm',
                  title: '위성통신 운용',
                  desc: 'MUOS/UHF/SHF 위성통신 체계 운용 및 장애 조치 과정',
                  features: ['위성 링크 설정', '주파수 관리', '장애 복구 절차'],
                },
              ].map((program, i) => (
                <div
                  key={program.title}
                  className={`hp-program-card ${slide === 2 ? 'hp-active' : ''}`}
                  style={{ transitionDelay: `${i * 200}ms` }}
                >
                  <div className="hp-program-top">
                    <span className={`hp-program-tag ${program.tagClass}`}>
                      {program.tag}
                    </span>
                  </div>
                  <h3 className="hp-program-name">{program.title}</h3>
                  <p className="hp-program-desc">{program.desc}</p>
                  <ul className="hp-program-features">
                    {program.features.map(f => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  <div className="hp-program-bottom">
                    <button className="hp-program-btn" onClick={onEnter}>
                      자세히 보기
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ── Navigation: Arrows ── */}
      <button className="hp-nav hp-nav-prev" onClick={prev} aria-label="이전">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M12 4L6 10L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button className="hp-nav hp-nav-next" onClick={next} aria-label="다음">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M8 4L14 10L8 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Navigation: Dots ── */}
      <div className="hp-dots">
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            className={`hp-dot ${slide === i ? 'hp-dot-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`슬라이드 ${i + 1}`}
          >
            <span className="hp-dot-inner" />
            {slide === i && <span className="hp-dot-progress" />}
          </button>
        ))}
      </div>

      {/* ── Slide Labels ── */}
      <div className="hp-slide-label">
        <span className="hp-slide-num">0{slide + 1}</span>
        <span className="hp-slide-sep">/</span>
        <span className="hp-slide-total">0{SLIDE_COUNT}</span>
      </div>
    </div>
  )
}
