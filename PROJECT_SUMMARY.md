# 해군 필승해군캠프 교육일정 신청 시스템

> 해군 교육훈련 일정 신청, 강사 배정, 교육장 관리를 위한 풀스택 웹 애플리케이션

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프로젝트명 | Navy Communication Training Schedule Request System |
| 목적 | 필승해군캠프 교육 일정 신청 및 관리 |
| 유형 | 풀스택 웹 애플리케이션 (모노레포) |
| 주요 사용자 | 해군 각 부대 담당자(일반 사용자), 운영 관리자(관리자) |

---

## 2. 기술 스택

### Frontend
| 기술 | 버전 |
|------|------|
| React | 18.3.1 |
| TypeScript | 5.6.2 |
| Vite | 6.0.1 |
| CSS | 커스텀 (App.css) |

### Backend
| 기술 | 버전 |
|------|------|
| Java | 17 |
| Spring Boot | 3.2.3 |
| Spring Data JPA | Hibernate |
| Gradle | 빌드 도구 |

### Infrastructure
| 기술 | 용도 |
|------|------|
| PostgreSQL 16 | 데이터베이스 |
| Docker / Docker Compose | 컨테이너화 |
| Nginx | 프론트엔드 리버스 프록시 |

---

## 3. 디렉토리 구조

```
260219_Navy_Communication/
├── docker-compose.yml          # Docker 서비스 오케스트레이션
├── .env                        # 환경변수 (DB 접속정보)
├── .gitignore
│
├── db/
│   └── init.sql                # DB 스키마 + 시드 데이터 (727줄)
│
├── backend/                    # Spring Boot 백엔드
│   ├── Dockerfile
│   ├── build.gradle
│   ├── settings.gradle
│   └── src/main/java/com/navy/communication/
│       ├── NavyCommunicationApplication.java
│       ├── config/
│       │   └── CorsConfig.java
│       ├── controller/         # REST API 컨트롤러 (6개)
│       │   ├── AuthController.java
│       │   ├── TrainingRequestController.java
│       │   ├── InstructorController.java
│       │   ├── InstructorScheduleController.java
│       │   ├── VenueController.java
│       │   └── UserController.java
│       ├── dto/                # 데이터 전송 객체 (13개)
│       ├── model/              # 엔티티 모델 (8개)
│       │   ├── User.java
│       │   ├── Instructor.java
│       │   ├── TrainingRequest.java
│       │   ├── Venue.java
│       │   ├── InstructorSchedule.java
│       │   ├── RequestStatus.java
│       │   ├── UserRole.java
│       │   └── UserStatus.java
│       ├── repository/         # JPA 리포지토리 (5개)
│       └── service/
│           └── TrainingRequestService.java
│
├── frontend/                   # React 프론트엔드
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── nginx.conf
│   └── src/
│       ├── App.tsx             # 메인 앱 (탭 네비게이션)
│       ├── App.css
│       ├── main.tsx
│       ├── components/         # UI 컴포넌트 (10개)
│       │   ├── LoginScreen.tsx
│       │   ├── Layout.tsx
│       │   ├── TrainingInfo.tsx
│       │   ├── RequestForm.tsx
│       │   ├── RequestList.tsx
│       │   ├── RequestManagement.tsx
│       │   ├── AccountManagement.tsx
│       │   ├── InstructorManagement.tsx
│       │   ├── VenueManagement.tsx
│       │   └── VenueInfo.tsx
│       ├── services/
│       │   └── api.ts          # API 클라이언트
│       ├── types/
│       │   └── index.ts        # TypeScript 타입 정의
│       └── assets/
│           ├── instructors/    # 강사 사진 (11장)
│           └── navy/           # 해군 테마 이미지 (7장)
│
├── 필캠_강사정리/               # 강사 정보 문서
│   ├── 강사정보_필승해군캠프_251231.docx
│   └── 강사정보_필승해군캠프_251231.pdf
│
└── 필캠_교육장정리/             # 교육장 정보 문서 (28개 파일)
    └── (13개 교육장 PDF/MD 파일)
```

---

## 4. 데이터베이스 스키마

### 4.1 테이블 구조

