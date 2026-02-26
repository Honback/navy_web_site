import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { api } from '../services/api'
import type { Venue } from '../types'
import { KOREA_PROVINCES, KOREA_METROS } from '../data/koreaMap'

/* ── Region → Province mapping ── */
const PROVINCE_MAP: Record<string, string> = {
  '강릉': '강원도', '동해': '강원도', '태백': '강원도',
  '목포': '전라남도', '영암/목포': '전라남도',
  '부산': '부산광역시',
  '진해': '경상남도', '창원/진해': '경상남도', '통영': '경상남도',
  '천안': '충청남도',
  '화성': '경기도',
}

const getProvince = (region: string | null): string => {
  if (!region) return '기타'
  return PROVINCE_MAP[region] || '기타'
}

/* ── Pin coordinates on full map ── */
const REGION_PINS: Record<string, { x: number; y: number }> = {
  '경기도':     { x: 165, y: 285 },
  '강원도':     { x: 420, y: 200 },
  '충청남도':   { x: 150, y: 450 },
  '전라남도':   { x: 130, y: 790 },
  '경상남도':   { x: 390, y: 710 },
  '부산광역시': { x: 520, y: 720 },
}

/* ── SVG province ID → venue province name mapping ── */
const SVG_ID_TO_PROVINCE: Record<string, string> = {
  gyeonggi: '경기도', seoul: '경기도', incheon: '경기도',
  gangwon: '강원도',
  chungnam: '충청남도', daejeon: '충청남도', sejong: '충청남도',
  chungbuk: '충청남도',
  jeonbuk: '전라남도',
  jeonnam: '전라남도', gwangju: '전라남도',
  gyeongbuk: '경상남도',
  gyeongnam: '경상남도', daegu: '경상남도',
  busan: '부산광역시', ulsan: '부산광역시',
  jeju: '기타',
}

/* ── Province bounding boxes for zoom ── */
const PROVINCE_BOUNDS: Record<string, { x: number; y: number; w: number; h: number }> = {
  '경기도':     { x: 55, y: 55, w: 260, h: 330 },
  '강원도':     { x: 155, y: -15, w: 420, h: 365 },
  '충청남도':   { x: -15, y: 275, w: 450, h: 300 },
  '전라남도':   { x: -15, y: 510, w: 340, h: 430 },
  '경상남도':   { x: 235, y: 300, w: 390, h: 540 },
  '부산광역시': { x: 430, y: 580, w: 200, h: 230 },
}

/* ── Individual venue city coordinates on SVG ── */
const VENUE_CITY_COORDS: Record<string, { x: number; y: number }> = {
  '화성':     { x: 165, y: 320 },
  '강릉':     { x: 500, y: 175 },
  '동해':     { x: 515, y: 230 },
  '태백':     { x: 435, y: 295 },
  '천안':     { x: 215, y: 400 },
  '목포':     { x: 70, y: 810 },
  '영암/목포': { x: 100, y: 790 },
  '진해':     { x: 425, y: 745 },
  '창원/진해': { x: 405, y: 725 },
  '통영':     { x: 375, y: 780 },
  '부산':     { x: 525, y: 725 },
}

const DEFAULT_VB = { x: -10, y: -5, w: 620, h: 935 }

