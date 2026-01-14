import { apiClient } from "@/lib/apiClient";
import type {
  SubscriptionStartInput,
  SubscriptionStartResponse,
  SubscriptionGetResponse,
  AdminProjectsSubscriptionResponse,
  PaymentHistoryResponse,
  PlanChangeInput,
  PlanChangeResponse,
  PlanEstimateInput,
  PlanEstimateResponse,
  SubscriptionPlansResponse,
  SubscriptionReactivateResponse,
} from "@/types/subscription";

export const SubscriptionService = {
  /**
   * 구독 시작 (Admin만 가능)
   * 빌링키가 등록된 상태에서 구독을 시작합니다. 첫 결제를 즉시 수행합니다.
   * 프로젝트 Admin 권한이 필요합니다.
   */
  start(input: SubscriptionStartInput) {
    return apiClient.post<SubscriptionStartResponse>("/v1/subscriptions", input);
  },

  /**
   * 구독 취소 (자동 갱신 중지, Admin만 가능)
   * 즉시 비활성화되지 않고, 만료일까지 계속 사용 가능합니다.
   * 자동 갱신만 중지됩니다.
   */
  cancel(projectId: string | number) {
    return apiClient.delete<void>("/v1/subscriptions", {
      headers: { "x-project-id": String(projectId) },
    });
  },

  /**
   * 프로젝트 구독 정보 조회
   */
  get(projectId: string | number) {
    return apiClient.get<SubscriptionGetResponse>("/v1/subscriptions", {
      headers: { "x-project-id": String(projectId) },
    });
  },

  /**
   * Admin 프로젝트 구독 정보 조회
   * 사용자가 Admin인 모든 프로젝트의 구독 정보를 조회합니다.
   * 각 프로젝트의 멤버 수, AI/SMS 사용량, 구독 정보 등을 포함합니다.
   */
  getAdminProjects() {
    return apiClient.get<AdminProjectsSubscriptionResponse>("/v1/subscriptions/admin/projects");
  },

  /**
   * 결제 이력 조회
   */
  getPayments(projectId: string | number) {
    return apiClient.get<PaymentHistoryResponse>("/v1/subscriptions/payments", {
      headers: { "x-project-id": String(projectId) },
    });
  },

  /**
   * 플랜 변경
   * 업그레이드는 즉시 적용되며 일할 계산된 추가 비용이 청구됩니다.
   * 다운그레이드는 다음 갱신일에 적용되며 즉시 과금은 발생하지 않습니다.
   */
  changePlan(projectId: string | number, input: PlanChangeInput) {
    return apiClient.post<PlanChangeResponse>("/v1/subscriptions/plan/change", input, {
      headers: { "x-project-id": String(projectId) },
    });
  },

  /**
   * 플랜 변경 비용 계산
   * 플랜 변경 시 추가로 지불해야 할 금액을 계산합니다.
   * 업그레이드는 즉시 적용되며 일할 계산된 추가 비용이 발생하고,
   * 다운그레이드는 다음 갱신일에 적용됩니다.
   */
  estimatePlanChange(projectId: string | number, input: PlanEstimateInput) {
    return apiClient.post<PlanEstimateResponse>("/v1/subscriptions/plan/estimate", input, {
      headers: { "x-project-id": String(projectId) },
    });
  },

  /**
   * 모든 구독 플랜 조회
   */
  getPlans() {
    return apiClient.get<SubscriptionPlansResponse>("/v1/subscriptions/plans");
  },

  /**
   * 구독 재활성화 (자동 갱신 재시작, Admin만 가능)
   * 취소한 구독을 다시 활성화하여 만료일 이후 자동 갱신되도록 합니다.
   * 사용자의 등록된 빌링키를 자동으로 연결합니다.
   */
  reactivate(projectId: string | number) {
    return apiClient.post<SubscriptionReactivateResponse>("/v1/subscriptions/reactivate", undefined, {
      headers: { "x-project-id": String(projectId) },
    });
  },
};

// Re-export types for convenience
export type {
  SubscriptionBillingCycle,
  SubscriptionStatus,
  PaymentType,
  PaymentStatus,
  SubscriptionPlan,
  Subscription,
  Payment,
  SubscriptionStartInput,
  SubscriptionStartResponse,
  SubscriptionGetResponse,
  AdminProjectSubscription,
  AdminProjectsSubscriptionResponse,
  PaymentHistoryResponse,
  PlanChangeInput,
  PlanChangeResponse,
  PlanEstimateInput,
  PlanEstimateResponse,
  SubscriptionPlansResponse,
  SubscriptionReactivateResponse,
} from "@/types/subscription";
