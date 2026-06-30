export interface ApiResponse<T> {
  code: number
  message?: string
  data: T
  pagination?: {
    next_cursor?: string
    has_more: boolean
    limit: number
  }
}

export interface RequestResult<T> {
  data: T
  pagination?: ApiResponse<T>['pagination']
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

/** 请求失败时抛出的错误，包含业务错误码和消息 */
export class ApiError extends Error {
  code: string
  constructor(code: number | string, message: string) {
    super(message)
    this.code = String(code)
    this.name = 'ApiError'
  }
}

export function request<T>(options: UniApp.RequestOptions): Promise<RequestResult<T>> {
  const token = uni.getStorageSync('access_token')

  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      url: `${BASE_URL}${options.url}`,
      header: {
        ...(options.header || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      success(response) {
        const body = response.data as ApiResponse<T>

        if (response.statusCode === 401) {
          uni.removeStorageSync('access_token')
          uni.removeStorageSync('refresh_token')
          uni.removeStorageSync('current_user')
          uni.reLaunch({ url: '/pages/auth/login' })
          reject(new ApiError(body.code || 40101, body.message || '登录已过期'))
          return
        }

        if (response.statusCode >= 200 && response.statusCode < 300 && body.code === 0) {
          resolve({
            data: body.data,
            pagination: body.pagination,
          })
          return
        }

        // 业务错误：透传 code + message
        reject(new ApiError(body.code || 50000, body.message || '请求失败'))
      },
      fail(error) {
        reject(new ApiError(50000, error.errMsg || '网络请求失败'))
      },
    })
  })
}
