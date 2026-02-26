import { useState, useEffect } from 'react'

// Navy images
import navyImage1 from '../assets/navy/navy_image1.jpg'
import navyImage2 from '../assets/navy/navy_image2.jpg'
import navyImage3 from '../assets/navy/navy_image3.jpg'
import navyImage4 from '../assets/navy/navy_image4.jpg'
import navyLecture from '../assets/navy/navy_lecture.jpg'
import navyOnboard from '../assets/navy/navy_onboard.jpg'
import navyTeam from '../assets/navy/navy_team.jpg'

const programs = [
  { badge: '필수', title: '해군 정체성 초빙강연', subtitle: '해군 자긍심 고취 및 정체성 함양 교육', image: navyLecture, items: ['해군 창군기, 발전 과정, 주요 해전 이해', '제1·2연평해전 등 피로써 지킨 바다의 역사', '세계 속 대한민국 해군의 위상'] },
  { badge: '필수', title: '군인정신 초빙강연', subtitle: '국가관·대적관·군인정신 함양', image: navyOnboard, items: ['투철한 국가관과 자유민주주의 이념 확립', '북한의 군사적 위협과 실상 이해', '한미동맹의 중요성 인식'] },
  { badge: '선택', title: '정신전력 강화 프로그램', subtitle: '부대 특성에 맞게 선택형으로 진행', image: navyTeam, items: ['함정 특성과 요구에 맞게 프로그램 선택 가능', '부대 맞춤형 활동으로 교육 효과 극대화', '팀 빌딩, 레크리에이션 등 다양한 프로그램'] },
]

const heroImages = [navyImage1, navyImage2, navyImage3, navyImage4]

const scheduleCamp = {
  title: '합숙형 교육 (1박 2일)',
  day1: [
    { time: '10:00 ~ 11:00', desc: '교육장 이동 및 도착' },
    { time: '11:00 ~ 12:00', desc: '입교식 및 교육안내' },
    { time: '12:00 ~ 13:00', desc: '중식' },
    { time: '13:00 ~ 14:50', desc: '해군 정체성 초빙강연' },
    { time: '14:50 ~ 15:00', desc: '휴식시간' },
    { time: '15:00 ~ 17:00', desc: '정신전력 강화 프로그램' },
    { time: '17:00 ~ 18:00', desc: '행정시간' },
    { time: '18:00 ~ 18:50', desc: '석식' },
  ],
  day2: [
    { time: '07:00 ~ 08:00', desc: '조식' },
    { time: '08:00 ~ 09:00', desc: '행정 시간 (체크아웃)' },
    { time: '09:00 ~ 11:00', desc: '군인정신 초빙강연' },
    { time: '11:00 ~ 11:50', desc: '퇴소식 / 교육 설문조사' },
    { time: '12:00 ~ 12:50', desc: '중식' },
    { time: '13:00 ~ 13:50', desc: '부대 복귀' },
  ],
}

const scheduleIntensive = {
  title: '집중형 교육 (1일)',
  items: [
    { time: '09:00 ~ 09:30', desc: '교육장 이동' },
    { time: '09:30 ~ 10:00', desc: '입교식 및 교육안내' },
    { time: '10:00 ~ 11:50', desc: '해군 정체성 초빙강연' },
    { time: '11:50 ~ 13:20', desc: '중식' },
    { time: '13:20 ~ 13:30', desc: '휴식 시간' },
    { time: '13:30 ~ 15:00', desc: '군인정신 초빙강연' },
    { time: '15:00 ~ 15:20', desc: '행정 시간' },
    { time: '15:20 ~ 17:00', desc: '정신전력 강화 프로그램' },
    { time: '17:00 ~ 17:30', desc: '부대 복귀' },
  ],
}

const locations = [
  { area: '1함대 권역', places: '동해 무릉건강숲, 동해보양온천컨벤션 등' },
  { area: '2함대 권역', places: '화성 YBM연수원 등' },
  { area: '3함대 권역', places: '청호인재개발원, DB생명 인재개발원 등' },
  { area: '진해 및 부산 권역', places: '진해 이순신리더십센터, 부산 아르피나 등' },
]

