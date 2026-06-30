<template>
  <view class="auth-page">
    <view class="hero">
      <text class="title">欢迎回来</text>
      <text class="subtitle">登录后发现活动、报名参与和发布自己的局。</text>
    </view>

    <view class="form">
      <input v-model="email" class="input" placeholder="邮箱" type="text" />
      <input v-model="password" class="input" placeholder="密码" password />
      <button class="primary-btn" :disabled="loading" @tap="submit">
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <button class="ghost-btn" @tap="navigateTo(routes.register)">还没有账号？去注册</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { ApiError } from '../../services/http'
import { navigateTo, routes } from '../../utils/routes'

const email = ref('')
const password = ref('')
const loading = ref(false)

const ERROR_MSG: Record<string, string> = {
  '40101': '邮箱或密码错误',
  '40102': '账户尚未激活，请先完成邮箱激活',
  '40103': '账户已被封禁，如有疑问请联系平台',
  '42901': '密码错误次数过多，请15分钟后重试',
}

async function submit() {
  if (!email.value || !password.value) {
    uni.showToast({ title: '请输入邮箱和密码', icon: 'none' })
    return
  }
  try {
    loading.value = true
    await useAuthStore().login(email.value, password.value)
    uni.switchTab({ url: routes.home })
  } catch (error) {
    const apiError = error as ApiError
    const msg = ERROR_MSG[apiError.code] || apiError.message || '登录失败'
    uni.showToast({ title: msg, icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  padding: 80rpx 36rpx;
  background: #ffffff;
}

.hero {
  margin-bottom: 64rpx;
}

.title {
  display: block;
  color: #101828;
  font-size: 54rpx;
  font-weight: 900;
}

.subtitle {
  display: block;
  margin-top: 16rpx;
  color: #667085;
  font-size: 28rpx;
  line-height: 1.5;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.input {
  height: 96rpx;
  padding: 0 28rpx;
  border: 1rpx solid #d0d5dd;
  border-radius: 14rpx;
  color: #101828;
  font-size: 30rpx;
}

.primary-btn {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 700;
}

.ghost-btn {
  color: #15803d;
  font-size: 28rpx;
}
</style>
