-- Notices table
CREATE TABLE IF NOT EXISTS notices (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    important BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Board posts table
CREATE TABLE IF NOT EXISTS board_posts (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    content TEXT NOT NULL,
    summary VARCHAR(1000),
    author VARCHAR(100) NOT NULL,
    tags VARCHAR(500),
    images TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed notices
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

-- Seed board post
INSERT INTO board_posts (title, content, summary, author, tags, images) VALUES
('2025년 1분기 필승해군캠프 교육 완료 보고',
E'2025년 1분기 필승해군캠프가 3월 24일부터 28일까지 진해 교육장에서 성공적으로 진행되었습니다.\n\n이번 교육에는 1함대, 2함대, 3함대에서 총 480여명의 장병이 참여하였으며, 해군정체성·안보·소통 3개 분야에 걸쳐 총 12개 강의가 진행되었습니다.\n\n■ 주요 교육 내용\n• 해군정체성: 해군의 역사와 전통, 해군인으로서의 자부심 함양\n• 안보(군인정신): 최신 안보 동향 및 군인 정신 교육\n• 소통: 조직 내 소통 역량 강화, 리더십 교육\n\n■ 교육 성과\n• 참가자 만족도: 4.52 / 5.00\n• 교육 이수율: 98.3%\n• 우수 강사: 강동완 교수 (해군정체성), 김동수 교수 (안보)\n\n■ 향후 계획\n2분기 교육은 6월 중 진행 예정이며, 참가자 피드백을 반영하여 소통 분야 실습 시간을 확대할 예정입니다.',
'2025년 1분기 필승해군캠프가 성공적으로 완료되었습니다. 총 3개 함대, 480여명의 장병이 참여하였으며 해군정체성, 안보, 소통 3개 분야의 교육이 진행되었습니다.',
'교육운영팀',
'필승해군캠프,1분기,교육완료',
'[{"url":"/board/navy_lecture.jpg","caption":"필승해군캠프 교육 현장"},{"url":"/board/navy_team.jpg","caption":"교육 참가 장병 단체 사진"},{"url":"/board/navy_onboard.jpg","caption":"함정 체험 교육"}]');