const processSteps = [
  { num: 1, title: '교육 신청', items: ['각 함대 정훈공보실을 통해 신청', '1차 신청기한 5월 중 완료', '운영사무국과 협의하여 결정'] },
  { num: 2, title: '일정 및 장소 확정', items: ['교육장소 섭외 및 강사 매칭', '최종 일정 및 장소 통보', '세부사항 조율'] },
  { num: 3, title: '교육 실시', items: ['계획된 일정에 따라 진행', '만족도 설문조사 실시', '피드백 수집'] },
  { num: 4, title: '사후 관리', items: ['결과 보고서 작성 및 공유', '차기 교육 개선을 위한 피드백 반영'] },
]

const staffDuties = [
  { phase: '사전 준비', period: 'D-30~D-1', items: ['교육 신청', '일정/장소 확인', '참가자 안내', '자료 확인'], highlight: false },
  { phase: '교육 당일', period: 'D-Day', items: ['참가자 인솔', '교육 참여 독려', '질서 유지', '비상상황 대비'], highlight: true },
  { phase: '사후 관리', period: 'D+1~D+7', items: ['안전한 복귀', '설문조사 독려', '결과 공유', '피드백 제출'], highlight: false },
]

const faqs = [
  { q: '교육 신청은 어떻게 하나요?', a: '각 함대 정훈공보실과 협의하여 신청 날짜, 프로그램 형태(1일/2일) 등을 제출합니다.' },
  { q: '준비물은 무엇인가요?', a: '필기구, 세면도구, 운동복(필요시) 등이 필요합니다.' },
  { q: '일정 변경은 가능한가요?', a: '불가피한 사유 시 변경 가능하나, 교육장 위약금이 발생하므로 긴급 사유일 경우에만 변경해 주시기 바랍니다.' },
  { q: '원하는 날짜에 교육 진행이 가능한가요?', a: '희망 날짜와 2달 이상 차이가 있으면 대부분 가능합니다.' },
  { q: '정신전력 강화 프로그램은 선택 가능한가요?', a: '가능합니다. 부대 희망 프로그램을 운영사무국에 제안해주시면 반영합니다.' },
  { q: '교육 장소는 어떻게 선정하나요?', a: '교육 희망 날짜에 예약 가능한 시설 중 부대 인근 최적 시설을 선정합니다.' },
  { q: '각 담당자의 주요 역할은?', a: '정훈공보실은 부대 선정/일정 조율, 부대 담당자는 인솔/현장 지원, 운영사무국은 장소 섭외/강사 매칭을 담당합니다.' },
]

interface Props {
  onEnter: () => void
  onVenue?: () => void
}

