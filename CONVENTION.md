# Talkgate Landing Convention

본 문서는 Talkgate 랜딩/온보딩 페이지의 코딩 컨벤션을 정의합니다.
메인 프로젝트(Talkgate)의 컨벤션을 기반으로 하되, **정적 콘텐츠 중심의 랜딩 페이지** 특성에 맞게 조정되었습니다.

---

## 1. 프로젝트 개요

### 목적
- Talkgate 서비스의 랜딩/마케팅 페이지
- SEO 최적화, 빠른 초기 로딩, 높은 전환율이 핵심 목표

### 주요 페이지
| 경로 | 설명 |
|------|------|
| `/` (main) | 메인 랜딩 페이지 |
| `/pricing` | 요금제 안내 |
| `/case` | 고객 성공 사례 |
| `/introduce` | 회사 소개 |
| `/trial` | 체험하기 (TBD) |

### 인증 흐름
```
[Landing] → 로그인 클릭 
         → [Main Service]?returnUrl=landing-url (쿠키 기반 인증)
         → [Landing] (인증 쿠키와 함께 복귀)
```

---

## 2. 프로젝트 구조

```
├── app/                    # Next.js App Router
│   ├── (main)/            # 메인 랜딩 (route group)
│   ├── pricing/           # 요금제
│   ├── case/              # 고객 성공 사례
│   ├── introduce/         # 회사 소개
│   ├── layout.tsx         # 루트 레이아웃
│   └── globals.css        # 글로벌 스타일 + 토큰
│
├── components/            # 공유 컴포넌트
│   ├── layout/           # Header, Footer, Navigation
│   ├── icons/            # SVG React 컴포넌트 (복잡한 SVG)
│   └── ui/               # Button, Card 등 기본 UI
│
├── modules/              # 페이지별 모듈 (필요시)
│   ├── landing/          # 메인 페이지 전용 컴포넌트
│   ├── pricing/          # 요금제 전용 컴포넌트
│   └── ...
│
├── lib/                  # 유틸리티
│   ├── env.ts           # 환경 변수 접근
│   ├── constants.ts     # 상수 (네비게이션, 링크 등)
│   └── auth.ts          # 인증 관련 유틸리티
│
├── types/               # 타입 정의
│   └── index.ts
│
└── public/              # 정적 자산
    ├── images/          # 이미지 파일
    └── icons/           # 원본 SVG 파일 (참조용)
```

### 구조 원칙
- **단순함 우선**: 랜딩 페이지는 복잡한 상태 관리가 불필요. 과도한 추상화 지양
- **모듈 분리**: 페이지별 컴포넌트가 커지면 `modules/` 하위로 분리
- **Server Components 우선**: 대부분의 콘텐츠는 서버 컴포넌트로 렌더링

---

## 3. 환경 변수

### 규칙
- 클라이언트 노출 값: `NEXT_PUBLIC_*` prefix 필수
- 모든 환경 변수는 `lib/env.ts`를 통해 접근
- `.env.example`에 모든 키 문서화

### 필수 환경 변수
```env
# 메인 서비스 URL (인증 리다이렉트용)
NEXT_PUBLIC_MAIN_SERVICE_URL=https://my-service.im

# 현재 랜딩 페이지 URL
NEXT_PUBLIC_LANDING_URL=https://landing.my-service.im

# API 엔드포인트 (필요시)
NEXT_PUBLIC_API_BASE_URL=https://api.my-service.im
```

---

## 4. 인증

### 외부 인증 위임
랜딩 페이지는 직접 인증 로직을 처리하지 않습니다.

```typescript
// lib/auth.ts
export function getLoginUrl(returnPath?: string): string {
  const returnUrl = `${env.LANDING_URL}${returnPath ?? '/'}`;
  return `${env.MAIN_SERVICE_URL}/login?returnUrl=${encodeURIComponent(returnUrl)}`;
}
```

### 인증 상태 확인
- 메인 서비스가 설정한 쿠키를 기반으로 인증 상태 판단
- 서버 컴포넌트에서 `cookies()` API로 확인
- 인증이 필요한 기능은 메인 서비스로 리다이렉트

---

## 5. 컴포넌트 설계

