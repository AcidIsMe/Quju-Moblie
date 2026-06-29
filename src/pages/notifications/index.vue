<template>
  <view class="page">
    <view v-for="item in notifications" :key="item.id" class="notice" :class="{ unread: !item.is_read }">
      <text class="title">{{ item.title }}</text>
      <text class="content">{{ item.content }}</text>
      <text class="time">{{ item.created_at }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { mockNotifications } from '../../mocks/activities'

const notifications = mockNotifications
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 28rpx;
}

.notice {
  padding: 28rpx;
  margin-bottom: 18rpx;
  border-radius: 16rpx;
  background: #ffffff;
}

.notice.unread {
  border-left: 8rpx solid #16a34a;
}

.title,
.content,
.time {
  display: block;
}

.title {
  color: #101828;
  font-size: 30rpx;
  font-weight: 800;
}

.content {
  margin-top: 10rpx;
  color: #475467;
  font-size: 26rpx;
}

.time {
  margin-top: 12rpx;
  color: #98a2b3;
  font-size: 22rpx;
}
</style>
