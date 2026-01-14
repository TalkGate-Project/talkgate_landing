/**
 * 프로젝트 선택 관리 유틸리티
 */

const PROJECT_ID_KEY = "tg_selected_project_id";

/**
 * 선택된 프로젝트 ID를 반환합니다.
 */
export function getSelectedProjectId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(PROJECT_ID_KEY);
  } catch {
    return null;
  }
}

/**
 * 선택된 프로젝트 ID를 제거합니다.
 */
export function clearSelectedProjectId(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(PROJECT_ID_KEY);
  } catch {
    // Ignore errors
  }
}
