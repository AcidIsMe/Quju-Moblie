<template>
  <view class="section">
    <view class="section-head">
      <text class="title">{{ title }}</text>
      <slot name="extra" />
    </view>
    <slot />
  </view>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped lang="scss">
.section {
  padding: 28rpx;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18rpx;
}

.title {
  color: #101828;
  font-size: 34rpx;
  font-weight: 800;
}
</style>
