<template>
  <view class="page">
    <text class="title">发起一次线下活动</text>
    <text class="subtitle">先把 P0 的手动创建跑通，AI 策划、模板和草稿会在下一迭代补齐。</text>

    <view class="actions">
      <button class="primary" @tap="navigateTo(routes.activityCreate)">手动创建活动</button>
      <button @tap="navigateTo(routes.templates)">活动模板</button>
      <button @tap="navigateTo(routes.drafts)">草稿箱</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { navigateTo, routes } from '../../utils/routes'
</script>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 48rpx 32rpx;
}

.title {
  display: block;
  color: #101828;
  font-size: 44rpx;
  font-weight: 900;
}

.subtitle {
  display: block;
  margin-top: 16rpx;
  color: #667085;
  font-size: 28rpx;
  line-height: 1.5;
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  margin-top: 48rpx;
}

.actions button {
  height: 96rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14rpx;
  background: #ffffff;
  color: #1f2933;
  font-size: 30rpx;
  font-weight: 700;
}

.actions .primary {
  background: #16a34a;
  color: #ffffff;
}
</style>
