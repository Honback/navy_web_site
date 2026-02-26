-- Navy Communication Training Schedule Request System
-- Database Schema & Seed Data

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    affiliation VARCHAR(200),
    phone VARCHAR(30),
    fleet VARCHAR(20),
    ship VARCHAR(50),
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('PENDING', 'ACTIVE', 'REJECTED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Instructors table (expanded with comprehensive evaluation fields)
CREATE TABLE instructors (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    rank VARCHAR(50) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(100),
    affiliation VARCHAR(100),
    education_topic VARCHAR(200),
    available_region VARCHAR(200),
    rating DECIMAL(3,2) DEFAULT 0,
    recommendation VARCHAR(20) DEFAULT '추천',
    category VARCHAR(20) NOT NULL DEFAULT '소통' CHECK (category IN ('해군정체성', '안보', '소통')),
    notes TEXT,
    -- New fields
    career TEXT,
    one_line_review TEXT,
    conditions TEXT,
    delivery_score DECIMAL(3,2) DEFAULT 0,
    expertise_score DECIMAL(3,2) DEFAULT 0,
    interaction_score DECIMAL(3,2) DEFAULT 0,
    time_management_score DECIMAL(3,2) DEFAULT 0,
    strengths TEXT,
    weaknesses TEXT,
    photo_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venues table (expanded with comprehensive fields)
CREATE TABLE venues (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200),
    building VARCHAR(100),
    room_number VARCHAR(50),
    capacity INTEGER NOT NULL DEFAULT 0,
    region VARCHAR(50),
    lecture_capacity INTEGER DEFAULT 0,
    accommodation_capacity INTEGER DEFAULT 0,
    meal_cost VARCHAR(100),
    overall_rating VARCHAR(20),
    notes TEXT,
    -- New columns
    website VARCHAR(500),
    reservation_contact VARCHAR(300),
    summary TEXT,
    lecture_rooms TEXT,
    usage_fee TEXT,
    banner_size VARCHAR(300),
    desk_layout VARCHAR(300),
    room_status TEXT,
    room_amenities TEXT,
    personal_items TEXT,
    convenience_facilities TEXT,
    restaurant_contact VARCHAR(300),
    reservation_rules TEXT,
    important_tips TEXT,
    sub_facilities TEXT,
    evaluation TEXT,
    survey_images VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Training requests table (3 instructor categories)
CREATE TABLE training_requests (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    identity_instructor_id BIGINT REFERENCES instructors(id),
    security_instructor_id BIGINT REFERENCES instructors(id),
    communication_instructor_id BIGINT REFERENCES instructors(id),
    venue_id BIGINT NOT NULL REFERENCES venues(id),
    second_venue_id BIGINT REFERENCES venues(id),
    training_type VARCHAR(20) NOT NULL DEFAULT '1일집중형' CHECK (training_type IN ('1일집중형', '1박2일합숙형')),
    fleet VARCHAR(20) NOT NULL CHECK (fleet IN ('1함대', '2함대', '3함대', '작전사', '진기사', '교육사')),
    ship VARCHAR(50),
    request_date DATE NOT NULL,
    request_end_date DATE,
    start_time VARCHAR(5),
    participant_count INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'VENUE_CHECK', 'INSTRUCTOR_CHECK', 'CONFIRMED', 'REJECTED', 'CANCELLED')),
    notes TEXT,
    plan TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Instructor schedules table (manual + auto from approved requests)
CREATE TABLE instructor_schedules (
    id BIGSERIAL PRIMARY KEY,
    instructor_id BIGINT NOT NULL REFERENCES instructors(id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    end_date DATE,
    description VARCHAR(200),
    source VARCHAR(20) NOT NULL DEFAULT 'MANUAL' CHECK (source IN ('MANUAL', 'REQUEST')),
    request_id BIGINT REFERENCES training_requests(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Venue contacts table
CREATE TABLE venue_contacts (
    id BIGSERIAL PRIMARY KEY,
    venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(50),
    phone VARCHAR(50),
    email VARCHAR(100),
    preferred_contact VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venue_contacts_venue ON venue_contacts(venue_id);

-- Venue rooms table (lecture halls / conference rooms under each venue)
CREATE TABLE venue_rooms (
    id BIGSERIAL PRIMARY KEY,
    venue_id BIGINT NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity INTEGER DEFAULT 0,
    has_projector BOOLEAN DEFAULT false,
    has_microphone BOOLEAN DEFAULT false,
    has_whiteboard BOOLEAN DEFAULT false,
    banner_size VARCHAR(300),
    podium_size VARCHAR(300),
    desk_layout VARCHAR(300),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_venue_rooms_venue ON venue_rooms(venue_id);

-- Notices table
CREATE TABLE notices (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    important BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Board posts table
CREATE TABLE board_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(1000),
    author VARCHAR(100) NOT NULL,
    tags VARCHAR(500),
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_training_requests_user ON training_requests(user_id);
CREATE INDEX idx_training_requests_identity ON training_requests(identity_instructor_id);
CREATE INDEX idx_training_requests_security ON training_requests(security_instructor_id);
CREATE INDEX idx_training_requests_communication ON training_requests(communication_instructor_id);
CREATE INDEX idx_training_requests_venue ON training_requests(venue_id);
CREATE INDEX idx_training_requests_date ON training_requests(request_date);
CREATE INDEX idx_training_requests_status ON training_requests(status);
CREATE INDEX idx_training_requests_second_venue ON training_requests(second_venue_id);
CREATE INDEX idx_training_requests_date_status ON training_requests(request_date, status);
CREATE INDEX idx_instructor_schedules_instructor ON instructor_schedules(instructor_id);
CREATE INDEX idx_instructor_schedules_date ON instructor_schedules(schedule_date);
CREATE INDEX idx_instructor_schedules_inst_date ON instructor_schedules(instructor_id, schedule_date);

-- Seed data: Users
INSERT INTO users (email, name, affiliation, phone, role, status) VALUES
    ('kjt@parancompany.co.kr', '관리자', '파란컴퍼니', '010-9876-5432', 'ADMIN', 'ACTIVE'),
    ('kim.dh@navy.mil.kr', '김대현', '제1함대 작전처', '010-1234-5678', 'USER', 'ACTIVE'),
    ('lee.sh@navy.mil.kr', '이승호', '제2함대 정보처', '010-2345-6789', 'USER', 'ACTIVE'),
    ('park.jm@navy.mil.kr', '박정민', '해군교육사령부', '010-3456-7890', 'USER', 'ACTIVE'),
    ('choi.ys@navy.mil.kr', '최윤서', '제3함대 군수처', '010-4567-8901', 'USER', 'ACTIVE'),
    ('jung.hj@navy.mil.kr', '정하준', '해군본부 인사처', '010-5678-9012', 'USER', 'ACTIVE'),
    ('test@test.co.kr', '테스트사용자', '잠수함사령부', '010-1111-2222', 'USER', 'ACTIVE'),
    ('1@1', '관리자2', '해군본부 정훈공보실', '010-6789-0123', 'ADMIN', 'ACTIVE');

-- Seed data: Instructors (category: 해군정체성 7명, 안보 5명, 소통 11명)
-- 해군정체성 (7)
INSERT INTO instructors (name, rank, specialty, phone, affiliation, education_topic, available_region, rating, recommendation, category, notes,
    career, one_line_review, conditions, delivery_score, expertise_score, interaction_score, time_management_score, strengths, weaknesses) VALUES
('강동완', '교수', '안보/북한', '01063296392', '동아대학교 정치외교학과', '북중 국경에서 본 북한의 현실과 인권', '부산/진해', 4.00, '추천', '해군정체성', NULL,
    '부산하나센터 원장, 유튜브 강동완TV 운영, 북한 및 통일 전문가',
    '사진을 설명하는 형태의 강의로 수강자들의 집중도가 높은 편',
    '바쁜 일정이 많으시고 부산 외 일정은 갑자기 취소하는 경향 / 빨리 끝내는 경향',
    5, 4, 4, 3,
    '실제 본인 촬영 사진으로 진행하므로 신뢰도와 호응도가 좋음',
    '강의 자료에 사진만 있어서 안보강의로써 주제관련성이 부족'),
('고광섭', '교수', '해양안보/거북선', '01047699402', '국립목포해양대학교 해군사관학부', '해양안보 및 항법전략, 군·해양 리더십 및 역사전략, 거북선', '전국', 2.50, '보통', '해군정체성', NULL,
    '해군사관학교 명예교수, 목포해양대 해군사관학부 교수, 이순신 해전·안좌도 연구 주도',
    '강의력이 있으나 결론은 거북선과 관련된 역사설명과 거북선 찬양 / 시간 조절이 어려움(시간을 더 쓰길 원함)',
    '전국으로 가실 수 있음',
    4, 3, 2, 1,
    '전국 어디든 가능, 필캠을 위해 시간을 빼주기도 함',
    '여타 군 출신처럼 후배 군인들에게 하대하는 경향'),
('권기형', '참전용사', '2연평해전 참전', '01027233003', '제2연평해전 참전용사', '참전용사의 눈으로 본 제2연평해전 10가지 장면', '부산/진해/충청(숙소지원필요)', 3.25, '추천', '해군정체성', NULL,
    '제2연평해전 참전용사(참수리 357호 갑판병, K-2 소총수 임무), 화랑무공훈장 수여',
    '일반 직장인으로 강의력이 좋지는 못하나 진정성이 있음',
    '초빙은 김대식이 전담, 미리 조율하고 해군본부에 공문이 필요',
    3, 3, 3, 4,
    '실제 본인이 참전했던 내용으로 진행하므로 신뢰도와 호응도가 좋은편',
    '강의 자료로 연평해전 영화의 장면을 사용하며 강의력이 부족해서 집중력이 떨어지는 경향'),
('박태용', '교수', '해군정체성', '01051054293', '목포해양대 해군사관학부', '인생의 터닝포인트', '목포', 3.75, '추천', '해군정체성', NULL,
    '해사 51기, 호원대학교 교수',
    '해군 출신, 말을 잘하는편, 강의 내용은 조금 부실하다',
    '목포',
    4, 4, 3, 4,
    '해군 교육자 중에선 괜찮은 편',
    '강의 내용 부실'),
('이희완', '전)차관', '해군정체성', '01094549437', '前 국가보훈부 차관', '해군정체성 강의', '평택/목포(교통비추가)', 3.50, '추천', '해군정체성', NULL,
    '해군대령 전역, 국가보훈부 정책자문위원회 위원, 히어로즈 패밀리 멘토, 해군사관학교 심리학 교수, 합동군사대학교 해군작전전술교관, 제2연평해전 참전(충무무공훈장 수훈)',
    '강의력은 보통이고 연평해전 참전하신분으로 경험 기반으로 진정성 있음',
    '강의중 조는걸 안좋아하고 다리가 불편하심',
    3, 4, 3, 4,
    '참전 경험 기반으로 집중도가 높은편이고 진정성 있음',
    '마이크를 먹거나 떨어뜨려 말하는 경향(잘안들림)'),
('최명한', '예)제독', '해군정체성', '01037141687', '한국해양대학교 교양교육원', '해군창설 80주년! 필승해군을 넘어 위대한 해군으로', '진해/부산(전국을 원하심)', 3.75, '추천', '해군정체성', NULL,
    '해군 예비역 준장(해사 39기), 양만춘함 함장, 8전투훈련단장, 한국해양대학교 해양군사대학 학장',
    '필캠을 많이 해주셔서 알아서 잘 해주심, 다른 군 출신에 비해서 잘하는 편',
    '25년엔 해군본부에서 섭외 제외 요청이 옴',
    4, 4, 3, 4,
    '필캠을 잘해오셔서 준비를 잘해오심, qqt 활용을 잘해주셔서 집중도가 높은 편',
    '전국으로 불러달라고 은근히 말씀하심, 강의 초반에 본인 PR이 많이 들어감'),
('최원일', '함장', '해군정체성', '010-2004-4395', '326호국보훈연구소 연구소장', '함장의 바다', '수도권/그 외 전국(교통비 지급)', 3.75, '추천', '해군정체성', NULL,
    '前 천안함 함장(예비역 해군 대령), 해사 45기, 前 한미연합군사령부 보안과장',
    '천안함 사건에 있던 상황들과 역대 해전에 대한 강의를 진행',
    NULL,
    4, 4, 3, 4,
    '필캠을 자주 하셔서 준비를 잘해오심, 신사적임, 후배들 출신 묻기가 적은 편',
    '역대 해전들에 대한 설명과 천안함 사건에 대한 설명은 조금 지루한 경향, 요즘 의무복무 중인 군인들은 천안함 사건에 대해 알지도 못함');

-- 안보 (5)
INSERT INTO instructors (name, rank, specialty, phone, affiliation, education_topic, available_region, rating, recommendation, category, notes,
    career, one_line_review, conditions, delivery_score, expertise_score, interaction_score, time_management_score, strengths, weaknesses) VALUES
('강석승', '원장', '북한학', '010-5231-2697', '21세기안보전략연구원 원장', '안보환경 변화와 북한의 실상', '전국', 0.75, '비추천', '안보', NULL,
    '단국대학교 행정학 학사·석사, 인하대학교 행정학 박사, 북한대사전·북핵 판도라 파일 등 북한·안보 관련 저서 다수 집필',
    '55년생으로 나이가 많으시고 강의가 굉장히 지루함',
    '마이크를 멀리두고 얘기하는 경향, 강의 설문 평가가 아주 안좋음',
    1, 1, 0, 1,
    '강의비, 장소 상관없이 가능',
    '전달력도 부족하고 상호작용도 어려움'),
('김동수', '교수', '안보', '01094885437', '부경대 국제지역학부', '글로벌 안보위기와 한반도 평화', '부산/진해', 3.25, '추천', '안보', NULL,
    'West Liberty university 조교수, 통일연구원 부연구위원',
    '목소리는 낮고 강의는 지루한 편이나 진해에서 빠르게 올 수 있음',
    '부산/진해 외에는 거절하시는 경향',
    3, 4, 2, 4,
    '안보 강사 중에는 평균',
    '적극적인 상호작용은 부족, 목소리가 저음이라 집중도 저하'),
('왕선택', '박사', '안보', '01088318697', '서울대학교 언론정보학과', '북한 도발의 역사적 배경과 우리 군의 군사적 대비 태세', '수도권', 3.25, '추천', '안보', NULL,
    'YTN통일외교전문기자, 한평정책연구소 글로벌외교센터장',
    '안보 강의 중에서 평균, 지루하지만 보통임',
    NULL,
    3, 4, 2, 4,
    '무난하고 섭외하기 쉬운편',
    '안보강의 특징, 지루함'),
('최진업', '교수', '안보', '010-3185-7082', '국립강릉원주대 안보전략 센터', '최근 북한의 적대적 대남정책 전환 평가', '수도권/강원/그 외 전국(교통비 지급)', 2.75, '보통', '안보', NULL,
    '前 국정원 강원지부장',
    '국정원 출신으로 청중의 관심을 얻지만 강의는 지루함, 안보 강의 특유의 지루함',
    '강원 지역 안보 강사가 별로없어서 섭외했음',
    2, 3, 2, 4,
    '국정원 출신이라는 이력으로 청중의 흥미가 높음, 의외로 강의 평가가 나쁨이 없고 좋음도 없음',
    '강의가 지루함, qqt의 형태가 만든 사람의 성의가 안보여서 다음에는 깔끔한 폼을 추가해야할 듯'),
('홍석훈', '교수', '안보/국제관계', '01092924721', '창원대 국제관계학과', '트럼프 대외정책과 한반도 안보', '수도권/창원/부산/그 외 전국(교통비 지급)', 3.75, '추천', '안보', NULL,
    '통일연구원 연구위원, 성균관대 정치외교학과 겸임교수',
    '자주 와주셨고 열심히 해주심, 안보 중에 잘하시는 편',
    NULL,
    4, 4, 3, 4,
    '안보 강사 중에 말씀 잘하시고 잘하시는 편, 문제도 내시면서 소통하려는 모습이 보임',
    '학회도 자주 나가셔서 일정 확인 필요');

-- 소통 (11)
INSERT INTO instructors (name, rank, specialty, phone, affiliation, education_topic, available_region, rating, recommendation, category, notes,
    career, one_line_review, conditions, delivery_score, expertise_score, interaction_score, time_management_score, strengths, weaknesses) VALUES
('손정민', '강사', '소통/리더십', '01030019420', '파란컴퍼니', '부대 응집력 강화를 위한 효과적인 소통 전략', '수도권', 4.25, '추천', '소통', NULL,
    'LG전자 B2B 교육팀 총괄팀장, 현대자동차 CS강사',
    '소통 강의를 막힘없이 진행함, 실습 진단지 필요(출력)',
    '육아휴직이라서 수도권 진행',
    5, 4, 4, 4,
    '말을 막힘없이 진행할 수 있으며, 소통 강의를 잘한다',
    '강의라서 레크레이션보다는 재미가 떨어진다'),
('신정희', '강사', '소통/리더십', '01026789143', '해피마인드 대표', '소통 / 리더십', '전국', 2.75, '보통', '소통', NULL,
    '중앙대학교 교육대학원(인적자원개발 전공), 前 CJ그룹 인재개발원 전문강사, 前 삼성전자·LG·현대자동차 교육 협력강사, 現 공공기관·군부대 소통 및 리더십 강의 진행',
    '군인을 좋아해서 낮은 가격에도 전국으로 온다, 다만 인상이 찌푸려질 정도로 언행이 거칠다',
    '언행이 거칠고 레크레이션 점수가 낮은 점 참고',
    2, 2, 3, 4,
    '전국 어디든 군인 강의라면 온다, 낮은 가격(40만)에 전국 가능',
    '언행이 거칠어서 강의 중간에 불쾌감을 주는 경우가 있고 혀가 조금 짧아 발음이 조금 센다'),
('오지혜', '강사', '소통/커뮤니케이션', '01054749974', '위드오컨설팅 대표', '부대 응집력 강화를 위한 효과적인 소통 전략', '부산/진해/통영', 4.50, '추천', '소통', NULL,
    '2023 대한민국 인적자원개발 명강사 대상, 前삼성물류센터 CS강사',
    '필캠 행사는 자주 하셔서 알아서 잘 해주심, 소통 강의 + 실습(소통의 등줄기)를 진행하심',
    '소통강의와 실습의 밸런스가 좋음',
    5, 4, 4, 5,
    '필캠을 자주 하셔서 알아서 잘 해주시고 강의력, 소통, 참여형 실습 모두 잘함',
    '가을, 강의 시즌에는 미리 일정 확인해야함. 많이 바쁘심'),
('이해인', '강사', '소통+레크리에이션', '010-8386-0896', '굿플레이스 교육컨설팅 대표', '소통 + 레크레이션', '수도권', 4.75, '추천', '소통', NULL,
    '중앙대학교 글로벌인적자원개발학 석사, 해병대 인성·리더십센터 전임강사, 보건복지인재원 사회복무요원 전임강사',
    '필캠 소통강의에서 상위권, 정진영 강사(소개)와 비슷한 형태의 강의(소통 + ai활용 레크레이션)',
    '수도권만 하심',
    5, 4, 5, 5,
    '잘하심',
    NULL),
('정소진', '강사', '소통/MBTI', '01056853035', 'KT is 교육 강사', '소통강의 + MBTI', '수도권', 4.25, '추천', '소통', NULL,
    '고용노동부 NCS 확인 강사, 한국코치협회 KAC 인증 코치, 前 LG전자 교육센터 전임 강사, 前 kt cs 사내 교육 강사, CS강사·이미지 컨설턴트·감정노동 관리사 등 다수 자격 보유',
    '좋은 미소로 집중도를 높임, 소통강의는 잘하는편, 실습으로 진단지를 진행(MBTI나 DISC)',
    '소통 강의는 좋음, 개인적으로 진단지 형태의 강의는 별로라고 생각함',
    4, 4, 5, 4,
    '밝은 성격으로 청중의 호감도를 높이고 강의력도 좋은편임',
    '이제는 조금 오래된 MBTI 검사를 강의에서 사용함(다른 형태로 변경요청 필요)'),
('정진영', '강사', '소통+AI레크리에이션', '010-8544-7009', '(주)포인트온보드 대표, 스마일 브라더 대표', '소통강의 + AI활용 레크레이션', '전국(수도권 외 교통비)', 4.75, '추천', '소통', NULL,
    'KBS 공채 개그맨, 한국 서비스경영교육원 수석 서비스 강사, 안산상공회의소 기업전문 강사, 한국예술원 창의력 전문강사, 김포대학교 유튜브 크리에이터과 외래교수',
    '예의가 있고 사람이 좋음, 강의력도 좋은 편이고 잘하심',
    NULL,
    5, 4, 5, 5,
    '예의가 넘치고 J라서 미리 와서 준비하고 시간을 잘 지킴, 쉬는시간에는 타로를 봐줄 만큼 행사에 신경써줌(파란 직원처럼), 강의 일부를 변경하면서 새로운 시도를 많이 함',
    '예상치 못한 상황이 나오면 조금은 주춤'),
('조래훈', '강사', '소통+레크리에이션', '010-5329-5439', 'KBS 31기 공채 개그맨', '소통강의 + 레크레이션', '전국(수도권 외 교통비)', 5.00, '추천', '소통', NULL,
    '중앙대학교 일반대학원 문예창작학과 박사과정, 전북특별자치도 남원시 홍보대사, 서일대학교 외래교수·주임교수, 해군 소통·단합·유머 특강 전담강사, 방송·행사 MC 600회 이상 진행',
    '재미있게 잘함, 레크레이션에 최적화, 분위기 파악을 잘하고 진행MC로 섭외도 좋음',
    '준비성이 좋음. 선물 등 가져오심',
    5, 5, 5, 5,
    '레크레이션도 잘하고 진행MC도 잘하심',
    '하고 있는 행사들이 많아서 필캠으로 섭외는 잘안됨'),
('최해령', '강사', '소통+실습', '010-9437-8401', '마인드앤파인드(MIND&FIND) 대표', '소통 강의 + 참여형 실습', '수도권/그 외 전국(40만에 진행 가능)', 4.00, '추천', '소통', NULL,
    '아레테교육컨설팅 前 대표, Groupe SEB Korea, 농협중앙회, CJ푸드빌 교육 담당, 월간 인재경영 선정 명강사(2018~2020)',
    '소통 + 참여형 실습 강의로 진행됨, 강의와 실습은 잘하는 편임, 전국이라서 급하게 섭외할 때 좋음',
    '개그맨 섭외 안되면 서브로 하기 좋음',
    4, 4, 4, 4,
    '강의력과 실습의 형태도 무난하여 재미있는 편임',
    '섭외를 2번해봐서 조금 더 지켜봐야함'),
('김니나', '강사', '소통/리더십', '01098817732', '한걸음 컨설팅 대표강사', '소통 강의 + 진단지형 실습', '전국', 4.00, '추천', '소통', NULL,
    '이화여자대학교 멘토 스쿨 협력 교수, 한국관광공사 호텔사업부 협력 강사, 현대백화점 인재개발원 전임 강사, 현대아이파크몰 인재개발원 선임 강사, (주)교원 교육팀 CS 교육 실장, 현대자동차 리더십 프로그램 개발 및 컨설팅 담당',
    '강의를 온화하고 부드럽게 진행하심',
    '정소진 강사 추천으로 한번 진행, 이후 진행은 많은 강사비를 요청함',
    4, 4, 4, 4,
    '부드럽게 말씀하시면서 강의를 진행하심',
    'DISC 같은 설문형 실습을 진행, 높은 강사비를 요청함'),
('김주연', '강사', '심리/소통', '0108079267', '주연 심리상담센터 센터장', '심리 강의', '전국', 2.25, '비추천', '소통', NULL,
    '강의 경력 6년 이상',
    '까탈스러움',
    NULL,
    2, 3, 2, 2,
    NULL,
    NULL),
('이정규', '강사', '소통+레크리에이션', '010-7480-2737', 'MBC 18기 공채 개그맨', '소통강의 + 레크레이션', '전국', 4.75, '추천', '소통', NULL,
    '2009년 MBC 개그맨 데뷔, 행사 MC(축제·결혼식·체육대회·음악회 등), 이정규의 정규방송 데일리 DJ, 前 JTV 전주방송(전북 SBS) 라디오 진행, 2014년 어쿠스틱 팝밴드 딜리버 결성(보컬·작사·작곡)',
    '자존감, 자신감이 높음, 소통 강의는 별로 레크레이션은 최상위(필캠용)',
    '자존감이 높아서 싸가지 없게 보일 수 있음',
    5, 5, 5, 4,
    '필캠용 레크레이션은 1시간 40분 정도로 고정되게 짜여있음, 아주 잘함',
    '항상 같은 레크레이션, 포인터(리모컨)을 사용 안함');

-- Seed data: Venues (13 venues with comprehensive info)

-- 1. 이순신리더십국제센터
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '이순신리더십국제센터',
    '경상남도 창원시 진해구 충장로 633',
    '연수시설',
    '한산관(대강당)',
    200, '진해', 200, 100,
    '중식/석식 8,000원, 조식(샌드위치)',
    '상',
    '진해 해군기지 인근, 34실 숙소',
    'https://www.changwon.go.kr/yisunsin/',
    '최정화 팀장 (010-8270-2012) / 대표전화 (070-4239-0771)',
    '진해 해군 캠프의 메카로, 이순신 리더십 체험과 대규모 교육 및 숙박을 원스톱으로 해결할 수 있는 최적의 시설',
    '한산관: 최대 200명(대강당), 프로젝터/노트북/스크린/음향시설 완비, 전체면적 6,692㎡ | 노량관: 60명(2층) | 옥포관: 50명(2층) | 명량관: 40명(2층) | 당항포관: 30명(1층) | 안골포관: 20명(1층)',
    '강의실: 한산관 이전 1,256,000원 | 숙박: 2인실 40,000원(한실10/양실10), 4인실 80,000원(침대 2인용 2개), 6인실 120,000원(침대 2인용 2개+온돌, 화장실 2개) | 식사: 중식/석식 각 8,000원, 조식(샌드위치)',
    '8m x 60cm (폼보드 단상용: 50x30cm)',
    NULL,
    '총 34실 (수용인원 100명, 4~5층) | 2인실: 한실 10, 양실 10 | 4인실: 침대 2인용 2개 | 6인실: 침대 2인용 2개 + 온돌, 화장실 2개',
    '수건, 샴푸, 치약',
    '생수, 바디워시, 칫솔, 면도기 등 개별 준비 필수',
    '공용 로비, 커뮤니티 공간, 커피숍, 기념품숍, 전시공간',
    NULL,
    '평시 미운영, 대관 시에만 운영 (최소 5일 전 인원/날짜 확정 필수)',
    '한산관 이용 시 책걸상 자가 세팅 필요 (사전 인력 계획 수립 권장) / 생수가 제공되지 않으므로 대량 구매 혹은 개인 지참 안내 필수 / 주말(일요일) 세팅이나 식사 운영은 반드시 최정화 팀장과 사전 조율 필요',
    '체험시설: 이순신 리더십 체험관 (군인 1인 2,000원 / 해설사 추가 시 10만원 - 30명당 1명) | 흡연: 객실 내 절대 금연 (위반 시 청소비 20만원 부과) | 편의: 커피숍, 기념품숍, 전시공간 | 주차: 전면/후면/지하 등 3개소 (100명 숙박 시에도 충분)',
    '장점: 해군 맞춤형 교육 환경(이순신 테마), 저렴한 숙박료, 충분한 주차 공간 및 부대시설 | 유의: 한산관 이용 시 책걸상 자가 세팅 필요, 생수 미제공, 주말 운영은 사전 조율 필요',
    'https://works.do/xNW2GrX'
);

-- 2. 청호인재개발원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '청호인재개발원',
    '경기도 화성시 팔탄면 마당바위로 135-21',
    '연수원',
    '윌리엄홀(대강의실)',
    250, '화성', 250, 200,
    '일반식 9,500원 / 특식 전골 25,000원',
    '상',
    '화성 소재, 3인실/4인실',
    'http://www.chunghoacademy.co.kr',
    '대표전화 031-354-1270 / 대관문의 02-522-0496',
    '식사가 매우 우수하고 직원이 친절하며, 대규모 주차와 다양한 강의실을 갖춘 종합 교육장',
    '윌리엄홀: 250명, 숙박 시 120만원/비숙박 시 200만원 | 팀홀: 168명, 숙박 시 100만원/비숙박 시 150만원 | 대회의실: 80명, 숙박 시 60만원/비숙박 시 80만원 (얼음 정수기 구비, 스피커 깨짐 현상 있음)',
    '강의실: 윌리엄홀 120/200만원, 팀홀 100/150만원, 대회의실 60/80만원 (숙박/비숙박) / 특별할인: 중강의실 동일 1일 350,000원 | 숙박: 3인실 90,000원(VAT 별도), 4인실(온돌) | 식사: 일반식 9,500원, 특식 전골 25,000원',
    NULL,
    NULL,
    '3인실(침대), 4인실(온돌) 보유',
    '비누, 수건, 물통, 종이컵',
    '샴푸, 린스, 바디워시, 칫솔, 치약 등 개별 세면도구 필히 지참',
    '복도에 정수기(얼음정수기 다수) 배치, 3인실 건물은 엘리베이터가 협소함',
    NULL,
    '조식(07:30~08:30), 중식(11:30~13:00), 석식(18:00~19:00) / 일반식 메뉴는 1주일 전 확인 가능',
    '100명 이하 시 반찬대는 1라인만 운영함, 전반적으로 맛이 매우 우수함 / 강의실을 저녁에 자체 대관하여 사용할 수 있다는 큰 장점 / 배달 음식 반입 시 외부음식반입확인서 양식을 미리 확보하고 쓰레기 분리배출 지침을 참가자들에게 미리 안내',
    '체험: 운동장(시간당 25만원), 무인카페 | 음주: 저녁 부대 대관 시 외부 음식(배달 등) 반입 확인서 작성 후 가능 | 흡연: 본관 뒤편 정자, 팀홀 우측 흡연장 | 편의: 무인카페, 얼음 정수기 다수 배치 | 주차: 200대 이상 가능, 대형버스 주차 용이',
    '장점: 식사의 질이 매우 높고 주차 및 접근성이 뛰어남. 담당 직원이 매우 친절하여 숙소 배정 및 안내 협조가 원활함. | 유의: 비누와 수건 외 세면도구가 전혀 없으므로 참가자 사전 공지 필수, 대회의실 음향 장비(스피커) 상태 확인 필요, 건물과 엘리베이터가 다소 노후된 편',
    'https://works.do/xNW2GrX'
);

-- 3. DB생명 인재개발원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    'DB생명 인재개발원',
    '경기 화성시 정남면 괘랑보통길 150',
    '연수원',
    '대강당',
    164, '화성', 164, 100,
    '조식/중식/석식 각 9,000원',
    '중상',
    '화성 소재, 2인실/6인실',
    'https://hrd.idblife.com/',
    '02-3011-4500',
    '호텔형과 콘도형 객실을 모두 보유하여 원스톱 교육이 가능하며 보통저수지 인근의 자연 친화적인 교육 환경을 갖춘 연수원',
    '대강당: 164명, 인당 12,500원 (최소 인원 90명 / 최소 총액 1,125,000원) | 대강의실: 80명, 인당 12,500원 (최소 인원 50명 / 최소 총액 625,000원)',
    '강의실: 인당 12,500원 | 숙박: 호텔형 2인실 77,000원, 콘도형 6인실 132,000원 | 식사: 조식/중식/석식 각 9,000원',
    NULL,
    NULL,
    '호텔형 2인실(침대 2개), 콘도형 6인실(침대 6개)',
    '샴푸, 바디워시, 수건, 샤워시설 완비',
    '칫솔, 치약, 면도기 등 기타 세면도구',
    '산책로, 매점, 도서관 보유',
    NULL,
    '취소수수료: 14~8일전 20% / 7~4일전 50% / 3일전 70% / 2일 이내 100% | 조식 07:00~08:00 / 중식 12:00~13:00 / 석식 18:00~19:00 (특식 19:00~21:00)',
    '필승해군캠프 참석 인원의 50% 수준으로 조식 준비 가능 / 대강당(2층) 이용 시 엘리베이터가 없어 무거운 짐이나 다과 이동 시 인력 투입 필요',
    '체험: 산책로 (보통저수지 인접) | 편의: 매점, 도서관, 정수기 | 주차: 다소 협소하나 무료 이용 가능 (대형버스 주차 가능 여부 확인 필요)',
    '장점: 호텔식과 콘도식의 다양한 숙박 환경 제공, 전문적인 음향/영상 시설 구비, 보통저수지와 어우러진 휴식 공간 | 유의: 대강당(2층) 이용 시 엘리베이터가 없어 무거운 짐이나 다과 이동 시 인력 투입 필요, 운동장 및 운동기구가 없어 동적인 레크리에이션 활동은 제한됨',
    'https://works.do/xNW2GrX'
);

-- 4. YBM연수원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    'YBM연수원',
    '경기도 화성시 정남면 세자로 317',
    '연수원',
    '강의실(대)',
    160, '화성', 160, 120,
    '별도 협의',
    '보통',
    '화성 소재, 2-3인실/6인실',
    'https://www.ybmacademy.com',
    '031-374-0509',
    '대규모 인원 수용이 가능하며 인원수 기반의 합리적인 대관료 체계를 갖춘 교육 시설',
    '강의실(대): 160명 (80~160명 수용), 기본 사용료 1,000,000원 또는 인당 10,000원 | 중강의실: 80명 (40~80명), 인당 10,000원',
    '강의실: 대형 정액 1,000,000원 또는 인당 10,000원, 중형 인당 10,000원 | 숙박: 2인실/3인실 95,000원, 6인실 160,000원 | 식사: 별도 협의',
    NULL,
    NULL,
    '2인실/3인실, 6인실 운영',
    '샴푸, 바디워시, 수건 제공',
    '칫솔, 치약, 면도기 등 기타 세면도구',
    NULL,
    NULL,
    NULL,
    NULL,
    NULL,
    '장점: 강의실 대관료가 인당 1만 원 수준으로 책정될 수 있어 인원수에 따른 유연한 예산 집행이 가능함 | 유의: 수건과 기본적인 세정제(샴푸, 바디워시) 외 세면도구는 없으므로 사전 공지 필요',
    'https://works.do/xNW2GrX'
);

-- 5. 목포국제축구센터
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '목포국제축구센터',
    '전라남도 목포시 내화마을길 89',
    '연수시설',
    '대강당',
    200, '목포', 200, 150,
    '조식/중식/석식 각 10,000원',
    '중상',
    '목포 소재, 2인실/4인실',
    'https://mifc.co.kr',
    '박성민 주임 (010-3125-7623 / milk4431@naver.com)',
    '교육과 체육 시설을 동시에 갖춘 복합 공간으로, 원스톱 팀빌딩 활동에 최적화된 스포츠 연수 시설',
    '대강당: 200명, 고정형 책상, 기본 사용료 100,000원 | 대회의실(1층): 70명, 기본 사용료 80,000원 (책상과 의자가 지저분하고 60명도 수용하기에 어려움, 책상과 의자가 통일되어있지 않음)',
    '강의실: 대강당 100,000원, 대회의실 80,000원 | 숙박(평일 20% 할인): 2인실 35,200원, 4인실/VIP 88,000원 | 식사: 조식/중식/석식 각 10,000원',
    NULL,
    '대강당 고정형 책상',
    '2인실, 4인실, 8/10인실, 20인실, VIP실 등 다양한 규모 보유',
    '수건, 샤워시설, 사우나(헬스장에 있음) 이용 가능',
    '수건 외 세면도구 일체(칫솔, 치약, 샴푸 등) 및 헤어드라이기 개별 지참 필수',
    '3층 다인 샤워실 별도 보유(단체 사용 용이), 사우나, 매점',
    '박성민 주임 문의',
    '식당 이용 시간대를 사전에 반드시 고지해야 함',
    '식사시간 시작~10분 안에 전부 와주실 원함 / 헤어드라이기가 없으니 참고바람 / 인조구장은 주간에는 그냥 빌려줬었음(확인필요)',
    '체험: 인조구장, 하프돔구장, 풋살구장, 다목적체육관, 헬스장(무료 이용) | 음주: 금지 (청소년들이 많이옴) | 흡연: 센터 건물 및 외부 전체 금연, 본관 정문/4층 옥상에서만 흡연 가능 | 편의: 사우나, 매점, 마트(단지 밖 약 600m) | 주차: 무료 주차 공간 충분, 대형버스 주차 가능',
    '장점: 숙박, 식사, 교육, 체육까지 한 곳에서 가능한 원스톱 서비스. 3함대와 인접하여 접근성이 좋고 대규모 팀빌딩에 매우 적합 | 유의: 식당 및 구장 이용 시간 사전 공유 필수. 헤어드라이기 없음. 흡연 구역(1층 정문, 4층 옥상) 제한적이므로 흡연자 사전 공지 필요',
    'https://works.do/xNW2GrX'
);

-- 6. 부산도시공사 아르피나
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '부산도시공사 아르피나',
    '부산광역시 해운대구 해운대해변로 35(우동)',
    '리조트',
    '그랜드 볼룸',
    200, '부산', 200, 280,
    '조14,000/중석20,000원',
    '중상',
    '해운대 소재, 103실',
    'http://www.arpina.co.kr/',
    '박진우 매니저 (051-740-3253) / 프론트 (051-740-3201)',
    '해운대 인근의 우수한 시설과 대규모 주차 공간을 갖추었으나, 성수기 비용 상승으로 인해 이용 시기 선택이 중요한 연수 시설',
    '그랜드 볼룸: 200명 (결혼식 및 150명 이상 대규모 행사 적합) | 중강의실(자스민,클로버): 50명, 기본 사용료 66만원(10시-17시), 1,309,000원(1박2일)',
    '강의실: 중강의실 66만원(10시-17시), 1,309,000원(1박2일) | 숙박: 2인실 침대 55,000원, 4인실 침대 77,000원, 4인실 온돌 77,000원, 5인 콘도 110,000원 (주말/7~8월 성수기 가격 2배 상승) | 식사: 조식 14,000원, 중식/석식 각 20,000원 (기본 14,000원+테이블당 메뉴 추가)',
    '(자스민홀) 5000 x 700 mm / 포디움 60 x 90 cm',
    NULL,
    '총 103실 (수용 인원 280명) | 2인실 침대(더블1,싱글1) | 4인실 침대(더블1,싱글2) | 4인실 온돌 | 5인 콘도(침대방,온돌방,거실)',
    '샴푸, 린스, 바디워시, 수건(1인당 2장), 드라이기, 생수(객실당 500ml 2병)',
    '칫솔, 치약은 제공되지 않으며 지하 편의점에서 유료 구매 필요',
    '무료 Wi-Fi, 지하 1층 편의점(07:00~22:30), 1층 카페라운지, 코인세탁실, 종합스포츠센터(골프연습장, 요가, 헬스, 수영장)',
    NULL,
    '조식(07:30~08:30), 중식(12:00~13:00), 석식(18:00~19:00) / 평시 미운영, 사전 예약 시에만 운영 가능 / 체크인 15:00 / 체크아웃 11:00',
    '세 끼 연속 이용 시 메뉴 중복될 수 있으므로 사전 확인 필요. 인근 도보 이동 가능 식당이 없어 차량 이동(5분 이내) 필수.',
    '체험: 종합스포츠센터(골프연습장, 요가, 헬스, 수영장) | 음주: 청소년 수련시설이므로 야간 과도한 음주 및 소음 자제 필수 | 흡연: 전 객실 금연, 외부 지정 흡연 장소 이용 | 편의: 지하 1층 편의점(07:00~22:30), 1층 카페라운지, 코인세탁실 | 주차: 총 280대 수용(지상/지하 2~3층), 대형버스 주차 가능(사전 연락 권장), 투숙객 무료',
    '장점: 해운대 인근 깔끔한 최신식 시설, 대규모 주차장, 친절한 장비 지원 서비스 | 유의: 7~8월 성수기 및 주말 가격 폭등, 단체 숙박 예약은 반드시 매니저를 통해야 함(홈페이지 직접 예약 불가), 객실 내 금연 위반 시 청소비 부과',
    'https://works.do/xNW2GrX'
);

-- 7. 호텔현대 바이 라한 목포
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '호텔현대 바이 라한 목포',
    '전라남도 영암군 삼호읍 대불로 91',
    '호텔',
    '에메랄드+루비홀',
    1000, '영암/목포', 70, 200,
    '조중석 각 26,000원 (뷔페 전골 시 30,000원)',
    '상',
    '대규모 컨벤션 가능, 고급 시설',
    'https://www.lahanhotels.com/mokpo',
    '허윤종 지배인 (010-2469-9953)',
    '3함대와 매우 인접하여 접근성이 압도적이며, 고급 호텔 시설과 숙박 인프라를 갖춘 프리미엄 교육 공간',
    '에메랄드+루비: 70명(스쿨 타입), 기본 사용료 80만원(숙박 시) / 120만원(비숙박) | 대연회장(컨벤션 C홀): 1,000명, 기본 사용료 120만원',
    '강의실: 컨벤션 C홀 120만원, 에메랄드+루비 120만원/80만원(숙박 시) | 숙박: 트윈 시티뷰 95,000원(40실), 트윈 바다뷰 125,000원(40실), 온돌4인실 125,000원(16실) | 식사: 조식/중식/석식 각 26,000원 (연회장 뷔페 전골 시 30,000원)',
    NULL,
    '스쿨 타입',
    '트윈 시티뷰 40실, 트윈 바다뷰 40실, 온돌(4인실) 16실',
    '샴푸, 바디워시, 수건 제공',
    '칫솔, 치약, 면도기 등 기타 세면도구',
    '피트니스 센터, 탁구장, 당구장, 코인세탁실 이용 가능',
    '레스토랑 토파즈(140석) 및 연회장',
    '대관 시 식사 예약 병행 필요',
    '3함대 내부 의견으로 식사 만족도가 다소 낮다는 평가 / 보통 점심을 쿠우쿠우 식당에서 진행했음(1일 집중형) / 숙박이 비싸기 때문에 1일 집중형만 진행했음',
    '체험: 피트니스 센터, 탁구장, 당구장 | 흡연: 원내 금연, 외부 지정 흡연 장소 이용 가능 | 편의: 코인세탁실, 다과 서비스 가능 | 주차: 250대 규모, 대형버스 주차 용이',
    '장점: 3함대에서 30분 거리의 접근성, 호텔 수준의 고품질 객실 및 부대시설(세탁, 운동 등), 대규모 인원 수용 능력 | 유의: 에메랄드+루비홀 최대 70명이므로 70~80명 규모 시 공간 협소, 숙박이 비싸 1일 집중형만 진행했음, 식사 비용이 일반 연수원 대비 높음',
    'https://works.do/xNW2GrX'
);

