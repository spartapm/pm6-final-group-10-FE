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
| `NEXT_PUBLIC_API_BASE_URL` | 백엔드 API URL (로컬: `http://localhost:4000`, 배포: `https://pm6-final-group-10-be.onrender.com`) |

## Vercel 배포

프로덕션 URL: [https://pm6-final-group-10-fe.vercel.app](https://pm6-final-group-10-fe.vercel.app)

Vercel **Environment Variables**:

| 변수 | 값 |
|------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key |
| `NEXT_PUBLIC_API_BASE_URL` | `https://pm6-final-group-10-be.onrender.com` |
| `NEXT_PUBLIC_DEV_SKIP_AUTH` | `false` |
