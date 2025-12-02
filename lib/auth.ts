/**
 * 인증 관련 유틸리티
 *
 * 랜딩 페이지는 직접 인증을 처리하지 않고,
 * 메인 서비스로 위임합니다.
 */

import { env } from './env';

/**
 * 로그인 URL 생성
 *
 * 메인 서비스의 로그인 페이지로 리다이렉트하며,
 * returnUrl을 쿼리 파라미터로 전달합니다.
 *
 * @param returnPath - 로그인 후 돌아올 경로 (기본: '/')
 * @returns 메인 서비스 로그인 URL
 *
 * @example
 * ```tsx
 * <Link href={getLoginUrl('/pricing')}>로그인</Link>
 * ```
 */
export function getLoginUrl(returnPath: string = '/'): string {
  const returnUrl = `${env.LANDING_URL}${returnPath}`;
  const loginUrl = new URL('/login', env.MAIN_SERVICE_URL);
  loginUrl.searchParams.set('returnUrl', returnUrl);

  return loginUrl.toString();
}

/**
 * 회원가입 URL 생성
 *
 * @param returnPath - 가입 후 돌아올 경로 (기본: '/')
 * @returns 메인 서비스 회원가입 URL
 */
export function getSignupUrl(returnPath: string = '/'): string {
  const returnUrl = `${env.LANDING_URL}${returnPath}`;
  const signupUrl = new URL('/signup', env.MAIN_SERVICE_URL);
  signupUrl.searchParams.set('returnUrl', returnUrl);

  return signupUrl.toString();
}

/**
 * 시작하기 URL 생성
 *
 * 인증 여부에 따라 다른 페이지로 이동합니다.
 * - 인증됨: 메인 서비스 대시보드
 * - 미인증: 메인 서비스 회원가입
 *
 * @param isAuthenticated - 인증 여부
 * @returns 적절한 URL
 */
export function getStartUrl(isAuthenticated: boolean = false): string {
  if (isAuthenticated) {
    return `${env.MAIN_SERVICE_URL}/dashboard`;
  }

  return getSignupUrl('/');
}

/**
 * 메인 서비스 대시보드 URL
 */
export function getDashboardUrl(): string {
  return `${env.MAIN_SERVICE_URL}/dashboard`;
}

/**
 * 로그아웃 URL 생성
 *
 * @param returnPath - 로그아웃 후 돌아올 경로 (기본: '/')
 * @returns 메인 서비스 로그아웃 URL
 */
export function getLogoutUrl(returnPath: string = '/'): string {
  const returnUrl = `${env.LANDING_URL}${returnPath}`;
  const logoutUrl = new URL('/logout', env.MAIN_SERVICE_URL);
  logoutUrl.searchParams.set('returnUrl', returnUrl);

  return logoutUrl.toString();
}

// ============================================
// Server-side 인증 확인 (추후 구현)
// ============================================

/**
 * 인증 쿠키 이름
 * 메인 서비스와 동일한 쿠키 이름 사용
 */
export const AUTH_COOKIE_NAME = 'talkgate_session';

/**
 * 서버 사이드에서 인증 상태 확인
 *
 * @example
 * ```tsx
 * // Server Component에서 사용
 * import { cookies } from 'next/headers';
 * import { checkAuthFromCookies } from '@/lib/auth';
 *
 * export default async function Page() {
 *   const cookieStore = await cookies();
 *   const isAuthenticated = checkAuthFromCookies(cookieStore);
 *   // ...
 * }
 * ```
 */
export function checkAuthFromCookies(
  cookieStore: { get: (name: string) => { value: string } | undefined }
): boolean {
  const sessionCookie = cookieStore.get(AUTH_COOKIE_NAME);
  return !!sessionCookie?.value;
}

