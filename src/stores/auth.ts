import { reactive } from 'vue'
import { getStoredUser, login as serviceLogin } from '../services/auth'
import type { UserProfile } from '../types/domain'

const state = reactive({
  token: '',
  user: null as UserProfile | null,
})

export function useAuthStore() {
  function restore() {
    state.token = uni.getStorageSync('access_token') || ''
    state.user = getStoredUser()
  }

  async function login(email: string, password: string) {
    const result = await serviceLogin(email, password)
    state.token = result.access_token
    state.user = result.user
  }

  function logout() {
    state.token = ''
    state.user = null
    uni.removeStorageSync('access_token')
    uni.removeStorageSync('refresh_token')
    uni.removeStorageSync('current_user')
  }

  return {
    state,
    restore,
    login,
    logout,
  }
}