-- 8. 한국여성수련원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '한국여성수련원',
    '강원도 강릉시 옥계면 금진솔밭길 148-19 (금진리)',
    '수련원',
    '다목적실',
    328, '강릉', 100, 328,
    '인당 20,000원',
    '상',
    '강릉 소재, 1함대 인근',
    'kwcenter.or.kr',
    '033-530-4356 (대관)',
    '1함대와 가까워서 접근성이 좋고 건물은 오래되었지만 강의실은 깔끔함',
    '다목적실: 100명, 타원형, 331㎡, 기본 사용료 20만원, 현수막 6m x 70cm | 대강당: 328명(2층 235명, 3층 93명), 복층 구성, 고정형 책상, 459㎡, 기본 사용료 50만원, 현수막 9m x 1m',
    '강의실: 다목적실 20만원, 대강당 50만원 (1회당 오전/오후/야간) | 숙박: 한실(4인) 27개실 6만원, 양실(2인) 19개실 6만원 | 식사: 인당 20,000원',
    '다목적실 6m x 70cm, 대강당 9m x 1m',
    '다목적실: 책상/의자 배치 변경 가능 (자체 변경, 셋팅 시간 30분 제공) / 대강당: 고정형',
    '한실(4인) 27개실, 양실(2인) 19개실',
    'TV, 에어컨, 소형 냉장고, 월풀욕조, 빨래건조대, 타월, 비누, 드라이기, 머리빗, 샴푸, 바디클렌저, 커피포트, 물병 및 컵',
    '칫솔, 치약, 면도기 등 일회용 세면도구',
    '복도 양쪽 휴게실에 전자레인지와 냉온수기 비치',
    '010-2580-1063',
    '최소 3일 전까지 확정 인원 통보 필요 / 조식 07:00~08:00, 중식 12:00~13:00, 석식 18:00~19:00 / 성수기 기간 7월 25일부터 8월 15일',
    '메인 메뉴가 전골일 경우 꼭 전골로 해달라고 명시적으로 요청할 것 / 인당 20,000원 구성이 매우 우수함',
    '흡연: 원내 전체 금연, 외부 지정 흡연실만 이용 가능 | 음주: 원칙적으로 금주 시설이나, 객실 내 비공식적 음주는 허용 | 휴게: 각 층 복도 끝에 공용 휴게실 및 정수기 시설 완비',
    '장점: 1함대와의 뛰어난 접근성, 합리적인 대관료 및 숙박비, 깔끔한 강의 환경 | 유의: 모든 강의실 내 음식물 반입 금지, 저녁 22:00 이후 고성방가 시 퇴실 조치 가능 (엄격 관리)',
    'https://works.do/xNW2GrX'
);

