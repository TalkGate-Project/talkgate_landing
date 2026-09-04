/**
 * 검색엔진 색인 허용 여부 판별 (Vercel 배포 기준)
 *
 * [사고 배경]
 * robots.ts / sitemap.ts / metadataBase가 모두 'https://talkgate.im'으로
 * 하드코딩되어 있어, dev 배포도 운영과 똑같이
 * "Allow: /" robots.txt + "index, follow" 메타를 내보내고 있었습니다.
 *
 * Vercel은 프리뷰 배포의 *.vercel.app URL에는 X-Robots-Tag: noindex를
 * 자동으로 붙이지만, **커스텀 도메인(dev.talkgate.im)에는 붙이지 않습니다.**
 * 그래서 dev 호스트가 그대로 크롤·색인되어 검색 결과에 노출됐습니다.
 * (실측: dev.talkgate.im 응답에 X-Robots-Tag 헤더 없음)
 *
 * [설계 원칙 — 실패 방향을 안전하게]
 * 운영 호스트를 화이트리스트로 잡으면 예상치 못한 호스트로 요청이 들어올 때
 * "운영이 통째로 noindex"가 되는 사고가 납니다. 그래서 반대로
 * **비운영 신호가 잡힐 때만 차단**하고, 판별에 실패하면 색인을 허용합니다.
 * 최악의 경우도 '기존 상태 유지'이지 운영 색인 중단이 아닙니다.
 */

/** 비운영으로 간주할 호스트 패턴 */
const NON_PRODUCTION_HOST_PATTERNS: RegExp[] = [
  /^dev\./, // dev.talkgate.im
  /-dev\./, // landing-dev.talkgate.im
  /^stag(e|ing)\./,
  /^preview\./,
  /^localhost$/,
  /^127\.0\.0\.1$/,
  /\.vercel\.app$/, // Vercel 프리뷰 기본 도메인
];

/** Headers에서 실제 요청 호스트를 정규화해 추출 */
export function normalizeHost(rawHost: string | null | undefined): string {
  return (rawHost ?? '')
    .split(',')[0] // "a.com, b.com" 형태 방어
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, ''); // 포트 제거
}

/**
 * 이 호스트에서 검색 색인을 허용할지 여부
 *
 * 판단 순서:
 * 1. NEXT_PUBLIC_SEARCH_INDEXING=off 로 강제 차단 (새 환경에 즉시 적용용)
 * 2. 호스트가 비운영 패턴에 걸리면 차단
 * 3. Vercel 배포 환경이 production이 아니면 차단 (preview / development)
 * 4. 그 외에는 허용 (판별 실패 시 운영 색인을 끊지 않기 위함)
 */
export function isIndexableHost(rawHost: string | null | undefined): boolean {
  if (process.env.NEXT_PUBLIC_SEARCH_INDEXING === 'off') return false;

  const host = normalizeHost(rawHost);
  if (host && NON_PRODUCTION_HOST_PATTERNS.some((p) => p.test(host))) return false;

  // Vercel이 주입하는 배포 환경 값: 'production' | 'preview' | 'development'
  const vercelEnv = process.env.VERCEL_ENV;
  if (vercelEnv && vercelEnv !== 'production') return false;

  return true;
}

/** Headers 객체에서 바로 판별 */
export function isIndexableRequest(headers: Headers): boolean {
  return isIndexableHost(headers.get('x-forwarded-host') ?? headers.get('host'));
}
