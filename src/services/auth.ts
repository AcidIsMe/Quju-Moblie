import { request, type RequestResult } from './http'
import { getMyProfile } from './user'
import type { UserProfile } from '../types/domain'

interface LoginResp {
  access_token: string
  refresh_token: string
  expires_in: number
  user: UserProfile
}

interface RegisterResp {
  email: string
}

interface TokenRefreshResp {
  access_token: string
  refresh_token: string
  expires_in: number
}

/** POST /api/auth/login */
export async function login(email: string, password: string): Promise<LoginResp> {
  const result = await request<LoginResp>({
    url: '/auth/login',
    method: 'POST',
    data: { email, password },
  })
  uni.setStorageSync('access_token', result.data.access_token)
  uni.setStorageSync('refresh_token', result.data.refresh_token)

  // 登录返回的 user 只有部分字段，补充拉取完整用户信息
  let fullUser = result.data.user
  try {
    const profileResult = await getMyProfile()
    fullUser = profileResult.data
  } catch { /* 忽略，使用登录返回的 partial user */ }

  uni.setStorageSync('current_user', fullUser)
  return { ...result.data, user: fullUser }
}

/** POST /api/auth/register/personal */
export async function registerPersonal(email: string, password: string, nickname: string): Promise<RegisterResp> {
  const result = await request<RegisterResp>({
    url: '/auth/register/personal',
    method: 'POST',
    data: { email, password, nickname },
  })
  return result.data
}

export function getStoredUser(): UserProfile | null {
  return uni.getStorageSync('current_user') || null
}

/** POST /api/auth/refresh */
export async function refreshToken(): Promise<RequestResult<TokenRefreshResp>> {
  const stored = uni.getStorageSync('refresh_token')
  if (!stored) {
    const { ApiError } = await import('./http')
    throw new ApiError(40101, 'refresh_token 缺失')
  }
  return request<TokenRefreshResp>({
    url: '/auth/refresh',
    method: 'POST',
    data: { refresh_token: stored },
  })
}

/** POST /api/auth/logout */
export async function logout() {
  const token = uni.getStorageSync('access_token')
  if (token) {
    await request<void>({ url: '/auth/logout', method: 'POST' })
  }
}

/** PUT /api/auth/password */
export async function changePassword(oldPassword: string, newPassword: string): Promise<void> {
  await request<void>({
    url: '/auth/password',
    method: 'PUT',
    data: { old_password: oldPassword, new_password: newPassword },
  })
}
