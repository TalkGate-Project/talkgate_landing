import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const API_BASE_URL = env.API_BASE_URL;

function getAllowedLogDetails(params: {
  path: string;
  method: string;
  projectId: string | null;
  hasAuth: boolean;
  queryKeys?: string[];
  status?: number;
  ok?: boolean;
  error?: string;
}): Record<string, unknown> {
  return {
    path: params.path,
    method: params.method,
    hasAuth: params.hasAuth,
    hasProjectId: Boolean(params.projectId),
    ...(params.queryKeys ? { queryKeys: params.queryKeys } : {}),
    ...(typeof params.status === "number" ? { status: params.status } : {}),
    ...(typeof params.ok === "boolean" ? { ok: params.ok } : {}),
    ...(params.error ? { error: params.error } : {}),
  };
}

// 서버 사이드 로깅 함수
function serverLog(level: "info" | "error" | "warn", message: string, data?: unknown) {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [PROXY] [${level.toUpperCase()}]`;
  
  if (data) {
    console[level](`${prefix} ${message}`, JSON.stringify(data, null, 2));
  } else {
    console[level](`${prefix} ${message}`);
  }
}

async function handleProxy(req: NextRequest, pathSegments: string[]) {
  const path = "/" + pathSegments.join("/");
  // 쿼리 파라미터 전달
  const searchParams = req.nextUrl.searchParams.toString();
  const queryKeys = Array.from(req.nextUrl.searchParams.keys());
  const queryString = searchParams ? `?${searchParams}` : "";
  const url = `${API_BASE_URL}${path}${queryString}`;
  const method = req.method;
  
  // 쿠키에서 액세스 토큰 가져오기
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("tg_access_token")?.value;
  
  // 요청 헤더 구성
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };
  
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  
  // x-project-id 헤더 전달
  const projectId = req.headers.get("x-project-id");
  if (projectId) {
    headers["x-project-id"] = projectId;
  }
  
  // 요청 바디 처리
  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    try {
      const text = await req.text();
      if (text) {
        body = text;
      }
    } catch {
      // 바디가 없거나 읽기 실패
    }
  }
  
  // 빌링 관련 요청 로깅 (서버 사이드에서만)
  const isBillingRequest = path.includes("/billing");
  const isSubscriptionRequest = path.includes("/subscriptions");
  
  if (isBillingRequest || isSubscriptionRequest) {
    serverLog(
      "info",
      `API Request: ${method} ${path}${queryString}`,
      getAllowedLogDetails({
        path,
        method,
        projectId,
        hasAuth: !!accessToken,
        queryKeys,
      })
    );
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    
    const responseText = await response.text();
    
    // 빌링/구독 관련 응답 로깅
    if (isBillingRequest || isSubscriptionRequest) {
      serverLog(
        response.ok ? "info" : "error",
        `API Response: ${method} ${path} - ${response.status}`,
        getAllowedLogDetails({
          path,
          method,
          projectId,
          hasAuth: !!accessToken,
          status: response.status,
          ok: response.ok,
        })
      );
    }
    
    // 응답 헤더 복사 (일부만)
    const responseHeaders = new Headers();
    responseHeaders.set("Content-Type", response.headers.get("Content-Type") || "application/json");
    
    return new NextResponse(responseText, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    serverLog(
      "error",
      `API Request Failed: ${method} ${path}`,
      getAllowedLogDetails({
        path,
        method,
        projectId,
        hasAuth: !!accessToken,
        error: error instanceof Error ? error.message : String(error),
      })
    );
    
    return NextResponse.json(
      {
        result: false,
        code: "PROXY_ERROR",
        message: "API 요청 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return handleProxy(req, path);
}