#### users (사용자)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL (PK) | 사용자 ID |
| email | VARCHAR(100) UNIQUE | 이메일 (로그인 키) |
| name | VARCHAR(100) | 이름 |
| affiliation | VARCHAR(200) | 소속 |
| phone | VARCHAR(30) | 전화번호 |
| role | VARCHAR(20) | 역할: `USER`, `ADMIN` |
| status | VARCHAR(20) | 상태: `PENDING`, `ACTIVE`, `REJECTED` |
| created_at | TIMESTAMP | 생성일시 |

#### instructors (강사)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL (PK) | 강사 ID |
| name | VARCHAR(100) | 이름 |
| rank | VARCHAR(50) | 직급/직위 |
| specialty | VARCHAR(100) | 전문분야 |
| phone | VARCHAR(20) | 전화번호 |
| email | VARCHAR(100) | 이메일 |
| affiliation | VARCHAR(100) | 소속 |
| education_topic | VARCHAR(200) | 교육주제 |
| available_region | VARCHAR(200) | 가용지역 |
| rating | DECIMAL(3,2) | 종합평점 |
| recommendation | VARCHAR(20) | 추천여부: 추천/보통/비추천 |
| category | VARCHAR(20) | 분류: `해군정체성`, `안보`, `소통` |
| career | TEXT | 경력사항 |
| one_line_review | TEXT | 한줄평 |
| conditions | TEXT | 조건/유의사항 |
| delivery_score | DECIMAL(3,2) | 전달력 점수 |
| expertise_score | DECIMAL(3,2) | 전문성 점수 |
| interaction_score | DECIMAL(3,2) | 상호작용 점수 |
| time_management_score | DECIMAL(3,2) | 시간관리 점수 |
| strengths | TEXT | 강점 |
| weaknesses | TEXT | 약점 |

#### venues (교육장)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL (PK) | 교육장 ID |
| name | VARCHAR(100) | 교육장명 |
| address | VARCHAR(200) | 주소 |
| capacity | INTEGER | 총 수용인원 |
| region | VARCHAR(50) | 지역 |
| lecture_capacity | INTEGER | 강의실 수용인원 |
| accommodation_capacity | INTEGER | 숙박 수용인원 |
| meal_cost | VARCHAR(100) | 식사비용 |
| overall_rating | VARCHAR(20) | 종합평가 |
| website | VARCHAR(500) | 웹사이트 |
| reservation_contact | VARCHAR(300) | 예약 연락처 |
| summary | TEXT | 요약 |
| lecture_rooms | TEXT | 강의실 정보 |
| usage_fee | TEXT | 이용요금 |
| banner_size | VARCHAR(300) | 현수막 규격 |
| room_status | TEXT | 객실현황 |
| room_amenities | TEXT | 객실 비품 |
| sub_facilities | TEXT | 부대시설 |
| evaluation | TEXT | 평가 |

#### training_requests (교육 신청)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL (PK) | 신청 ID |
| user_id | BIGINT (FK) | 신청자 |
| identity_instructor_id | BIGINT (FK) | 해군정체성 강사 |
| security_instructor_id | BIGINT (FK) | 안보 강사 |
| communication_instructor_id | BIGINT (FK) | 소통 강사 |
| venue_id | BIGINT (FK) | 1순위 교육장 |
| second_venue_id | BIGINT (FK) | 2순위 교육장 |
| training_type | VARCHAR(20) | 유형: `1일집중형`, `1박2일합숙형` |
| fleet | VARCHAR(20) | 소속: `1함대`~`3함대`, `작전사`, `진기사`, `교육사` |
| request_date | DATE | 교육 시작일 |
| request_end_date | DATE | 교육 종료일 |
| start_time | VARCHAR(5) | 시작 시각 |
| status | VARCHAR(20) | 상태: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED` |
| notes | TEXT | 비고 |
| plan | TEXT | 교육 계획 |

#### instructor_schedules (강사 일정)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | BIGSERIAL (PK) | 일정 ID |
| instructor_id | BIGINT (FK) | 강사 |
| schedule_date | DATE | 일정 시작일 |
| end_date | DATE | 일정 종료일 |
| description | VARCHAR(200) | 설명 |
| source | VARCHAR(20) | 출처: `MANUAL`, `REQUEST` |
| request_id | BIGINT (FK) | 연결된 교육신청 |

### 4.2 데이터 관계도

```
User (1) ──────── (*) TrainingRequest
Instructor (1) ──── (*) TrainingRequest  (3개 카테고리별 강사 배정)
Venue (1) ───────── (*) TrainingRequest  (1순위 + 2순위)
Instructor (1) ───── (*) InstructorSchedule
TrainingRequest (1) ─ (*) InstructorSchedule (REQUEST 출처)
```

---

## 5. API 엔드포인트

### 5.1 인증 (Auth)
| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | `/api/auth/login` | 이메일 로그인 |
| POST | `/api/auth/register` | 회원가입 |

### 5.2 사용자 관리 (Users)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/users` | 전체 사용자 조회 |
| POST | `/api/users` | 사용자 생성 |
| PUT | `/api/users/{id}` | 사용자 수정 |
| PATCH | `/api/users/{id}/approve` | 사용자 승인 |
| PATCH | `/api/users/{id}/reject` | 사용자 거부 |
| DELETE | `/api/users/{id}` | 사용자 삭제 |

