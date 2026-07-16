# Figma 디자인 정렬 체크리스트

기준: Figma `z9fgcNb7ViU8p0wsTzL4fN` / 섹션 `720:9415` (2차 개선안_최종 와이어프레임)  
검증일: 2026-07-16

상태 기준:
- **구현됨**: 기능·레이아웃 코드 반영
- **시안 일치**: Figma export 에셋 + 시각 스펙 대조 완료

## Phase 0 — 토큰·에셋

| 항목 | 구현됨 | 시안 일치 |
|------|--------|-----------|
| 컬러 토큰 `globals.css` 동기화 | pass | pass |
| `design-tokens.ts` layout 상수 | pass | pass |
| 아이콘 일괄 Figma export (`726:*`, `883:*`) | pass | pass |
| empty/onboarding 전용 이미지 export | pass | pass |
| 캐러셀·로고 재export | pass | pass |
| `ASSETS.md` (새 fileKey) | pass | pass |

## Phase 1 — 앱 셸·목록

| 항목 | 구현됨 | 시안 일치 |
|------|--------|-----------|
| GNB `px-20` + 폴더 수정하기 우측 | pass | pass |
| 활성 폴더 탭 열린 폴더 아이콘 | pass | pass |
| URL 드롭다운 167px·우측정렬·구성 | pass | pass |
| FilterBar white / black pill | pass | pass |
| JobCard 252×179 + More 공식 아이콘 | pass | pass |
| 그리드 `px-20` | pass | pass |

## Phase 2 — 폴더 수정·팝업

| 항목 | 구현됨 | 시안 일치 |
|------|--------|-----------|
| FolderEditModal 330px 커스텀 | pass | pass |
| Edit/Delete/Add Figma SVG | pass | pass |
| 이름 편집 모드 체크/X | pass | pass |
| Modal 475 / header 46 / Toast 하단 | pass | pass |

## Phase 3 — 상세·인증·온보딩·설정

| 항목 | 구현됨 | 시안 일치 |
|------|--------|-----------|
| 상세 1152×810, 저장 CTA pill | pass | pass |
| 온보딩 STEP 문구·이미지 | pass | pass |
| 빈화면 일러스트 (`907:9074`) | pass | pass |
| 캐러셀·auth 로고 | pass | pass |
| 설정 compact 헤더 | pass | pass |

## 범위 외

- 이메일 OTP (P2)
- 모바일 375px 상세 모달 (P2)
