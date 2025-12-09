# 메인 서비스 로그아웃 기능 구현 가이드

## 📋 개요

랜딩 페이지(`talkgate_landing`)에서 로그아웃 요청 시, 메인 서비스로 리다이렉트하여 로그아웃을 처리하고 콜백 URL을 통해 다시 돌아오는 방식으로 구현되어 있습니다.

---

## 🔄 로그아웃 플로우

```
1. 사용자가 랜딩 페이지에서 "Logout" 버튼 클릭
   ↓
2. 메인 서비스 로그아웃 페이지로 리다이렉트
   URL: {MAIN_SERVICE_URL}/logout?callbackUrl={LANDING_URL}/api/auth/logout-callback&returnUrl={LANDING_URL}{pathname}
   ↓
3. 메인 서비스에서 로그아웃 처리
   - 서버 사이드 세션 무효화
   - 쿠키 삭제 (tg_access_token, tg_refresh_token)
   ↓
4. 콜백 URL로 리다이렉트
   URL: {LANDING_URL}/api/auth/logout-callback?returnUrl={LANDING_URL}{pathname}&success=true
   ↓
5. 랜딩 페이지에서 쿠키 삭제 확인 및 최종 리다이렉트
   ↓
6. returnUrl로 이동 (사용자가 있던 페이지 유지)
```

---

## 🎯 메인 서비스에서 구현해야 할 사항

### 1. 로그아웃 페이지/API 엔드포인트 생성

**경로**: `/logout` (GET 또는 POST)

**쿼리 파라미터**:
- `callbackUrl` (필수): 로그아웃 처리 후 리다이렉트할 콜백 URL
  - 예: `https://landing.talkgate.im/api/auth/logout-callback`
- `returnUrl` (선택): 최종적으로 사용자를 보낼 URL
  - 예: `https://landing.talkgate.im/pricing`

**구현 예시**:

```typescript
// app/logout/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get('callbackUrl');
  const returnUrl = searchParams.get('returnUrl');

  if (!callbackUrl) {
    // callbackUrl이 없으면 기본 로그아웃 처리 후 홈으로
    await handleLogout();
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그아웃 처리
  await handleLogout();

  // 콜백 URL로 리다이렉트 (returnUrl 포함)
  const callback = new URL(callbackUrl);
  if (returnUrl) {
    callback.searchParams.set('returnUrl', returnUrl);
  }
  callback.searchParams.set('success', 'true');

  return NextResponse.redirect(callback);
}

async function handleLogout() {
  const cookieStore = await cookies();
  
  // 서버 사이드 세션 무효화 (필요한 경우)
  // await invalidateSession();
  
  // 쿠키 삭제
  const cookieOptions = {
    expires: new Date(0),
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined, // .talkgate.im
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    httpOnly: true,
  };

  // Access Token 쿠키 삭제
  cookieStore.set('tg_access_token', '', cookieOptions);
  
  // Refresh Token 쿠키 삭제
  cookieStore.set('tg_refresh_token', '', cookieOptions);
}
```

---

### 2. 쿠키 삭제 로직

메인 서비스에서 다음 쿠키들을 삭제해야 합니다:

- `tg_access_token` (Access Token)
- `tg_refresh_token` (Refresh Token)

**쿠키 옵션**:
- `domain`: `.talkgate.im` (프로덕션) 또는 `undefined` (개발)
- `path`: `/`
- `secure`: `true` (프로덕션), `false` (개발)
- `sameSite`: `none` (프로덕션), `lax` (개발)
- `httpOnly`: `true`

**중요**: 쿠키 삭제 시 Domain 속성이 있는 쿠키와 없는 쿠키를 모두 삭제해야 합니다 (브라우저 호환성).

```typescript
// Domain 속성이 있는 쿠키 삭제
cookieStore.set('tg_access_token', '', {
  expires: new Date(0),
  path: '/',
  domain: '.talkgate.im',
  secure: true,
  sameSite: 'none',
  httpOnly: true,
});

// Domain 속성이 없는 쿠키도 삭제 시도 (브라우저 호환성)
cookieStore.set('tg_access_token', '', {
  expires: new Date(0),
  path: '/',
  secure: true,
  sameSite: 'none',
  httpOnly: true,
});
```

---

### 3. 서버 사이드 세션 무효화 (선택적)

서버 사이드 세션을 사용하는 경우, 세션을 무효화해야 합니다:

