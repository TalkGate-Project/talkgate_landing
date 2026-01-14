import { apiClient } from "@/lib/apiClient";
import type {
  PresignedUrlInput,
  PresignedUrlResponse,
} from "@/types/asset";

export const AssetsService = {
  /**
   * 프로젝트 로고 업로드용 Presigned URL 발급
   */
  presignProjectLogo(input: PresignedUrlInput) {
    return apiClient.post<PresignedUrlResponse>(
      "/v1/asset/project-logo/presigned-url",
      input
    );
  },

  /**
   * 프로필 이미지 업로드용 Presigned URL 발급
   */
  presignProfileImage(input: PresignedUrlInput) {
    return apiClient.post<PresignedUrlResponse>(
      "/v1/asset/profile-image/presigned-url",
      input
    );
  },

  /**
   * S3에 직접 업로드
   * @param uploadUrl Presigned URL
   * @param file 업로드할 파일
   * @param fileType MIME type (Presigned URL 발급 시 사용한 값과 동일해야 함)
   */
  async uploadToS3(uploadUrl: string, file: File, fileType: string): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": fileType,
      },
      credentials: "omit", // CORS 요청
    });

    if (!response.ok) {
      throw new Error(`S3 upload failed: ${response.status}`);
    }
  },
};

// Re-export types for convenience
export type {
  PresignedUrlInput,
  PresignedUrlData,
  PresignedUrlResponse,
} from "@/types/asset";
