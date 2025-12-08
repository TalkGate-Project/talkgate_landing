# 도메인 간 로그인 상태 공유 - 구현 완료 문서

## 📌 개요

랜딩 페이지(`landing.talkgate.im`)와 메인 서비스(`talkgate.im`) 간의 로그인 상태 공유가 완료되었습니다.

## ✅ 구현된 기능

### 1. 쿠키 기반 인증 공유

- **쿠키 이름**: `tg_access_token`, `tg_refresh_token`
- **Domain 속성**: `.talkgate.im` (프로덕션)
- **SameSite**: `None` + `Secure` (프로덕션), `Lax` (개발)
- **메인 서비스에서 설정한 쿠키를 랜딩 페이지에서 읽어 인증 상태 확인**

### 2. 헤더(Header) 동적 변경

**로그아웃 상태:**
- Login 버튼
- 시작하기 버튼

**로그인 상태:**
- 대시보드 버튼 (메인 서비스로 이동)
- Logout 버튼 (메인 서비스 로그아웃 페이지로 이동)

### 3. Pricing 페이지 인증 플로우

**로그아웃 상태:**
- 구독하기 버튼 클릭 시 → 로그인 필요 안내 메시지 표시
- 사용자 확인 후 → 메인 서비스 로그인 페이지로 리다이렉트
- `returnUrl` 파라미터로 `/pricing` 전달
- 로그인 완료 후 자동으로 pricing 페이지로 복귀

**로그인 상태:**
- 구독하기 버튼 클릭 시 → 바로 결제 단계로 진행
- DEV 로그인 버튼 숨김 (개발 환경에서만 DEV 로그아웃 버튼 표시)

### 4. 서버/클라이언트 인증 확인

**서버 컴포넌트 (SSR):**
```typescript
import { cookies } from 'next/headers';
import { checkAuthFromCookies } from '@/lib/auth';

export default async function RootLayout() {
  const cookieStore = await cookies();
  const isAuthenticated = checkAuthFromCookies(cookieStore);
  
  return <Header isAuthenticated={isAuthenticated} />;
}
```

**클라이언트 컴포넌트:**
```typescript
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { isAuthenticated, checkAuth } = useAuth({ initialAuth: false });
  
  // isAuthenticated 사용
}
```

## 🔧 주요 파일 변경 내역

### 1. `lib/auth.ts`
- 쿠키 이름: `talkgate_session` → `tg_access_token`
- `REFRESH_COOKIE_NAME` 추가
- `COOKIE_OPTIONS` 설정 추가

### 2. `hooks/useAuth.ts`
- 쿠키 값 검증 강화 (빈 값, undefined, null 체크)
- 메인 서비스 쿠키 이름 사용

### 3. `components/layout/Header.tsx`
- 로그인 상태에 따라 Logout 버튼 표시
- `getLogoutUrl()` 함수 사용

### 4. `app/pricing/page.tsx`
- 쿠키 검증 로직 개선
- DEV 로그인/로그아웃 버튼에서 쿠키 SameSite 속성 추가

### 5. `modules/pricing/PlanSelectStep.tsx`
- 로그인 확인 메시지 제거
- 로그인되지 않은 경우 바로 로그인 페이지로 이동

### 6. `app/layout.tsx`
- 서버 컴포넌트에서 쿠키 기반 인증 확인 활성화
- Header에 인증 상태 전달

### 7. `lib/env.ts`
- `COOKIE_DOMAIN` 환경 변수 추가

### 8. `next.config.ts`
- CORS 헤더 설정 추가 (랜딩 페이지 ↔ 메인 서비스 통신)

## 🚀 사용 방법

### 환경 변수 설정

`.env.local` 파일 생성:

**개발 환경:**
```env
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app-dev.talkgate.im
NEXT_PUBLIC_LANDING_URL=https://talkgate.im
NEXT_PUBLIC_COOKIE_DOMAIN=
```

**프로덕션 환경 (Vercel):**
```env
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app.talkgate.im
NEXT_PUBLIC_LANDING_URL=https://talkgate.im
NEXT_PUBLIC_COOKIE_DOMAIN=.talkgate.im
```

## 🧪 테스트 시나리오

