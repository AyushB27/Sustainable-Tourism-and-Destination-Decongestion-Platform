/**
 * Centralized API Client for EcoRoute Bharat
 * Resolves base URL from VITE_API_BASE_URL with fallback to http://127.0.0.1:8000
 * Provides typed, fault-tolerant helpers (apiGet, apiPost, apiPut, apiDelete)
 */

export const API_BASE_URL: string = (
  import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000'
).replace(/\/+$/, '');

export interface ApiResponse<T = any> {
  status: 'success' | 'error' | string;
  data?: T;
  message?: string;
  [key: string]: any;
}

export class ApiError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number = 500, data: any = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

/**
 * Retrieves the current auth token from stored session if available
 */
function getAuthToken(): string | null {
  try {
    const rawUser = localStorage.getItem('ecoroute_auth_user');
    if (rawUser) {
      const user = JSON.parse(rawUser);
      if (user && user.token) return user.token;
    }
  } catch {
    // Ignore storage parse errors
  }
  return null;
}

interface RequestOptions {
  headers?: Record<string, string>;
  timeoutMs?: number;
  token?: string;
}

async function request<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  body?: any,
  options: RequestOptions = {}
): Promise<T> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
    ...(body ? { 'Content-Type': 'application/json' } : {}),
    ...(options.headers || {})
  };

  const token = options.token || getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const timeoutMs = options.timeoutMs || 9000;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    let data: any = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }

    if (!response.ok) {
      const errorMsg = data?.message || data?.error || `HTTP ${response.status}: Request failed`;
      throw new ApiError(errorMsg, response.status, data);
    }

    return data as T;
  } catch (err: any) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      throw new ApiError(`Request to ${cleanEndpoint} timed out after ${timeoutMs}ms`, 408);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(err.message || 'Network connection error. Please verify backend is active.', 0);
  }
}

export async function apiGet<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, 'GET', undefined, options);
}

export async function apiPost<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, 'POST', body, options);
}

export async function apiPut<T = any>(endpoint: string, body?: any, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, 'PUT', body, options);
}

export async function apiDelete<T = any>(endpoint: string, options?: RequestOptions): Promise<T> {
  return request<T>(endpoint, 'DELETE', undefined, options);
}
