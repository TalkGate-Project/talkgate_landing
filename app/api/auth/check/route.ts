/**
 * 인증 상태 확인 API
 *
 * 클라이언트에서 현재 인증 상태를 확인할 수 있는 엔드포인트.
 * /api/proxy와 동일하게 API_BASE_URL + tg_access_token 쿠키 기반으로 검증합니다.
 */

import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('tg_access_token')?.value;

    if (!accessToken || accessToken === 'undefined' || accessToken === 'null') {
      return NextResponse.json({ authenticated: false });
    }

    const response = await fetch(`${env.API_BASE_URL}/v1/auth/user`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      cache: 'no-store',
    });

    return NextResponse.json({
      authenticated: response.ok,
    });
  } catch (error) {
    console.warn('인증 상태 확인 실패:', error);
    return NextResponse.json({
      authenticated: false,
    });
  }
}
