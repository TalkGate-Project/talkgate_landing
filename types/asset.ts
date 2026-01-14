/**
 * Asset API 타입 정의
 */

/**
 * Presigned URL 요청 입력
 */
export interface PresignedUrlInput {
  fileName: string;
  fileType: string; // MIME type (예: "image/png", "image/jpeg")
}

/**
 * Presigned URL 응답 데이터
 */
export interface PresignedUrlData {
  uploadUrl: string; // S3 업로드용 Presigned URL
  fileUrl: string; // 업로드 후 접근 가능한 URL (API에 전달)
  fileName?: string;
}

/**
 * Presigned URL 응답
 */
export interface PresignedUrlResponse {
  result: true;
  data: PresignedUrlData;
}
