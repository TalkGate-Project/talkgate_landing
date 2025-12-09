/**
 * 로그아웃 API
 * 
 * HttpOnly 쿠키를 포함한 모든 인증 쿠키를 삭제합니다.
 * 서버 사이드에서 Set-Cookie 헤더를 통해 쿠키를 만료시킵니다.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/auth';
import { env } from '@/lib/env';

export async function POST() {
  // Response 생성
  const response = NextResponse.json({ 
    success: true,
    message: '로그아웃되었습니다.' 
  });

  // 쿠키 삭제를 위한 옵션
  const cookieOptions = {
    expires: new Date(0), // 1970-01-01로 설정하여 즉시 만료
    path: '/',
    domain: env.COOKIE_DOMAIN || undefined, // 프로덕션: .talkgate.im
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as 'none' | 'lax' | 'strict',
    httpOnly: true, // HttpOnly 쿠키도 삭제 가능하도록
  };

  // Access Token 쿠키 삭제 (만료된 쿠키로 설정)
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    expires: cookieOptions.expires,
    path: cookieOptions.path,
    domain: cookieOptions.domain,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    httpOnly: cookieOptions.httpOnly,
  });
  
  // Refresh Token 쿠키 삭제 (만료된 쿠키로 설정)
  response.cookies.set({
    name: REFRESH_COOKIE_NAME,
    value: '',
    expires: cookieOptions.expires,
    path: cookieOptions.path,
    domain: cookieOptions.domain,
    secure: cookieOptions.secure,
    sameSite: cookieOptions.sameSite,
    httpOnly: cookieOptions.httpOnly,
  });

  // Domain 속성이 있는 경우, Domain 없이도 삭제 시도 (브라우저 호환성)
  // 일부 브라우저에서는 Domain 속성이 있는 쿠키와 없는 쿠키를 다르게 처리할 수 있음
  if (cookieOptions.domain) {
    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: '',
      expires: cookieOptions.expires,
      path: cookieOptions.path,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      httpOnly: cookieOptions.httpOnly,
    });
    
    response.cookies.set({
      name: REFRESH_COOKIE_NAME,
      value: '',
      expires: cookieOptions.expires,
      path: cookieOptions.path,
      secure: cookieOptions.secure,
      sameSite: cookieOptions.sameSite,
      httpOnly: cookieOptions.httpOnly,
    });
  }

  return response;
}