### 1. 헤더 버튼 테스트
1. 로그아웃 상태에서 랜딩 페이지 접속
2. "Login" 및 "시작하기" 버튼 확인
3. Login 클릭 → 메인 서비스 로그인
4. 로그인 후 랜딩 페이지로 복귀
5. "대시보드" 및 "Logout" 버튼 확인

### 2. Pricing 플로우 테스트 (로그아웃 상태)
1. `/pricing` 페이지 접속
2. 플랜 선택 후 "구독하기" 클릭
3. 메인 서비스 로그인 페이지로 자동 이동
4. 로그인 완료
5. `/pricing` 페이지로 자동 복귀
6. 플랜 선택 후 "구독하기" 클릭
7. 결제 페이지로 진행 확인

### 3. Pricing 플로우 테스트 (로그인 상태)
1. 로그인된 상태에서 `/pricing` 페이지 접속
2. DEV 로그인 버튼 숨김 확인
3. 플랜 선택 후 "구독하기" 클릭
4. 바로 결제 페이지로 진행 확인

### 4. 개발 환경 테스트
1. `/pricing` 페이지에서 우하단 "DEV 로그인" 버튼 클릭
2. 페이지 새로고침
3. 헤더에 "대시보드" 및 "Logout" 버튼 표시 확인
4. "DEV 로그아웃" 버튼으로 변경 확인

## 📝 메인 서비스에서 확인할 사항

메인 서비스의 로그인/로그아웃 핸들러에서 다음을 확인하세요:

### 로그인 후 처리
```typescript
// 1. returnUrl 파라미터 확인
const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirectUrl');

// 2. 쿠키 설정 (Domain: .talkgate.im)
cookieStore.set('tg_access_token', accessToken, {
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, // .talkgate.im
  path: '/',
  sameSite: 'none',
  secure: true,
  httpOnly: false,
  maxAge: 60 * 60 * 24 * 7, // 7일
});

// 3. returnUrl로 리다이렉트
if (returnUrl) {
  window.location.href = returnUrl;
} else {
  router.push('/dashboard');
}
```

### 로그아웃 후 처리
```typescript
// 1. returnUrl 파라미터 확인
const returnUrl = searchParams.get('returnUrl') || searchParams.get('redirectUrl');

// 2. 쿠키 삭제
cookieStore.set('tg_access_token', '', {
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  path: '/',
  maxAge: 0,
});

cookieStore.set('tg_refresh_token', '', {
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN,
  path: '/',
  maxAge: 0,
});

// 3. returnUrl로 리다이렉트
if (returnUrl) {
  window.location.href = returnUrl;
} else {
  router.push('/');
}
```

## 🐛 문제 해결

### 쿠키가 공유되지 않을 때

1. **브라우저 개발자 도구에서 쿠키 확인**
   - Application → Cookies
   - `tg_access_token` 쿠키의 Domain이 `.talkgate.im`인지 확인
   - SameSite가 `None`이고 Secure가 체크되어 있는지 확인

2. **HTTPS 확인**
   - 프로덕션 환경에서는 반드시 HTTPS 사용
   - `secure: true` 설정 시 HTTP에서는 쿠키 전송 안 됨

3. **환경 변수 확인**
   - Vercel 대시보드에서 `NEXT_PUBLIC_COOKIE_DOMAIN=.talkgate.im` 설정 확인
   - 메인 서비스와 랜딩 페이지 모두 동일한 값 설정

### 로컬 개발에서 테스트

로컬에서 도메인 간 쿠키 공유를 테스트하려면 hosts 파일을 수정:

```
# Windows: C:\Windows\System32\drivers\etc\hosts
# Mac/Linux: /etc/hosts

127.0.0.1 local.talkgate.im
127.0.0.1 landing.local.talkgate.im
```

그리고 환경 변수 수정:
```env
NEXT_PUBLIC_MAIN_SERVICE_URL=http://local.talkgate.im:3001
NEXT_PUBLIC_LANDING_URL=https://talkgate.im
NEXT_PUBLIC_COOKIE_DOMAIN=.local.talkgate.im
```

## 📚 참고 문서

- [SETUP.md](./SETUP.md) - 전체 설정 가이드
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

---

**구현 완료일**: 2025-12-05
**작성자**: AI Assistant
