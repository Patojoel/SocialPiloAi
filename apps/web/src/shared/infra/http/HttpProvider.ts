export interface RequestOptions {
  params?: Record<string, string | number | boolean>
  headers?: Record<string, string>
}

export interface HttpProvider {
  get<T>(url: string, options?: RequestOptions): Promise<T>
  post<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T>
  patch<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T>
  put<T>(url: string, body?: unknown, options?: RequestOptions): Promise<T>
  delete<T>(url: string, options?: RequestOptions): Promise<T>
}
