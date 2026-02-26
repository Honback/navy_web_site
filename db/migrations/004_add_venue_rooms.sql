-- Venue rooms table (lecture halls / conference rooms under each venue)
CREATE TABLE IF NOT EXISTS venue_rooms (
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

CREATE INDEX IF NOT EXISTS idx_venue_rooms_venue ON venue_rooms(venue_id);

-- Seed: 이순신리더십국제센터 (venue_id = 1) rooms
INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
SELECT 1, '한산관', 200, true, true, true, '8m x 60cm', '50cm x 30cm (폼보드)', NULL, '대강당, 책걸상 자가 세팅 필요, 전체면적 6,692㎡'
WHERE NOT EXISTS (SELECT 1 FROM venue_rooms WHERE venue_id = 1 AND name = '한산관');

INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
SELECT 1, '노량관', 60, true, true, false, NULL, NULL, NULL, '2층'
WHERE NOT EXISTS (SELECT 1 FROM venue_rooms WHERE venue_id = 1 AND name = '노량관');

INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
SELECT 1, '옥포관', 50, true, true, false, NULL, NULL, NULL, '2층'
WHERE NOT EXISTS (SELECT 1 FROM venue_rooms WHERE venue_id = 1 AND name = '옥포관');

INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
SELECT 1, '명량관', 40, true, true, false, NULL, NULL, NULL, '2층'
WHERE NOT EXISTS (SELECT 1 FROM venue_rooms WHERE venue_id = 1 AND name = '명량관');

INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
SELECT 1, '당항포관', 30, true, true, false, NULL, NULL, NULL, '1층'
WHERE NOT EXISTS (SELECT 1 FROM venue_rooms WHERE venue_id = 1 AND name = '당항포관');

INSERT INTO venue_rooms (venue_id, name, capacity, has_projector, has_microphone, has_whiteboard, banner_size, podium_size, desk_layout, notes)
SELECT 1, '안골포관', 20, true, true, false, NULL, NULL, NULL, '1층'
WHERE NOT EXISTS (SELECT 1 FROM venue_rooms WHERE venue_id = 1 AND name = '안골포관');