-- 9. 통영 동원리조트
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '통영 동원리조트',
    '경상남도 통영시 산양읍 영운리 산 184-1',
    '리조트',
    '이순신홀',
    100, '통영', 100, 100,
    '중식/석식 15,000원, 조식 13,000원',
    '상',
    '통영 소재, 트리플룸 80,000원',
    'https://www.dongwonresort.co.kr/',
    '055-640-5000',
    '수려한 다도해 경관과 골프장을 배후에 둔 복합 리조트로, 대규모 숙박과 교육(이순신홀)이 동시에 가능한 장소',
    '이순신홀: 100명 규모, 기본 사용료 300,000원 (+ 추가 시 150,000원)',
    '강의실: 이순신홀 300,000원(하루에 30만원 / 1박2일 30만+15만) | 숙박: 슈페리어 트리플 80,000원, 디럭스 트리플K 80,000원, 디럭스 트리플 80,000원, 슈페리어 더블 80,000원 | 식사: 중식/석식 15,000원, 조식 13,000원',
    NULL,
    NULL,
    '슈페리어 트리플(더블1/싱글2, 4인) | 디럭스 트리플K(더블1/싱글2, 4인) | 디럭스 트리플(싱글3, 3인) | 슈페리어 더블(더블2, 4인) | 리조트형 객실/골프텔/카라반 등',
    '샴푸, 린스, 타월, 헤어드라이어, 비데 제공',
    '칫솔, 치약, 면도기 등 일회용 세면도구',
    '객실 내 무료 WiFi 제공',
    NULL,
    '단체 식사 시 사전 메뉴 협의 필요',
    '방에는 침대가 3개이므로 3인용으로 들어가야 됨(싱글 3 or 더블 1, 싱글 2) / 부가세는 빼주고 있음',
    '음주: 가능(사전 협의 필요, 식당에서는 불가) | 흡연: 건물 내 금연, 지정된 외부 흡연 구역 이용 | 편의: 노래방, 탁구장, 편의점 | 주차: 리조트 및 클럽하우스 전용 주차장(대형버스 주차 가능)',
    '장점: 객실당 단가가 8만원 수준으로 인원 대비 가성비가 매우 뛰어남, 부가세는 빼주고 있음 | 유의: 방에는 침대가 3개이므로 3인용으로 들어가야 됨',
    'https://works.do/xNW2GrX'
);

