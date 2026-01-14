/**
 * 에러/성공/정보 모달 이벤트 시스템
 * 전역적으로 모달을 표시/숨기기 위한 pub-sub 패턴 구현
 */

export type FeedbackModalType = "error" | "success" | "info";

export type ErrorModalCallbacks = {
  type?: FeedbackModalType;
  title?: string;
  headline?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string | null;
  hideCancel?: boolean;
  persistent?: boolean;
  hideCloseButton?: boolean;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
};

type ErrorModalEvent =
  | { type: "show"; payload: ErrorModalCallbacks }
  | { type: "hide" };

type Listener = (event: ErrorModalEvent) => void;

const listeners = new Set<Listener>();

export function subscribeErrorModal(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showErrorModal(options?: ErrorModalCallbacks): void {
  const event: ErrorModalEvent = { type: "show", payload: options || {} };
  listeners.forEach((listener) => listener(event));
}

export function hideErrorModal(): void {
  const event: ErrorModalEvent = { type: "hide" };
  listeners.forEach((listener) => listener(event));
}
