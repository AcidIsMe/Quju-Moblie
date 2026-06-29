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

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

export function request<T>(options: UniApp.RequestOptions): Promise<T> {
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
          uni.navigateTo({ url: '/pages/auth/login' })
          reject(new Error('登录已过期'))
          return
        }
        if (response.statusCode >= 200 && response.statusCode < 300 && body.code === 0) {
          resolve(body.data)
          return
        }
        reject(new Error(body?.message || '请求失败'))
      },
      fail(error) {
        reject(error)
      },
    })
  })
}
