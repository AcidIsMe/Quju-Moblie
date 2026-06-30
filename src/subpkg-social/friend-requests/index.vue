<template>
  <view class="page">
    <view v-for="request in requests" :key="request.id" class="request-card">
      <text class="name">{{ request.nickname }}</text>
      <text class="message">{{ request.message }}</text>
      <text class="time">{{ request.created_at }}</text>
      <view class="actions">
        <button class="accept" @tap="handle(request.id, true)">同意</button>
        <button @tap="handle(request.id, false)">拒绝</button>
      </view>
    </view>
    <empty-state v-if="requests.length === 0" title="暂无申请" />
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EmptyState from '../../components/empty-state.vue'
import { mockFriendRequests } from '../../mocks/activities'

const requests = ref([...mockFriendRequests])

function handle(id: string, accepted: boolean) {
  requests.value = requests.value.filter((item) => item.id !== id)
  uni.showToast({ title: accepted ? '已同意' : '已拒绝', icon: 'success' })
}
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
  background: #f4f7f5;
}

.request-card {
  padding: 26rpx;
  margin-bottom: 18rpx;
  border-radius: 18rpx;
  background: #ffffff;
}

.name,
.message,
.time {
  display: block;
}

.name {
  color: #101828;
  font-size: 30rpx;
  font-weight: 900;
}

.message {
  margin-top: 10rpx;
  color: #475467;
  font-size: 26rpx;
}

.time {
  margin-top: 8rpx;
  color: #98a2b3;
  font-size: 22rpx;
}

.actions {
  display: flex;
  gap: 14rpx;
  margin-top: 20rpx;
}

.actions button {
  flex: 1;
  height: 78rpx;
  border-radius: 14rpx;
  background: #f2f4f7;
  color: #475467;
}

.actions .accept {
  background: #ecfdf3;
  color: #15803d;
  font-weight: 800;
}
</style>
