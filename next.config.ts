import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * 도메인 간 쿠키 공유를 위한 헤더 설정
   * 
   * 메인 서비스(talkgate.im)에서 설정한 쿠키를
   * 랜딩 페이지(landing.talkgate.im)에서도 읽을 수 있도록 설정
   */
  async headers() {
    return [
      {
        // 모든 API 라우트에 적용
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true',
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NEXT_PUBLIC_MAIN_SERVICE_URL || 'https://app.talkgate.im',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
