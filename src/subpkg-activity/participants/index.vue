<template>
  <view class="page">
    <view v-for="item in participants" :key="item.name" class="person">
      <view class="avatar">{{ item.name.slice(0, 1) }}</view>
      <view>
        <text class="name">{{ item.name }}</text>
        <text class="status">{{ item.checked ? '已签到' : '未签到' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const participants = [
  { name: '李四', checked: true },
  { name: '王五', checked: false },
  { name: '赵六', checked: true },
]
</script>

<style scoped lang="scss">
.page {
  padding: 28rpx;
}

.person {
  display: flex;
  align-items: center;
  gap: 18rpx;
  padding: 24rpx;
  margin-bottom: 16rpx;
  border-radius: 14rpx;
  background: #ffffff;
}

.avatar {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: #dcfce7;
  color: #15803d;
  font-weight: 900;
}

.name,
.status {
  display: block;
}

.name {
  color: #101828;
  font-size: 28rpx;
  font-weight: 800;
}

.status {
  color: #667085;
  font-size: 24rpx;
}
</style>
