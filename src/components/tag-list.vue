<template>
  <view class="tag-list">
    <text v-for="tag in tags" :key="tag" class="tag">{{ tag }}</text>
  </view>
</template>

<script setup lang="ts">
defineProps<{
  tags: string[]
}>()
</script>

<style scoped lang="scss">
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8rpx;
  margin-top: 12rpx;
}

.tag {
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #f2f4f7;
  color: #475467;
  font-size: 22rpx;
}
</style>
