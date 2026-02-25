-- 1. 태그 테이블
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 게시글-태그 중간 테이블
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- 3. 댓글 테이블
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 좋아요 테이블
CREATE TABLE IF NOT EXISTS likes (
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (post_id, user_id)
);

-- RLS 활성화
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;

-- 태그: 누구나 읽기, 로그인 사용자만 생성
CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true);
CREATE POLICY "Auth insert tags" ON tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- post_tags: 누구나 읽기, 로그인 사용자만 생성/삭제
CREATE POLICY "Public read post_tags" ON post_tags FOR SELECT USING (true);
CREATE POLICY "Auth manage post_tags" ON post_tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Auth delete post_tags" ON post_tags FOR DELETE USING (auth.uid() IS NOT NULL);

-- 댓글: 누구나 읽기, 로그인 사용자만 작성, 본인만 삭제
CREATE POLICY "Public read comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Auth insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);
CREATE POLICY "Author delete comments" ON comments FOR DELETE USING (auth.uid() = author_id);

-- 좋아요: 누구나 읽기, 로그인 사용자만 추가/취소
CREATE POLICY "Public read likes" ON likes FOR SELECT USING (true);
CREATE POLICY "Auth insert likes" ON likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Auth delete likes" ON likes FOR DELETE USING (auth.uid() = user_id);