-- 10. 태백 중진공 연수원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '태백 중진공 연수원',
    '강원특별자치도 태백시 구와우길 38-7',
    '연수원',
    '소강당',
    150, '태백', 150, 78,
    '조식 10,000원 / 중석식 10,000~30,000원',
    '중상',
    '태백 소재, 해발 800m 고지대',
    'https://ssup.kosmes.or.kr/trainingInstitute/6/caution',
    '백승재 사원 (033-550-5013 / sj.baek@kosmes.or.kr)',
    '해발 800m 고지대에 위치하여 여름에도 서늘한 기후를 가진 CEO 리더십 특화 연수 시설',
    '소강당: 78명, 220,000원(3시간)/추가 1시간당 44,000원, 현수막 6000x600mm(클립,자석부착)/폼보드 900x300mm | 실내체육관: 150명, 275,000원(3시간)/추가 1시간당 77,000원 | 일반강의실(6개실): 20~50명, 110,000원(3시간)/추가 1시간당 22,000원',
    '강의실: 소강당 220,000원(3시간), 실내체육관 275,000원(3시간), 일반강의실 110,000원(3시간) | 숙박: 1인실(47실) 33,000원, 4인실(22실) 66,000원, 6인실(3실) 110,000원 | 식사: 조식 10,000원, 중석식 10,000~30,000원',
    '6000 X 600mm (클립, 자석부착) / 폼보드 900 X 300mm',
    NULL,
    '1인실(47실): 원룸형, 침대/화장실/샤워실 | 4인실(22실): 콘도형, 침실2/주방/거실/욕실/발코니 | 6인실(3실): 콘도형, 침실2/주방/거실/욕실/발코니(침대방)',
    'TV, 에어컨, 수건(2장), 비누, 샴푸, 바디워시, 정수기, 치약/칫솔 등 일회용품 제공',
    '수건 추가 필요 시 사감실 요청, 커피머신 이용 시 개인 머그컵 지참 권장',
    '와이파이(숙소 내), 커피머신(2층), 세탁실(3층 사감실 옆), 층별 정수기',
    '김상희 010-5363-2115',
    NULL,
    '특식 C, D 등급은 4인 상차림 기준으로 운영됨 / 식당이 대규모 인원을 감당하기에 조금 부족함(서비스 엉망) / 여름철에도 아침저녁으로 서늘하므로 긴 소매 옷 준비 필수',
    '체험: 실내체육관(시간당 25만원), 커피머신(2층) | 음주: 허용, 다만 식당에서 맥주캔 구매 필요(355ml 기본 세팅) | 흡연: 원내 전체 금연, 외부 지정 흡연실만 이용 가능(교육장 뒤쪽 2층 주차장) | 편의: 숙소 내 와이파이, 세탁실(3층), 정수기 | 주차: 건물 내 1층 주차장 (대형버스 및 승용차 주차 용이)',
    '장점: CEO 리더십 특화, 해발 800m 서늘한 기후 | 유의: 연수원 전체 금연(지정 장소 외), 멧돼지/뱀 출몰 위험으로 산책로 이용 자제 권고. 인근 대형마트(7km) 및 시장 이용 시 차량 이동 필요',
    'https://works.do/xNW2GrX'
);