### Server vs Client Components
```
Server Components (기본)
├── 정적 콘텐츠 렌더링
├── SEO 메타데이터
├── 데이터 페칭 (필요시)
└── 레이아웃

Client Components ('use client')
├── 인터랙티브 UI (토글, 탭, 모달)
├── 폼 처리
├── 애니메이션
└── 브라우저 API 사용
```

### 네이밍
| 종류 | 패턴 | 예시 |
|------|------|------|
| 컴포넌트 파일 | PascalCase | `HeroSection.tsx` |
| 유틸 파일 | camelCase | `formatPrice.ts` |
| 상수 파일 | camelCase | `navigation.ts` |
| 타입 파일 | camelCase | `pricing.ts` |

### 컴포넌트 구조
```typescript
// 간단한 presentational 컴포넌트
export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  return (
    <div className="...">
      {/* ... */}
    </div>
  );
}

// 페이지 섹션 컴포넌트
export function HeroSection() {
  return (
    <section className="...">
      {/* ... */}
    </section>
  );
}
```

---

## 6. 스타일링

### Tailwind v4 + CSS Variables
`globals.css`에서 `@theme inline`으로 디자인 토큰 관리

### 토큰 카테고리
```css
@theme inline {
  /* Colors - Semantic */
  --color-background: ...;
  --color-foreground: ...;
  --color-primary: ...;
  --color-primary-foreground: ...;
  --color-muted: ...;
  --color-muted-foreground: ...;
  --color-accent: ...;
  --color-border: ...;
  
  /* Typography */
  --font-sans: ...;
  --font-heading: ...;
  
  /* Container Spacing */
  --container-padding-x: ...;
  
  /* Border Radius */
  --radius-sm: ...;
  --radius-md: ...;
  --radius-lg: ...;
}
```

### 스타일 규칙
- **Semantic 클래스 우선**: `text-foreground`, `bg-primary`, `border-border`
- **섹션 패딩**: 디자이너가 지정한 수치를 직접 사용. `section-padding` 같은 유틸리티 클래스 지양
  - 예: `py-20`, `py-[80px]`, 또는 인라인 스타일로 디자이너 수치 그대로 적용
- **반응형**: `sm:`, `md:`, `lg:` breakpoint 일관성 유지
- **다크 모드**: 현재 미지원 (라이트 모드 고정)

---

## 7. 네비게이션

### 상수로 관리
```typescript
// lib/constants.ts
export const NAVIGATION = {
  main: [
    { label: '고객 성공 사례', href: '/case' },
    { label: '체험하기', href: '/trial' },
    { label: '회사소개', href: '/introduce' },
    { label: '요금제', href: '/pricing' },
  ],
  auth: {
    login: { label: 'Login', href: '/login' }, // getLoginUrl() 사용
    start: { label: '시작하기', href: '/start' },
  },
} as const;
```

### 외부 링크
```typescript
export const EXTERNAL_LINKS = {
  mainService: env.MAIN_SERVICE_URL,
  support: 'mailto:support@talkgate.com',
  // ...
} as const;
```

---

## 8. SEO & 메타데이터

### 페이지별 메타데이터
```typescript
// app/pricing/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '요금제 | Talkgate',
  description: '복잡한 고민 없이, 모든 기능을 지금 바로 시작하세요.',
  openGraph: {
    title: '요금제 | Talkgate',
    description: '...',
    images: ['/og/pricing.png'],
  },
};
```

### 공통 메타데이터
- `app/layout.tsx`에서 기본값 설정
- 각 페이지에서 필요시 override

---

## 9. 이미지 & 자산

### 경로 규칙
```
public/
├── images/
│   ├── hero/           # 히어로 섹션
│   ├── features/       # 기능 소개
│   ├── cases/          # 고객 사례
│   └── og/             # OpenGraph 이미지
├── icons/              # 원본 SVG 파일 (참조용)
└── logos/              # 로고 변형

components/
└── icons/              # SVG React 컴포넌트
    ├── CheckIcon.tsx
    ├── ArrowIcon.tsx
    └── index.ts
```