### 5.3 강사 관리 (Instructors)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/instructors` | 전체 강사 조회 |
| POST | `/api/instructors` | 강사 등록 |
| PUT | `/api/instructors/{id}` | 강사 수정 |
| DELETE | `/api/instructors/{id}` | 강사 삭제 |

### 5.4 강사 일정 (Instructor Schedules)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/instructor-schedules?startDate=&endDate=` | 기간별 일정 조회 |
| GET | `/api/instructor-schedules/instructor/{id}` | 강사별 일정 조회 |
| POST | `/api/instructor-schedules` | 일정 생성 |
| DELETE | `/api/instructor-schedules/{id}` | 일정 삭제 |

### 5.5 교육장 관리 (Venues)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/venues` | 전체 교육장 조회 |
| POST | `/api/venues` | 교육장 등록 |
| PUT | `/api/venues/{id}` | 교육장 수정 |
| DELETE | `/api/venues/{id}` | 교육장 삭제 |

### 5.6 교육 신청 (Training Requests)
| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | `/api/requests` | 전체 신청 조회 |
| GET | `/api/requests?userId={id}` | 사용자별 신청 조회 |
| POST | `/api/requests` | 교육 신청 |
| PATCH | `/api/requests/{id}/status` | 상태 변경 (승인/거부/취소) |
| PATCH | `/api/requests/{id}/instructors` | 강사 배정 |
| PATCH | `/api/requests/{id}/plan` | 교육 계획 수정 |
| GET | `/api/requests/availability?date=` | 날짜별 가용현황 조회 |

---

## 6. 주요 기능

### 6.1 사용자 인증 및 권한
- **이메일 기반 로그인** (비밀번호 없음)
- **회원가입 → 승인 워크플로우**: PENDING → ACTIVE / REJECTED
- **역할 기반 접근 제어**: USER (일반), ADMIN (관리자)

### 6.2 교육 신청 (일반 사용자)
- 교육 유형 선택: **1일집중형** / **1박2일합숙형**
- 소속 함대 선택: 1함대, 2함대, 3함대, 작전사, 진기사, 교육사
- 교육일 및 시작시간 지정
- 1순위/2순위 교육장 선택
- 날짜 기준 강사/교육장 **가용 현황** 자동 확인
- 비고 입력
- 본인 신청 내역 조회

### 6.3 교육 신청 관리 (관리자)
- 전체 교육 신청 목록 조회
- 신청 **승인/거부** 처리
- 3개 카테고리별 **강사 배정**: 해군정체성, 안보, 소통
- **교육 계획** 작성/수정
- 신청 상태 추적

### 6.4 강사 관리 (관리자)
- 23명의 강사 데이터베이스 관리
- 3개 카테고리 분류: **해군정체성**(7명), **안보**(5명), **소통**(11명)
- 상세 프로필: 경력, 평가, 강약점, 조건
- 4개 항목별 평가: 전달력, 전문성, 상호작용, 시간관리
- 추천 여부 관리 (추천/보통/비추천)
- 강사 일정 수동 등록 및 조회

