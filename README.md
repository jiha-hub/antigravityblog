# antigravityblog

안티그래비티를 통해 구현한 개발자 블로그입니다.

🔗 **배포 URL:** [https://jihaantigravityblog.vercel.app](https://jihaantigravityblog.vercel.app)

## 기술 스택

- **Framework:** [Next.js 15.1.9](https://nextjs.org) (App Router)
- **Database & Auth:** [Supabase](https://supabase.com)
- **Styling:** Tailwind CSS v4
- **Deployment:** [Vercel](https://vercel.com)

## 주요 기능

- **회원가입 / 로그인** - Supabase 인증 기반
- **글 목록 & 카테고리 필터** - 실시간 Supabase DB 조회
- **글 상세 보기** - Markdown 렌더링 지원
- **글 작성** - Markdown 에디터 내장
- **반응형 UI** - 모바일 / 데스크탑 지원

## 로컬 개발 환경 설정

### 1. 저장소 클론 및 의존성 설치

```bash
git clone https://github.com/jiha-hub/antigravityblog
cd antigravityblog
npm install
```

### 2. 환경 변수 설정

`.env.local` 파일을 생성하고 아래 값을 입력하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 에서 확인할 수 있습니다.

## 배포

이 프로젝트는 **GitHub → Vercel** 자동 배포로 운영됩니다.  
`main` 브랜치에 푸시하면 자동으로 배포됩니다.

Vercel 환경 변수에 아래 값을 추가해야 합니다:

| 키 | 설명 |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon 공개 키 |
| `NEXT_PUBLIC_SITE_URL` | 배포된 사이트 URL |

## 라이선스

MIT
