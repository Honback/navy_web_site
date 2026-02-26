import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Instructor } from '../types'

// Photos mapped by instructor name
import kangDongwanImg from '../assets/instructors/kang_dongwan.jpg'
import kwonKihyungImg from '../assets/instructors/kwon_kihyung.png'
import choiMyunghanImg from '../assets/instructors/choi_myunghan.png'
import kimDongsuImg from '../assets/instructors/kim_dongsu.jpeg'
import wangSuntaekImg from '../assets/instructors/wang_suntaek.png'
import hongSeokhunImg from '../assets/instructors/hong_seokhun.jpg'
import koGwangsubImg from '../assets/instructors/ko_gwangsub.png'
import parkTaeyongImg from '../assets/instructors/park_taeyong.png'
import leeHiwanImg from '../assets/instructors/lee_hiwan.jpg'
import choiWonilImg from '../assets/instructors/choi_wonil.png'
import kangSeokseungImg from '../assets/instructors/kang_seokseung.jpg'
import choiJinupImg from '../assets/instructors/choi_jinup.jpg'
import sonJungminImg from '../assets/instructors/son_jungmin.png'
import shinJungheeImg from '../assets/instructors/shin_junghee.png'
import ohJihyeImg from '../assets/instructors/oh_jihye.jpg'
import leeHaeinImg from '../assets/instructors/lee_haein.png'
import jungSojinImg from '../assets/instructors/jung_sojin.png'
import jungJinyoungImg from '../assets/instructors/jung_jinyoung.png'
import joRaehoonImg from '../assets/instructors/jo_raehoon.png'
import choiHaeryungImg from '../assets/instructors/choi_haeryung.png'
import kimNinaImg from '../assets/instructors/kim_nina.png'
import kimJooyeonImg from '../assets/instructors/kim_jooyeon.png'
import leeJunggyuImg from '../assets/instructors/lee_junggyu.png'

export const PHOTO_MAP: Record<string, string> = {
  // 해군정체성
  '강동완': kangDongwanImg,
  '고광섭': koGwangsubImg,
  '권기형': kwonKihyungImg,
  '박태용': parkTaeyongImg,
  '이희완': leeHiwanImg,
  '최명한': choiMyunghanImg,
  '최원일': choiWonilImg,
  // 안보
  '강석승': kangSeokseungImg,
  '김동수': kimDongsuImg,
  '왕선택': wangSuntaekImg,
  '최진업': choiJinupImg,
  '홍석훈': hongSeokhunImg,
  // 소통
  '손정민': sonJungminImg,
  '신정희': shinJungheeImg,
  '오지혜': ohJihyeImg,
  '이해인': leeHaeinImg,
  '정소진': jungSojinImg,
  '정진영': jungJinyoungImg,
  '조래훈': joRaehoonImg,
  '최해령': choiHaeryungImg,
  '김니나': kimNinaImg,
  '김주연': kimJooyeonImg,
  '이정규': leeJunggyuImg,
}

const CATEGORY_ORDER = ['해군정체성', '안보', '소통']
const CATEGORY_LABELS: Record<string, string> = {
  '해군정체성': '해군정체성',
  '안보': '안보(군인정신)',
  '소통': '소통',
}

export default function InstructorInfo() {
  const [instructors, setInstructors] = useState<Instructor[]>([])

  useEffect(() => {
    api.getInstructors().then(setInstructors).catch(() => {})
  }, [])

  const grouped = CATEGORY_ORDER.map(cat => ({
    category: cat,
    label: CATEGORY_LABELS[cat] || cat,
    items: instructors.filter(i => i.category === cat),
  })).filter(g => g.items.length > 0)

  return (
    <div className="ii-wrap">
      <div className="ii-header">
        <h2 className="ii-title">강사진 안내</h2>
        <p className="ii-desc">전문성과 감동을 전하는 강사진 (총 {instructors.length}명)</p>
      </div>

      {grouped.map(group => (
        <div key={group.category} className="ii-category">
          <h3 className="ii-cat-title">
            <span className={`ii-cat-badge ii-cat-${group.category === '해군정체성' ? 'identity' : group.category === '안보' ? 'security' : 'communication'}`}>
              {group.label}
            </span>
            <span className="ii-cat-count">{group.items.length}명</span>
          </h3>
          <div className="ii-grid">
            {group.items.map((inst) => {
              const photo = inst.photoUrl || PHOTO_MAP[inst.name]
              return (
                <div className="ii-card" key={inst.id}>
                  <div className={`ii-photo ${!photo ? 'ii-photo-empty' : ''}`}>
                    {photo ? (
                      <img src={photo} alt={inst.name} />
                    ) : (
                      <span className="ii-initial">{inst.name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="ii-name">{inst.name}</div>
                  <div className="ii-role">{inst.rank}</div>
                  {inst.specialty && <div className="ii-specialty">{inst.specialty}</div>}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
