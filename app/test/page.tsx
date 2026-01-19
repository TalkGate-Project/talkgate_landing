import { redirect } from "next/navigation";
import TestContent from "./TestContent";

export default function TestPage() {
  // 프로덕션 환경에서는 홈으로 리다이렉트
  if (process.env.NODE_ENV === "production") {
    redirect("/");
  }

  return <TestContent />;
}
