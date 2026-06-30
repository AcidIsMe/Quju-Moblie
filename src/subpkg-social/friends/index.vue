<template>
  <view class="page">
    <view class="top-actions">
      <button @tap="navigateTo(routes.friendRequests)">好友申请</button>
    </view>
    <view v-for="friend in friends" :key="friend.id" class="friend-card">
      <view class="avatar">{{ friend.nickname.slice(0, 1) }}</view>
      <view class="body">
        <text class="name">{{ friend.remark_name || friend.nickname }}</text>
        <text class="sub">{{ friend.nickname }}</text>
        <tag-list :tags="friend.group_tags" />
      </view>
      <button @tap="remove(friend.id)">删除</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import TagList from '../../components/tag-list.vue'
import { getFriends, deleteFriend } from '../../services/user'
import { navigateTo, routes } from '../../utils/routes'

const friends = ref<any[]>([])

onMounted(async () => {
  try {
    const result = await getFriends()
    friends.value = result.data
  } catch { /* silent */ }
})

async function remove(id: string) {
  try {
    await deleteFriend(id)
    friends.value = friends.value.filter((item) => item.id !== id)
  } catch {
    uni.showToast({ title: '删除失败', icon: 'none' })
  }
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f4f7f5;
}

.top-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20rpx;
}

.top-actions button,
.friend-card > button {
  padding: 12rpx 20rpx;
  border-radius: 999rpx;
  background: #ffffff;
  color: #15803d;
  font-size: 24rpx;
  font-weight: 700;
}

.friend-card {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 18rpx;
  background: #ffffff;
  box-shadow: 0 12rpx 34rpx rgba(15, 23, 42, 0.05);
}

.avatar {
  width: 86rpx;
  height: 86rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, #dcfce7, #ccfbf1);
  color: #047857;
  font-size: 34rpx;
  font-weight: 900;
}

.body {
  flex: 1;
}

.name,
.sub {
  display: block;
}

.name {
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.sub {
  margin-top: 4rpx;
  color: #98a2b3;
  font-size: 23rpx;
}
</style>
