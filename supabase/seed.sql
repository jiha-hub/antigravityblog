-- 기존 카테고리 삭제 후 새로운 내용 유형으로 교체
DELETE FROM categories;

-- 글 내용 종류 기반 카테고리
INSERT INTO categories (name, slug) VALUES
('개발 일기', 'dev-diary'),
('튜토리얼', 'tutorial'),
('기술 트렌드', 'tech-trend'),
('프로젝트 회고', 'retrospective'),
('문제 해결', 'troubleshooting'),
('팁 & 트릭', 'tips'),
('Q&A', 'qna'),
('기타', 'etc');
