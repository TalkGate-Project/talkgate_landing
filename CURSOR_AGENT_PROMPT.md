# 메인 서비스 로그아웃 기능 구현 - Cursor 에이전트 프롬프트

## 🎯 작업 목표

랜딩 페이지(`talkgate_landing`)에서 로그아웃 요청 시 메인 서비스로 리다이렉트하여 로그아웃을 처리하고, 콜백 URL을 통해 다시 돌아오는 기능을 구현해야 합니다.

---

## 📋 요구사항

### 1. 로그아웃 엔드포인트 구현

**경로**: `/logout` (GET 또는 POST)

**기능**:
- 랜딩 페이지에서 전달받은 `callbackUrl`과 `returnUrl` 쿼리 파라미터를 파싱
- 서버 사이드 세션 무효화 (필요한 경우)
- 인증 쿠키 삭제 (`tg_access_token`, `tg_refresh_token`)
- 콜백 URL로 리다이렉트 (`returnUrl` 및 `success` 파라미터 포함)

**요청 예시**:
```
GET /logout?callbackUrl=https://landing.talkgate.im/api/auth/logout-callback&returnUrl=https://landing.talkgate.im/pricing
```

**응답**:
```
302 Redirect
Location: https://landing.talkgate.im/api/auth/logout-callback?returnUrl=https://landing.talkgate.im/pricing&success=true
```

### 2. 쿠키 삭제 로직

다음 쿠키들을 삭제해야 합니다:
- `tg_access_token` (Access Token)
- `tg_refresh_token` (Refresh Token)

**쿠키 삭제 옵션**:
```typescript
{
  expires: new Date(0), // 즉시 만료
  path: '/',
  domain: process.env.COOKIE_DOMAIN || undefined, // .talkgate.im (프로덕션)
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  httpOnly: true,
}
```

**중요**: Domain 속성이 있는 쿠키와 없는 쿠키를 모두 삭제해야 합니다 (브라우저 호환성).

### 3. 콜백 URL 검증

보안을 위해 랜딩 페이지의 콜백 URL만 허용하도록 검증해야 합니다:

```typescript
const ALLOWED_CALLBACK_DOMAINS = [
  'https://landing.talkgate.im',
  'https://talkgate.im',
  'http://localhost:3000', // 개발 환경
];
```

---

## 📝 구현 가이드

### Step 1: 로그아웃 엔드포인트 생성

Next.js App Router를 사용하는 경우:
```typescript
// app/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  // 쿼리 파라미터 파싱
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get('callbackUrl');
  const returnUrl = searchParams.get('returnUrl');

  // 로그아웃 처리
  await handleLogout();

  // 콜백 URL이 있으면 리다이렉트, 없으면 기본 처리
  if (callbackUrl && isValidCallbackUrl(callbackUrl)) {
    const callback = new URL(callbackUrl);
    if (returnUrl) {
      callback.searchParams.set('returnUrl', returnUrl);
    }
    callback.searchParams.set('success', 'true');
    return NextResponse.redirect(callback);
  }

  // 기본 로그아웃 처리 (콜백 URL이 없는 경우)
  return NextResponse.redirect(new URL('/', request.url));
}
```

### Step 2: 쿠키 삭제 함수 구현

```typescript
async function handleLogout() {
  const cookieStore = await cookies();
  
  const cookieOptions = {
    expires: new Date(0),
    path: '/',
    domain: process.env.COOKIE_DOMAIN || undefined,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    httpOnly: true,
  };

  // Domain 속성이 있는 쿠키 삭제
  if (cookieOptions.domain) {
    cookieStore.set('tg_access_token', '', cookieOptions);
    cookieStore.set('tg_refresh_token', '', cookieOptions);
  }

  // Domain 속성이 없는 쿠키도 삭제 (브라우저 호환성)
  const cookieOptionsWithoutDomain = {
    ...cookieOptions,
    domain: undefined,
  };
  cookieStore.set('tg_access_token', '', cookieOptionsWithoutDomain);
  cookieStore.set('tg_refresh_token', '', cookieOptionsWithoutDomain);
}
```

### Step 3: 콜백 URL 검증 함수 구현

```typescript
function isValidCallbackUrl(url: string): boolean {
  try {
    const callbackUrl = new URL(url);
    const allowedDomains = [
      'https://landing.talkgate.im',
      'https://talkgate.im',
      'http://localhost:3000',
    ];
    
    return allowedDomains.some(domain => {
      const allowedUrl = new URL(domain);
      return callbackUrl.origin === allowedUrl.origin;
    });
  } catch {
    return false;
  }
}
```

---

## ✅ 체크리스트

구현 시 다음 사항들을 확인하세요:

- [ ] `/logout` 엔드포인트가 정상 작동하는지
- [ ] `callbackUrl` 쿼리 파라미터를 올바르게 파싱하는지
- [ ] `returnUrl` 쿼리 파라미터를 올바르게 파싱하는지
- [ ] `tg_access_token` 쿠키가 삭제되는지
- [ ] `tg_refresh_token` 쿠키가 삭제되는지
- [ ] Domain 속성이 있는 쿠키와 없는 쿠키 모두 삭제되는지
- [ ] 콜백 URL 검증이 작동하는지
- [ ] 콜백 URL로 올바르게 리다이렉트되는지 (`returnUrl` 및 `success` 파라미터 포함)
- [ ] 에러 처리가 적절한지 (callbackUrl이 없는 경우 등)

---

## 🧪 테스트 방법

1. 랜딩 페이지에서 로그인된 상태로 접속
2. "Logout" 버튼 클릭
3. 메인 서비스 로그아웃 페이지로 이동하는지 확인
4. 개발자 도구에서 쿠키가 삭제되는지 확인
5. 랜딩 페이지로 돌아와서 로그아웃 상태가 반영되는지 확인

---

## 📚 참고 자료

- 랜딩 페이지 프로젝트의 `MAIN_SERVICE_LOGOUT_IMPLEMENTATION.md` 파일 참고
- 랜딩 페이지의 `lib/auth.ts`에서 `getLogoutUrl()` 함수 확인
- 랜딩 페이지의 `app/api/auth/logout-callback/route.ts`에서 콜백 처리 로직 확인

---

## 💡 추가 고려사항

1. **서버 사이드 세션 무효화**: 서버 사이드 세션을 사용하는 경우, 세션을 무효화해야 합니다.
2. **에러 처리**: `callbackUrl`이 없거나 유효하지 않은 경우 적절한 에러 처리를 해야 합니다.
3. **로깅**: 로그아웃 요청을 로깅하여 디버깅에 도움이 되도록 합니다.

---

이 프롬프트를 Cursor 에이전트에 전달하여 메인 서비스의 로그아웃 기능을 구현하세요.

