# 🔧 환경 변수 설정 가이드

## 📋 개요

랜딩 페이지와 메인 서비스 간의 올바른 통신을 위한 환경 변수 설정 방법을 안내합니다.

---

## 🌍 도메인 구조

### 메인 서비스 도메인
```
개발 환경: https://app-dev.talkgate.im
프로덕션: https://app.talkgate.im
```

### 랜딩 페이지 도메인
```
개발 환경: http://localhost:3000
프로덕션: https://landing.talkgate.im
```

### 쿠키 도메인
```
개발 환경: (비워둠 - localhost 사용)
프로덕션: .talkgate.im (서브도메인 간 공유)
```

---

## 💻 로컬 개발 환경 설정

### 1. `.env.local` 파일 생성

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
# 메인 서비스 URL
NEXT_PUBLIC_MAIN_SERVICE_URL=https://app-dev.talkgate.im

# 현재 랜딩 페이지 URL
NEXT_PUBLIC_LANDING_URL=https://talkgate.im

# 쿠키 도메인 (개발 환경에서는 비워둠)
NEXT_PUBLIC_COOKIE_DOMAIN=

# 선택적 설정
NEXT_PUBLIC_API_TIMEOUT_MS=10000
NEXT_PUBLIC_ENABLE_TRIAL=false
```

### 2. 확인

```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
# http://localhost:3000

# Login 버튼 클릭 시 다음 URL로 이동하는지 확인:
# https://app-dev.talkgate.im/login?returnUrl=http://localhost:3000
```

---

## 🚀 Vercel 프로덕션 환경 설정

### 1. Vercel 대시보드 접속

1. https://vercel.com/dashboard 접속
2. 랜딩 페이지 프로젝트 선택
3. **Settings** → **Environment Variables** 클릭

### 2. 환경 변수 추가

#### Production 환경

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `NEXT_PUBLIC_MAIN_SERVICE_URL` | `https://app.talkgate.im` | Production |
| `NEXT_PUBLIC_LANDING_URL` | `https://landing.talkgate.im` | Production |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | `.talkgate.im` | Production |

#### Preview 환경 (선택)

| 변수명 | 값 | 환경 |
|--------|-----|------|
| `NEXT_PUBLIC_MAIN_SERVICE_URL` | `https://app-dev.talkgate.im` | Preview |
| `NEXT_PUBLIC_LANDING_URL` | `https://landing-dev.talkgate.im` | Preview |
| `NEXT_PUBLIC_COOKIE_DOMAIN` | `.talkgate.im` | Preview |

### 3. 재배포

환경 변수 추가 후 자동으로 재배포되거나, 수동으로 재배포를 트리거하세요.

---

## ✅ 확인 방법

### 로컬 환경 확인

```bash
# 1. 개발 서버 시작
npm run dev

# 2. 브라우저 콘솔에서 확인 (F12)
console.log('Main Service URL:', 'https://app-dev.talkgate.im');

# 3. Login 버튼의 href 확인
document.querySelector('a[href*="login"]')?.getAttribute('href');
// 예상: https://app-dev.talkgate.im/login?returnUrl=http://localhost:3000
```

### 프로덕션 환경 확인

```bash
# 브라우저 콘솔에서 확인 (F12)
# https://landing.talkgate.im

console.log('Main Service URL:', 'https://app.talkgate.im');

# Login 버튼의 href 확인
document.querySelector('a[href*="login"]')?.getAttribute('href');
// 예상: https://app.talkgate.im/login?returnUrl=https://landing.talkgate.im
```

---

## 🔍 환경별 동작 확인

### 개발 환경 (localhost)

```
1. Login 버튼 클릭
   ↓
2. https://app-dev.talkgate.im/login?returnUrl=http://localhost:3000
   ↓
3. 로그인 완료
   ↓
4. http://localhost:3000 으로 복귀
```

### 프로덕션 환경

```
1. Login 버튼 클릭
   ↓
2. https://app.talkgate.im/login?returnUrl=https://landing.talkgate.im
   ↓
3. 로그인 완료 + 쿠키 설정 (Domain: .talkgate.im)
   ↓
4. https://landing.talkgate.im 으로 복귀
   ↓
5. 쿠키 공유로 로그인 상태 유지
```

---

## 🚨 문제 해결

### 문제 1: Login 버튼이 잘못된 URL로 이동

**증상**: 
- Login 버튼 클릭 시 `https://my-service.im/login`으로 이동

**원인**: 
- 환경 변수가 설정되지 않아 기본값 사용

**해결**:
```bash
# .env.local 파일 확인
cat .env.local

# NEXT_PUBLIC_MAIN_SERVICE_URL이 올바르게 설정되어 있는지 확인
# 설정 후 개발 서버 재시작
npm run dev
```

### 문제 2: Vercel 배포 후에도 기본값 사용

**증상**:
- 프로덕션에서도 `https://my-service.im` 사용

**원인**:
- Vercel 환경 변수가 설정되지 않음

**해결**:
1. Vercel 대시보드 → Settings → Environment Variables
2. `NEXT_PUBLIC_MAIN_SERVICE_URL` 추가
3. 재배포

### 문제 3: 환경 변수가 적용되지 않음

**확인 사항**:
- 환경 변수 이름이 `NEXT_PUBLIC_`으로 시작하는지 확인
- 환경 변수 설정 후 서버를 재시작했는지 확인
- Vercel의 경우 재배포했는지 확인

---

## 📝 체크리스트

### 로컬 개발 시작 전

- [ ] `.env.local` 파일 생성
- [ ] `NEXT_PUBLIC_MAIN_SERVICE_URL=https://app-dev.talkgate.im` 설정
- [ ] `NEXT_PUBLIC_LANDING_URL=https://talkgate.im` 설정
- [ ] `npm run dev` 실행
- [ ] Login 버튼 URL 확인

### Vercel 배포 전

- [ ] Vercel 환경 변수 설정 완료
- [ ] Production: `https://app.talkgate.im`
- [ ] Preview: `https://app-dev.talkgate.im` (선택)
- [ ] `NEXT_PUBLIC_COOKIE_DOMAIN=.talkgate.im` 설정

### 배포 후 확인

- [ ] Login 버튼 URL 확인
- [ ] 로그인 플로우 테스트
- [ ] 쿠키 도메인 확인 (F12 → Application → Cookies)

---

## 🎯 요약

**핵심 포인트**:
1. **개발**: `app-dev.talkgate.im` 사용
2. **프로덕션**: `app.talkgate.im` 사용
3. **쿠키 도메인**: `.talkgate.im` (앞에 점 필수!)

**참고 문서**:
- [README.md](./README.md) - 전체 개요
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - 배포 체크리스트