-- 11. 중진공 충청연수원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '중진공 충청연수원',
    '충청남도 천안시 서북구 직산읍 남산2길 41',
    '연수원',
    '대강당',
    100, '천안', 100, 86,
    '별도 협의',
    '보통',
    '천안 소재, 66실, 2021년 개관 최신 시설',
    'https://ssup.kosmes.or.kr/trainingInstitute/7/facilities',
    '시설 대여 담당 041-559-9226 / 대표번호 041-559-9225',
    '2021년 개관한 최신 시설로 스마트 제조 혁신 분야에 특화되어 있으며, 100명 규모 교육에 최적화된 연수원',
    '대강당: 100명 | 대강의실: 40명, 216㎡, 기본 사용료 100,000원(3시간/추가 1시간당 20,000원, VAT 별도)',
    '강의실: 대강의실 100,000원(3시간, 추가 1시간당 20,000원, VAT 별도) | 숙박: 별도 협의 | 식사: 별도 협의',
    NULL,
    NULL,
    '총 66개 객실 (1인실 46실, 2인실 20실 운영 / 최대 86명 수용 가능) - 더 많이 있을 것임',
    '샴푸, 바디워시, 수건 제공',
    '칫솔, 치약, 면도기 등 일회용 세면도구',
    '객실 내 와이파이, 실내체육관, 커피머신(2층), 세탁실, 정수기',
    NULL,
    NULL,
    '식당 퀄리티가 굉장히 낮은편',
    '체험: 실내체육관(시간당 25만원 - 확인 필요), 커피머신(2층) | 음주: 원내 음주 절대 금지 | 흡연: 원내 전체 금연, 외부 지정 흡연실만 이용 가능(교육장 뒤쪽 2층 주차장) | 편의: 숙소 내 와이파이, 세탁실, 정수기 | 주차: 충분히 마련되어 있음 (대형버스 및 승용차 주차 용이)',
    '장점: 2021년 개설된 최신식 교육 환경 및 수도권/충청권에서의 뛰어난 접근성 | 유의: 연수원 시설 내 음주 금지',
    'https://works.do/xNW2GrX'
);

