/**
 * Proxy (formerly Middleware)
 * 
 * 스트리밍이 시작되기 전에 실행되므로 쿠키 조작이 가능합니다.
 * 로그아웃 콜백 경로를 처리하여 쿠키를 확실히 삭제합니다.
 * 
 * 참고: Route Handler에서도 쿠키 조작이 가능하지만,
 * Proxy를 통해 추가로 보장할 수 있습니다.
 * 
 * 실행 순서:
 * 1. Proxy (이 파일) - 스트리밍 전 실행, 쿠키 삭제 가능
 * 2. Route Handler (/api/auth/logout-callback) - 스트리밍 전 실행, 쿠키 삭제 가능
 * 
 * 두 곳에서 모두 쿠키를 삭제하여 확실하게 처리합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { env } from '@/lib/env';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 로그아웃 콜백 경로 처리
  if (pathname === '/api/auth/logout-callback') {
    const searchParams = request.nextUrl.searchParams;
    const returnUrl = searchParams.get('returnUrl') || '/';

    // Response 생성 (리다이렉트는 Route Handler에서 처리)
    // Proxy에서는 쿠키만 삭제하고 Route Handler로 전달
    const response = NextResponse.next();

    // 쿠키 삭제 옵션 (쿠키 설정 시와 동일한 속성 사용)
    const cookieOptions = {
      expires: new Date(0), // 1970-01-01로 설정하여 즉시 만료
      maxAge: 0, // Max-Age도 0으로 설정
      path: '/',
      domain: env.COOKIE_DOMAIN || undefined,
      secure: process.env.NODE_ENV === 'production',
      sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
      httpOnly: true,
    };

    // 삭제할 쿠키 목록
    const cookiesToDelete = [
      AUTH_COOKIE_NAME,
      REFRESH_COOKIE_NAME,
      'tg_selected_project_id',
    ];

    // 각 쿠키 삭제
    for (const cookieName of cookiesToDelete) {
      // Domain 속성이 있는 쿠키 삭제
      if (cookieOptions.domain) {
        response.cookies.set({
          name: cookieName,
          value: '',
          expires: cookieOptions.expires,
          maxAge: cookieOptions.maxAge,
          path: cookieOptions.path,
          domain: cookieOptions.domain,
          secure: cookieOptions.secure,
          sameSite: cookieOptions.sameSite,
          httpOnly: cookieOptions.httpOnly,
        });
      }

      // Domain 속성이 없는 쿠키도 삭제 (브라우저 호환성)
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: cookieOptions.expires,
        maxAge: cookieOptions.maxAge,
        path: cookieOptions.path,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        httpOnly: cookieOptions.httpOnly,
      });

      // delete 메서드도 사용 (Next.js 14+)
      response.cookies.delete(cookieName);
      if (cookieOptions.domain) {
        response.cookies.delete({
          name: cookieName,
          path: cookieOptions.path,
          domain: cookieOptions.domain,
        });
      }
    }

    return response;
  }

  // 다른 경로는 그대로 통과
  return NextResponse.next();
}

export const config = {
  // 로그아웃 콜백 경로만 처리
  matcher: '/api/auth/logout-callback',
};

