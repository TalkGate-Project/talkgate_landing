# 도메인 간 로그인 상태 공유 설정 가이드

이 문서는 랜딩 페이지(`landing.talkgate.im`)와 메인 서비스(`talkgate.im`) 간의 로그인 상태 공유 설정 방법을 설명합니다.

## 목차

1. [개요](#개요)
2. [환경 변수 설정](#환경-변수-설정)
3. [쿠키 설정](#쿠키-설정)
4. [인증 플로우](#인증-플로우)
5. [개발 환경 설정](#개발-환경-설정)
6. [프로덕션 배포](#프로덕션-배포)
7. [문제 해결](#문제-해결)

## 개요

### 인증 흐름

```
1. 사용자가 랜딩 페이지에서 "시작하기" 또는 "로그인" 클릭
   ↓
2. 메인 서비스로 리다이렉트 (returnUrl 파라미터 포함)
   - 개발: https://app-dev.talkgate.im/login?returnUrl=http://localhost:3000
   - 프로덕션: https://app.talkgate.im/login?returnUrl=https://landing.talkgate.im
   ↓
3. 메인 서비스에서 로그인 처리
   ↓
4. 메인 서비스가 쿠키 설정 (domain: .talkgate.im)
   - 이렇게 하면 *.talkgate.im 도메인에서 모두 접근 가능
   ↓
5. 사용자를 returnUrl로 리다이렉트
   ↓
6. 랜딩 페이지에서 쿠키 읽어서 로그인 상태 확인
```

## 환경 변수 설정

### `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

#### 개발 환경

```env
# 메인 서비스 URL
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app-dev.talkgate.im

# 현재 랜딩 페이지 URL
NEXT_PUBLIC_LANDING_URL=https://talkgate.im

# 쿠키 도메인 (개발 환경에서는 비워둠)
NEXT_PUBLIC_COOKIE_DOMAIN=
```

#### 프로덕션 환경 (Vercel 환경 변수로 설정)

```env
# 메인 서비스 URL
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app.talkgate.im

# 현재 랜딩 페이지 URL
NEXT_PUBLIC_LANDING_URL=https://talkgate.im

# 쿠키 도메인 (앞에 점을 붙여 서브도메인 간 공유)
NEXT_PUBLIC_COOKIE_DOMAIN=.talkgate.im
```

## 쿠키 설정

### 메인 서비스에서 설정해야 할 쿠키 옵션

메인 서비스(`talkgate.im`)에서 로그인 시 다음과 같이 쿠키를 설정해야 합니다:

```typescript
// 메인 서비스 (talkgate.im)의 로그인 핸들러
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // ... 로그인 처리 ...
  
  const cookieStore = await cookies();
  
  // 세션 쿠키 설정
  cookieStore.set('talkgate_session', sessionToken, {
    domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN, // .talkgate.im
    path: '/',
    sameSite: 'lax',
    secure: true, // HTTPS only
    httpOnly: false, // 클라이언트에서도 읽을 수 있도록
    maxAge: 60 * 60 * 24 * 7, // 7일
  });
  
  // returnUrl로 리다이렉트
  const url = new URL(request.url);
  const returnUrl = url.searchParams.get('returnUrl') || '/';
  
  return Response.redirect(returnUrl);
}
```

### 중요한 쿠키 설정 포인트

1. **`domain: '.talkgate.im'`**
   - 앞에 점(`.`)을 붙여야 서브도메인 간 공유 가능
   - `talkgate.im`, `landing.talkgate.im`, `www.talkgate.im` 모두 접근 가능

2. **`httpOnly: false`**
   - 클라이언트 JavaScript에서도 쿠키를 읽을 수 있도록 설정
   - 보안이 중요한 경우 API 엔드포인트를 통해 확인 가능

3. **`sameSite: 'lax'`**
   - CSRF 공격 방지
   - 도메인 간 리다이렉트 시에도 쿠키 전송

4. **`secure: true`**
   - HTTPS 환경에서만 쿠키 전송
   - 프로덕션에서 필수

## 인증 플로우

### 1. 로그인 버튼 클릭

랜딩 페이지의 Header 컴포넌트에서 자동으로 처리됩니다:

```tsx
import { getLoginUrl } from '@/lib/auth';

<Link href={getLoginUrl(pathname)}>
  Login
</Link>
```

### 2. 메인 서비스로 리다이렉트

`getLoginUrl()` 함수가 자동으로 생성합니다:

```typescript
// 개발 환경
https://app-dev.talkgate.im/login?returnUrl=http://localhost:3000/pricing

// 프로덕션 환경
https://app.talkgate.im/login?returnUrl=https://landing.talkgate.im/pricing
```

### 3. 랜딩 페이지에서 로그인 상태 확인

#### 서버 컴포넌트에서

```tsx
import { cookies } from 'next/headers';
import { checkAuthFromCookies } from '@/lib/auth';

export default async function Page() {
  const cookieStore = await cookies();
  const isAuthenticated = checkAuthFromCookies(cookieStore);
  
  return <div>{isAuthenticated ? '로그인됨' : '로그아웃됨'}</div>;
}
```

#### 클라이언트 컴포넌트에서

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export default function MyComponent({ initialAuth }: { initialAuth: boolean }) {
  const { isAuthenticated, checkAuth } = useAuth({ initialAuth });
  
  return (
    <div>
      {isAuthenticated ? '로그인됨' : '로그아웃됨'}
      <button onClick={checkAuth}>상태 새로고침</button>
    </div>
  );
}
```

## 개발 환경 설정

### 로컬 개발 시 주의사항

1. **`localhost`에서는 쿠키 도메인을 설정하지 않습니다**
   ```env
   NEXT_PUBLIC_COOKIE_DOMAIN=
   ```

2. **HTTPS가 필요한 경우**
   - 로컬에서 HTTPS 설정: `mkcert` 사용
   - 또는 Vercel Preview 배포로 테스트

3. **CORS 이슈**
   - 메인 서비스에서 랜딩 페이지 URL을 허용 목록에 추가
   ```typescript
   // 메인 서비스의 next.config.ts
   headers: [
     {
       key: 'Access-Control-Allow-Origin',
       value: 'http://localhost:3000',
     },
     {
       key: 'Access-Control-Allow-Credentials',
       value: 'true',
     },
   ]
   ```

## 프로덕션 배포

### Vercel 환경 변수 설정

1. Vercel 대시보드에서 프로젝트 선택
2. Settings → Environment Variables
3. 다음 변수 추가:

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `NEXT_PUBLIC_MAIN_SERVICE_URL` | `https://talkgate.im` | Production |
| `NEXT_PUBLIC_LANDING_URL` | `https://landing.talkgate.im` | Production |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | `.talkgate.im` | Production |

### DNS 설정

1. **랜딩 페이지 도메인 설정**
   - Vercel에서 `landing.talkgate.im` 도메인 연결
   - CNAME 레코드: `landing` → `cname.vercel-dns.com`

2. **메인 서비스 도메인 설정**
   - 메인 서비스 배포 환경에서 `talkgate.im` 도메인 연결

### 배포 체크리스트

- [ ] 환경 변수 설정 완료
- [ ] DNS 설정 완료
- [ ] HTTPS 인증서 발급 완료
- [ ] 메인 서비스에서 쿠키 도메인 설정 완료 (`.talkgate.im`)
- [ ] 로그인 → 리다이렉트 → 랜딩 페이지 테스트 완료
- [ ] 로그아웃 → 리다이렉트 → 랜딩 페이지 테스트 완료

## 문제 해결

### 쿠키가 공유되지 않을 때

1. **쿠키 도메인 확인**
   ```javascript
   // 브라우저 콘솔에서 확인
   document.cookie
   ```
   - `talkgate_session` 쿠키의 `Domain` 속성이 `.talkgate.im`인지 확인

2. **HTTPS 확인**
   - 프로덕션 환경에서는 반드시 HTTPS 사용
   - `secure: true` 설정 시 HTTP에서는 쿠키 전송 안 됨

3. **SameSite 속성 확인**
   - `sameSite: 'lax'` 또는 `'none'` 설정
   - `'strict'`는 도메인 간 전송 불가

### 로컬 개발에서 테스트하기

로컬에서 도메인 간 쿠키 공유를 테스트하려면:

1. **hosts 파일 수정**
   ```
   # Windows: C:\Windows\System32\drivers\etc\hosts
   # Mac/Linux: /etc/hosts
   
   127.0.0.1 local.talkgate.im
   127.0.0.1 landing.local.talkgate.im
   ```

2. **환경 변수 수정**
   ```env
   NEXT_PUBLIC_MAIN_SERVICE_URL=http://local.talkgate.im:3001
   NEXT_PUBLIC_LANDING_URL=https://talkgate.im
   NEXT_PUBLIC_COOKIE_DOMAIN=.local.talkgate.im
   ```

3. **포트 설정**
   - 랜딩 페이지: 3000번 포트
   - 메인 서비스: 3001번 포트

### API 응답 확인

인증 상태 확인 API를 통해 테스트:

```bash
# 랜딩 페이지에서 인증 상태 확인
curl -X GET http://localhost:3000/api/auth/check \
  -H "Cookie: talkgate_session=your_session_token"
```

## 참고 자료

- [Next.js Cookies Documentation](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [MDN: Using HTTP cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
- [SameSite Cookie Explained](https://web.dev/samesite-cookies-explained/)

## 문의

문제가 발생하거나 추가 도움이 필요한 경우, 개발팀에 문의해주세요.
