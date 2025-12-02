# Talkgate Landing

Talkgate 서비스의 랜딩/마케팅 페이지입니다.  
Next.js 16 (App Router) 기반으로 SEO 최적화, 빠른 성능, 높은 전환율을 목표로 합니다.

## 🚀 기술 스택

- **프레임워크**: Next.js 16
- **언어**: TypeScript
- **스타일링**: Tailwind CSS v4
- **라우팅**: App Router (Server Components 우선)

## 📁 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── (main)/            # 메인 랜딩 페이지
│   ├── pricing/           # 요금제
│   ├── case/              # 고객 성공 사례
│   ├── introduce/         # 회사 소개
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 글로벌 스타일 + 디자인 토큰
│
├── components/            # 공유 컴포넌트
│   ├── layout/           # Header, Footer
│   └── ui/               # Button, Card 등
│
├── lib/                  # 유틸리티
│   ├── env.ts           # 환경 변수
│   ├── constants.ts     # 상수 (네비게이션, 링크 등)
│   └── auth.ts          # 인증 유틸리티
│
├── types/               # 타입 정의
│   └── index.ts
│
├── modules/             # 페이지별 모듈 (확장 시)
└── public/              # 정적 자산
```

## 🔧 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정합니다:

```env
# 메인 서비스 URL (인증 리다이렉트용)
NEXT_PUBLIC_MAIN_SERVICE_URL=https://my-service.im

# 현재 랜딩 페이지 URL
NEXT_PUBLIC_LANDING_URL=http://localhost:3000
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 📄 주요 페이지

| 경로 | 설명 |
|------|------|
| `/` | 메인 랜딩 페이지 |
| `/pricing` | 요금제 안내 |
| `/case` | 고객 성공 사례 |
| `/introduce` | 회사 소개 |

## 🔐 인증 흐름

랜딩 페이지는 직접 인증을 처리하지 않고 메인 서비스로 위임합니다:

```
[Landing] → 로그인 클릭 
         → [Main Service]/login?returnUrl=... 
         → 인증 처리 (쿠키 설정)
         → [Landing] (쿠키 기반 인증 상태 확인)
```

## 🎨 스타일 가이드

- **디자인 토큰**: `globals.css`의 `@theme inline`에서 관리
- **Semantic 클래스**: `text-foreground`, `bg-primary`, `border-border` 등
- **유틸리티 클래스**: `typo-*`, `btn-*`, `card`, `badge-*` 등

## 📚 문서

- [CONVENTION.md](./CONVENTION.md) - 코딩 컨벤션 및 가이드라인

## 🛠 스크립트

```bash
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # 린트 검사
```
