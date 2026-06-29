<template>
  <view class="page">
    <input v-model="nickname" class="input" placeholder="昵称" />
    <textarea v-model="bio" class="textarea" placeholder="个性签名" />
    <input v-model="tags" class="input" placeholder="兴趣标签，用逗号分隔" />
    <button class="primary" @tap="save">保存</button>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
auth.restore()

const nickname = ref(auth.state.user?.nickname || '')
const bio = ref(auth.state.user?.bio || '')
const tags = ref(auth.state.user?.interest_tags.join(',') || '')

function save() {
  if (!nickname.value.trim()) {
    uni.showToast({ title: '昵称不能为空', icon: 'none' })
    return
  }
  if (auth.state.user) {
    auth.state.user.nickname = nickname.value
    auth.state.user.bio = bio.value
    auth.state.user.interest_tags = tags.value.split(',').map((item) => item.trim()).filter(Boolean)
    uni.setStorageSync('current_user', auth.state.user)
  }
  uni.showToast({ title: '已保存', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.input,
.textarea {
  padding: 0 24rpx;
  border-radius: 14rpx;
  background: #ffffff;
  font-size: 28rpx;
}

.input {
  height: 88rpx;
}

.textarea {
  height: 180rpx;
  padding-top: 24rpx;
}

.primary {
  height: 92rpx;
  border-radius: 14rpx;
  background: #16a34a;
  color: #ffffff;
}
</style>
