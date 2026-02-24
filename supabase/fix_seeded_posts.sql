-- 1. 이미지 URL 업데이트 (깨진 링크 수정)
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1537432376769-00f5c2f0b8b9?auto=format&fit=crop&q=80&w=800' WHERE slug = 'nodejs-performance-tuning';
UPDATE posts SET image_url = 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=800' WHERE slug = 'modern-css-layouts';

-- 2. 기존 포스트에 샘플 본문(Content) 추가
UPDATE posts 
SET content = '# Node.js 성능 최적화 가이드\n\nNode.js 애플리케이션의 성능을 한 단계 높이는 고급 기법들을 알아봅니다. 이벤트 루프 최적화부터 가비지 컬렉션 튜닝까지 상세히 다룹니다.\n\n## 주요 내용\n- 비동기 처리 최적화\n- 메모리 누수 탐지 및 해결\n- 클러스터 모드 활용'
WHERE slug = 'nodejs-performance-tuning';

UPDATE posts 
SET content = '# 모던 CSS 레이아웃 마스터하기\n\nFlexbox와 Grid는 웹 디자인의 패러다임을 바꿨습니다. 이제 더 이상 float나 table 레이아웃으로 고생할 필요가 없습니다.\n\n## 학습 목표\n- Grid 레이아웃 기초와 응용\n- Flexbox를 활용한 유연한 정렬\n- 반응형 디자인 베스트 프랙티스'
WHERE slug = 'modern-css-layouts';

UPDATE posts 
SET content = '# React Hooks 완벽 가이드\n\nReact Hooks는 함수형 컴포넌트에서 상태와 생명주기를 관리하는 혁신적인 방법입니다.\n\n## 핵심 훅\n- **useState**: 상태 관리\n- **useEffect**: 사이드 이펙트 처리\n- **useMemo**: 성능 최적화'
WHERE slug = 'mastering-react-hooks';

UPDATE posts 
SET content = '# TypeScript 2024 트렌드\n\n더 안전하고 강력한 타입 시스템을 활용하여 유지보수하기 쉬운 코드를 작성하는 방법을 소개합니다.'
WHERE slug = 'typescript-best-practices-2024';

UPDATE posts 
SET content = '# Async/Await 완벽 이해\n\n비동기 자바스크립트의 끝판왕, Async/Await의 모든 것을 파헤쳐 봅니다.'
WHERE slug = 'understanding-async-await';

UPDATE posts 
SET content = '# GraphQL vs REST\n\n당신의 다음 프로젝트를 위한 최선의 선택은 무엇일까요? 심층 비교 분석 결과를 공유합니다.'
WHERE slug = 'graphql-vs-rest';