export default function TrainingInfoHero({ onEnter, onVenue }: Props) {
  const [imgIdx, setImgIdx] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false)
      setTimeout(() => { setImgIdx(p => (p + 1) % heroImages.length); setFade(true) }, 800)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="tia-wrap">
      {/* Hero */}
      <div className="tia-hero">
        <div className={`tia-hero-bg ${fade ? 'tia-visible' : ''}`} style={{ backgroundImage: `url(${heroImages[imgIdx]})` }} />
        <div className="tia-hero-overlay" />
        <div className="tia-hero-content">
          <h2>2026 필승해군캠프</h2>
          <p>싸우면 승리하는 정예 해군 장병 육성을 위한 특별 교육 프로그램</p>
          <div className="tia-badges"><span>해군 해상 근무 장병 대상</span><span>합숙형(1박2일) / 집중형(1일)</span></div>
        </div>
      </div>

      {/* 개요 */}
      <div id="ti-overview" className="tia-section">
        <h3 className="tia-section-title">교육 개요</h3>
        <div className="tia-overview">
          <div className="tia-overview-img"><img src={navyImage1} alt="해군 필승캠프" /></div>
          <div className="tia-overview-info">
            <table className="tia-table"><tbody>
              <tr><th>교육 대상</th><td>해군 해상 근무 장병</td></tr>
              <tr><th>교육 형태</th><td>합숙형(1박 2일) 또는 집중형(1일)</td></tr>
              <tr><th>교육 장소</th><td>함대 소재지 인근 교육시설</td></tr>
              <tr><th>교육 내용</th><td>해군 정체성 교육, 군인정신 함양, 맞춤형 정신전력 프로그램</td></tr>
            </tbody></table>
            <div className="tia-bg-box">
              <h4>추진 배경</h4>
              <ul>
                <li>함정 근무자의 잦은 출동으로 정기적 교육 참여 어려움</li>
                <li>함상 근무 장병들의 스트레스 해소 필요</li>
                <li>일상 환경을 벗어난 부대 단합활동 요구</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 프로그램 */}
      <div id="ti-programs" className="tia-section">
        <h3 className="tia-section-title">교육 프로그램 안내</h3>
        <p className="tia-section-desc">정예 해군 장병 육성을 위한 체계적인 교육 프로그램</p>
        <div className="tia-programs">
          {programs.map(p => (
            <div key={p.title} className="tia-program-card">
              <div className="tia-program-img"><img src={p.image} alt={p.title} /></div>
              <div className="tia-program-body">
                <span className={`tia-pbadge ${p.badge === '선택' ? 'tia-pbadge-sel' : ''}`}>{p.badge}</span>
                <h4>{p.title}</h4>
                <p className="tia-program-sub">{p.subtitle}</p>
                <ul>{p.items.map(i => <li key={i}>{i}</li>)}</ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 일정 */}
      <div id="ti-schedule" className="tia-section">
        <h3 className="tia-section-title">교육 운영 방식</h3>
        <div className="tia-schedules">
          <div className="tia-schedule">
            <div className="tia-schedule-hd">{scheduleCamp.title}</div>
            <div className="tia-schedule-bd">
              <h4>1일차</h4>
              <table><tbody>{scheduleCamp.day1.map(s => <tr key={s.time}><td className="tia-time">{s.time}</td><td>{s.desc}</td></tr>)}</tbody></table>
              <h4>2일차</h4>
              <table><tbody>{scheduleCamp.day2.map(s => <tr key={s.time}><td className="tia-time">{s.time}</td><td>{s.desc}</td></tr>)}</tbody></table>
            </div>
          </div>
          <div className="tia-schedule">
            <div className="tia-schedule-hd">{scheduleIntensive.title}</div>
            <div className="tia-schedule-bd">
              <table><tbody>{scheduleIntensive.items.map(s => <tr key={s.time}><td className="tia-time">{s.time}</td><td>{s.desc}</td></tr>)}</tbody></table>
            </div>
          </div>
        </div>
      </div>

      {/* 장소 */}
      <div className="tia-section">
        <h3 className="tia-section-title">교육 장소</h3>
        <div className="tia-locations">
          {locations.map(l => <div key={l.area} className="tia-location"><strong>{l.area}</strong> : {l.places}</div>)}
        </div>
        {onVenue && (
          <div className="tia-venue-btn-wrap">
            <button className="tia-venue-btn" onClick={onVenue}>
              교육장 상세 안내 보기 →
            </button>
          </div>
        )}
      </div>

      {/* 절차 */}
      <div className="tia-section">
        <h3 className="tia-section-title">신청 및 진행 절차</h3>
        <div className="tia-process">
          {processSteps.map(s => (
            <div key={s.num} className="tia-step">
              <div className="tia-step-num">{s.num}</div>
              <div><h4>{s.title}</h4><ul>{s.items.map(i => <li key={i}>{i}</li>)}</ul></div>
            </div>
          ))}
        </div>
      </div>

      {/* 담당자 */}
      <div className="tia-section">
        <h3 className="tia-section-title">담당자 업무 안내</h3>
        <div className="tia-staff">
          {staffDuties.map(d => (
            <div key={d.phase} className={`tia-staff-card ${d.highlight ? 'tia-staff-hl' : ''}`}>
              <h4>{d.phase} <small>({d.period})</small></h4>
              <ul>{d.items.map(i => <li key={i}>{i}</li>)}</ul>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div id="ti-faq" className="tia-section">
        <h3 className="tia-section-title">자주 묻는 질문 (FAQ)</h3>
        <div className="tia-faq">
          {faqs.map(f => (
            <div key={f.q} className="tia-faq-item">
              <div className="tia-faq-q">Q. {f.q}</div>
              <div className="tia-faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="tia-cta-wrap"><button className="tia-cta" onClick={onEnter}>시스템 접속 →</button></div>
    </div>
  )
}
