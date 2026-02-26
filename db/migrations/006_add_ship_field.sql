-- Add fleet and ship columns to users
ALTER TABLE users ADD COLUMN IF NOT EXISTS fleet VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS ship VARCHAR(50);

-- Add ship column to training_requests
ALTER TABLE training_requests ADD COLUMN IF NOT EXISTS ship VARCHAR(50);

-- Test accounts (status ACTIVE so they can log in immediately)
INSERT INTO users (email, name, affiliation, phone, role, status, fleet, ship)
VALUES
  ('fleet1@navy.mil', '1함대본부담당', '1함대 본부', '010-1111-0001', 'USER', 'ACTIVE', '1함대', NULL),
  ('ship1@navy.mil', '충무공이순신함담당', '1함대 충무공이순신함', '010-1111-0002', 'USER', 'ACTIVE', '1함대', '충무공이순신함'),
  ('fleet2@navy.mil', '2함대본부담당', '2함대 본부', '010-2222-0001', 'USER', 'ACTIVE', '2함대', NULL),
  ('ship2@navy.mil', '세종대왕함담당', '2함대 세종대왕함', '010-2222-0002', 'USER', 'ACTIVE', '2함대', '세종대왕함');

-- Test training requests
-- 1함대 본부 요청
INSERT INTO training_requests (user_id, venue_id, training_type, fleet, ship, request_date, request_end_date, start_time, participant_count, status, notes)
VALUES (
  (SELECT id FROM users WHERE email='fleet1@navy.mil'),
  1, '1일집중형', '1함대', NULL,
  '2026-03-10', '2026-03-10', '09:00', 150, 'PENDING', '1함대 본부 교육 요청'
);

-- 1함대 충무공이순신함 요청
INSERT INTO training_requests (user_id, venue_id, training_type, fleet, ship, request_date, request_end_date, start_time, participant_count, status, notes)
VALUES (
  (SELECT id FROM users WHERE email='ship1@navy.mil'),
  2, '1박2일합숙형', '1함대', '충무공이순신함',
  '2026-03-15', '2026-03-16', '10:00', 80, 'VENUE_CHECK', '충무공이순신함 승조원 교육'
);

-- 2함대 본부 요청
INSERT INTO training_requests (user_id, venue_id, training_type, fleet, ship, request_date, request_end_date, start_time, participant_count, status, notes)
VALUES (
  (SELECT id FROM users WHERE email='fleet2@navy.mil'),
  3, '1일집중형', '2함대', NULL,
  '2026-03-20', '2026-03-20', '09:00', 200, 'PENDING', '2함대 본부 교육 요청'
);

-- 2함대 세종대왕함 요청
INSERT INTO training_requests (user_id, venue_id, training_type, fleet, ship, request_date, request_end_date, start_time, participant_count, status, notes)
VALUES (
  (SELECT id FROM users WHERE email='ship2@navy.mil'),
  4, '1박2일합숙형', '2함대', '세종대왕함',
  '2026-03-25', '2026-03-26', '10:00', 120, 'INSTRUCTOR_CHECK', '세종대왕함 승조원 교육'
);
