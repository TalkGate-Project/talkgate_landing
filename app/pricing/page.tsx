import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Suspense } from "react";
import PricingContent from "./PricingContent";
import { checkAuthStatus } from "@/lib/auth";
import { BRAND, PAGE_METADATA } from "@/lib/constants";
import { env } from "@/lib/env";
import type { SubscriptionPlan, SubscriptionPlansResponse } from "@/types/subscription";

export const metadata: Metadata = {
  title: PAGE_METADATA.pricing.title,
  description: PAGE_METADATA.pricing.description,
  alternates: { canonical: "/pricing" },
};

async function getPlans(): Promise<SubscriptionPlan[]> {
  try {
    const response = await fetch(`${env.API_BASE_URL}/v1/subscriptions/plans`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) return [];

    const payload = (await response.json()) as SubscriptionPlansResponse;
    return [...(payload.data?.plans ?? [])].sort((a, b) => a.sortOrder - b.sortOrder);
  } catch {
    return [];
  }
}

export default async function PricingPage() {
  const [initialPlans, cookieStore] = await Promise.all([getPlans(), cookies()]);
  const initialIsAuthenticated = await checkAuthStatus(cookieStore);

  // SaaS 구독 상품이므로 Product 대신 SoftwareApplication 사용
  const softwareSchema = initialPlans.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${BRAND.nameKo} CRM`,
    alternateName: `${BRAND.name} CRM`,
    description: PAGE_METADATA.pricing.description,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "CRM",
    operatingSystem: "Web",
    inLanguage: "ko-KR",
    url: "https://talkgate.im/pricing",
    publisher: { "@type": "Organization", name: `${BRAND.nameKo} ${BRAND.name}` },
    offers: initialPlans.map((plan) => ({
      "@type": "Offer",
      name: `${plan.name} 월 요금제`,
      price: plan.monthlyPrice,
      priceCurrency: "KRW",
      availability: "https://schema.org/InStock",
      url: "https://talkgate.im/pricing",
    })),
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: BRAND.nameKo, item: "https://talkgate.im" },
      { "@type": "ListItem", position: 2, name: "요금제", item: "https://talkgate.im/pricing" },
    ],
  };

  const pricingSchemas = softwareSchema
    ? [softwareSchema, breadcrumbSchema]
    : [breadcrumbSchema];

  return (
    <>
      {pricingSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(pricingSchemas).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <Suspense
        fallback={
          <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-[16px] text-[#808080]">불러오는 중...</div>
          </div>
        }
      >
        <PricingContent
          initialPlans={initialPlans}
          initialIsAuthenticated={initialIsAuthenticated}
        />
      </Suspense>
    </>
  );
}
