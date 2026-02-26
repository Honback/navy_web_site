-- Seed venue_contacts data (idempotent: skips if data already exists)

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 1, '최정화', '팀장', '010-8270-2012', NULL, '전화', '주말(일요일) 세팅이나 식사 운영은 반드시 사전 조율 필요'
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 1 AND phone = '010-8270-2012');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 1, '대표전화', '대관문의', '070-4239-0771', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 1 AND phone = '070-4239-0771');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 2, '대표전화', '대관문의', '031-354-1270', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 2 AND phone = '031-354-1270');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 2, '대관문의', '대관', '02-522-0496', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 2 AND phone = '02-522-0496');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 3, '대표전화', '대관문의', '02-3011-4500', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 3 AND phone = '02-3011-4500');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 4, '대표전화', '대관문의', '031-374-0509', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 4 AND phone = '031-374-0509');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 5, '박성민', '주임', '010-3125-7623', 'milk4431@naver.com', '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 5 AND phone = '010-3125-7623');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 6, '박진우', '매니저', '051-740-3253', NULL, '전화', '단체 숙박 예약은 반드시 매니저를 통해야 함'
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 6 AND phone = '051-740-3253');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 6, '프론트', '프론트데스크', '051-740-3201', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 6 AND phone = '051-740-3201');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 7, '허윤종', '지배인', '010-2469-9953', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 7 AND phone = '010-2469-9953');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 8, '대관담당', '대관', '033-530-4356', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 8 AND phone = '033-530-4356');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 8, '식당담당', '식당', '010-2580-1063', NULL, '전화', '최소 3일 전까지 확정 인원 통보 필요'
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 8 AND phone = '010-2580-1063');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 9, '대표전화', '대관문의', '055-640-5000', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 9 AND phone = '055-640-5000');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 10, '백승재', '사원', '033-550-5013', 'sj.baek@kosmes.or.kr', '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 10 AND phone = '033-550-5013');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 10, '김상희', '식당', '010-5363-2115', NULL, '전화', '식당 관련 문의'
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 10 AND phone = '010-5363-2115');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 11, '시설대여담당', '시설대여', '041-559-9226', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 11 AND phone = '041-559-9226');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 11, '대표전화', '대관문의', '041-559-9225', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 11 AND phone = '041-559-9225');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 12, '성태경', '대리 (시설대관)', '055-548-8023', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 12 AND phone = '055-548-8023');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 12, '한선순', '영양사 (식당)', '055-548-8097', NULL, '전화', '식사 인원 및 메뉴 확정을 사전에 정교하게 조율해야'
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 12 AND phone = '055-548-8097');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 12, '한선순 (휴대폰)', '영양사 (식당)', '010-3253-2086', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 12 AND phone = '010-3253-2086');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 13, '김나현', '팀장', '033-539-8280', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 13 AND phone = '033-539-8280');

INSERT INTO venue_contacts (venue_id, name, role, phone, email, preferred_contact, notes)
SELECT 13, '대표전화', '대관문의', '033-530-2391', NULL, '전화', NULL
WHERE NOT EXISTS (SELECT 1 FROM venue_contacts WHERE venue_id = 13 AND phone = '033-530-2391');
