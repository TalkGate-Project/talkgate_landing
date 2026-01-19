import { Suspense } from "react";
import PricingContent from "./PricingContent";

export default function PricingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-[16px] text-[#808080]">불러오는 중...</div>
        </div>
      }
    >
      <PricingContent />
    </Suspense>
  );
}
