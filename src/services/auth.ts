import { mockUser } from '../mocks/activities'
import { request, type RequestResult } from './http'
import type { UserProfile } from '../types/domain'

/**
 * Mock 登录（对接真实 API 后替换为调用 request()）
 * POST /api/auth/login
 * 请求：{ email, password }
 * 返回：{ access_token, refresh_token, expires_in, user }
 */
export async function mockLogin(email: string, password: string): Promise<UserProfile> {
  if (!email || !password) {
    const { ApiError } = await import('./http')
    throw new ApiError(40000, '请输入邮箱和密码')
  }

  // 模拟：对接真实 API 后改为
  // const result = await request<UserProfile>({ url: '/auth/login', method: 'POST', data: { email, password } })
  // uni.setStorageSync('access_token', ...)  // token 由 authStore 管理

  uni.setStorageSync('access_token', 'mock_access_token')
  uni.setStorageSync('refresh_token', 'mock_refresh_token')
  uni.setStorageSync('current_user', mockUser)
  return mockUser
}

/**
 * Mock 注册（对接真实 API 后替换为调用 request()）
 * POST /api/auth/register/personal
 * 请求：{ email, password, nickname }
 * 返回：{ email }
 */
export async function mockRegister(email: string, password: string, nickname: string) {
  if (!email || !password || !nickname) {
    const { ApiError } = await import('./http')
    throw new ApiError(40000, '请完整填写注册信息')
  }

  // 模拟：对接真实 API 后改为
  // const result = await request<{ email: string }>({ url: '/auth/register/personal', method: 'POST', data: { email, password, nickname } })

  return { email }
}

export function getStoredUser(): UserProfile | null {
  return uni.getStorageSync('current_user') || null
}

// ====== 真实 API 对接预留（迭代 2 启用） ======

/** 待实现：POST /api/auth/refresh */
export async function refreshToken() {
  const refreshToken = uni.getStorageSync('refresh_token')
  if (!refreshToken) {
    const { ApiError } = await import('./http')
    throw new ApiError(40101, 'refresh_token 缺失')
  }
  return request<{ access_token: string; refresh_token: string; expires_in: number }>({
    url: '/auth/refresh',
    method: 'POST',
    data: { refresh_token: refreshToken },
  })
}

/** 待实现：POST /api/auth/logout */
export async function logout() {
  const token = uni.getStorageSync('access_token')
  if (token) {
    await request<void>({ url: '/auth/logout', method: 'POST' })
  }
}
