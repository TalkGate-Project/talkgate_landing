/**
 * 환경 변수 접근 유틸리티
 *
 * 모든 환경 변수는 이 모듈을 통해 접근합니다.
 * 타입 안전성과 기본값 처리를 제공합니다.
 */

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] ?? defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
}

function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
}

export const env = {
  /**
   * 메인 서비스 URL
   * 인증 리다이렉트, 대시보드 링크 등에 사용
   */
  MAIN_SERVICE_URL: getEnvVar(
    'NEXT_PUBLIC_MAIN_SERVICE_URL',
    'https://my-service.im'
  ),

  /**
   * 현재 랜딩 페이지 URL
   * 인증 후 returnUrl 생성에 사용
   */
  LANDING_URL: getEnvVar('NEXT_PUBLIC_LANDING_URL', 'http://localhost:3000'),

  /**
   * API 베이스 URL (필요시)
   */
  API_BASE_URL: getOptionalEnvVar('NEXT_PUBLIC_API_BASE_URL'),

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
} as const;

export type Env = typeof env;

