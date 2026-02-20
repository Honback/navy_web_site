import { useState, useEffect, useMemo } from 'react'
import { api } from '../services/api'
import type { Venue } from '../types'

export default function VenueInfo() {
  const [venues, setVenues] = useState<Venue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null)
  const [filterRegion, setFilterRegion] = useState<string>('')

  useEffect(() => {
    api.getVenues()
      .then(setVenues)
      .catch(() => setError('교육장 정보를 불러오는데 실패했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const getProvince = (region: string | null): string => {
    if (!region) return '기타'
    const map: Record<string, string> = {
      '강릉': '강원도', '동해': '강원도', '태백': '강원도',
      '목포': '전라남도', '영암/목포': '전라남도',
      '부산': '부산광역시',
      '진해': '경상남도', '창원/진해': '경상남도', '통영': '경상남도',
      '천안': '충청남도',
      '화성': '경기도',
    }
    return map[region] || '기타'
  }

  const provinces = useMemo(() => {
    const set = new Set<string>()
    venues.forEach(v => set.add(getProvince(v.region)))
    return Array.from(set).sort()
  }, [venues])

  const grouped = useMemo(() => {
    const filtered = filterRegion ? venues.filter(v => getProvince(v.region) === filterRegion) : venues
    const map = new Map<string, Venue[]>()
    filtered.forEach(v => {
      const key = getProvince(v.region)
      if (!map.has(key)) map.set(key, [])
      map.get(key)!.push(v)
    })
    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }, [venues, filterRegion])

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
        <button className="vi-back-btn" onClick={() => setSelectedVenue(null)}>
          &larr; 목록으로 돌아가기
        </button>

        {/* Hero */}
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
            <div className="vi-spec">
              <span className="vi-spec-value">{v.capacity}</span>
              <span className="vi-spec-label">총 수용(명)</span>
            </div>
            <div className="vi-spec">
              <span className="vi-spec-value">{v.lectureCapacity || '-'}</span>
              <span className="vi-spec-label">강의장(명)</span>
            </div>
            <div className="vi-spec">
              <span className="vi-spec-value">{v.accommodationCapacity || '-'}</span>
              <span className="vi-spec-label">숙소(명)</span>
            </div>
          </div>
        </div>

        {/* Feature sections */}
        <div className="vi-features">
          {(v.lectureRooms || v.roomNumber || v.bannerSize || v.deskLayout) && (
            <section className="vi-feature">
              <div className="vi-feature-icon">&#127979;</div>
              <div className="vi-feature-body">
                <h3>강의실</h3>
                {v.roomNumber && <p className="vi-feature-highlight">주 강의실: {v.roomNumber}</p>}
                {renderPipeText(v.lectureRooms)}
                {(v.bannerSize || v.deskLayout) && (
                  <div className="vi-feature-meta">
                    {v.bannerSize && <span>현수막 {v.bannerSize}</span>}
                    {v.deskLayout && <span>책상배치 {v.deskLayout}</span>}
                  </div>
                )}
              </div>
            </section>
          )}

          {(v.roomStatus || v.roomAmenities || v.personalItems) && (
            <section className="vi-feature">
              <div className="vi-feature-icon">&#128719;</div>
              <div className="vi-feature-body">
                <h3>숙소 및 비품</h3>
                {renderPipeText(v.roomStatus)}
                {v.roomAmenities && (
                  <div className="vi-inline-detail">
                    <strong>구비 비품</strong>
                    <span>{v.roomAmenities}</span>
                  </div>
                )}
                {v.personalItems && (
                  <div className="vi-inline-detail">
                    <strong>개인 준비물</strong>
                    <span>{v.personalItems}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {(v.convenienceFacilities || v.restaurantContact) && (
            <section className="vi-feature">
              <div className="vi-feature-icon">&#9749;</div>
              <div className="vi-feature-body">
                <h3>편의시설</h3>
                {v.convenienceFacilities && <p>{v.convenienceFacilities}</p>}
                {v.restaurantContact && (
                  <div className="vi-inline-detail">
                    <strong>식당 연락처</strong>
                    <span>{v.restaurantContact}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {v.subFacilities && (
            <section className="vi-feature">
              <div className="vi-feature-icon">&#127947;</div>
              <div className="vi-feature-body">
                <h3>부대시설</h3>
                {renderPipeText(v.subFacilities)}
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        {v.website && (
          <div className="vi-footer-info">
            <a href={v.website} target="_blank" rel="noopener noreferrer" className="vi-link">
              웹사이트 방문 &rarr;
            </a>
          </div>
        )}
      </div>
    )
  }

  // ============ Card List ============
  return (
    <div className="management-page">
      <div className="management-header">
        <h2>교육장 안내</h2>
        <div className="header-info">
          <span className="count-badge">총 {venues.length}곳</span>
          <select
            className="filter-select"
            value={filterRegion}
            onChange={e => setFilterRegion(e.target.value)}
          >
            <option value="">전체 지역</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p} ({venues.filter(v => getProvince(v.region) === p).length}곳)</option>
            ))}
          </select>
        </div>
      </div>

      {grouped.map(([region, regionVenues]) => (
        <div key={region} className="vi-region-group">
          <h3 className="vi-region-title">{region}</h3>
          <div className="vi-card-grid">
            {regionVenues.map(v => (
              <div key={v.id} className="vi-card" onClick={() => setSelectedVenue(v)}>
                <div className="vi-card-header">
                  <strong className="vi-card-name">{v.name}</strong>
                  {v.region && <span className="vi-card-region">{v.region}</span>}
                </div>
                {v.summary && <p className="vi-card-summary">{v.summary}</p>}
                <div className="vi-card-specs">
                  <span className="vi-card-spec">
                    <span className="vi-card-spec-num">{v.lectureCapacity || '-'}</span>
                    강의장
                  </span>
                  <span className="vi-card-spec-divider" />
                  <span className="vi-card-spec">
                    <span className="vi-card-spec-num">{v.accommodationCapacity || '-'}</span>
                    숙소
                  </span>
                  <span className="vi-card-spec-divider" />
                  <span className="vi-card-spec">
                    <span className="vi-card-spec-num">{v.capacity}</span>
                    총 수용
                  </span>
                </div>
                {v.address && <p className="vi-card-address">{v.address}</p>}
                <div className="vi-card-footer">
                  <span className="vi-card-more">상세 보기 &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
