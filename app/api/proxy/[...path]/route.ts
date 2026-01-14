import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api-dev.talkgate.im";

// 민감한 정보를 마스킹하는 함수
function maskSensitiveData(data: Record<string, unknown>): Record<string, unknown> {
  const sensitiveFields = ["cardNo", "cardPw", "idNo", "cvc", "password", "token"];
  const masked: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (sensitiveFields.includes(key) && typeof value === "string") {
      // 앞 4자리만 보여주고 나머지는 마스킹
      masked[key] = value.length > 4 ? `${value.slice(0, 4)}****` : "****";
    } else if (typeof value === "object" && value !== null) {
      masked[key] = maskSensitiveData(value as Record<string, unknown>);
    } else {
      masked[key] = value;
    }
  }
  
  return masked;
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
  const url = `${API_BASE_URL}${path}`;
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
  let bodyData: Record<string, unknown> | undefined;
  
  if (method !== "GET" && method !== "HEAD") {
    try {
      const text = await req.text();
      if (text) {
        body = text;
        bodyData = JSON.parse(text);
      }
    } catch {
      // 바디가 없거나 파싱 실패
    }
  }
  
  // 빌링 관련 요청 로깅 (서버 사이드에서만)
  const isBillingRequest = path.includes("/billing");
  const isSubscriptionRequest = path.includes("/subscriptions");
  
  if (isBillingRequest || isSubscriptionRequest) {
    serverLog("info", `API Request: ${method} ${path}`, {
      url,
      method,
      hasAuth: !!accessToken,
      projectId: projectId || null,
      body: bodyData ? maskSensitiveData(bodyData) : null,
    });
  }
  
  try {
    const response = await fetch(url, {
      method,
      headers,
      body,
    });
    
    const responseText = await response.text();
    let responseData: unknown;
    
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }
    
    // 빌링/구독 관련 응답 로깅
    if (isBillingRequest || isSubscriptionRequest) {
      serverLog(
        response.ok ? "info" : "error",
        `API Response: ${method} ${path} - ${response.status}`,
        {
          status: response.status,
          ok: response.ok,
          data: responseData,
        }
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
    serverLog("error", `API Request Failed: ${method} ${path}`, {
      error: error instanceof Error ? error.message : String(error),
    });
    
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
