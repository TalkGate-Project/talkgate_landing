# SEO 최적화 가이드

## ✅ 완료된 작업

### 1. 한글 검색어 대응
- 메타데이터에 "톡게이트", "토크게이트" 키워드 추가
- JSON-LD structured data에 alternateName으로 한글 검색어 포함
- alternate 언어 설정 추가 (ko-KR, en-US)
- sitemap에 다국어 지원 추가

### 2. 검색 엔진 최적화
- `sitemap.ts` 생성 - 검색 엔진이 사이트 구조를 이해할 수 있도록
- `robots.ts` 생성 - 검색 엔진 크롤러 가이드
- JSON-LD structured data 추가:
  - Organization 스키마 (회사 정보)
  - WebSite 스키마 (사이트 정보 및 검색 기능)
- Open Graph 및 Twitter Card 메타데이터 강화

### 3. 메타데이터 강화
- keywords 배열에 한글 검색어 대량 추가
- canonical URL 설정
- hreflang 태그 (다국어 지원)
- 검색 엔진 검증 코드 지원

## 📋 추가로 필요한 작업

### 아이콘 파일 생성 필요

구글 검색 결과에 아이콘이 표시되려면 다음 파일들이 `public/` 폴더에 필요합니다:

#### 필수 아이콘 파일:
1. **`/public/favicon.ico`** ✅ (이미 존재)
   - 16x16, 32x32, 48x48 크기를 포함하는 멀티 사이즈 ICO 파일
   - 브라우저 탭에 표시되는 기본 아이콘

2. **`/public/icon-16x16.png`** ❌ (생성 필요)
   - 16x16 픽셀 PNG 파일

3. **`/public/icon-32x32.png`** ❌ (생성 필요)
   - 32x32 픽셀 PNG 파일

4. **`/public/icon-192x192.png`** ❌ (생성 필요)
   - 192x192 픽셀 PNG 파일 (안드로이드 홈 화면용)

5. **`/public/icon-512x512.png`** ❌ (생성 필요)
   - 512x512 픽셀 PNG 파일 (안드로이드 홈 화면용)

6. **`/public/apple-touch-icon.png`** ❌ (생성 필요)
   - 180x180 픽셀 PNG 파일
   - iOS Safari 홈 화면에 추가할 때 사용

7. **`/public/safari-pinned-tab.svg`** ❌ (생성 필요, 선택사항)
   - SVG 파일
   - Safari 고정 탭 아이콘 (단색)

#### 아이콘 생성 방법:

1. **원본 로고 파일 준비**
   - 고해상도 로고 이미지 (최소 512x512 이상)
   - 투명 배경 PNG 또는 SVG 권장

2. **온라인 도구 사용** (추천):
   - https://realfavicongenerator.net/
   - https://favicon.io/
   - https://www.favicon-generator.org/
   
   이 도구들에 원본 이미지를 업로드하면 모든 크기의 아이콘을 자동 생성해줍니다.

3. **수동 생성**:
   - Photoshop, Figma, GIMP 등 이미지 편집 도구 사용
   - 각 크기별로 리사이즈하여 저장

#### 아이콘 디자인 가이드라인:
- **단순하고 명확한 디자인**: 작은 크기에서도 알아볼 수 있어야 함
- **높은 대비**: 배경과 명확히 구분되는 색상 사용
- **브랜드 일관성**: Talkgate 로고와 일치하는 디자인
- **투명 배경**: 가능하면 투명 배경 사용 (일부 브라우저는 색상 배경 추가)

### Open Graph 이미지 생성 필요

소셜 미디어 공유 시 표시되는 이미지:

1. **`/public/images/og-image.png`** ❌ (생성 필요)
   - 크기: 1200x630 픽셀 (권장)
   - 형식: PNG 또는 JPG
   - 내용: Talkgate 로고 + 브랜드 메시지
   - 파일 크기: 1MB 이하 권장

#### OG 이미지 디자인 가이드라인:
- **가독성**: 텍스트가 작은 크기에서도 읽을 수 있어야 함
- **브랜드**: Talkgate 로고와 브랜드 색상 사용
- **메시지**: "All your business workflows in one place" 또는 "톡게이트" 포함
- **비율**: 1.91:1 (1200x630) 유지

### 추가 SEO 설정

#### Google Search Console 설정:
1. https://search.google.com/search-console 접속
2. 사이트 등록 (https://talkgate.im)
3. 사이트맵 제출: `https://talkgate.im/sitemap.xml`
4. Google 사이트 검증 코드를 환경 변수에 추가:
   ```
   NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=your_verification_code
   ```

#### Google Analytics 설정 (선택사항):
- 이미 `lib/env.ts`에 `GA_ID` 설정이 있음
- 환경 변수에 추가: `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`

## 🔍 검색 결과 아이콘 표시 확인 방법

1. **Google Search Console에서 확인**
   - 검색 성능 > 검색 결과 향상 > 아이콘
   - 아이콘이 제대로 인덱싱되었는지 확인

2. **직접 테스트**
   - 구글에서 "site:talkgate.im" 검색
   - 검색 결과에 아이콘이 표시되는지 확인
   - 아이콘 표시까지 보통 1-2주 소요

3. **Rich Results Test**
   - https://search.google.com/test/rich-results
   - URL 입력하여 structured data 확인

## 📝 한글 검색어 최적화 확인

다음 검색어로 검색했을 때 노출되는지 확인:
- "톡게이트"
- "토크게이트"
- "톡게이트 CRM"
- "톡게이트 상담"
- "토크게이트 고객관리"

검색 결과 개선까지 보통 2-4주 소요됩니다.

## 🎯 추가 권장사항

1. **콘텐츠에 자연스럽게 한글 검색어 포함**
   - 페이지 본문에 "톡게이트", "토크게이트" 자연스럽게 사용
   - 현재 HeroSection의 description에 이미 포함되어 있음

2. **블로그/뉴스 섹션 추가** (장기적 SEO)
   - "톡게이트 사용법", "톡게이트 리뷰" 등 키워드 타겟팅 콘텐츠

3. **백링크 구축**
   - 관련 사이트에 링크 획득
   - 소셜 미디어 프로필에 링크 추가

4. **페이지 속도 최적화**
   - 이미지 최적화
   - 코드 스플리팅
   - CDN 사용

## 📚 참고 자료

- [Google Search Central](https://developers.google.com/search)
- [Schema.org Documentation](https://schema.org/)
- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [Open Graph Protocol](https://ogp.me/)
