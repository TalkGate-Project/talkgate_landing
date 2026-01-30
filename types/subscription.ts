/**
 * Subscription API 타입 정의
 */

/**
 * 빌링 주기
 */
export type SubscriptionBillingCycle = "monthly" | "quarterly";

/**
 * 구독 상태
 */
export type SubscriptionStatus = "active" | "cancelled" | "expired" | "pending";

/**
 * 결제 타입
 */
export type PaymentType = "initial" | "renewal" | "upgrade" | "downgrade";

/**
 * 결제 상태
 */
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

/**
 * 구독 플랜 정보
 */
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  monthlyPrice: number;
  quarterlyPrice: number;
  aiUsageLimit: number;
  smsUsageLimit: number;
  memberCountLimit: number;
  maxMembers: number;
  maxCustomers: number;
  sortOrder: number;
}

/**
 * 구독 정보
 */
export interface Subscription {
  id: number;
  projectId: number;
  plan: SubscriptionPlan;
  billingCycle: SubscriptionBillingCycle;
  status: SubscriptionStatus;
  autoRenewal: boolean;
  startDate: string;
  endDate: string;
  pendingPlanId?: number;
  pendingPlanAppliesAt?: string;
  pendingBillingCycle?: SubscriptionBillingCycle;
  cancelledAt?: string;
  terminatedAt?: string;
  isActive: boolean;
}

/**
 * 결제 정보
 */
export interface Payment {
  id: number;
  subscriptionId: number;
  amount: number;
  planName: string;
  paymentType: PaymentType;
  status: PaymentStatus;
  method: string;
  approvedAt?: string;
  failureReason?: string;
  createdAt: string;
}

/**
 * 구독 시작 요청
 */
export interface SubscriptionStartInput {
  projectId: number;
  planId: number;
  billingCycle: SubscriptionBillingCycle;
}

/**
 * 구독 시작 응답
 */
export interface SubscriptionStartResponse {
  result: true;
  data: {
    subscription: Subscription;
    payment: Payment;
  };
}

/**
 * 구독 정보 조회 응답
 */
export interface SubscriptionGetResponse {
  result: true;
  data: Subscription;
}

/**
 * Admin 프로젝트 구독 정보
 */
export interface AdminProjectSubscription {
  projectId: number;
  projectName: string;
  currentMemberCount: number;
  currentAiUsage: number;
  currentSmsUsage: number;
  subscriptionName: string;
  subscriptionStartDate: string;
  subscriptionEndDate: string;
  billingCycle: SubscriptionBillingCycle;
  maxMembers: number;
  maxAiUsage: number;
  maxSmsUsage: number;
}

/**
 * Admin 프로젝트 구독 정보 조회 응답
 */
export interface AdminProjectsSubscriptionResponse {
  result: true;
  data: {
    projects: AdminProjectSubscription[];
  };
}

/**
 * 결제 이력 조회 응답
 */
export interface PaymentHistoryResponse {
  result: true;
  data: {
    payments: Payment[];
  };
}

/**
 * 플랜 변경 요청
 */
export interface PlanChangeInput {
  newPlanId: number;
  newBillingCycle: SubscriptionBillingCycle;
}

/**
 * 플랜 변경 응답
 */
export interface PlanChangeResponse {
  result: true;
  data: {
    subscription: Subscription;
    payment?: Payment;
    isUpgrade: boolean;
  };
}

/**
 * 플랜 변경 비용 계산 요청
 */
export interface PlanEstimateInput {
  newPlanId: number;
  newBillingCycle: SubscriptionBillingCycle;
}

/**
 * 플랜 변경 비용 계산 응답
 */
export interface PlanEstimateResponse {
  result: true;
  data: {
    currentPlanId: number;
    currentBillingCycle: SubscriptionBillingCycle;
    newPlanId: number;
    newBillingCycle: SubscriptionBillingCycle;
    currentPlanPrice: number;
    newPlanPrice: number;
    additionalCost: number;
  };
}

/**
 * 모든 구독 플랜 조회 응답
 */
export interface SubscriptionPlansResponse {
  result: true;
  data: {
    plans: SubscriptionPlan[];
  };
}

/**
 * 구독 재활성화 응답
 */
export interface SubscriptionReactivateResponse {
  result: true;
  data: Subscription;
}

/**
 * 쿠폰 적용 요청
 */
export interface CouponApplyInput {
  code: string;
}

/**
 * 쿠폰 적용 응답
 * 쿠폰 코드로 무료 구독 활성화 (Admin만 가능). 동일 프로젝트는 모든 쿠폰 통틀어 1회만 사용 가능.
 */
export interface CouponApplyResponse {
  result: true;
  data: {
    subscription: Subscription;
  };
}

/**
 * 쿠폰 정보 조회 요청
 */
export interface CouponInfoInput {
  code: string;
}

/**
 * 쿠폰 정보 조회 응답
 * 적용될 플랜 정보와 사용 가능 여부 (Admin만 가능)
 */
export interface CouponInfoResponse {
  result: true;
  data: {
    name: string;
    description: string;
    plan: SubscriptionPlan;
    billingCycle: SubscriptionBillingCycle;
    durationMonths: number;
    startDate: string;
    endDate: string;
    canUse: boolean;
    unavailableReason?: string;
  };
}

/** Checkout 단계로 전달하는 쿠폰 정보 (code + info API 응답) */
export type CouponInfoForCheckout = {
  code: string;
  info: CouponInfoResponse["data"];
};
