<template>
  <view class="page">
    <!-- 旧密码 -->
    <view class="field">
      <text class="label">当前密码</text>
      <input
        v-model="oldPassword"
        class="input"
        :password="!showOld"
        placeholder="请输入当前密码"
      />
      <text class="toggle" @tap="showOld = !showOld">{{ showOld ? '隐藏' : '显示' }}</text>
      <text v-if="errors.oldPassword" class="error-text">{{ errors.oldPassword }}</text>
    </view>

    <!-- 新密码 -->
    <view class="field">
      <text class="label">新密码</text>
      <input
        v-model="newPassword"
        class="input"
        :password="!showNew"
        placeholder="至少8位，包含字母和数字"
      />
      <text class="toggle" @tap="showNew = !showNew">{{ showNew ? '隐藏' : '显示' }}</text>
      <text v-if="errors.newPassword" class="error-text">{{ errors.newPassword }}</text>
    </view>

    <!-- 确认新密码 -->
    <view class="field">
      <text class="label">确认新密码</text>
      <input
        v-model="confirmPassword"
        class="input"
        :password="!showConfirm"
        placeholder="请再次输入新密码"
      />
      <text class="toggle" @tap="showConfirm = !showConfirm">{{ showConfirm ? '隐藏' : '显示' }}</text>
      <text v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</text>
    </view>

    <!-- 提示 -->
    <view class="hint">
      <text>新密码至少 8 位，需同时包含字母和数字</text>
    </view>

    <!-- 保存 -->
    <button class="primary-btn" :disabled="saving" @tap="save">
      {{ saving ? '修改中...' : '确认修改' }}
    </button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { changePassword } from '../../services/auth'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showOld = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)
const saving = ref(false)
const errors = ref({ oldPassword: '', newPassword: '', confirmPassword: '' })

function validate(): boolean {
  errors.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
  let valid = true

  if (!oldPassword.value) {
    errors.value.oldPassword = '请输入当前密码'
    valid = false
  }

  if (!newPassword.value) {
    errors.value.newPassword = '请输入新密码'
    valid = false
  } else if (newPassword.value.length < 8) {
    errors.value.newPassword = '新密码至少8位'
    valid = false
  } else if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(newPassword.value)) {
    errors.value.newPassword = '新密码需同时包含字母和数字'
    valid = false
  }

  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    errors.value.confirmPassword = '两次输入的新密码不一致'
    valid = false
  }

  return valid
}

async function save() {
  if (!validate()) return

  try {
    saving.value = true
    await changePassword(oldPassword.value, newPassword.value)
    uni.showToast({ title: '密码修改成功', icon: 'success' })
    setTimeout(() => uni.navigateBack(), 1000)
  } catch (error: any) {
    uni.showToast({ title: error.message || '修改失败', icon: 'none' })
  } finally {
    saving.value = false
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 28rpx;
  background: #f6f8f7;
}

.field {
  padding: 28rpx;
  border-radius: 16rpx;
  background: #ffffff;
  position: relative;
}

.label {
  display: block;
  margin-bottom: 16rpx;
  color: #475467;
  font-size: 26rpx;
  font-weight: 600;
}

.input {
  height: 80rpx;
  padding: 0 20rpx;
  border: 1rpx solid #e5e7eb;
  border-radius: 10rpx;
  color: #101828;
  font-size: 28rpx;
  background: #f9fafb;
}

.toggle {
  position: absolute;
  right: 48rpx;
  bottom: 44rpx;
  color: #16a34a;
  font-size: 24rpx;
}

.error-text {
  display: block;
  margin-top: 8rpx;
  color: #dd524d;
  font-size: 24rpx;
}

.hint {
  padding: 20rpx 28rpx;
  border-radius: 12rpx;
  background: #ecfdf3;
}

.hint text {
  color: #15803d;
  font-size: 24rpx;
}

.primary-btn {
  height: 92rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
  font-size: 30rpx;
  font-weight: 800;
}

.primary-btn[disabled] {
  background: #a3e6ae;
}
</style>
