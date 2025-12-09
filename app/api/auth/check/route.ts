/**
 * 인증 상태 확인 API
 * 
 * 클라이언트에서 현재 인증 상태를 확인할 수 있는 엔드포인트
 * 메인 서비스의 API 프록시를 통해 인증 상태를 확인합니다.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // 모든 쿠키를 가져와서 Cookie 헤더로 전달
    const cookieHeader = cookieStore
      .getAll()
      .map(cookie => `${cookie.name}=${cookie.value}`)
      .join('; ');

    // 메인 서비스의 API 프록시를 통해 인증 상태 확인
    const response = await fetch(`${env.MAIN_SERVICE_URL}/api/proxy/v1/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
      cache: 'no-store', // 매번 최신 상태 확인
    });

    const isAuthenticated = response.ok;

    return NextResponse.json({
      authenticated: isAuthenticated,
    });
  } catch (error) {
    console.warn('인증 상태 확인 실패:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}
