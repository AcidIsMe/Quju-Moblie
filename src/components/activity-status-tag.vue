<template>
  <text class="status-tag">{{ statusText(status) }}</text>
</template>

<script setup lang="ts">
import type { ActivityStatus } from '../types/domain'
import { statusText } from '../utils/format'

defineProps<{
  status: ActivityStatus
}>()
</script>

<style scoped lang="scss">
.status-tag {
  flex-shrink: 0;
  padding: 6rpx 12rpx;
  border-radius: 999rpx;
  background: #ecfdf3;
  color: #15803d;
  font-size: 22rpx;
  font-weight: 600;
}
</style>
