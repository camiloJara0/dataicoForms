interface HttpError {
  statusCode: number
  message: string
  data?: unknown
}

export function useHttp() {
  const { token } = useDataicoConfig()

  async function request<T>(url: string, options?: Record<string, unknown>): Promise<T> {
    try {
      return await $fetch<T>(url, {
        baseURL: '/api',
        ...options,
        headers: {
          ...(options?.headers as Record<string, string> || {}),
          ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
        },
      })
    }
    catch (error: any) {
      const httpError: HttpError = {
        statusCode: error?.statusCode || error?.status || 500,
        message: error?.data?.message || error?.message || 'Error desconocido',
        data: error?.data,
      }
      throw httpError
    }
  }

  async function post<T>(url: string, body: unknown): Promise<T> {
    return request<T>(url, {
      method: 'POST',
      body,
    })
  }

  async function get<T>(url: string, params?: Record<string, unknown>): Promise<T> {
    return request<T>(url, {
      method: 'GET',
      params,
    })
  }

  return { request, post, get }
}