```typescript
async function handleLogout() {
  // 1. 세션 무효화
  const sessionId = getSessionIdFromCookie();
  if (sessionId) {
    await invalidateSession(sessionId);
  }

  // 2. 쿠키 삭제
  // ... (위의 쿠키 삭제 로직)
}
```

---

## 🔍 랜딩 페이지에서 전달하는 정보

### 요청 URL 예시

```
https://app.talkgate.im/logout?callbackUrl=https://landing.talkgate.im/api/auth/logout-callback&returnUrl=https://landing.talkgate.im/pricing
```

### 파라미터 설명

| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `callbackUrl` | 로그아웃 처리 후 리다이렉트할 콜백 URL | `https://landing.talkgate.im/api/auth/logout-callback` |
| `returnUrl` | 최종적으로 사용자를 보낼 URL | `https://landing.talkgate.im/pricing` |

---

## ✅ 콜백 URL로 리다이렉트

로그아웃 처리 후, 다음 형식으로 콜백 URL로 리다이렉트해야 합니다:

```
{callbackUrl}?returnUrl={returnUrl}&success=true
```

**예시**:
```
https://landing.talkgate.im/api/auth/logout-callback?returnUrl=https://landing.talkgate.im/pricing&success=true
```

---

## 🧪 테스트 시나리오

### 테스트 1: 기본 로그아웃

```
1. 랜딩 페이지에서 로그인된 상태로 접속
2. "Logout" 버튼 클릭
3. 메인 서비스 로그아웃 페이지로 이동 확인
4. 쿠키 삭제 확인 (개발자 도구)
5. 랜딩 페이지로 돌아와서 로그아웃 상태 확인
```

### 테스트 2: 특정 페이지에서 로그아웃

```
1. /pricing 페이지에서 로그인된 상태로 접속
2. "Logout" 버튼 클릭
3. 로그아웃 처리 후 /pricing 페이지로 돌아오는지 확인
```

### 테스트 3: 크로스 도메인 쿠키 삭제

```
1. landing.talkgate.im에서 로그인
2. app.talkgate.im에서도 로그인 상태 확인
3. landing.talkgate.im에서 로그아웃
4. app.talkgate.im에서도 로그아웃 상태로 변경되는지 확인
```

---

## 🔒 보안 고려사항

### 1. 콜백 URL 검증

랜딩 페이지의 콜백 URL만 허용하도록 검증해야 합니다:

```typescript
const ALLOWED_CALLBACK_DOMAINS = [
  'https://landing.talkgate.im',
  'https://talkgate.im',
  'http://localhost:3000', // 개발 환경
];

function isValidCallbackUrl(url: string): boolean {
  try {
    const callbackUrl = new URL(url);
    return ALLOWED_CALLBACK_DOMAINS.some(domain => 
      callbackUrl.origin === domain || callbackUrl.origin === new URL(domain).origin
    );
  } catch {
    return false;
  }
}
```

### 2. CSRF 보호

필요한 경우 CSRF 토큰을 사용하여 요청을 검증할 수 있습니다.

---

## 📝 구현 체크리스트

- [ ] `/logout` 엔드포인트 생성 (GET 또는 POST)
- [ ] `callbackUrl` 쿼리 파라미터 파싱
- [ ] `returnUrl` 쿼리 파라미터 파싱 (선택적)
- [ ] 서버 사이드 세션 무효화 (필요한 경우)
- [ ] `tg_access_token` 쿠키 삭제
- [ ] `tg_refresh_token` 쿠키 삭제
- [ ] Domain 속성이 있는 쿠키와 없는 쿠키 모두 삭제
- [ ] 콜백 URL 검증 (보안)
- [ ] 콜백 URL로 리다이렉트 (`returnUrl` 및 `success` 파라미터 포함)
- [ ] 에러 처리 (callbackUrl이 없는 경우 등)

---

## 🎉 완료 후 확인 사항

1. 랜딩 페이지에서 로그아웃 버튼 클릭 시 메인 서비스로 이동하는지 확인
2. 메인 서비스에서 쿠키가 삭제되는지 확인
3. 콜백 URL로 리다이렉트되는지 확인
4. 랜딩 페이지로 돌아와서 로그아웃 상태가 반영되는지 확인
5. 크로스 도메인 쿠키 삭제가 정상 작동하는지 확인

---

## 📞 문의

구현 중 문제가 발생하거나 추가 정보가 필요한 경우, 랜딩 페이지 프로젝트의 `lib/auth.ts` 파일을 참고하세요.