-- 12. 중진공 부산경남연수원
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '중진공 부산경남연수원',
    '경상남도 창원시 진해구 남영로473번길 22(남양동)',
    '연수원',
    '대강당',
    150, '창원/진해', 150, 100,
    '별도 협의',
    '중',
    '창원진해 소재, 2인실 40,000원',
    'https://sbti.kosmes.or.kr/',
    '시설대관 성태경 대리 (055-548-8023) / 식당 한선순 영양사 (055-548-8097, 010-3253-2086)',
    '진해 부대 인근 필승해군캠프 보조 교육시설로, 체육관과 대강당을 보유하여 대규모 인원 수용이 가능한 공공 연수원',
    '대강당: 150명, 3시간 300,000원/추가 1시간당 60,000원 | 중규모 강의실: 50명, 3시간 100,000원/추가 1시간당 20,000원',
    '강의실: 대강당 300,000원(3시간), 중규모 강의실 100,000원(3시간) | 숙박: 1인당 20,000원 / 객실당(2인) 40,000원 | 식사: 별도 협의',
    NULL,
    NULL,
    '2인 1실, 총 수용 인원 100명',
    '샴푸, 바디워시, 수건 제공',
    '칫솔, 치약, 면도기 등 기타 세면도구',
    '각 객실 내 개인 화장실 및 샤워시설 완비, 교육과 별도의 숙소동 운영',
    '한선순 영양사 (055-548-8097, 010-3253-2086)',
    NULL,
    '연수원 인근에 외부 식당이 전혀 없으므로 숙박 시 모든 식사를 내부에서 해결해야 함 / 행사를 해본적이 없음, 디테일 한 내용 추가 필요 - 김종태',
    '체험: 실내체육관(기본 3시간 300,000원/추가 1시간당 100,000원) | 편의: 교육과 별도의 숙소동 운영 | 주차: 충분한 주차 공간 확보',
    '장점: 공공기관 직영으로 이용료가 고정되어 저렴하며, 실내체육관이 있어 별도의 단체 행사나 팀빌딩 진행이 가능함 | 유의: 진해 부대에서 약 40분 거리, 시설 전반이 노후화되어 이순신센터 등 우선순위 시설의 예약이 불가능할 때 보조적으로 활용 권장, 주변 인프라가 없어 식사 인원 및 메뉴 확정을 담당 영양사와 사전에 정교하게 조율해야',
    'https://works.do/xNW2GrX'
);

