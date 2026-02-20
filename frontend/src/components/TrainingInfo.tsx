// Navy images
import navyImage1 from '../assets/navy/navy_image1.jpg'
import navyImage2 from '../assets/navy/navy_image2.jpg'
import navyImage3 from '../assets/navy/navy_image3.jpg'
import navyImage4 from '../assets/navy/navy_image4.jpg'
import navyLecture from '../assets/navy/navy_lecture.jpg'
import navyOnboard from '../assets/navy/navy_onboard.jpg'
import navyTeam from '../assets/navy/navy_team.jpg'

// Instructor photos
import jungdaejinImg from '../assets/instructors/jungdaejin.jpg'
import joosungImg from '../assets/instructors/joosung.png'
import hanseoImg from '../assets/instructors/hanseo.jpg'
import kwonImg from '../assets/instructors/kwon.png'
import wangDrImg from '../assets/instructors/wang_dr.png'
import choiAdmImg from '../assets/instructors/choi_adm.png'
import kangProImg from '../assets/instructors/kang_pro.jpg'
import kimProImg from '../assets/instructors/kim_pro.jpeg'
import jungDrImg from '../assets/instructors/jung_dr.jpg'
import hanViceImg from '../assets/instructors/han_vice.jpg'
import hongProImg from '../assets/instructors/hong_pro.jpg'

import { useState, useEffect } from 'react'

const instructors = [
  { name: '정대진', title: '교수', image: jungdaejinImg },
  { name: '주성하', title: '북한전문기자', image: joosungImg },
  { name: '한서희', title: '북한정보 자문위원', image: hanseoImg },
  { name: '권기형', title: '참전 용사', image: kwonImg },
  { name: '왕선택', title: '박사', image: wangDrImg },
  { name: '최명환', title: '제독(예)', image: choiAdmImg },
  { name: '강동완', title: '교수', image: kangProImg },
  { name: '김동수', title: '교수', image: kimProImg },
  { name: '정성장', title: '박사', image: jungDrImg },
  { name: '한용섭', title: '부총장', image: hanViceImg },
  { name: '홍석훈', title: '교수', image: hongProImg },
]

const heroImages = [navyImage1, navyImage2, navyImage3, navyImage4]

