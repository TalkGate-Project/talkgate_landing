/**
 * 로그아웃 라우트
 * 
 * Next.js 공식 API인 cookies().delete()를 사용하여
 * HttpOnly 쿠키를 포함한 모든 인증 쿠키를 삭제한 후 메인 페이지로 리다이렉트합니다.
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIE_NAME, REFRESH_COOKIE_NAME } from '@/lib/auth';

// 프로젝트 선택 쿠키 이름
const SELECTED_PROJECT_COOKIE_NAME = 'tg_selected_project_id';

export async function GET() {
  const cookieStore = await cookies();

  // 삭제할 쿠키 목록
  const cookiesToDelete = [
    AUTH_COOKIE_NAME,
    REFRESH_COOKIE_NAME,
    SELECTED_PROJECT_COOKIE_NAME,
  ];

  // Next.js 공식 API를 사용하여 쿠키 삭제
  for (const cookieName of cookiesToDelete) {
    cookieStore.delete(cookieName);
  }

  // 메인 페이지로 리다이렉트
  redirect('/');
}

