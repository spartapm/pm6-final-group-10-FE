# Ddakpool (Frontend)

Next.js 웹앱 — 개인용 채용공고 라이브러리

## 시작하기

```bash
cp .env.local.example .env.local
# .env.local에 Supabase URL/Anon Key, API URL 입력
npm install
npm run dev
```

기본 포트: `3000`

## 환경변수

| 변수 | 설명 |
|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API URL (예: `http://localhost:4000`) |
