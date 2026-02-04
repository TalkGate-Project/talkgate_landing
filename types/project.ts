/**
 * Project API 타입 정의
 */

/**
 * 프로젝트 정보
 */
export interface ProjectInfo {
  id: number;
  name: string;
  subDomain?: string;
  logoUrl?: string;
  useAttendanceMenu: boolean;
  /** 데이터 제공자 여부. true면 데이터 제공자, false면 일반 프로젝트 */
  isDataProvider?: boolean;
  createdAt: string;
  updatedAt: string;
  memberCount: number;
  assignedCustomerCount: number;
  todayScheduleCount: number;
  hasActiveSubscription: boolean;
}

/**
 * 프로젝트 생성 요청
 */
export interface ProjectCreateInput {
  name: string;
  subDomain?: string;
  logoUrl?: string;
  useAttendanceMenu?: boolean;
}

/**
 * 프로젝트 생성 응답
 */
export interface ProjectCreateResponse {
  result: true;
  data: {
    id: number;
    name: string;
    subDomain?: string;
    logoUrl?: string;
    useAttendanceMenu: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * 프로젝트 목록 조회 응답
 */
export interface ProjectListResponse {
  result: true;
  data: ProjectInfo[];
}

/**
 * 서브도메인 중복 확인 응답
 */
export interface CheckSubDomainDuplicateResponse {
  result: true;
  data: {
    isDuplicate: boolean;
    message: string;
  };
}