### Next.js Image 사용
```typescript
import Image from 'next/image';

<Image
  src="/images/hero/dashboard.png"
  alt="Talkgate 대시보드"
  width={1200}
  height={800}
  priority // LCP 이미지인 경우
/>
```

### SVG 사용 규칙

#### 1. 간단한 SVG (4줄 이하)
인라인으로 직접 사용합니다.

```typescript
// ✅ 간단한 경우: 인라인
<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10 2L3 7v11h14V7l-7-5z" stroke="currentColor" strokeWidth="2"/>
</svg>
```

#### 2. 복잡한 SVG (4줄 초과)
React 컴포넌트로 변환하여 `components/icons/`에 저장합니다.

```typescript
// components/icons/CheckIcon.tsx
import type { SVGProps } from 'react';

interface CheckIconProps extends SVGProps<SVGSVGElement> {
  size?: number;
}

export function CheckIcon({ size = 24, ...props }: CheckIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M20 6L9 17l-5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
```

**사용 예시:**
```typescript
import { CheckIcon } from '@/components/icons';

<CheckIcon className="text-primary" size={20} />
```

#### 3. SVG 컴포넌트 네이밍
- 파일명: `PascalCase` + `Icon` suffix (예: `CheckIcon.tsx`, `ArrowRightIcon.tsx`)
- 컴포넌트명: 파일명과 동일
- `components/icons/index.ts`에서 re-export

```typescript
// components/icons/index.ts
export { CheckIcon } from './CheckIcon';
export { ArrowRightIcon } from './ArrowRightIcon';
```

#### 4. SVG 컴포넌트 원칙
- `currentColor` 사용: 부모의 `color`를 상속받도록 설정
- `size` prop 제공: 기본값 24px
- `className` prop 전달: `SVGProps<SVGSVGElement>` 확장
- `viewBox` 명시: 반응형 크기 조정 지원

---

## 10. 성능 가이드라인

### Core Web Vitals 목표
- **LCP** < 2.5s: Hero 이미지 priority 설정, 폰트 최적화
- **FID** < 100ms: 최소한의 JS, 서버 컴포넌트 우선
- **CLS** < 0.1: 이미지 dimensions 명시, 폰트 swap 설정

### 최적화 체크리스트
- [ ] 이미지: WebP/AVIF 포맷, 적절한 사이즈
- [ ] 폰트: `next/font`로 최적화 로딩
- [ ] 번들: 불필요한 클라이언트 컴포넌트 최소화
- [ ] 정적 생성: 가능한 페이지는 빌드 타임 생성

---

## 11. 코드 스타일

### 일반 규칙
- Guard clause 선호, 깊은 중첩 회피
- 불필요한 주석 금지, 의도/제약만 간결히 주석
- try/catch는 실제 필요한 지점에서만
- 명확한 변수명, 1-2글자 축약 회피

### TypeScript
```typescript
// Props 타입은 컴포넌트 근처에 정의
interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

// 공유 타입은 types/에 정의
export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  // ...
}
```

---

## 12. 테스트 (선택)

- 복잡한 유틸 함수만 단위 테스트
- E2E 테스트는 핵심 사용자 흐름(CTA 클릭 → 로그인)에 집중
- 스냅샷 테스트는 유지 비용 대비 효용 낮아 지양

---

## 13. 배포

### 환경
- Preview: PR 별 자동 배포
- Production: main 브랜치 머지 시 배포

### 체크리스트
- [ ] 환경 변수 설정 확인
- [ ] OG 이미지 경로 확인
- [ ] 외부 링크 (메인 서비스 URL) 확인
- [ ] 분석 도구 설정 확인

---

## 부록: 메인 프로젝트와의 차이점

| 항목 | 메인 프로젝트 | 랜딩 페이지 |
|------|--------------|------------|
| 상태 관리 | Context/Store 사용 가능 | 최소화 (거의 불필요) |
| API 통신 | `useFetch`, `useMutation` | 거의 없음 (정적 콘텐츠) |
| 인증 | 직접 처리 | 메인 서비스로 위임 |
| 렌더링 | CSR/SSR 혼합 | SSG/SSR 우선 |
| 복잡도 | 비즈니스 로직 포함 | 프레젠테이션 중심 |