export default function TrainingInfo() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [fadeIn, setFadeIn] = useState(true)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeIn(false)
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length)
        setFadeIn(true)
      }, 800)
    }, 5000)
    return () => clearInterval(intervalId)
  }, [])

  return (
    <div className="training-info">
      {/* Hero Section */}
      <div className="hero-banner">
        <div
          className={`hero-bg ${fadeIn ? 'visible' : ''}`}
          style={{ backgroundImage: `url(${heroImages[currentImageIndex]})` }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h2>2025 필승해군캠프</h2>
          <p>싸우면 승리하는 정예 해군 장병 육성을 위한 특별 교육 프로그램</p>
          <div className="hero-badges">
            <span className="hero-badge">해군 해상 근무 장병 대상</span>
            <span className="hero-badge">합숙형(1박2일) / 집중형(1일)</span>
          </div>
        </div>
      </div>

      {/* 개요 */}
      <div className="info-card">
        <h3>교육 개요</h3>
        <div className="info-grid-2">
          <div className="overview-image">
            <img src={navyImage1} alt="해군 필승캠프 강연 장면" />
          </div>
          <div>
            <table className="info-table">
              <tbody>
                <tr><th>교육 대상</th><td>해군 해상 근무 장병</td></tr>
                <tr><th>교육 형태</th><td>합숙형(1박 2일) 또는 집중형(1일)</td></tr>
                <tr><th>교육 장소</th><td>함대 소재지 인근 교육시설</td></tr>
                <tr><th>교육 내용</th><td>해군 정체성 교육, 군인정신 함양, 맞춤형 정신전력 프로그램</td></tr>
              </tbody>
            </table>
            <div className="info-box" style={{ marginTop: '14px' }}>
              <h4>추진 배경</h4>
              <ul>
                <li>함정 근무자의 잦은 출동으로 정기적 정신전력 교육 참여 어려움</li>
                <li>함상 근무 장병들의 스트레스 해소 필요</li>
                <li>일상 환경을 벗어난 부대 단합활동 요구</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="info-quote">
          "필승해군캠프는 해상 근무 장병들의 정신무장 강화와 자긍심 고취를 위한 교육 프로그램입니다. 부대별 여건에 맞게 합숙교육(1박 2일) 또는 집중교육(1일) 과정으로 운영하고 있습니다."
        </div>
      </div>

      {/* 교육 프로그램 */}
      <div className="info-card">
        <h3>교육 프로그램 안내</h3>
        <p className="info-desc">정예 해군 장병 육성을 위한 체계적인 교육 프로그램 구성</p>
        <div className="info-grid-3 program-grid">
          <div className="program-card-img">
            <div className="program-image">
              <img src={navyLecture} alt="해군 정체성 초빙강연" />
            </div>
            <div className="program-body">
              <div className="program-badge">필수</div>
              <h4>해군 정체성 초빙강연</h4>
              <p className="program-subtitle">해군 자긍심 고취 및 정체성 함양 교육</p>
              <ul>
                <li>해군 창군기, 발전 과정, 주요 해전 이해</li>
                <li>제1·2연평해전 등 피로써 지킨 바다의 역사</li>
                <li>세계 속 대한민국 해군의 위상</li>
              </ul>
            </div>
          </div>
          <div className="program-card-img">
            <div className="program-image">
              <img src={navyOnboard} alt="군인정신 초빙강연" />
            </div>
            <div className="program-body">
              <div className="program-badge">필수</div>
              <h4>군인정신 초빙강연</h4>
              <p className="program-subtitle">국가관·대적관·군인정신 함양</p>
              <ul>
                <li>투철한 국가관과 자유민주주의 이념 확립</li>
                <li>북한의 군사적 위협과 실상 이해</li>
                <li>한미동맹의 중요성 인식</li>
              </ul>
            </div>
          </div>
          <div className="program-card-img">
            <div className="program-image">
              <img src={navyTeam} alt="정신전력 강화 프로그램" />
            </div>
            <div className="program-body">
              <div className="program-badge select">선택</div>
              <h4>정신전력 강화 프로그램</h4>
              <p className="program-subtitle">부대 특성에 맞게 선택형으로 진행</p>
              <ul>
                <li>함정 특성과 요구에 맞게 프로그램 선택 가능</li>
                <li>부대 맞춤형 활동으로 교육 효과 극대화</li>
                <li>팀 빌딩, 레크리에이션 등 다양한 프로그램</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* 교육 일정 */}
      <div className="info-card">
        <h3>교육 운영 방식</h3>
        <p className="info-desc">합숙형과 집중형 중 선택 가능한 유연한 교육 운영</p>
        <div className="info-grid-2">
          <div className="schedule-block">
            <div className="schedule-header">합숙형 교육 (1박 2일)</div>
            <div className="schedule-body">
              <h4>1일차</h4>
              <table className="schedule-table">
                <tbody>
                  <tr><td className="time">10:00 ~ 11:00</td><td>교육장 이동 및 도착</td></tr>
                  <tr><td className="time">11:00 ~ 12:00</td><td>입교식 및 교육안내</td></tr>
                  <tr><td className="time">12:00 ~ 13:00</td><td>중식</td></tr>
                  <tr><td className="time">13:00 ~ 14:50</td><td>해군 정체성 초빙강연</td></tr>
                  <tr><td className="time">14:50 ~ 15:00</td><td>휴식시간</td></tr>
                  <tr><td className="time">15:00 ~ 17:00</td><td>정신전력 강화 프로그램</td></tr>
                  <tr><td className="time">17:00 ~ 18:00</td><td>행정시간</td></tr>
                  <tr><td className="time">18:00 ~ 18:50</td><td>석식</td></tr>
                </tbody>
              </table>
              <h4>2일차</h4>
              <table className="schedule-table">
                <tbody>
                  <tr><td className="time">07:00 ~ 08:00</td><td>조식</td></tr>
                  <tr><td className="time">08:00 ~ 09:00</td><td>행정 시간 (체크아웃)</td></tr>
                  <tr><td className="time">09:00 ~ 11:00</td><td>군인정신 초빙강연</td></tr>
                  <tr><td className="time">11:00 ~ 11:50</td><td>퇴소식 / 교육 설문조사</td></tr>
                  <tr><td className="time">12:00 ~ 12:50</td><td>중식</td></tr>
                  <tr><td className="time">13:00 ~ 13:50</td><td>부대 복귀</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="schedule-block">
            <div className="schedule-header">집중형 교육 (1일)</div>
            <div className="schedule-body">
              <table className="schedule-table">
                <tbody>
                  <tr><td className="time">09:00 ~ 09:30</td><td>교육장 이동</td></tr>
                  <tr><td className="time">09:30 ~ 10:00</td><td>입교식 및 교육안내</td></tr>
                  <tr><td className="time">10:00 ~ 11:50</td><td>해군 정체성 초빙강연</td></tr>
                  <tr><td className="time">11:50 ~ 13:20</td><td>중식</td></tr>
                  <tr><td className="time">13:20 ~ 13:30</td><td>휴식 시간</td></tr>
                  <tr><td className="time">13:30 ~ 15:00</td><td>군인정신 초빙강연</td></tr>
                  <tr><td className="time">15:00 ~ 15:20</td><td>행정 시간</td></tr>
                  <tr><td className="time">15:20 ~ 17:00</td><td>정신전력 강화 프로그램</td></tr>
                  <tr><td className="time">17:00 ~ 17:30</td><td>부대 복귀</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 교육 장소 */}
      <div className="info-card">
        <h3>교육 장소</h3>
        <div className="info-grid-2">
          <div className="location-item"><strong>1함대 권역</strong> : 동해 무릉건강숲, 동해보양온천컨벤션 등</div>
          <div className="location-item"><strong>2함대 권역</strong> : 화성 YBM연수원 등</div>
          <div className="location-item"><strong>3함대 권역</strong> : 청호인재개발원, DB생명 인재개발원 등</div>
          <div className="location-item"><strong>진해 및 부산 권역</strong> : 진해 이순신리더십센터, 부산 아르피나 등</div>
        </div>
      </div>

      {/* 강사진 - 원형 사진 + 자동 스크롤 */}
      <div className="info-card">
        <h3>강사진 소개</h3>
        <p className="info-desc">해군 장병들에게 전문성과 감동을 전하는 강사진 (총 {instructors.length}명)</p>
        <div className="instructor-scroll-wrapper">
          <div className="instructor-scroll-track">
            {[...instructors, ...instructors].map((inst, i) => (
              <div className="instructor-card" key={i}>
                <div className="instructor-photo">
                  <img src={inst.image} alt={inst.name} />
                </div>
                <div className="instructor-name">{inst.name}</div>
                <div className="instructor-title">{inst.title}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="info-quote">
          "현장 경험과 전문 지식을 겸비한 최고의 강사진이 해군 장병들에게 생생한 교육을 제공합니다."
        </div>
      </div>

      {/* 신청 및 진행 절차 */}
      <div className="info-card">
        <h3>신청 및 진행 절차</h3>
        <div className="process-steps">
          <div className="process-step">
            <div className="step-number">1</div>
            <div>
              <h4>교육 신청</h4>
              <ul>
                <li>각 함대 정훈공보실을 통해 신청 날짜, 프로그램 형태(1일/2일) 등 제출</li>
                <li>1차 신청기한 취합은 5월 중 완료 예정</li>
                <li>세부 프로그램 구성 등은 운영사무국과 협의하여 결정</li>
              </ul>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">2</div>
            <div>
              <h4>일정 및 장소 확정</h4>
              <ul>
                <li>운영사무국에서 교육장소 섭외 및 강사 매칭</li>
                <li>신청 함정에 최종 교육 일정 및 장소 통보</li>
                <li>교육 관련 세부사항 조율</li>
              </ul>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">3</div>
            <div>
              <h4>교육 실시</h4>
              <ul>
                <li>계획된 일정에 따라 교육 진행</li>
                <li>교육 만족도 및 효과성 측정을 위한 설문조사 실시</li>
                <li>교육 결과 피드백 수집</li>
              </ul>
            </div>
          </div>
          <div className="process-step">
            <div className="step-number">4</div>
            <div>
              <h4>사후 관리</h4>
              <ul>
                <li>운영사무국에서 교육 결과 보고서 작성 및 공유</li>
                <li>차기 교육 개선을 위한 피드백 반영</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="info-quote">
          "교육 일정 변경은 교육장 대관 등을 위해 최소 4주 전에 운영사무국에 통보해주시기 바랍니다."
        </div>
      </div>

      {/* 담당자 업무 안내 */}
      <div className="info-card">
        <h3>담당자(겸임정훈관) 업무 안내</h3>
        <div className="info-grid-3">
          <div className="staff-card">
            <h4>사전 준비 <small>(D-30~D-1)</small></h4>
            <ul>
              <li>교육 신청</li>
              <li>일정/장소 확인</li>
              <li>참가자 안내</li>
              <li>자료 확인</li>
            </ul>
          </div>
          <div className="staff-card highlight">
            <h4>교육 당일 <small>(D-Day)</small></h4>
            <ul>
              <li>참가자 인솔</li>
              <li>교육 참여 독려</li>
              <li>질서 유지</li>
              <li>비상상황 대비</li>
            </ul>
          </div>
          <div className="staff-card">
            <h4>사후 관리 <small>(D+1~D+7)</small></h4>
            <ul>
              <li>안전한 복귀</li>
              <li>설문조사 독려</li>
              <li>결과 공유</li>
              <li>피드백 제출</li>
            </ul>
          </div>
        </div>
        <div className="info-quote">
          "교육 시작 약 4주 전에 운영사무국 직원이 개별적으로 연락을 드리며, 이후 업무 및 체크리스트를 전달드립니다."
        </div>
      </div>

      {/* FAQ */}
      <div className="info-card">
        <h3>자주 묻는 질문 (FAQ)</h3>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q">Q. 교육 신청은 어떻게 하나요?</div>
            <div className="faq-a">각 함대 정훈공보실과 협의하여 신청 날짜, 프로그램 형태(1일/2일) 등을 제출합니다. 1차 신청기한 취합은 5월 중 완료 예정이며, 교육일 변경은 최소 6주 전에 운영사무국에 통보해야 합니다.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 준비물은 무엇인가요?</div>
            <div className="faq-a">필기구, 세면도구, 운동복(필요시) 등이 필요합니다. 정확한 준비물 목록은 교육 확정 후 운영 사무국에서 제공하는 안내를 참조하세요.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 일정 변경은 가능한가요?</div>
            <div className="faq-a">불가피한 사유로 정해진 일정에 교육 진행이 불가능한 경우 변경이 가능합니다. 다만 교육장 등에서 위약금이 발생하므로, 긴급한 출동 등 불가피한 사유일 경우에만 변경해 주시기 바랍니다. 일정 취소 후 다음 일정 예약은 2개월 이후의 날짜를 선택해야 합니다.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 원하는 특정 날짜에 교육 진행이 가능한가요?</div>
            <div className="faq-a">희망 날짜가 신청 날짜와 2달 정도 차이가 있으면 대부분 교육 진행이 가능합니다. 원활한 교육장 대관을 위해 충분한 시간(2달 이상)을 두고 교육 신청을 해주시기 바랍니다.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. '정신전력 강화 프로그램'은 부대에서 선택할 수 있나요?</div>
            <div className="faq-a">가능합니다. 팀 빌딩, 레크리에이션 등 부대 희망 프로그램을 운영사무국에 제안해주시면 최대한 반영하겠습니다.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 교육 장소는 어떻게 선정하나요?</div>
            <div className="faq-a">교육 희망 날짜에 예약이 가능한 시설을 확인하고, 가장 좋은 환경을 가진 곳을 선정합니다. 부대 인근 시설을 우선 고려합니다.</div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 정훈공보실/부대 담당자/운영사무국의 주요 역할은?</div>
            <div className="faq-a">정훈공보실은 교육 대상 부대 선정과 일정 조율을, 부대 담당자는 교육생 인솔과 현장 지원을, 운영사무국은 교육 장소 섭외와 강사 매칭 및 전반적인 교육 운영을 담당합니다.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
