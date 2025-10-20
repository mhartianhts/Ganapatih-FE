const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type FetchOptions = RequestInit & { parse?: "json" | "text" | "blob" | "arrayBuffer" };

const defaultHeaders = {
  "Content-Type": "application/json",
};

async function handleResponse<T>(response: Response, parse: FetchOptions["parse"]): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";
  const shouldParseJson = parse === "json" || (parse === undefined && contentType.includes("application/json"));

  let data: unknown = null;

  if (shouldParseJson) {
    data = await response.json().catch(() => null);
  } else if (parse === "text") {
    data = await response.text();
  } else if (parse === "blob") {
    data = await response.blob();
  } else if (parse === "arrayBuffer") {
    data = await response.arrayBuffer();
  }

  if (!response.ok) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message?: unknown }).message)
        : response.statusText || "Permintaan API gagal";

    throw new ApiError(message, response.status, data);
  }

  return data as T;
}

async function rawFetch(
  path: string,
  options: FetchOptions = {}
) {
  const { headers, ...rest } = options;

  if (!baseUrl) {
    throw new Error(
      "NEXT_PUBLIC_API_BASE_URL belum diatur. Tambahkan variabel ini di file .env lokal Anda."
    );
  }

  return fetch(`${baseUrl}${path}`, {
    ...rest,
    headers: {
      ...defaultHeaders,
      ...headers,
    },
  });
}

export async function apiFetch<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { parse, ...rest } = options;
  const response = await rawFetch(path, rest);

  return handleResponse<T>(response, parse);
}

type RefreshTokensResult = {
  token: string;
  refreshToken: string;
};

let isRefreshing = false;
let refreshPromise: Promise<RefreshTokensResult> | null = null;

async function refreshTokens(refreshToken: string): Promise<RefreshTokensResult> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = apiFetch<RefreshTokensResult>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  }).finally(() => {
    isRefreshing = false;
    refreshPromise = null;
  });

  return refreshPromise;
}

export type TokenProvider = {
  getToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: RefreshTokensResult) => void;
  clear: () => void;
};

let tokenProvider: TokenProvider | null = null;

export function registerTokenProvider(provider: TokenProvider) {
  tokenProvider = provider;
}

async function withAuthHeaders(
  path: string,
  token: string,
  options: FetchOptions = {}
) {
  return rawFetch(path, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}

export async function apiFetchAuthorized<T = unknown>(
  path: string,
  token: string,
  options: FetchOptions = {}
): Promise<T> {
  const { parse, ...rest } = options;

  const response = await withAuthHeaders(path, token, rest);

  if (response.status !== 401) {
    return handleResponse<T>(response, parse);
  }

  if (!tokenProvider) {
    throw new ApiError("Sesi kedaluwarsa. Silakan login kembali.", 401);
  }

  const storedRefresh = tokenProvider.getRefreshToken();
  if (!storedRefresh) {
    tokenProvider.clear();
    throw new ApiError("Sesi kedaluwarsa. Silakan login kembali.", 401);
  }

  try {
    const newTokens = await refreshTokens(storedRefresh);
    tokenProvider.setTokens(newTokens);

    const retryResponse = await withAuthHeaders(path, newTokens.token, rest);
    if (retryResponse.status === 401) {
      tokenProvider.clear();
      throw new ApiError("Sesi kedaluwarsa. Silakan login kembali.", 401);
    }

    return handleResponse<T>(retryResponse, parse);
  } catch (err) {
    tokenProvider.clear();
    if (err instanceof ApiError) {
      throw err;
    }

    throw new ApiError(
      err instanceof Error ? err.message : "Gagal memperbarui sesi. Silakan login kembali.",
      401
    );
  }
}

