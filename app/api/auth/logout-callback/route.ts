/**
 * 로그아웃 콜백 API
 * 
 * 메인 서비스에서 로그아웃 처리 후 이 엔드포인트로 리다이렉트됩니다.
 * Route Handler는 스트리밍 전에 실행되므로 쿠키 조작이 가능합니다.
 * 쿠키 삭제를 확인하고, returnUrl로 최종 리다이렉트합니다.
 */

import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { env } from '@/lib/env';

/**
 * GET /api/auth/logout-callback
 * 
 * 쿼리 파라미터:
 * - returnUrl: 로그아웃 후 최종적으로 이동할 URL (기본: '/')
 * - success: 로그아웃 성공 여부 (선택적)
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const returnUrl = searchParams.get('returnUrl') || '/';
  const success = searchParams.get('success') !== 'false';

  // Response 생성 (리다이렉트 전에 쿠키를 삭제해야 함)
  const response = NextResponse.redirect(new URL(returnUrl, env.LANDING_URL));

  // 쿠키 삭제를 위한 옵션
  // 중요: 쿠키를 삭제하려면 설정할 때와 동일한 옵션을 사용해야 합니다
  const cookieOptions = {
    expires: new Date(0), // 1970-01-01로 설정하여 즉시 만료
    maxAge: 0, // Max-Age도 0으로 설정
    path: '/',
    domain: env.COOKIE_DOMAIN || undefined, // 프로덕션: .talkgate.im
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    httpOnly: true, // HttpOnly 쿠키도 삭제 가능하도록
  };

  // 삭제할 쿠키 목록
  const cookiesToDelete = [
    AUTH_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    'tg_selected_project_id', // 프로젝트 선택 쿠키도 삭제
  ];

  // 각 쿠키를 삭제 (Domain 속성이 있는 경우와 없는 경우 모두)
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

    // Domain 속성이 없는 쿠키도 삭제 시도 (브라우저 호환성)
    // 일부 브라우저에서는 Domain 속성이 있는 쿠키와 없는 쿠키를 다르게 처리할 수 있음
    response.cookies.set({
      name: cookieName,
      value: '',
      expires: cookieOptions.expires,
      maxAge: cookieOptions.maxAge,
      path: cookieOptions.path,
      // domain을 명시적으로 undefined로 설정하지 않음 (Next.js가 자동 처리)
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      httpOnly: cookieOptions.httpOnly,
    });

    // delete 메서드도 시도 (Next.js 14+)
    response.cookies.delete(cookieName);
    if (cookieOptions.domain) {
      // Domain이 있는 경우도 delete 시도
      response.cookies.delete({
        name: cookieName,
        path: cookieOptions.path,
        domain: cookieOptions.domain,
      });
    }
  }

  return response;
}

