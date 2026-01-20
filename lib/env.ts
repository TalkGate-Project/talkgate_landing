/**
 * 환경 변수 접근 유틸리티
 *
 * 모든 환경 변수는 이 모듈을 통해 접근합니다.
 * 타입 안전성과 기본값 처리를 제공합니다.
 */

function getEnvVar(key: string, defaultValue?: string): string {
  // 환경 변수가 설정되어 있으면 우선 사용
  const value = process.env[key];
  if (value) {
    return value;
  }
  
  // 환경 변수가 없으면 기본값 사용
  if (defaultValue !== undefined) {
    return defaultValue;
  }
  
  throw new Error(`Missing environment variable: ${key}`);
}

function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  /**
   * 메인 서비스 URL
   * 인증 리다이렉트, 대시보드 링크 등에 사용
   * 
   * 환경 변수 NEXT_PUBLIC_MAIN_SERVICE_URL이 설정되어 있으면 그것을 사용합니다.
   * 설정되어 있지 않으면 기본값을 사용합니다.
   * 
   * 개발 기본값: https://app-dev.talkgate.im
   * 프로덕션 기본값: https://app.talkgate.im
   */
  MAIN_SERVICE_URL: getEnvVar(
    'NEXT_PUBLIC_MAIN_SERVICE_URL',
    'https://app-dev.talkgate.im' // 기본값 (환경 변수가 없을 때만 사용)
  ),

  /**
   * 현재 랜딩 페이지 URL
   * 인증 후 returnUrl 생성에 사용
   * 
   * 개발: http://localhost:3000
   * 프로덕션: https://landing.talkgate.im
   */
  LANDING_URL: getEnvVar('NEXT_PUBLIC_LANDING_URL', 'https://talkgate.im'),

  /**
   * API 베이스 URL
   * 
   * 환경 변수 NEXT_PUBLIC_API_BASE_URL이 설정되어 있으면 그것을 사용합니다.
   * 설정되어 있지 않으면 기본값을 사용합니다.
   * 
   * 개발 기본값: https://api-dev.talkgate.im
   * 프로덕션 기본값: https://api.talkgate.im
   */
  API_BASE_URL: getEnvVar(
    'NEXT_PUBLIC_API_BASE_URL',
    'https://api-dev.talkgate.im' // 기본값 (환경 변수가 없을 때만 사용)
  ),

  /**
   * API 타임아웃 (ms)
   */
  API_TIMEOUT_MS: Number(
    getEnvVar('NEXT_PUBLIC_API_TIMEOUT_MS', '10000')
  ),

  /**
   * Google Analytics ID
   */
  GA_ID: getOptionalEnvVar('NEXT_PUBLIC_GA_ID'),

  /**
   * 체험하기 기능 활성화 여부
   */
  ENABLE_TRIAL: getEnvVar('NEXT_PUBLIC_ENABLE_TRIAL', 'false') === 'true',

  /**
   * 쿠키 도메인 설정
   * 프로덕션: .talkgate.im (서브도메인 간 공유)
   * 개발: undefined (localhost)
   */
  COOKIE_DOMAIN: getOptionalEnvVar('NEXT_PUBLIC_COOKIE_DOMAIN'),
} as const;

export type Env = typeof env;

