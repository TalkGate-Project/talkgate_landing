# 🚀 배포 전 최종 체크리스트

이 문서는 랜딩 페이지를 배포하기 전에 확인해야 할 모든 항목을 정리합니다.

---

## ✅ 1. 코드 레벨 체크리스트

### 1.1 쿠키 설정
- [x] 쿠키 이름: `tg_access_token`, `tg_refresh_token` (메인 서비스와 동일)
- [x] 쿠키 검증: 빈 값, 'undefined', 'null' 체크 추가
- [x] COOKIE_OPTIONS: sameSite 설정 개선 (프로덕션: 'none', 개발: 'lax')

### 1.2 인증 플로우
- [x] `getLoginUrl()`: returnUrl 파라미터 포함
- [x] `getLogoutUrl()`: returnUrl 파라미터 포함
- [x] `getStartUrl()`: 인증 상태에 따른 분기
- [x] 서버 컴포넌트: `checkAuthFromCookies()` 사용
- [x] 클라이언트 컴포넌트: `useAuth()` 훅 사용

### 1.3 UI 컴포넌트
- [x] Header: 로그인/로그아웃 상태에 따른 버튼 변경
- [x] Pricing: 인증 확인 후 구독 플로우 진행
- [x] Hydration 오류 방지: useState(null) 초기값 사용

### 1.4 CORS 설정
- [x] `next.config.ts`: API 라우트에 CORS 헤더 추가
- [x] Access-Control-Allow-Credentials: true
- [x] Access-Control-Allow-Origin: 메인 서비스 URL

---

## ⚙️ 2. 환경 변수 체크리스트

### 2.1 Vercel 환경 변수 설정 (랜딩 페이지)

**Production 환경:**
```env
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app.talkgate.im
NEXT_PUBLIC_LANDING_URL=https://landing.talkgate.im
NEXT_PUBLIC_COOKIE_DOMAIN=.talkgate.im
```

**Preview/Dev 환경 (선택):**
```env
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app-dev.talkgate.im
NEXT_PUBLIC_LANDING_URL=https://landing-dev.talkgate.im
NEXT_PUBLIC_COOKIE_DOMAIN=
```

### 2.2 메인 서비스 환경 변수 확인

**확인 필요:**
- [ ] `NEXT_PUBLIC_COOKIE_DOMAIN=.talkgate.im` 설정되어 있는지
- [ ] 로그인/로그아웃 후 `returnUrl` 리다이렉트 구현되어 있는지
- [ ] 쿠키 설정 시 `Domain=.talkgate.im` 사용하는지

---

## 🌐 3. DNS 및 도메인 체크리스트

### 3.1 DNS 레코드 확인
- [ ] `landing.talkgate.im` CNAME → Vercel
- [ ] SSL/TLS 인증서 자동 발급 활성화
- [ ] HTTPS 강제 리다이렉트 활성화

### 3.2 Vercel 도메인 연결
- [ ] Vercel 프로젝트에서 `landing.talkgate.im` 도메인 추가
- [ ] 도메인 상태: Active 확인
- [ ] HTTPS 인증서: Valid 확인

---

## 🧪 4. 배포 전 로컬 빌드 테스트

### 4.1 빌드 테스트
```bash
# 1. 프로덕션 빌드
npm run build

# 2. 빌드 성공 확인
# ✅ "Compiled successfully" 메시지 확인
# ❌ 타입 에러, 린트 에러 없는지 확인

# 3. 프로덕션 모드 실행
npm run start

# 4. 브라우저에서 확인
# http://localhost:3000
```

### 4.2 빌드 시 확인 사항
- [ ] 타입 에러 없음
- [ ] 린트 에러 없음
- [ ] 빌드 경고 최소화
- [ ] 페이지 라우팅 정상
- [ ] 이미지 최적화 정상

---

## 📋 5. 배포 후 즉시 테스트

### 5.1 기본 페이지 확인
```
✅ https://landing.talkgate.im
✅ https://landing.talkgate.im/pricing
✅ https://landing.talkgate.im/case
✅ https://landing.talkgate.im/introduce
```

### 5.2 환경 변수 확인
**브라우저 콘솔에서 실행:**
```javascript
// 개발자 도구 → Console
console.log('Main Service URL:', window.location.protocol + '//' + 'talkgate.im');
console.log('Current URL:', window.location.href);

// Header에서 Login 버튼 클릭 시 이동하는 URL 확인
document.querySelector('a[href*="login"]')?.getAttribute('href');
// 예상: https://app.talkgate.im/login?returnUrl=https://landing.talkgate.im
```

### 5.3 쿠키 도메인 확인
1. 메인 서비스(`talkgate.im`)에서 로그인
2. 개발자 도구 → Application → Cookies → `https://talkgate.im`
3. `tg_access_token` 쿠키의 Domain 속성 확인
   ```
   ✅ Domain: .talkgate.im (점으로 시작!)
   ❌ Domain: talkgate.im (점 없음 - 문제!)
   ```

---

## 🧪 6. 통합 테스트 (배포 테스트 가이드 참고)

배포 후 반드시 다음 테스트를 수행하세요:

### 6.1 로그인 플로우 테스트
- [ ] **테스트 1**: 기본 로그인 플로우 (가이드 참고)
- [ ] **테스트 2**: Pricing 플로우 - 로그아웃 상태
- [ ] **테스트 3**: Pricing 플로우 - 로그인 상태
- [ ] **테스트 4**: 소셜 로그인 (Google, Kakao, Naver)
- [ ] **테스트 5**: 로그아웃 후 쿠키 삭제 확인

### 6.2 크로스 도메인 동기화 테스트
```
1. landing.talkgate.im에서 로그인
   → Header: "대시보드" + "Logout" 버튼 ✅

2. 새 탭에서 talkgate.im 접속
   → 로그인 상태 유지 확인 ✅

3. talkgate.im에서 로그아웃
   → 쿠키 삭제 확인 ✅

4. landing.talkgate.im 탭으로 돌아가서 새로고침
   → Header: "Login" + "시작하기" 버튼 ✅
```

---

## 🚨 7. 문제 발생 시 체크포인트

### 7.1 쿠키가 공유되지 않을 때

**단계별 디버깅:**

1. **메인 서비스에서 쿠키 확인**
   ```
   Application → Cookies → https://talkgate.im
   - tg_access_token이 있는지? ✓/✗
   - Domain이 ".talkgate.im"인지? ✓/✗
   - SameSite가 "None"인지? ✓/✗
   - Secure가 체크되어 있는지? ✓/✗
   ```

2. **랜딩 페이지에서 쿠키 확인**
   ```
   Application → Cookies → https://landing.talkgate.im
   - 동일한 쿠키가 보이는지? ✓/✗
   ```

3. **Network 탭 확인**
   ```
   메인 서비스 로그인 API 요청 → Headers 탭
   Response Headers에서:
   Set-Cookie: tg_access_token=...; Domain=.talkgate.im; ...
   ```

### 7.2 CORS 에러가 발생할 때

**에러 메시지:**
```
Access to fetch at '...' from origin '...' has been blocked by CORS policy
```

**해결 방법:**
1. `next.config.ts`의 headers() 함수 확인
2. Vercel에서 재배포
3. Response Headers에 다음이 있는지 확인:
   ```
   Access-Control-Allow-Origin: https://landing.talkgate.im
   Access-Control-Allow-Credentials: true
   ```

### 7.3 리다이렉션이 안 될 때

**확인 사항:**
1. URL에 `returnUrl` 파라미터가 있는지
2. 메인 서비스에서 `returnUrl` 처리 로직 구현되어 있는지
3. 콘솔 로그 확인:
   ```
   [LoginPage] ✅ 로그인 성공 + 리디렉션 URL 있음 → ...
   ```

---

## 📊 8. 성능 체크리스트

### 8.1 Lighthouse 점수 확인
```bash
# Chrome DevTools → Lighthouse
- Performance: 90+ 목표
- Accessibility: 90+ 목표
- Best Practices: 90+ 목표
- SEO: 90+ 목표
```

### 8.2 Core Web Vitals
```
✅ LCP (Largest Contentful Paint): < 2.5s
✅ FID (First Input Delay): < 100ms
✅ CLS (Cumulative Layout Shift): < 0.1
```

---

## 🎯 9. 최종 확인

배포 전 마지막으로 확인하세요:

- [ ] 모든 환경 변수 설정 완료
- [ ] DNS 레코드 정상
- [ ] HTTPS 인증서 유효
- [ ] 로컬 빌드 테스트 통과
- [ ] 타입 에러 없음
- [ ] 린트 에러 없음
- [ ] 메인 서비스 쿠키 설정 확인
- [ ] 배포 테스트 가이드 숙지

---

## 🚀 10. 배포 실행

### 10.1 Vercel 배포
```bash
# Git에 커밋 및 푸시
git add .
git commit -m "feat: 도메인 간 로그인 상태 공유 구현"
git push origin main

# Vercel이 자동으로 배포를 시작합니다
# 배포 진행 상황: https://vercel.com/dashboard
```

### 10.2 배포 완료 후
1. Vercel 대시보드에서 배포 상태 확인
2. 배포 로그 확인 (에러 없는지)
3. 프로덕션 URL 접속: `https://landing.talkgate.im`
4. **배포 테스트 가이드**에 따라 전체 플로우 테스트

---

## 📝 11. 배포 후 모니터링

### 11.1 즉시 확인 (배포 후 30분 이내)
- [ ] 모든 페이지 정상 로딩
- [ ] 로그인/로그아웃 플로우 정상
- [ ] 쿠키 공유 정상
- [ ] CORS 에러 없음
- [ ] Console 에러 없음

### 11.2 24시간 모니터링
- [ ] Vercel Analytics 확인
- [ ] 에러 로그 확인
- [ ] 사용자 피드백 수집

---

## 🎉 완료!

모든 체크리스트를 완료했다면 배포 준비가 완료되었습니다!

**문제 발생 시**: [DEPLOYMENT_TEST_GUIDE.md](./DEPLOYMENT_TEST_GUIDE.md) 참고

**구현 상세**: [DOMAIN_AUTH_SETUP.md](./DOMAIN_AUTH_SETUP.md) 참고