### 6.5 교육장 관리 (관리자)
- 13개 교육장 상세 정보 관리
- 시설 정보: 수용인원, 강의실, 숙박시설, 식사비
- 예약 연락처, 이용요금, 현수막 규격
- 부대시설, 유의사항, 종합평가

### 6.6 교육장 정보 (전체 사용자)
- 교육장 상세 정보 열람
- 시설 현황, 비용, 접근성 확인

---

## 7. 프론트엔드 컴포넌트 구조

```
App (상태 관리, 탭 라우팅)
├── LoginScreen          # 로그인/회원가입 화면
└── Layout               # 네비게이션 레이아웃
    ├── TrainingInfo       # 교육 안내 (info)
    ├── RequestForm        # 교육 신청서 (form)
    ├── RequestList        # 내 신청 목록 (list)
    ├── VenueInfo          # 교육장 정보 (venueInfo)
    ├── RequestManagement  # [관리자] 신청 관리 (admin)
    ├── AccountManagement  # [관리자] 계정 관리 (accounts)
    ├── InstructorManagement # [관리자] 강사 관리 (instructors)
    └── VenueManagement    # [관리자] 교육장 관리 (venues)
```

---

## 8. 시드 데이터

### 8.1 사용자 (8명)
| 이메일 | 이름 | 소속 | 역할 |
|--------|------|------|------|
| kjt@parancompany.co.kr | 관리자 | 파란컴퍼니 | ADMIN |
| 1@1 | 관리자2 | 해군본부 정훈공보실 | ADMIN |
| kim.dh@navy.mil.kr | 김대현 | 제1함대 작전처 | USER |
| lee.sh@navy.mil.kr | 이승호 | 제2함대 정보처 | USER |
| park.jm@navy.mil.kr | 박정민 | 해군교육사령부 | USER |
| choi.ys@navy.mil.kr | 최윤서 | 제3함대 군수처 | USER |
| jung.hj@navy.mil.kr | 정하준 | 해군본부 인사처 | USER |
| test@test.co.kr | 테스트사용자 | 잠수함사령부 | USER |

### 8.2 강사 (23명)

#### 해군정체성 (7명)
| 이름 | 직급 | 소속 | 평점 | 추천 |
|------|------|------|------|------|
| 강동완 | 교수 | 동아대학교 정치외교학과 | 4.00 | 추천 |
| 고광섭 | 교수 | 국립목포해양대학교 해군사관학부 | 2.50 | 보통 |
| 권기형 | 참전용사 | 제2연평해전 참전용사 | 3.25 | 추천 |
| 박태용 | 교수 | 목포해양대 해군사관학부 | 3.75 | 추천 |
| 이희완 | 전)차관 | 前 국가보훈부 차관 | 3.50 | 추천 |
| 최명한 | 예)제독 | 한국해양대학교 교양교육원 | 3.75 | 추천 |
| 최원일 | 함장 | 326호국보훈연구소 연구소장 | 3.75 | 추천 |

#### 안보 (5명)
| 이름 | 직급 | 소속 | 평점 | 추천 |
|------|------|------|------|------|
| 강석승 | 원장 | 21세기안보전략연구원 원장 | 0.75 | 비추천 |
| 김동수 | 교수 | 부경대 국제지역학부 | 3.25 | 추천 |
| 왕선택 | 박사 | 서울대학교 언론정보학과 | 3.25 | 추천 |
| 최진업 | 교수 | 국립강릉원주대 안보전략 센터 | 2.75 | 보통 |
| 홍석훈 | 교수 | 창원대 국제관계학과 | 3.75 | 추천 |

