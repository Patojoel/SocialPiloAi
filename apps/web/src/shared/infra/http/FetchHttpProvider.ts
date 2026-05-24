import type { HttpProvider, RequestOptions } from './HttpProvider'
import { HttpError } from './HttpError'
import { getAccessToken } from '@/features/auth/infra/tokenStorage'

export class FetchHttpProvider implements HttpProvider {
  private workspaceId: string | null = null

  constructor(private readonly baseUrl: string) {}

  setWorkspaceId(id: string | null): void {
    this.workspaceId = id
  }

  getWorkspaceId(): string | null {
    return this.workspaceId
  }

  private buildUrl(url: string, params?: Record<string, string | number | boolean>): string {
    const fullUrl = `${this.baseUrl}${url}`
    if (!params || Object.keys(params).length === 0) return fullUrl
    const query = new URLSearchParams(
      Object.entries(params).map(([k, v]) => [k, String(v)]),
    ).toString()
    return `${fullUrl}?${query}`
  }

  private buildHeaders(extra?: Record<string, string>): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...extra,
    }
    const token = getAccessToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    if (this.workspaceId) headers['X-Workspace-Id'] = this.workspaceId
    return headers
  }

  private async request<T>(url: string, init: RequestInit, options?: RequestOptions): Promise<T> {
    const fullUrl = this.buildUrl(url, options?.params)
    const headers = this.buildHeaders(options?.headers)
    const response = await fetch(fullUrl, { ...init, headers })

    if (!response.ok) {
      const body: unknown = await response.json().catch(() => null)
      const message =
        body !== null &&
        typeof body === 'object' &&
        'detail' in body &&
        typeof (body as Record<string, unknown>).detail === 'string'
          ? (body as Record<string, unknown>).detail as string
          : response.statusText
      throw new HttpError(response.status, message, body)
    }

    if (response.status === 204) return undefined as T
    return response.json() as Promise<T>
  }

  get<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { method: 'GET' }, options)
  }

  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { method: 'POST', body: JSON.stringify(body) }, options)
  }

  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { method: 'PATCH', body: JSON.stringify(body) }, options)
  }

  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { method: 'PUT', body: JSON.stringify(body) }, options)
  }

  delete<T>(url: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(url, { method: 'DELETE' }, options)
  }
}
