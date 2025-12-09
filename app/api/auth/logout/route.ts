/**
 * 로그아웃 라우트
 * 
 * HttpOnly 쿠키를 포함한 모든 인증 쿠키를 삭제한 후 메인 페이지로 리다이렉트합니다.
 * 쿠키 삭제는 쿠키가 설정된 것과 정확히 동일한 속성을 사용해야 합니다.
 */

import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { env } from '@/lib/env';

// 프로젝트 선택 쿠키 이름
const SELECTED_PROJECT_COOKIE_NAME = 'tg_selected_project_id';

export async function GET() {
  // Response 생성 (리다이렉트 전에 쿠키 삭제 헤더 설정)
  const response = NextResponse.redirect(new URL('/', env.LANDING_URL));

  // 쿠키 삭제를 위한 옵션 (쿠키 설정 시와 동일한 속성 사용)
  const cookieOptions = {
    expires: new Date(0), // 1970-01-01로 설정하여 즉시 만료
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
    SELECTED_PROJECT_COOKIE_NAME,
  ];

  // 각 쿠키를 만료된 쿠키로 설정하여 삭제
  for (const cookieName of cookiesToDelete) {
    // Domain이 있는 경우와 없는 경우 모두 삭제 시도 (브라우저 호환성)
    const domains = cookieOptions.domain ? [cookieOptions.domain, undefined] : [undefined];
    
    for (const domain of domains) {
      response.cookies.set({
        name: cookieName,
        value: '',
        expires: cookieOptions.expires,
        path: cookieOptions.path,
        domain: domain,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        httpOnly: cookieOptions.httpOnly,
      });
    }
  }

  return response;
}

