# 🫘 보난자 (Bohnanza) · 웹 카드 게임

원작 보드게임 *보난자(Bohnanza)* 의 웹 기반 팬 구현체입니다. 모바일 우선 UI, 의인화된 콩 캐릭터, CPU 상대, 그리고 전략적 트레이딩에 집중했습니다.

> ⚠️ Bohnanza는 Uwe Rosenberg가 디자인한 상표 등록된 보드게임입니다. 이 프로젝트는 개인 학습·팬 프로젝트이며 권리자와 관련이 없습니다.

![screenshot placeholder](./docs/screenshot.png)

## ✨ 특징

- **의인화된 콩 캐릭터** — 파란콩 수도승, 고추콩 불꽃, 메주콩 어르신 등 8종 고유 SVG 아트
- **모바일 친화적** — 반응형 레이아웃, 햅틱 피드백, 터치 우선 UI
- **CPU 상대 (3단계 난이도)** — 초급/중급/고급, 각 난이도별 거래 수락 기준 차등
- **깊이 있는 거래 UI** — 양방향 선택, 실시간 미리보기, 양쪽 밭 상황 동시 표시
- **전략 정보 노출** — 모든 밭에 현재 금화, 다음 임계값, 근접 표시기
- **액션 내러티브** — CPU 행동이 배너로 "누가 무엇을 어디로"를 명시적으로 보여줌
- **전체 보드 오버뷰** — 언제든 상단 버튼으로 모두의 상태 한눈에
- **3인 게임 3밭 지원** — 원작 규칙 반영

## 🎮 플레이

로컬에서:
```bash
npm install
npm run dev
```
그리고 http://localhost:5173 접속

## 🛠 기술 스택

- **React 18** — 함수형 컴포넌트, Hooks
- **Vite 5** — 빠른 개발 서버 및 번들링
- **Tailwind CSS 3** — 유틸리티 클래스 스타일
- **lucide-react** — 아이콘
- Google Fonts (Fraunces, Noto Sans KR, Gowun Dodum, JetBrains Mono)

## 📦 빌드 & 배포

### 정적 빌드
```bash
npm run build
```
`dist/` 폴더에 정적 산출물 생성.

### GitHub Pages 배포

**방법 1: GitHub Actions (권장)**

`.github/workflows/deploy.yml` 파일이 포함되어 있습니다. 저장소에서:
1. `Settings` → `Pages` → `Source`를 **GitHub Actions**로 설정
2. `main` 브랜치에 푸시하면 자동 배포

**방법 2: gh-pages 브랜치 수동 배포**

```bash
npm run build
npm run deploy
```
`gh-pages` 브랜치로 `dist/` 내용 푸시. 그 후 Settings → Pages에서 `gh-pages` 브랜치 선택.

> 저장소 이름이 username/reponame 형태라면 `vite.config.js`의 `base: './'`가 이미 상대경로로 작동합니다. 별도 설정 필요 없음.

### Vercel / Netlify

둘 다 자동 인식됩니다:
- **Vercel**: `vercel` CLI 실행 또는 저장소 임포트
- **Netlify**: `netlify deploy --prod --dir=dist` 또는 대시보드에서 `npm run build` / publish `dist`

## 📁 파일 구조

```
.
├── index.html                 # HTML 진입점
├── package.json               # 의존성 및 스크립트
├── vite.config.js             # Vite 설정
├── tailwind.config.js         # Tailwind 설정
├── postcss.config.js          # PostCSS 설정
├── public/
│   └── favicon.svg            # 파란콩 캐릭터 아이콘
├── src/
│   ├── main.jsx               # React 루트 마운트
│   ├── index.css              # Tailwind 지시문 + 전역 리셋
│   └── Bonanza.jsx            # 전체 게임 (단일 파일, ~2,700줄)
├── .github/
│   └── workflows/
│       └── deploy.yml         # GitHub Pages 자동 배포
└── docs/                      # 스크린샷 등 (선택)
```

## 🧩 게임 아키텍처 개요

`Bonanza.jsx` 한 파일 안에 들어있습니다. 논리 섹션:

| 섹션 | 역할 |
|---|---|
| `BEAN_TYPES` | 8종 콩 데이터 (임계값, 색상, 총 매수) |
| `BeanGlyph` | 콩 캐릭터 SVG 렌더러 |
| `BeanCard` | 카드 비주얼 (앞/뒤) |
| `Field`, `MiniFieldRow` | 밭 UI (상세/미니) |
| `Hand`, `CollapsibleHand` | 손패 표시 |
| `OpponentPanel` | 상대 요약 패널 |
| `TradeModal` | 거래 제안 모달 |
| `SetupScreen` / `GameScreen` | 설정 / 게임 진행 |
| `evaluateBeanForPlayer`, `cpu*` | CPU AI 로직 |
| `plantCard`, `harvestField`, `drawCards` | 게임 규칙 처리 |

턴 단계: `plant1 → plant2 → reveal → trade → plantFaceUp → draw → (다음 플레이어)`

## 🗺 로드맵 아이디어

- [ ] 온라인 멀티플레이 (WebSocket)
- [ ] 3번째 밭 구매 카드 (원작 `Third Bean Field` 메커닉)
- [ ] 확장팩 콩 3종 (카카오, 커피, 가르반조)
- [ ] 사운드 효과 토글
- [ ] 게임 리플레이 저장
- [ ] 다국어 지원 (영어)

## 🤝 기여

개인 프로젝트입니다만 이슈/PR 환영합니다. 특히:
- 버그 신고 (턴 단계 진행 이상, 계산 오류 등)
- UI/UX 개선 제안
- CPU AI 밸런스 피드백

## 📜 라이선스

MIT License — [LICENSE](./LICENSE) 참조

Bohnanza 브랜드·테마·세부 규칙의 저작권은 원저작자 **Uwe Rosenberg** 및 퍼블리셔에 있습니다.
