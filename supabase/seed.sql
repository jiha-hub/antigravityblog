-- Seed categories
INSERT INTO categories (name, slug) VALUES
('React', 'react'),
('TypeScript', 'typescript'),
('Node.js', 'nodejs'),
('CSS', 'css'),
('Design', 'design'),
('JavaScript', 'javascript'),
('GraphQL', 'graphql');

-- Seed posts
INSERT INTO posts (title, subtitle, reading_time, category_id, slug, image_url)
SELECT 
  'React Hooks 마스터하기', 
  'useEffect, useMemo, useCallback의 작동 방식을 깊이 있게 파헤쳐 애플리케이션 리액티비티를 정복합니다.', 
  5, 
  id, 
  'mastering-react-hooks',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800'
FROM categories WHERE slug = 'react';

INSERT INTO posts (title, subtitle, reading_time, category_id, slug, image_url)
SELECT 
  'TypeScript 2024 모범 사례', 
  '필수적인 TypeScript 패턴과 유틸리티 타입을 사용하여 더 깔끔하고 안전하며 유지보수하기 쉬운 코드를 작성하세요.', 
  7, 
  id, 
  'typescript-best-practices-2024',
  'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800'
FROM categories WHERE slug = 'typescript';

INSERT INTO posts (title, subtitle, reading_time, category_id, slug, image_url)
SELECT 
  'Node.js 성능 튜닝', 
  '서버 사이드 애플리케이션의 처리량을 최대화하고 지연 시간을 최소화하기 위한 고급 기술을 설명합니다.', 
  6, 
  id, 
  'nodejs-performance-tuning',
  'https://images.unsplash.com/photo-1537432376769-00f5c2f0b8b9?auto=format&fit=crop&q=80&w=800'
FROM categories WHERE slug = 'nodejs';

INSERT INTO posts (title, subtitle, reading_time, category_id, slug, image_url)
SELECT 
  '모던 CSS 레이아웃 설명', 
  'float와의 씨름은 그만. Grid와 Flexbox를 사용하여 복잡하고 반응형인 레이아웃을 만드는 방법을 배웁니다.', 
  4, 
  id, 
  'modern-css-layouts',
  'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800'
FROM categories WHERE slug = 'css';

INSERT INTO posts (title, subtitle, reading_time, category_id, slug, image_url)
SELECT 
  'Async/Await 이해하기', 
  '자바스크립트의 비동기 프로그래밍을 알기 쉽게 설명합니다. Promise부터 이벤트 루프까지...', 
  8, 
  id, 
  'understanding-async-await',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800'
FROM categories WHERE slug = 'javascript';

INSERT INTO posts (title, subtitle, reading_time, category_id, slug, image_url)
SELECT 
  'GraphQL 대 REST: 올바른 선택은?', 
  '다음 API 프로젝트에서 GraphQL과 REST 중 무엇을 선택해야 할까요? 각 방식의 장단점을 비교합니다.', 
  6, 
  id, 
  'graphql-vs-rest',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800'
FROM categories WHERE slug = 'graphql';
