-- profiles 테이블에 직업군 컬럼 추가
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job TEXT;

-- 프로필 업데이트 RLS 정책 확인
-- (기존에 "Users can edit own profile" 정책이 있으므로 별도 추가 불필요)