#### 소통 (11명)
| 이름 | 직급 | 소속 | 평점 | 추천 |
|------|------|------|------|------|
| 손정민 | 강사 | 파란컴퍼니 | 4.25 | 추천 |
| 신정희 | 강사 | 해피마인드 대표 | 2.75 | 보통 |
| 오지혜 | 강사 | 위드오컨설팅 대표 | 4.50 | 추천 |
| 이해인 | 강사 | 굿플레이스 교육컨설팅 대표 | 4.75 | 추천 |
| 정소진 | 강사 | KT is 교육 강사 | 4.25 | 추천 |
| 정진영 | 강사 | (주)포인트온보드 대표 | 4.75 | 추천 |
| 조래훈 | 강사 | KBS 31기 공채 개그맨 | 5.00 | 추천 |
| 최해령 | 강사 | 마인드앤파인드 대표 | 4.00 | 추천 |
| 김니나 | 강사 | 한걸음 컨설팅 대표강사 | 4.00 | 추천 |
| 김주연 | 강사 | 주연 심리상담센터 센터장 | 2.25 | 비추천 |
| 이정규 | 강사 | MBC 18기 공채 개그맨 | 4.75 | 추천 |

### 8.3 교육장 (13개)

| 교육장명 | 지역 | 강의수용 | 숙박수용 | 등급 |
|----------|------|----------|----------|------|
| 이순신리더십국제센터 | 진해 | 200 | 100 | 상 |
| 청호인재개발원 | 화성 | 250 | 200 | 상 |
| DB생명 인재개발원 | 화성 | 164 | 100 | 중상 |
| YBM연수원 | 화성 | 160 | 120 | 보통 |
| 목포국제축구센터 | 목포 | 200 | 150 | 중상 |
| 부산도시공사 아르피나 | 부산 | 200 | 280 | 중상 |
| 호텔현대 바이 라한 목포 | 영암/목포 | 70 | 200 | 상 |
| 한국여성수련원 | 강릉 | 100 | 328 | 상 |
| 통영 동원리조트 | 통영 | 100 | 100 | 상 |
| 태백 중진공 연수원 | 태백 | 150 | 78 | 중상 |
| 중진공 충청연수원 | 천안 | 100 | 86 | 보통 |
| 중진공 부산경남연수원 | 창원/진해 | 150 | 100 | 중 |
| 동해 무릉건강숲 | 동해 | 100 | 60 | 상 |

---

## 9. Docker 서비스 구성

```yaml
services:
  postgres-db:       # PostgreSQL 16 Alpine (포트 5432)
  spring-backend:    # Spring Boot 백엔드 (포트 8080)
  react-frontend:    # React + Nginx 프론트엔드 (포트 3000)
```

### 실행 방법
```bash
docker compose up --build
```

### 접속 정보
- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8080
- **데이터베이스**: localhost:5432

### 환경변수 (.env)
| 변수 | 값 |
|------|-----|
| POSTGRES_DB | navy_communication |
| POSTGRES_USER | navy_admin |
| POSTGRES_PASSWORD | navy_secure_2024 |

---

## 10. 주요 업무 흐름

### 10.1 교육 신청 흐름
```
사용자 로그인 → 교육 신청서 작성 → 날짜/교육장 가용 확인
→ 신청 제출 (PENDING) → 관리자 검토
→ 강사 배정 → 승인 (APPROVED) / 거부 (REJECTED)
→ 교육 계획 작성
```

### 10.2 사용자 가입 흐름
```
회원가입 (PENDING) → 관리자 검토 → 승인 (ACTIVE) / 거부 (REJECTED)
```

### 10.3 강사 일정 관리 흐름
```
수동 일정 등록 (MANUAL)
교육 신청 승인 시 자동 일정 생성 (REQUEST)
→ 날짜별 가용 강사 확인
```

---

## 11. 파일 통계

| 분류 | 수량 | 비고 |
|------|------|------|
| Java 컨트롤러 | 6개 | Auth, Request, Instructor, Schedule, Venue, User |
| Java 모델 | 8개 | Entity 5 + Enum 3 |
| Java DTO | 13개 | 요청/응답 데이터 전송 객체 |
| Java 리포지토리 | 5개 | JPA Repository 인터페이스 |
| React 컴포넌트 | 10개 | 화면 구성 컴포넌트 |
| TypeScript 타입 | 15개 | 인터페이스 + 타입 정의 |
| 이미지 에셋 | 18개 | 강사 사진 11 + 해군 이미지 7 |
| 설정 파일 | 7개 | Docker, Vite, TS, Nginx 등 |
| DB 스키마 | 1개 | 테이블 5 + 인덱스 13 + 시드 44건 |
