<template>
  <view class="auth-page">
    <view class="hero">
      <text class="title">创建账号</text>
      <text class="subtitle">注册后需要前往邮箱激活账号。</text>
    </view>

    <view class="form">
      <view class="field">
        <input
          v-model="nickname"
          class="input"
          :class="{ error: errors.nickname }"
          placeholder="昵称（2-50字）"
          @blur="validateNickname"
        />
        <text v-if="errors.nickname" class="error-text">{{ errors.nickname }}</text>
      </view>

      <view class="field">
        <input
          v-model="email"
          class="input"
          :class="{ error: errors.email }"
          placeholder="邮箱"
          type="text"
          @blur="validateEmail"
        />
        <text v-if="errors.email" class="error-text">{{ errors.email }}</text>
      </view>

      <view class="field">
        <input
          v-model="password"
          class="input"
          :class="{ error: errors.password }"
          placeholder="密码，至少8位含字母和数字"
          password
          @blur="validatePassword"
        />
        <text v-if="errors.password" class="error-text">{{ errors.password }}</text>
      </view>

      <button class="primary-btn" :disabled="loading" @tap="submit">
        {{ loading ? '注册中...' : '注册' }}
      </button>
      <button class="ghost-btn" @tap="goBack">已有账号？去登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { mockRegister } from '../../services/auth'
import { ApiError } from '../../services/http'

const nickname = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errors = reactive({ nickname: '', email: '', password: '' })

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateNickname() {
  const v = nickname.value.trim()
  if (!v) {
    errors.nickname = '请输入昵称'
  } else if (v.length < 2) {
    errors.nickname = '昵称至少2个字'
  } else if (v.length > 50) {
    errors.nickname = '昵称不能超过50字'
  } else {
    errors.nickname = ''
  }
}

function validateEmail() {
  if (!email.value) {
    errors.email = '请输入邮箱'
  } else if (!EMAIL_RE.test(email.value)) {
    errors.email = '请输入有效的邮箱地址'
  } else {
    errors.email = ''
  }
}

function validatePassword() {
  const v = password.value
  if (!v) {
    errors.password = '请输入密码'
  } else if (v.length < 8) {
    errors.password = '密码至少8位'
  } else if (!/[a-zA-Z]/.test(v) || !/\d/.test(v)) {
    errors.password = '密码需包含字母和数字'
  } else {
    errors.password = ''
  }
}

function hasError() {
  validateNickname()
  validateEmail()
  validatePassword()
  return !!(errors.nickname || errors.email || errors.password)
}

const ERROR_MSG: Record<string, string> = {
  '40001': '该邮箱已被注册，请更换邮箱或直接登录',
  '40002': '密码不合规，需至少8位且包含字母和数字',
  '40003': '该昵称已被占用，请更换',
}

async function submit() {
  if (hasError()) return
  try {
    loading.value = true
    await mockRegister(email.value, password.value, nickname.value.trim())
    uni.showModal({
      title: '注册成功',
      content: '请前往邮箱完成账号激活，然后返回登录。',
      showCancel: false,
      success: () => uni.navigateBack(),
    })
  } catch (error) {
    const apiError = error as ApiError
    const msg = ERROR_MSG[apiError.code] || apiError.message || '注册失败'
    uni.showToast({ title: msg, icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goBack() {
  uni.navigateBack()
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
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.input {
  height: 96rpx;
  padding: 0 28rpx;
  border: 1rpx solid #d0d5dd;
  border-radius: 14rpx;
  color: #101828;
  font-size: 30rpx;

  &.error {
    border-color: #dd524d;
  }
}

.error-text {
  padding-left: 4rpx;
  color: #dd524d;
  font-size: 24rpx;
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
