import { request, type RequestResult } from './http'
import type { UserProfile } from '../types/domain'

interface LoginResponse {
  access_token: string
  refresh_token: string
  expires_in: number
  user: {
    id: string
    nickname: string
    avatar_url: string | null
    role: string
    status: string
  }
}

export async function login(email: string, password: string): Promise<UserProfile> {
  if (!email || !password) {
    const { ApiError } = await import('./http')
    throw new ApiError(40000, '请输入邮箱和密码')
  }

  const result = await request<LoginResponse>({
    url: '/auth/login',
    method: 'POST',
    data: { email, password },
  })

  const { access_token, refresh_token, user } = result.data
  uni.setStorageSync('access_token', access_token)
  uni.setStorageSync('refresh_token', refresh_token)

  const profile: UserProfile = {
    id: user.id,
    nickname: user.nickname,
    avatar_url: user.avatar_url || '',
    role: user.role as UserProfile['role'],
    status: user.status as UserProfile['status'],
    credit_score: 100,
    interest_tags: [],
  }
  uni.setStorageSync('current_user', profile)
  return profile
}

export async function register(email: string, password: string, nickname: string) {
  if (!email || !password || !nickname) {
    const { ApiError } = await import('./http')
    throw new ApiError(40000, '请完整填写注册信息')
  }

  return request<{ email: string }>({
    url: '/auth/register/personal',
    method: 'POST',
    data: { email, password, nickname },
  })
}

export function getStoredUser(): UserProfile | null {
  return uni.getStorageSync('current_user') || null
}

export async function refreshToken() {
  const refreshTokenVal = uni.getStorageSync('refresh_token')
  if (!refreshTokenVal) {
    const { ApiError } = await import('./http')
    throw new ApiError(40101, 'refresh_token 缺失')
  }
  return request<{ access_token: string; refresh_token: string; expires_in: number }>({
    url: '/auth/refresh',
    method: 'POST',
    data: { refresh_token: refreshTokenVal },
  })
}

export async function logout() {
  const token = uni.getStorageSync('access_token')
  if (token) {
    await request<void>({ url: '/auth/logout', method: 'POST' })
  }
}
