import { redirect } from "next/navigation";

/**
 * 이용가이드 페이지
 * 
 * [개발 노트]
 * 이 페이지는 직접 URL로 접근할 경우 메인 페이지로 리디렉션합니다.
 * 
 * 이유:
 * - 이용가이드는 외부 GitBook 문서(https://talkgate.gitbook.io/talkgate)로 제공됩니다
 * - 헤더 메뉴의 "이용가이드" 클릭 시 새 탭에서 외부 링크가 열립니다
 * - 하지만 /guide 경로로 직접 접근하는 경우를 대비해 리디렉션을 구현했습니다
 * 
 * 참고:
 * - 메뉴에서 이용가이드를 클릭하면 외부 링크가 새 탭에서 열립니다
 * - 이 페이지는 내부 라우팅을 통한 접근을 방지하기 위한 안전장치입니다
 */
export default function GuidePage() {
  redirect("/");
}
