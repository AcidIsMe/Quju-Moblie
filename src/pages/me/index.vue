<template>
  <view class="page">
    <view class="profile" @tap="handleProfileTap">
      <view class="avatar">{{ initial }}</view>
      <view class="info">
        <text class="name">{{ user?.nickname || '未登录' }}</text>
        <text class="score">{{ user ? `信誉分 ${user.credit_score || 0}` : '点击头像登录 / 注册' }}</text>
      </view>
    </view>

    <view v-if="user" class="tags">
      <text v-for="tag in user?.interest_tags || []" :key="tag">{{ tag }}</text>
    </view>

    <view class="menu">
      <button @tap="goAuthed(routes.profileEdit)">编辑资料</button>
      <button @tap="goAuthed(routes.myCreated)">我发布的活动</button>
      <button @tap="goAuthed(routes.myJoined)">我报名的活动</button>
      <button @tap="goAuthed(routes.friends)">好友</button>
      <button v-if="user" @tap="logout">退出登录</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { onShow } from '@dcloudio/uni-app'
import { computed } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { navigateTo, routes } from '../../utils/routes'

const auth = useAuthStore()
auth.restore()
onShow(() => auth.restore())

const user = computed(() => auth.state.user)
const initial = computed(() => user.value?.nickname?.slice(0, 1) || '趣')

function goLogin() {
  navigateTo(routes.login)
}

function handleProfileTap() {
  if (!user.value) goLogin()
}

function goAuthed(url: string) {
  if (user.value) {
    navigateTo(url)
    return
  }
  goLogin()
}

function logout() {
  auth.logout()
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 36rpx 28rpx;
}

.profile {
  display: flex;
  align-items: center;
  gap: 22rpx;
  padding: 30rpx;
  border-radius: 18rpx;
  background: #ffffff;
  cursor: pointer;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  font-size: 44rpx;
  font-weight: 900;
}

.name,
.score {
  display: block;
}

.name {
  color: #101828;
  font-size: 34rpx;
  font-weight: 900;
}

.score {
  margin-top: 8rpx;
  color: #667085;
  font-size: 24rpx;
}

.tags {
  display: flex;
  gap: 12rpx;
  margin: 24rpx 0;
}

.tags text {
  padding: 8rpx 14rpx;
  border-radius: 999rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 24rpx;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.menu button {
  height: 92rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  border-radius: 14rpx;
  background: #ffffff;
  color: #1f2933;
  font-size: 28rpx;
  text-align: left;
}
</style>
