# MVP v2 (v1.1) 자체 검증 리포트

검증 일시: 2026-07-16  
테스트 계정: `test@test.com` / `Test1234`  
환경: 프론트 `localhost:3000`, 백엔드 `localhost:4000`  
스크린샷 경로: `frontend/docs/v2-screenshots/`

## API 검증

| 항목 | 결과 | 비고 |
|---|---|---|
| `GET /folders` | 통과 | 기본 폴더(지원예정, 직무분석 등) 정상 반환 |
| `GET /jobs` | 통과 | `folder_id`, `deadline_status`, 구조화 `competency_keywords` 필드 확인 |
| `GET /jobs?uncategorized=true` | 통과 | 미분류(기타) 필터 동작 |
| `POST /jobs/parse` + `folder_id` | 통과 | URL 드롭박스 선택 후 파싱 플로우 연동 |
| `npm run build` (백엔드) | 통과 | TypeScript 빌드 성공 |
| `npx tsc --noEmit` (프론트) | 통과 | 타입체크 성공 |

## Phase A — GNB·폴더·URL

| 체크 | 결과 | 스크린샷 |
|---|---|---|
| 상단 탭바 GNB | 통과 | [01-gnb-top-tabs.png](./01-gnb-top-tabs.png) |
| URL 추가 → 폴더 드롭박스 | 통과 | [02-url-folder-dropdown.png](./02-url-folder-dropdown.png) |
| 폴더 수정 모달 | 통과 | [03-folder-edit-modal.png](./03-folder-edit-modal.png) |
| 기타 탭(미분류) | 통과 | [04-folder-tab-list.png](./04-folder-tab-list.png) |
| 설정 헤더 우측 | 통과 | 01-gnb-top-tabs.png 내 확인 |

## Phase B — 키워드·저장·마감

| 체크 | 결과 | 스크린샷 |
|---|---|---|
| 키워드 필터 검색 | 통과 | [05-keyword-filter-search.png](./05-keyword-filter-search.png) |
| 상세 키워드 그룹 헤더 | 통과 | [06-detail-keyword-groups.png](./06-detail-keyword-groups.png) |
| 저장 후 모달 닫힘 + 토스트 | 통과 | [07-save-toast.png](./07-save-toast.png) |
| 상시채용/마감 체크 | 통과 | [08-deadline-checkboxes.png](./08-deadline-checkboxes.png) |
| 상세 모달 크기 (max-w-6xl) | 통과 | [09-detail-modal-size.png](./09-detail-modal-size.png) |
| 저장 CTA dirty 비활성 | 통과 | 06-detail-keyword-groups.png 내 비활성 상태 확인 |
| 탭명 요약/원문 | 통과 | 06-detail-keyword-groups.png 내 확인 |

## Phase C — P1

| 체크 | 결과 | 스크린샷 |
|---|---|---|
| 온보딩 3장 팝업 | 통과 | [10-onboarding.png](./10-onboarding.png) |
| 빈 화면 일러스트 | 통과 | [11-empty-state.png](./11-empty-state.png) ※ API mock으로 0건 UI 캡처 |
| 회원가입 약관·비밀번호 힌트 | 통과 | [12-signup-terms.png](./12-signup-terms.png) |
| CS 메일 (설정) | 통과 | [13-cs-email.png](./13-cs-email.png) |

## P0 체크리스트 요약

- [x] URL 추가 → 폴더 선택 후에만 파싱·저장
- [x] 폴더 수정 모달 (추가/삭제/이름 편집)
- [x] 미분류 공고 = 기타 탭
- [x] 키워드 필터 검색·상세 그룹 헤더
- [x] 저장 시 편집 중 키워드 자동 적용
- [x] 저장 → 모달 닫힘 + "저장이 완료되었어요!" 토스트
- [x] 상시채용 체크 → 디데이 "상시채용"
- [x] 상단 GNB + 설정 헤더 우측

## 재실행 방법

```bash
# 서버 기동 후
cd frontend
node scripts/capture-v2-screenshots.mjs
```

## 비고

- `11-empty-state.png`는 테스트 계정에 공고가 있어 실데이터 0건 화면 대신 jobs API mock으로 캡처함.
- 이메일 OTP(REG-12~15)는 계획 범위 외(P2).

## Phase D — Figma 디자인 정렬 (2026-07-16 재정렬)

기준 Figma: [`z9fgcNb7ViU8p0wsTzL4fN`](https://www.figma.com/design/z9fgcNb7ViU8p0wsTzL4fN/?node-id=720-9415) 섹션 `720:9415`

| 영역 | 결과 | 참고 |
|------|------|------|
| 디자인 토큰·에셋 (공식 export) | pass | [ASSETS.md](../design-alignment/ASSETS.md) |
| GNB + 열린 폴더 아이콘 | pass | [01-gnb-top-tabs.png](./01-gnb-top-tabs.png) |
| URL 드롭다운 우측정렬·아이콘 | pass | [02-url-folder-dropdown.png](./02-url-folder-dropdown.png) |
| 폴더 수정 모달 + 체크/X 편집 | pass | [03-folder-edit-modal.png](./03-folder-edit-modal.png) |
| FilterBar / JobCard | pass | [05](./05-keyword-filter-search.png) · [01](./01-gnb-top-tabs.png) |
| 상세 모달 1152×810 · 저장 CTA pill | pass | [09-detail-modal-size.png](./09-detail-modal-size.png) |
| 빈화면 일러스트 | pass | [11-empty-state.png](./11-empty-state.png) |
| 인증 캐러셀·로고 | pass | [12-signup-terms.png](./12-signup-terms.png) |
| 설정 compact 헤더 | pass | [13-cs-email.png](./13-cs-email.png) |

체크리스트: [CHECKLIST.md](../design-alignment/CHECKLIST.md) (구현됨 / 시안 일치 분리)

`npx tsc --noEmit` 통과. 스크린샷 재캡처 완료.
