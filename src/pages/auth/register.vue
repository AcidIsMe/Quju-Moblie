<template>
  <view class="auth-page">
    <view class="hero">
      <text class="title">创建账号</text>
      <text class="subtitle">注册后需要前往邮箱激活账号。</text>
    </view>

    <view class="form">
      <input v-model="nickname" class="input" placeholder="昵称" />
      <input v-model="email" class="input" placeholder="邮箱" />
      <input v-model="password" class="input" placeholder="密码，至少8位含字母和数字" password />
      <button class="primary-btn" @tap="submit">注册</button>
      <button class="ghost-btn" @tap="goBack">返回登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockRegister } from '../../services/auth'

const nickname = ref('')
const email = ref('')
const password = ref('')

async function submit() {
  try {
    await mockRegister(email.value, password.value, nickname.value)
    uni.showModal({
      title: '注册成功',
      content: '请前往邮箱完成账号激活，然后返回登录。',
      showCancel: false,
      success: () => uni.navigateBack(),
    })
  } catch (error) {
    uni.showToast({ title: error instanceof Error ? error.message : '注册失败', icon: 'none' })
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

.input {
  height: 96rpx;
  padding: 0 28rpx;
  border: 1rpx solid #d0d5dd;
  border-radius: 14rpx;
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
