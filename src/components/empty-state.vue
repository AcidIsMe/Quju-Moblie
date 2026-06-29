<template>
  <view class="empty-state">
    <text class="title">{{ title }}</text>
    <text v-if="description" class="description">{{ description }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<style scoped lang="scss">
.empty-state {
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  color: #667085;
}

.title {
  color: #1f2933;
  font-size: 30rpx;
  font-weight: 700;
}

.description {
  font-size: 24rpx;
}
</style>
