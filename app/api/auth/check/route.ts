/**
 * 인증 상태 확인 API
 *
 * 클라이언트에서 현재 인증 상태를 확인할 수 있는 엔드포인트.
 * /api/proxy와 동일하게 API_BASE_URL + tg_access_token 쿠키 기반으로 검증합니다.
 *
 * ------------------------------------------------------------------------------
 * [기존 로직 / 변경 배경] — 배포·테스트 시 재검토용. 필요하면 아래 방식으로 되돌려볼 수 있음.
 *
 * 상황: 쿠키에 tg_access_token·tg_refresh_token 있는데 로그인 처리 안 되는 이슈.
 * 현재 방식: API_BASE_URL + Authorization Bearer (우리 /api/proxy와 동일).
 * 기존 방식: MAIN_SERVICE_URL(메인 앱) /api/proxy/v1/auth/user 호출 + Cookie 헤더로 전체 쿠키 전달.
 *
 * 기존 코드 예시:
 *   const cookieStore = await cookies();
 *   const cookieHeader = cookieStore
 *     .getAll()
 *     .map((c) => `${c.name}=${c.value}`)
 *     .join('; ');
 *   const response = await fetch(
 *     `${env.MAIN_SERVICE_URL}/api/proxy/v1/auth/user`,
 *     {
 *       method: 'GET',
 *       headers: {
 *         'Content-Type': 'application/json',
 *         ...(cookieHeader ? { Cookie: cookieHeader } : {}),
 *       },
 *       cache: 'no-store',
 *     }
 *   );
 *   return NextResponse.json({ authenticated: response.ok });
 *
 * 기존이 동작하지 않았을 가능성: 메인 앱 /api/proxy 경로·쿠키 처리 차이, 검증 서버 불일치 등.
 * ------------------------------------------------------------------------------
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
