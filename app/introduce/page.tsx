import type { Metadata } from "next";
import { PAGE_METADATA } from "@/lib/constants";
import type { TimelineItem } from "@/types";
import { IntroduceView } from "@/modules/introduce";

export const metadata: Metadata = {
  title: PAGE_METADATA.introduce.title,
  description: PAGE_METADATA.introduce.description,
};

/**
 * 회사 스토리 타임라인 데이터
 */
const STORY_ITEMS: TimelineItem[] = [
  {
    date: "2025.11.01",
    title: "고객 관계(CRM) 트렌드 선도, Talkgate이 이끄는 차세대 CX 솔루션",
  },
  {
    date: "2025.11.01",
    title: "AI 챗봇, Talkgate AI 상담 도우미로 효율 극대화",
  },
];

/**
 * 회사 소개 페이지
 * 서버 컴포넌트로 메타데이터와 데이터를 관리하고,
 * 뷰는 클라이언트 컴포넌트로 분리
 */
export default function IntroducePage() {
  return <IntroduceView storyItems={STORY_ITEMS} />;
}
