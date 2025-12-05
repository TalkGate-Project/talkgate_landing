/**
 * 인증 상태 확인 API
 * 
 * 클라이언트에서 현재 인증 상태를 확인할 수 있는 엔드포인트
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { checkAuthFromCookies } from '@/lib/auth';

export async function GET() {
  const cookieStore = await cookies();
  const isAuthenticated = checkAuthFromCookies(cookieStore);

  return NextResponse.json({
    authenticated: isAuthenticated,
  });
}
