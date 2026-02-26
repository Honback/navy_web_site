-- Seed venue_rooms for all venues (venues 2-13)
-- Venue 1 (이순신리더십국제센터) already has rooms from 004

-- Venue 1: Update existing rooms with extra info
UPDATE venue_rooms SET has_projector=true, has_microphone=true, notes='대강당, 전체면적 6,692㎡, 프로젝터/노트북/스크린/음향시설 완비' WHERE venue_id=1 AND name='한산관';

-- Venue 2: 청호인재개발원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(2, '윌리엄홀', 250, true, true, false, '숙박 시 120만원 / 비숙박 시 200만원'),
(2, '팀홀', 168, true, true, false, '숙박 시 100만원 / 비숙박 시 150만원'),
(2, '대회의실', 80, true, true, false, '숙박 시 60만원 / 비숙박 시 80만원, 얼음 정수기 구비, 스피커 깨짐 현상 있음');

-- Venue 3: DB생명 인재개발원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(3, '대강당', 164, true, true, false, '인당 12,500원 (최소 인원 90명 / 최소 총액 1,125,000원)'),
(3, '대강의실', 80, true, true, false, '인당 12,500원 (최소 인원 50명 / 최소 총액 625,000원)');

-- Venue 4: YBM연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(4, '강의실(대)', 160, true, true, false, '80~160명 수용, 기본 사용료 1,000,000원 또는 인당 10,000원'),
(4, '중강의실', 80, true, true, false, '40~80명, 인당 10,000원');

-- Venue 5: 목포국제축구센터
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes, desk_layout) VALUES
(5, '대강당', 200, true, true, false, '기본 사용료 100,000원', '고정형 책상'),
(5, '대회의실(1층)', 70, true, true, false, '기본 사용료 80,000원, 책상과 의자가 지저분하고 통일되어있지 않음', NULL);

-- Venue 6: 부산도시공사 아르피나
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, notes) VALUES
(6, '그랜드 볼룸', 200, true, true, false, NULL, NULL, '결혼식 및 150명 이상 대규모 행사 적합'),
(6, '자스민', 50, true, true, false, '5000 x 700 mm', '60 x 90 cm', '기본 사용료 66만원(10시-17시) / 1,309,000원(1박2일)'),
(6, '클로버', 50, true, true, false, NULL, NULL, '자스민과 동일 규모');

-- Venue 7: 호텔현대 바이 라한 목포
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, desk_layout, notes) VALUES
(7, '에메랄드+루비', 70, true, true, false, '스쿨 타입', '기본 사용료 80만원(숙박 시) / 120만원(비숙박)'),
(7, '대연회장(컨벤션 C홀)', 1000, true, true, false, NULL, '기본 사용료 120만원');

-- Venue 8: 한국여성수련원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, desk_layout, notes) VALUES
(8, '다목적실', 100, true, true, false, '6m x 70cm', '책상/의자 배치 변경 가능 (자체 변경, 셋팅 시간 30분 제공)', '타원형, 331㎡, 기본 사용료 20만원'),
(8, '대강당', 328, true, true, false, '9m x 1m', '고정형', '복층 구성(2층 235명, 3층 93명), 459㎡, 기본 사용료 50만원');

-- Venue 9: 통영 동원리조트
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(9, '이순신홀', 100, true, true, false, '기본 사용료 300,000원 (추가 시 150,000원)');

-- Venue 10: 태백 중진공 연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, notes) VALUES
(10, '소강당', 78, true, true, false, '6000 x 600mm (클립,자석부착)', '900 x 300mm (폼보드)', '220,000원(3시간) / 추가 1시간당 44,000원'),
(10, '실내체육관', 150, true, true, false, NULL, NULL, '275,000원(3시간) / 추가 1시간당 77,000원'),
(10, '일반강의실', 50, true, true, false, NULL, NULL, '6개실, 20~50명, 110,000원(3시간) / 추가 1시간당 22,000원');

-- Venue 11: 중진공 충청연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(11, '대강당', 100, true, true, false, NULL),
(11, '대강의실', 40, true, true, false, '216㎡, 기본 사용료 100,000원(3시간/추가 1시간당 20,000원, VAT 별도)');

-- Venue 12: 중진공 부산경남연수원
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(12, '대강당', 150, true, true, false, '3시간 300,000원 / 추가 1시간당 60,000원'),
(12, '중규모 강의실', 50, true, true, false, '3시간 100,000원 / 추가 1시간당 20,000원');

-- Venue 13: 동해 무릉건강숲
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, notes) VALUES
(13, '대강당', 100, true, true, false, '10만원(4시간) / 20만원(8시간)'),
(13, '소그룹실', 50, true, true, false, '6만원(4시간) / 12만원(8시간)');
