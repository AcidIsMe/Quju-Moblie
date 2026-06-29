import { mockUser } from '../mocks/activities'
import type { UserProfile } from '../types/domain'

export async function mockLogin(email: string, password: string) {
  if (!email || !password) throw new Error('请输入邮箱和密码')
  uni.setStorageSync('access_token', 'mock_access_token')
  uni.setStorageSync('refresh_token', 'mock_refresh_token')
  uni.setStorageSync('current_user', mockUser)
  return mockUser
}

export async function mockRegister(email: string, password: string, nickname: string) {
  if (!email || !password || !nickname) throw new Error('请完整填写注册信息')
  return { email }
}

export function getStoredUser(): UserProfile | null {
  return uni.getStorageSync('current_user') || null
}