/* ── Region gradient colors for card thumbnails (fallback) ── */
const REGION_GRADIENT: Record<string, string> = {
  '경기도':     'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  '강원도':     'linear-gradient(135deg, #10b981 0%, #047857 100%)',
  '충청남도':   'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
  '전라남도':   'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  '경상남도':   'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
  '부산광역시': 'linear-gradient(135deg, #06b6d4 0%, #0e7490 100%)',
}

const REGION_ICON: Record<string, string> = {
  '경기도': '🏢', '강원도': '⛰️', '충청남도': '🏛️',
  '전라남도': '🌊', '경상남도': '⚓', '부산광역시': '🚢',
}

/* ── Venue thumbnail images ── */
const VENUE_THUMBNAIL: Record<string, string> = {
  '이순신리더십국제센터':        '/venues/yisunsin.jpg',
  '청호인재개발원':              '/venues/chungho.png',
  'DB생명 인재개발원':           '/venues/db_life.jpg',
  'YBM연수원':                   '/venues/ybm.jpg',
  '목포국제축구센터':            '/venues/mifc.png',
  '부산도시공사 아르피나':       '/venues/arpina.jpg',
  '호텔현대 바이 라한 목포':     '/venues/lahan.jpg',
  '한국여성수련원':              '/venues/kwcenter_panorama.jpg',
  '통영 동원리조트':             '/venues/dongwon.jpg',
  '동해 무릉건강숲':             '/venues/gangwon_forest.jpg',
}

export default function VenueInfo() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [filterRegion, setFilterRegion] = useState<string>('')
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)
  const [zoomedProvince, setZoomedProvince] = useState<string | null>(null)
  const [hoveredVenuePin, setHoveredVenuePin] = useState<string | null>(null)
  const [expandedVenueId, setExpandedVenueId] = useState<number | null>(null)
  const detailRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)
  const animRef = useRef<number>(0)
  const currentVB = useRef({ ...DEFAULT_VB })

  useEffect(() => {
    api.getVenues()
      .then(setVenues)
      .catch(() => setError('교육장 정보를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  const provinces = useMemo(() => {
    const set = new Set<string>()
    venues.forEach(v => set.add(getProvince(v.region)))
    return Array.from(set).sort()
  }, [venues])

  const venueCountByProvince = useMemo(() => {
    const counts: Record<string, number> = {}
    venues.forEach(v => {
      const p = getProvince(v.region)
      counts[p] = (counts[p] || 0) + 1
    })
    return counts
  }, [venues])

  /* Venue pins grouped by city for zoomed view */
  const venuesByCity = useMemo(() => {
    if (!zoomedProvince) return []
    const pvVenues = venues.filter(v => getProvince(v.region) === zoomedProvince)
    const cityMap = new Map<string, Venue[]>()
    pvVenues.forEach(v => {
      const r = v.region || '기타'
      if (!cityMap.has(r)) cityMap.set(r, [])
      cityMap.get(r)!.push(v)
    })
    return Array.from(cityMap.entries())
      .filter(([r]) => VENUE_CITY_COORDS[r])
      .map(([region, vList]) => ({
        region,
        venues: vList,
        ...VENUE_CITY_COORDS[region]
      }))
  }, [venues, zoomedProvince])

  const animateViewBox = useCallback((target: typeof DEFAULT_VB) => {
    cancelAnimationFrame(animRef.current)
    const animate = () => {
      const c = currentVB.current
      const ease = 0.12
      c.x += (target.x - c.x) * ease
      c.y += (target.y - c.y) * ease
      c.w += (target.w - c.w) * ease
      c.h += (target.h - c.h) * ease
      if (svgRef.current) {
        svgRef.current.setAttribute('viewBox',
          `${c.x.toFixed(1)} ${c.y.toFixed(1)} ${c.w.toFixed(1)} ${c.h.toFixed(1)}`)
      }
      const done = Math.abs(target.x - c.x) < 0.3 && Math.abs(target.y - c.y) < 0.3 &&
                   Math.abs(target.w - c.w) < 0.3 && Math.abs(target.h - c.h) < 0.3
      if (!done) {
        animRef.current = requestAnimationFrame(animate)
      } else {
        Object.assign(c, target)
        if (svgRef.current) {
          svgRef.current.setAttribute('viewBox', `${target.x} ${target.y} ${target.w} ${target.h}`)
        }
      }
    }
    animRef.current = requestAnimationFrame(animate)
  }, [])

  const handlePinClick = (province: string) => {
    const toggling = filterRegion === province
    setFilterRegion(toggling ? '' : province)

    if (toggling) {
      setZoomedProvince(null)
      setHoveredVenuePin(null)
      animateViewBox(DEFAULT_VB)
    } else {
      setZoomedProvince(province)
      const b = PROVINCE_BOUNDS[province]
      if (b) {
        const pad = 30
        animateViewBox({ x: b.x - pad, y: b.y - pad, w: b.w + pad * 2, h: b.h + pad * 2 })
      }
    }
  }

  const handleZoomOut = () => {
    setZoomedProvince(null)
    setFilterRegion('')
    setHoveredVenuePin(null)
    animateViewBox(DEFAULT_VB)
  }

  const renderPipeText = (text: string | null) => {
    if (!text) return null
    const lines = text.split('|').map(s => s.trim()).filter(Boolean)
    if (lines.length === 0) return null
    return (
      <ul className="vi-pipe-list">
        {lines.map((line, i) => <li key={i}>{line}</li>)}
      </ul>
    )
  }

  if (loading) return <div className="loading">불러오는 중...</div>
  if (error) return <div className="message error">{error}</div>

  // ============ Detail Page ============
  if (selectedVenue) {
    const v = selectedVenue
    return (
      <div className="vi-page">
        <div className="vi-page-top">
          <button className="vi-back-btn" onClick={() => setSelectedVenue(null)}>
            &larr; 목록으로 돌아가기
          </button>
        </div>
        <div className="vi-hero">
          <div className="vi-hero-content">
            <div className="vi-hero-tags">
              <span className="vi-region-tag">{v.region || '기타'}</span>
              {v.building && <span className="vi-type-tag">{v.building}</span>}
            </div>
            <h1 className="vi-hero-title">{v.name}</h1>
            {v.summary && <p className="vi-hero-desc">{v.summary}</p>}
            {v.address && <p className="vi-hero-address">{v.address}</p>}
          </div>
          <div className="vi-specs">
            <div className="vi-spec"><span className="vi-spec-value">{v.capacity}</span><span className="vi-spec-label">총 수용(명)</span></div>
            <div className="vi-spec"><span className="vi-spec-value">{v.lectureCapacity || '-'}</span><span className="vi-spec-label">강의장(명)</span></div>
            <div className="vi-spec"><span className="vi-spec-value">{v.accommodationCapacity || '-'}</span><span className="vi-spec-label">숙소(명)</span></div>
          </div>
        </div>
        <div className="vi-features">
          {(v.lectureRooms || v.roomNumber || v.bannerSize || v.deskLayout) && (
            <section className="vi-feature"><div className="vi-feature-icon">&#127979;</div><div className="vi-feature-body"><h3>강의실</h3>{v.roomNumber && <p className="vi-feature-highlight">주 강의실: {v.roomNumber}</p>}{renderPipeText(v.lectureRooms)}{(v.bannerSize || v.deskLayout) && (<div className="vi-feature-meta">{v.bannerSize && <span>현수막 {v.bannerSize}</span>}{v.deskLayout && <span>책상배치 {v.deskLayout}</span>}</div>)}</div></section>
          )}
          {(v.roomStatus || v.roomAmenities || v.personalItems) && (
            <section className="vi-feature"><div className="vi-feature-icon">&#128719;</div><div className="vi-feature-body"><h3>숙소 및 비품</h3>{renderPipeText(v.roomStatus)}{v.roomAmenities && (<div className="vi-inline-detail"><strong>구비 비품</strong><span>{v.roomAmenities}</span></div>)}{v.personalItems && (<div className="vi-inline-detail"><strong>개인 준비물</strong><span>{v.personalItems}</span></div>)}</div></section>
          )}
          {(v.convenienceFacilities || v.restaurantContact) && (
            <section className="vi-feature"><div className="vi-feature-icon">&#9749;</div><div className="vi-feature-body"><h3>편의시설</h3>{v.convenienceFacilities && <p>{v.convenienceFacilities}</p>}{v.restaurantContact && (<div className="vi-inline-detail"><strong>식당 연락처</strong><span>{v.restaurantContact}</span></div>)}</div></section>
          )}
          {v.subFacilities && (
            <section className="vi-feature"><div className="vi-feature-icon">&#127947;</div><div className="vi-feature-body"><h3>부대시설</h3>{renderPipeText(v.subFacilities)}</div></section>
          )}
        </div>
        {v.website && (
          <div className="vi-footer-info"><a href={v.website} target="_blank" rel="noopener noreferrer" className="vi-link">웹사이트 방문 &rarr;</a></div>
        )}
      </div>
    )
  }

  // ============ Map + Card List (combined) ============
  return (
    <>
      {/* ── Korea Map ── */}
      <div className="vmap-hero">
          <div className="vmap-bg" />
          <div className="vmap-content">
            <div className="vmap-text">
              <span className="vmap-badge">TRAINING VENUES</span>
              <h1 className="vmap-title">전국 교육장 안내</h1>
              <p className="vmap-desc">대한민국 해군 교육을 위한 전국 {venues.length}개 교육장</p>
              <div className="vmap-legend">
                {provinces.map(p => (
                  <button
                    key={p}
                    className={`vmap-legend-item ${filterRegion === p ? 'vmap-legend-active' : ''}`}
                    onClick={() => handlePinClick(p)}
                  >
                    <span className="vmap-legend-dot" />
                    <span>{p}</span>
                    <span className="vmap-legend-count">{venueCountByProvince[p] || 0}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="vmap-map-wrap">
              {zoomedProvince && (
                <button className="vmap-back-btn" onClick={handleZoomOut}>
                  &larr; 전체 보기
                </button>
              )}
              {zoomedProvince && (
                <div className="vmap-zoomed-label">{zoomedProvince}</div>
              )}
              <svg
                ref={svgRef}
                viewBox="-10 -5 620 935"
                className="vmap-svg"
                xmlns="http://www.w3.org/2000/svg"
                onClick={(e) => {
                  if (zoomedProvince && e.target === svgRef.current) handleZoomOut()
                }}
              >
                {/* Province fills (detailed real geography) */}
                {Object.entries(KOREA_PROVINCES).map(([id, d]) => {
                  const prov = SVG_ID_TO_PROVINCE[id]
                  const isActive = prov === zoomedProvince || (!zoomedProvince && prov === filterRegion)
                  const isHovered = !zoomedProvince && prov === hoveredPin
                  const isDimmed = !!zoomedProvince && prov !== zoomedProvince
                  return (
                    <path
                      key={id}
                      className={`vmap-province${isActive ? ' vmap-province-active' : ''}${isHovered ? ' vmap-province-hover' : ''}${isDimmed ? ' vmap-province-dimmed' : ''}`}
                      d={d}
                      fillRule="evenodd"
                      onClick={() => !zoomedProvince && prov && prov !== '기타' && handlePinClick(prov)}
                      onMouseEnter={() => !zoomedProvince && prov && prov !== '기타' && setHoveredPin(prov)}
                      onMouseLeave={() => setHoveredPin(null)}
                      style={{ cursor: !zoomedProvince && prov && prov !== '기타' ? 'pointer' : 'default' }}
                    />
                  )
                })}
                {/* Metro city fills */}
                {Object.entries(KOREA_METROS).map(([id, d]) => {
                  const prov = SVG_ID_TO_PROVINCE[id]
                  const isActive = prov === zoomedProvince || (!zoomedProvince && prov === filterRegion)
                  const isHovered = !zoomedProvince && prov === hoveredPin
                  const isDimmed = !!zoomedProvince && prov !== zoomedProvince
                  return (
                    <path
                      key={id}
                      className={`vmap-metro${isActive ? ' vmap-province-active' : ''}${isHovered ? ' vmap-province-hover' : ''}${isDimmed ? ' vmap-province-dimmed' : ''}`}
                      d={d}
                      onClick={() => !zoomedProvince && prov && prov !== '기타' && handlePinClick(prov)}
                      onMouseEnter={() => !zoomedProvince && prov && prov !== '기타' && setHoveredPin(prov)}
                      onMouseLeave={() => setHoveredPin(null)}
                      style={{ cursor: !zoomedProvince && prov && prov !== '기타' ? 'pointer' : 'default' }}
                    />
                  )
                })}

                {/* Sea labels - only when not zoomed */}
                {!zoomedProvince && (
                  <>
                    <text x="15" y="500" className="vmap-sea-label">서해</text>
                    <text x="590" y="420" className="vmap-sea-label">동해</text>
                  </>
                )}

                {/* Reference cities - only when not zoomed */}
                {!zoomedProvince && (
                  <>
                    <circle cx="150" cy="230" r="8" className="vmap-ref-city" />
                    <text x="150" y="200" className="vmap-city-label">서울</text>
                    <circle cx="225" cy="480" r="7" className="vmap-ref-city" />
                    <text x="225" y="450" className="vmap-city-label">대전</text>
                    <circle cx="430" cy="600" r="7" className="vmap-ref-city" />
                    <text x="430" y="570" className="vmap-city-label">대구</text>
                  </>
                )}

                {/* Region pins - only when NOT zoomed */}
                {!zoomedProvince && Object.entries(REGION_PINS).map(([province, pos]) => {
                  const count = venueCountByProvince[province] || 0
                  if (count === 0) return null
                  const isActive = filterRegion === province
                  const isHovered = hoveredPin === province
                  const expanded = isActive || isHovered
                  return (
                    <g
                      key={province}
                      className={`vmap-pin-group ${isActive ? 'vmap-pin-active' : ''}`}
                      onClick={() => handlePinClick(province)}
                      onMouseEnter={() => setHoveredPin(province)}
                      onMouseLeave={() => setHoveredPin(null)}
                      style={{ cursor: 'pointer' }}
                    >
                      <circle cx={pos.x} cy={pos.y} r="60" className="vmap-pin-pulse" />
                      <circle cx={pos.x} cy={pos.y} r={expanded ? 40 : 32} className="vmap-pin-outer" />
                      <circle cx={pos.x} cy={pos.y} r={expanded ? 30 : 24} className="vmap-pin-inner" />
                      <text x={pos.x} y={pos.y + 12} className="vmap-pin-count">{count}</text>
                      {expanded && (
                        <g>
                          <rect x={pos.x - 90} y={pos.y - 85} width="180" height="40" rx="8" className="vmap-tooltip-bg" />
                          <text x={pos.x} y={pos.y - 58} className="vmap-tooltip-text">{province}</text>
                        </g>
                      )}
                      {!expanded && (
                        <text x={pos.x} y={pos.y - 42} className="vmap-pin-label">{province}</text>
                      )}
                    </g>
                  )
                })}

                {/* Venue city pins - only when ZOOMED */}
                {zoomedProvince && venuesByCity.map(({ region, venues: vList, x, y }) => {
                  const isHovered = hoveredVenuePin === region
                  return (
                    <g
                      key={region}
                      className={`vmap-venue-pin${isHovered ? ' vmap-venue-pin-hover' : ''}`}
                      onMouseEnter={() => setHoveredVenuePin(region)}
                      onMouseLeave={() => setHoveredVenuePin(null)}
                      onClick={() => {
                        setTimeout(() => listRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Pulse ring */}
                      <circle cx={x} cy={y} r="24" className="vmap-venue-pulse" />
                      {/* Outer dot */}
                      <circle cx={x} cy={y} r={isHovered ? 16 : 12} className="vmap-venue-dot" />
                      {/* Inner dot */}
                      <circle cx={x} cy={y} r={isHovered ? 7 : 5} className="vmap-venue-dot-inner" />
                      {/* City name */}
                      <text x={x} y={y - 22} className="vmap-venue-name">{region}</text>
                      {/* Venue count */}
                      <text x={x} y={y + 30} className="vmap-venue-subtext">
                        {vList.length}개 교육장
                      </text>
                      {/* Tooltip with venue names on hover */}
                      {isHovered && vList.length > 0 && (
                        <g>
                          <rect
                            x={x - 80}
                            y={y + 38}
                            width="160"
                            height={10 + vList.length * 18}
                            rx="4"
                            className="vmap-venue-tooltip-bg"
                          />
                          {vList.map((v, i) => (
                            <text
                              key={v.id}
                              x={x}
                              y={y + 54 + i * 18}
                              className="vmap-venue-tooltip-name"
                            >
                              {v.name}
                            </text>
                          ))}
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        </div>

      {/* ── Venue Cards ── */}
      {(() => {
        const filtered = filterRegion ? venues.filter(v => getProvince(v.region) === filterRegion) : venues
        const expandedVenue = expandedVenueId ? venues.find(v => v.id === expandedVenueId) : null
        return (
          <div ref={listRef} className="vb2-wrap">
            <div className="vb2-header">
              <div className="vb2-header-left">
                <h1 className="vb2-title">전국 교육장 안내</h1>
                <span className="vb2-count">총 {filtered.length}곳</span>
              </div>
              <select className="vb2-filter" value={filterRegion} onChange={e => { setFilterRegion(e.target.value); setExpandedVenueId(null) }}>
                <option value="">전체 지역</option>
                {provinces.map(p => (
                  <option key={p} value={p}>{p} ({venues.filter(v => getProvince(v.region) === p).length})</option>
                ))}
              </select>
            </div>
            <div className="vb2-grid">
              {filtered.map(v => {
                const prov = getProvince(v.region)
                const isExpanded = expandedVenueId === v.id
                return (
                  <div
                    key={v.id}
                    className={`vb2-card ${isExpanded ? 'vb2-card-active' : ''}`}
                    onClick={() => {
                      setExpandedVenueId(isExpanded ? null : v.id)
                      if (!isExpanded) setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100)
                    }}
                  >
                    <div className="vb2-card-img" style={{ background: REGION_GRADIENT[prov] || 'linear-gradient(135deg,#94a3b8,#64748b)' }}>
                      {VENUE_THUMBNAIL[v.name]
                        ? <img src={VENUE_THUMBNAIL[v.name]} alt={v.name} className="vb2-card-photo" />
                        : <span className="vb2-card-emoji">{REGION_ICON[prov] || '📍'}</span>
                      }
                      <span className="vb2-card-region-tag">{v.region || prov}</span>
                    </div>
                    <div className="vb2-card-info">
                      <h3 className="vb2-card-name">{v.name}</h3>
                      {v.address && <p className="vb2-card-addr">{v.address}</p>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* ── Expanded Detail Panel ── */}
            {expandedVenue && (
              <div ref={detailRef} className="vb2-detail">
                <div className="vb2-detail-top">
                  <div className="vb2-detail-head">
                    <div className="vb2-detail-tags">
                      <span className="vi-region-tag">{expandedVenue.region || '기타'}</span>
                      {expandedVenue.building && <span className="vi-type-tag">{expandedVenue.building}</span>}
                    </div>
                    <h2 className="vb2-detail-title">{expandedVenue.name}</h2>
                    {expandedVenue.summary && <p className="vb2-detail-desc">{expandedVenue.summary}</p>}
                    {expandedVenue.address && <p className="vb2-detail-addr">{expandedVenue.address}</p>}
                  </div>
                  <div className="vb2-detail-specs">
                    <div className="vb2-spec"><span className="vb2-spec-val">{expandedVenue.capacity}</span><span className="vb2-spec-lbl">총 수용(명)</span></div>
                    <div className="vb2-spec"><span className="vb2-spec-val">{expandedVenue.lectureCapacity || '-'}</span><span className="vb2-spec-lbl">강의장(명)</span></div>
                    <div className="vb2-spec"><span className="vb2-spec-val">{expandedVenue.accommodationCapacity || '-'}</span><span className="vb2-spec-lbl">숙소(명)</span></div>
                  </div>
                </div>
                <div className="vi-features">
                  {(expandedVenue.lectureRooms || expandedVenue.roomNumber || expandedVenue.bannerSize || expandedVenue.deskLayout) && (
                    <section className="vi-feature"><div className="vi-feature-icon">&#127979;</div><div className="vi-feature-body"><h3>강의실</h3>{expandedVenue.roomNumber && <p className="vi-feature-highlight">주 강의실: {expandedVenue.roomNumber}</p>}{renderPipeText(expandedVenue.lectureRooms)}{(expandedVenue.bannerSize || expandedVenue.deskLayout) && (<div className="vi-feature-meta">{expandedVenue.bannerSize && <span>현수막 {expandedVenue.bannerSize}</span>}{expandedVenue.deskLayout && <span>책상배치 {expandedVenue.deskLayout}</span>}</div>)}</div></section>
                  )}
                  {(expandedVenue.roomStatus || expandedVenue.roomAmenities || expandedVenue.personalItems) && (
                    <section className="vi-feature"><div className="vi-feature-icon">&#128719;</div><div className="vi-feature-body"><h3>숙소 및 비품</h3>{renderPipeText(expandedVenue.roomStatus)}{expandedVenue.roomAmenities && (<div className="vi-inline-detail"><strong>구비 비품</strong><span>{expandedVenue.roomAmenities}</span></div>)}{expandedVenue.personalItems && (<div className="vi-inline-detail"><strong>개인 준비물</strong><span>{expandedVenue.personalItems}</span></div>)}</div></section>
                  )}
                  {(expandedVenue.convenienceFacilities || expandedVenue.restaurantContact) && (
                    <section className="vi-feature"><div className="vi-feature-icon">&#9749;</div><div className="vi-feature-body"><h3>편의시설</h3>{expandedVenue.convenienceFacilities && <p>{expandedVenue.convenienceFacilities}</p>}{expandedVenue.restaurantContact && (<div className="vi-inline-detail"><strong>식당 연락처</strong><span>{expandedVenue.restaurantContact}</span></div>)}</div></section>
                  )}
                  {expandedVenue.subFacilities && (
                    <section className="vi-feature"><div className="vi-feature-icon">&#127947;</div><div className="vi-feature-body"><h3>부대시설</h3>{renderPipeText(expandedVenue.subFacilities)}</div></section>
                  )}
                </div>
                {expandedVenue.website && (
                  <div className="vi-footer-info"><a href={expandedVenue.website} target="_blank" rel="noopener noreferrer" className="vi-link">웹사이트 방문 &rarr;</a></div>
                )}
                <button className="vb2-detail-close" onClick={() => setExpandedVenueId(null)}>닫기</button>
              </div>
            )}
          </div>
        )
      })()}

    </>
  )
}