-- 13. 동해 무릉건강숲
INSERT INTO venues (name, address, building, room_number, capacity, region, lecture_capacity, accommodation_capacity, meal_cost, overall_rating, notes,
    website, reservation_contact, summary, lecture_rooms, usage_fee, banner_size, desk_layout, room_status, room_amenities, personal_items,
    convenience_facilities, restaurant_contact, reservation_rules, important_tips, sub_facilities, evaluation, survey_images)
VALUES (
    '동해 무릉건강숲',
    '강원특별자치도 동해시 삼화로 455(삼화동)',
    '연수시설',
    '대강당',
    100, '동해', 100, 60,
    '1인 10,000원',
    '상',
    '동해 소재, 자연 친화적 복합 교육 환경',
    'https://www.dh.go.kr/forest/',
    '김나현 팀장 (033-539-8280) / 대표번호 (033-530-2391)',
    '자연 친화적 복합 교육 환경으로 팀빌딩 및 심리역량 강화(필승해군캠프 등)에 최적화됨',
    '대강당: 100명, 10만원(4시간)/20만원(8시간) | 소그룹실: 50명, 6만원(4시간)/12만원(8시간)',
    '강의실: 대강당 10만원(4시간)/20만원(8시간), 소그룹실 6만원(4시간)/12만원(8시간) | 숙박(비수기/20인 이상 단체 20% 할인): 2인실(온돌/침대) 30개실 6만원(단체 4.8만원), 6인실 6개실 12만원(단체 9.6만원), 8인실 2개실 20만원(단체 16만원) | 식사: 1인 10,000원',
    NULL,
    NULL,
    '2인실(온돌/침대) 30개실 | 6인실 6개실 | 8인실 2개실',
    'TV, 에어컨, 개별 샤워실 및 화장실, 이불, 수건, 샴푸, 바디워시',
    '칫솔, 치약, 면도기 등 일회용 세면도구 및 생수(물)는 제공되지 않으므로 개별 준비 필수',
    '온열테라피실, 차훈명상실, 동굴산책로, 잔디광장(야외 팀빌딩), 사우나 및 찜질방(안내데스크 5,000원)',
    '건강자연식당',
    NULL,
    '단체 식사 해결에 용이하나 특식 진행 시에는 외부 식당 이용 필요 / 객실 기본 인원 외 추가 수건 및 생수 제공 불가',
    '체험: 온열테라피실, 차훈명상실, 동굴산책로, 잔디광장(야외 팀빌딩) | 힐링: 사우나 및 찜질방(안내데스크 5,000원) | 주차: 내부 및 외부 주차 공간 충분(대형버스 주차 용이) | 참고: 별도의 체육시설은 없음',
    '장점: 자연 속 교육과 힐링 동시 가능, 소규모~중간 규모 교육에 최적화, 저렴한 대관료 | 유의: 흡연 및 음주 절대 금지, 객실 내 취식 불가',
    'https://works.do/xNW2GrX'
);

-- ═══════════════════════════════════════════════
-- Venue Contacts (장소 담당자)
-- ═══════════════════════════════════════════════

-- 1. 이순신리더십국제센터
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (1, '최정화', '팀장', '010-8270-2012', NULL, '전화', '주말(일요일) 세팅이나 식사 운영은 반드시 사전 조율 필요');
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (1, '대표전화', '대관문의', '070-4239-0771', NULL, '전화', NULL);

-- 2. 청호인재개발원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (2, '대표전화', '대관문의', '031-354-1270', NULL, '전화', NULL);
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (2, '대관문의', '대관', '02-522-0496', NULL, '전화', NULL);

-- 3. DB생명 인재개발원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (3, '대표전화', '대관문의', '02-3011-4500', NULL, '전화', NULL);

-- 4. YBM연수원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (4, '대표전화', '대관문의', '031-374-0509', NULL, '전화', NULL);

-- 5. 목포국제축구센터
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (5, '박성민', '주임', '010-3125-7623', 'milk4431@naver.com', '전화', NULL);

-- 6. 부산도시공사 아르피나
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (6, '박진우', '매니저', '051-740-3253', NULL, '전화', '단체 숙박 예약은 반드시 매니저를 통해야 함');
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (6, '프론트', '프론트데스크', '051-740-3201', NULL, '전화', NULL);

-- 7. 호텔현대 바이 라한 목포
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (7, '허윤종', '지배인', '010-2469-9953', NULL, '전화', NULL);

-- 8. 한국여성수련원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (8, '대관담당', '대관', '033-530-4356', NULL, '전화', NULL);
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (8, '식당담당', '식당', '010-2580-1063', NULL, '전화', '최소 3일 전까지 확정 인원 통보 필요');

-- 9. 통영 동원리조트
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (9, '대표전화', '대관문의', '055-640-5000', NULL, '전화', NULL);

-- 10. 태백 중진공 연수원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (10, '백승재', '사원', '033-550-5013', 'sj.baek@kosmes.or.kr', '전화', NULL);
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (10, '김상희', '식당', '010-5363-2115', NULL, '전화', '식당 관련 문의');

-- 11. 중진공 충청연수원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (11, '시설대여담당', '시설대여', '041-559-9226', NULL, '전화', NULL);
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (11, '대표전화', '대관문의', '041-559-9225', NULL, '전화', NULL);

-- 12. 중진공 부산경남연수원
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (12, '성태경', '대리 (시설대관)', '055-548-8023', NULL, '전화', NULL);
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (12, '한선순', '영양사 (식당)', '055-548-8097', NULL, '전화', '식사 인원 및 메뉴 확정을 사전에 정교하게 조율해야');
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (12, '한선순 (휴대폰)', '영양사 (식당)', '010-3253-2086', NULL, '전화', NULL);

-- 13. 동해 무릉건강숲
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (13, '김나현', '팀장', '033-539-8280', NULL, '전화', NULL);
INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
VALUES (13, '대표전화', '대관문의', '033-530-2391', NULL, '전화', NULL);

-- Seed data: Notices
INSERT INTO notices (title, content, author, important) VALUES
('2025년 2분기 필승해군캠프 교육 일정 안내',
E'2025년 2분기 필승해군캠프 교육 일정을 안내드립니다.\n\n■ 교육 기간\n• 1차: 2025년 6월 9일(월) ~ 6월 13일(금)\n• 2차: 2025년 6월 23일(월) ~ 6월 27일(금)\n\n■ 교육 장소\n• 진해 해군교육사령부 교육관\n• 숙소: 진해 국방컨벤션센터\n\n■ 교육 신청\n• 신청 기간: 2025년 5월 1일 ~ 5월 23일\n• 신청 방법: 본 시스템 ''교육 신청'' 메뉴를 통해 신청\n• 각 함대별 배정 인원을 확인 후 신청 바랍니다\n\n■ 유의사항\n• 교육 신청 후 취소 시 최소 2주 전까지 취소 요청 바랍니다\n• 교육 일정은 부대 상황에 따라 변경될 수 있습니다\n• 문의: 교육운영팀 (내선 4520)',
'교육운영팀', true);

