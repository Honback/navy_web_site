import { useState, useEffect, useRef } from 'react'
import navyImage1 from '../assets/navy/navy_image1.jpg'
import TrainingInfoHero from './TrainingInfoHero'

// NavBar is rendered in App.tsx

interface HeroPageProps {
  onEnter: () => void
  onVenue: () => void
}

/* ══════════════════════════════════════════
   Variant A — 전함 돌파 (Warship Breakthrough)
   ══════════════════════════════════════════ */
function VariantA({ onEnter }: { onEnter: () => void }) {
  const [vis, setVis] = useState(false)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setTimeout(() => setVis(true), 300) }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!wrapRef.current) return
    const rect = wrapRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2
    setMouse({ x, y })
  }

  return (
    <div className="hwa-wrap" ref={wrapRef} onMouseMove={handleMouseMove}>
      <div
        className={`hwa-ship ${vis ? 'hwa-ship-in' : ''}`}
        style={{
          backgroundImage: `url(${navyImage1})`,
          transform: `scale(${vis ? 1.15 : 1.4}) translate(${mouse.x * -8}px, ${mouse.y * -8}px)`,
        }}
      />
      <div className="hwa-vignette" />
      <div className="hwa-scanlines" aria-hidden="true" />
      <div className={`hwa-content ${vis ? 'hwa-vis' : ''}`}>
        <div className="hwa-top-badge">REPUBLIC OF KOREA NAVY</div>
        <h1 className="hwa-title">
          <span className="hwa-title-en">ROK NAVY</span>
          <span className="hwa-title-kr">대한민국 해군</span>
        </h1>
        <p className="hwa-sub">바다를 지키는 힘, 대한민국 해군과 함께</p>
        <div className="hwa-divider" />
        <button className="hwa-cta" onClick={onEnter}>
          <span>시스템 접속</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
      <div className="hwa-wave" aria-hidden="true">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" fill="rgba(8,12,20,0.6)" />
          <path d="M0,80 C320,40 640,100 960,60 C1200,30 1380,70 1440,80 L1440,120 L0,120 Z" fill="rgba(8,12,20,0.85)" />
        </svg>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   Main — HeroPage with Nav + Sections
   ══════════════════════════════════════════ */
export default function HeroPage({ onEnter, onVenue }: HeroPageProps) {
  return (
    <div className="hv-container">
      {/* ── Hero Section ── */}
      <div className="hv-viewport">
        <VariantA onEnter={onEnter} />
      </div>

      {/* ── Training Info Section ── */}
      <div id="section-training" className="hv-ti-viewport">
        <TrainingInfoHero onEnter={onEnter} onVenue={onVenue} />
      </div>
    </div>
  )
}