INSERT INTO notices (title, content, author, important) VALUES
('교육 요청 시스템 사용 안내',
E'필승해군캠프 교육 요청 시스템 사용법을 안내드립니다.\n\n■ 회원가입 및 로그인\n• 상단 ''시스템 접속'' 버튼을 클릭하여 로그인 또는 회원가입\n• 회원가입 후 관리자 승인이 필요합니다\n\n■ 교육 요청 방법\n1. 로그인 후 ''교육 신청'' → ''교육 요청서 작성'' 메뉴 선택\n2. 교육 유형, 함대, 희망 일자, 교육장 선택\n3. 참가 인원 및 요청사항 입력 후 제출\n\n■ 요청 상태 확인\n• ''내 요청 목록'' 또는 ''My Page''에서 요청 상태 확인 가능\n• 상태: 대기중 → 승인/반려\n\n■ 문의\n• 시스템 관련 문의: 시스템관리팀\n• 교육 관련 문의: 교육운영팀',
'시스템관리자', false);

INSERT INTO notices (title, content, author, important) VALUES
('1분기 교육 우수 참가부대 선정 결과',
E'2025년 1분기 필승해군캠프 우수 참가부대 선정 결과를 안내드립니다.\n\n■ 우수 참가부대\n• 최우수: 제1함대 102전대\n• 우수: 제3함대 301전대\n• 장려: 제2함대 205전대\n\n■ 선정 기준\n• 교육 참여율 (30%)\n• 교육 평가 점수 (40%)\n• 교육 태도 및 참여도 (30%)\n\n우수 부대에는 부대장 표창이 수여될 예정입니다.\n다음 분기에도 많은 관심과 참여 바랍니다.',
'교육운영팀', false);

-- Seed data: Board Posts
INSERT INTO board_posts (title, content, summary, author, tags, images) VALUES
('2025년 1분기 필승해군캠프 교육 완료 보고',
E'2025년 1분기 필승해군캠프가 3월 24일부터 28일까지 진해 교육장에서 성공적으로 진행되었습니다.\n\n이번 교육에는 1함대, 2함대, 3함대에서 총 480여명의 장병이 참여하였으며, 해군정체성·안보·소통 3개 분야에 걸쳐 총 12개 강의가 진행되었습니다.\n\n■ 주요 교육 내용\n• 해군정체성: 해군의 역사와 전통, 해군인으로서의 자부심 함양\n• 안보(군인정신): 최신 안보 동향 및 군인 정신 교육\n• 소통: 조직 내 소통 역량 강화, 리더십 교육\n\n■ 교육 성과\n• 참가자 만족도: 4.52 / 5.00\n• 교육 이수율: 98.3%\n• 우수 강사: 강동완 교수 (해군정체성), 김동수 교수 (안보)\n\n■ 향후 계획\n2분기 교육은 6월 중 진행 예정이며, 참가자 피드백을 반영하여 소통 분야 실습 시간을 확대할 예정입니다.',
'2025년 1분기 필승해군캠프가 성공적으로 완료되었습니다. 총 3개 함대, 480여명의 장병이 참여하였으며 해군정체성, 안보, 소통 3개 분야의 교육이 진행되었습니다.',
'교육운영팀',
'필승해군캠프,1분기,교육완료',
'[{"url":"/board/navy_lecture.jpg","caption":"필승해군캠프 교육 현장"},{"url":"/board/navy_team.jpg","caption":"교육 참가 장병 단체 사진"},{"url":"/board/navy_onboard.jpg","caption":"함정 체험 교육"}]');

-- Seed data: Sample Training Request
INSERT INTO training_requests (user_id, venue_id, training_type, fleet, request_date, request_end_date, start_time, participant_count, status, notes, created_at) VALUES
(2, 1, '1박2일합숙형', '1함대', '2025-06-09', '2025-06-10', '09:00', 120, 'PENDING',
'제1함대 102전대 장병 대상 필승해군캠프 교육 요청합니다.
해군정체성 및 소통 분야 위주 교육을 희망합니다.
숙소 및 식사 지원 필요합니다.',
CURRENT_TIMESTAMP);

-- ═══════════════════════════════════════════════
-- Venue Rooms (교육장 강의실)
-- ═══════════════════════════════════════════════

-- 1. 이순신리더십국제센터
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
VALUES (1, '한산관', 200, true, true, true, '8m x 60cm', '50cm x 30cm (폼보드)', NULL, '대강당, 책걸상 자가 세팅 필요, 전체면적 6,692㎡');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
VALUES (1, '노량관', 60, true, true, false, NULL, NULL, NULL, '2층');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
VALUES (1, '옥포관', 50, true, true, false, NULL, NULL, NULL, '2층');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
VALUES (1, '명량관', 40, true, true, false, NULL, NULL, NULL, '2층');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
VALUES (1, '당항포관', 30, true, true, false, NULL, NULL, NULL, '1층');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
VALUES (1, '안골포관', 20, true, true, false, NULL, NULL, NULL, '1층');

-- 2. 청호인재개발원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (2, '윌리엄홀', 250, true, true, false, '숙박 시 120만원 / 비숙박 시 200만원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (2, '팀홀', 168, true, true, false, '숙박 시 100만원 / 비숙박 시 150만원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (2, '대회의실', 80, true, true, false, '숙박 시 60만원 / 비숙박 시 80만원, 얼음 정수기 구비, 스피커 깨짐 현상 있음');

-- 3. DB생명 인재개발원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (3, '대강당', 164, true, true, false, '인당 12,500원 (최소 인원 90명 / 최소 총액 1,125,000원)');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (3, '대강의실', 80, true, true, false, '인당 12,500원 (최소 인원 50명 / 최소 총액 625,000원)');

-- 4. YBM연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (4, '강의실(대)', 160, true, true, false, '80~160명 수용, 기본 사용료 1,000,000원 또는 인당 10,000원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (4, '중강의실', 80, true, true, false, '40~80명, 인당 10,000원');

-- 5. 목포국제축구센터
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes, desk_layout)
VALUES (5, '대강당', 200, true, true, false, '기본 사용료 100,000원', '고정형 책상');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (5, '대회의실(1층)', 70, true, true, false, '기본 사용료 80,000원, 책상과 의자가 지저분하고 통일되어있지 않음');

-- 6. 부산도시공사 아르피나
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (6, '그랜드 볼룸', 200, true, true, false, '결혼식 및 150명 이상 대규모 행사 적합');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, notes)
VALUES (6, '자스민', 50, true, true, false, '5000 x 700 mm', '60 x 90 cm', '기본 사용료 66만원(10시-17시) / 1,309,000원(1박2일)');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (6, '클로버', 50, true, true, false, '자스민과 동일 규모');

-- 7. 호텔현대 바이 라한 목포
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, desk_layout, notes)
VALUES (7, '에메랄드+루비', 70, true, true, false, '스쿨 타입', '기본 사용료 80만원(숙박 시) / 120만원(비숙박)');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (7, '대연회장(컨벤션 C홀)', 1000, true, true, false, '기본 사용료 120만원');

-- 8. 한국여성수련원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, desk_layout, notes)
VALUES (8, '다목적실', 100, true, true, false, '6m x 70cm', '책상/의자 배치 변경 가능 (자체 변경, 셋팅 시간 30분 제공)', '타원형, 331㎡, 기본 사용료 20만원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, desk_layout, notes)
VALUES (8, '대강당', 328, true, true, false, '9m x 1m', '고정형', '복층 구성(2층 235명, 3층 93명), 459㎡, 기본 사용료 50만원');

-- 9. 통영 동원리조트
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (9, '이순신홀', 100, true, true, false, '기본 사용료 300,000원 (추가 시 150,000원)');

-- 10. 태백 중진공 연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, notes)
VALUES (10, '소강당', 78, true, true, false, '6000 x 600mm (클립,자석부착)', '900 x 300mm (폼보드)', '220,000원(3시간) / 추가 1시간당 44,000원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (10, '실내체육관', 150, true, true, false, '275,000원(3시간) / 추가 1시간당 77,000원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (10, '일반강의실', 50, true, true, false, '6개실, 20~50명, 110,000원(3시간) / 추가 1시간당 22,000원');

-- 11. 중진공 충청연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (11, '대강당', 100, true, true, false, NULL);
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (11, '대강의실', 40, true, true, false, '216㎡, 기본 사용료 100,000원(3시간/추가 1시간당 20,000원, VAT 별도)');

-- 12. 중진공 부산경남연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (12, '대강당', 150, true, true, false, '3시간 300,000원 / 추가 1시간당 60,000원');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (12, '중규모 강의실', 50, true, true, false, '3시간 100,000원 / 추가 1시간당 20,000원');

-- 13. 동해 무릉건강숲
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (13, '대강당', 100, true, true, false, '10만원(4시간) / 20만원(8시간)');
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes)
VALUES (13, '소그룹실', 50, true, true, false, '6만원(4시간) / 12만원(8시간)');
